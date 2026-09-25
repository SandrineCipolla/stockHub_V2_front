#!/usr/bin/env node

import {execSync} from 'child_process';
import {existsSync, readdirSync, readFileSync, statSync} from 'fs';
import {dirname, join, normalize, relative, resolve} from 'path';

/**
 * Vérification de la documentation Markdown, commune aux trois repos StockHub.
 *
 * 1. Liens : tout lien relatif doit pointer vers un fichier existant, avec la
 *    casse exacte (un lien faux en casse passe sous Windows et casse sur GitHub).
 *    Les liens GitHub vers un fichier d'un repo StockHub sont vérifiés contre un
 *    clone de ce repo, cherché dans DOCS_SIBLINGS_DIR (par défaut le dossier
 *    parent). Un repo absent est signalé, pas bloquant.
 *    Les liens déjà cassés à la mise en place sont listés dans un baseline et
 *    n'échouent pas. Le baseline est fait pour diminuer, jamais pour grossir.
 * 2. Style : règles fixes du guide de rédaction (tiret cadratin, point-virgule
 *    en prose, point médian), sur les seuls fichiers modifiés par rapport à la
 *    branche de base.
 *
 * Configuration par repo : fichier .docs-check.json à la racine (chemin du guide,
 * du baseline, dossiers exclus du contrôle de style).
 *
 * Usage, depuis la racine du repo à vérifier :
 *   node scripts/check-docs.mjs              # liens + style sur les fichiers modifiés
 *   node scripts/check-docs.mjs --all        # style sur tous les fichiers (audit)
 *   node scripts/check-docs.mjs --links-only
 *
 * Variables d'environnement :
 *   DOCS_BASE_REF      branche de base (défaut : origin/HEAD, sinon origin/main ou origin/master)
 *   DOCS_SIBLINGS_DIR  dossier contenant les clones des autres repos (défaut : dossier parent)
 */

const EXCLUDE_DIRS = ['node_modules', 'dist', 'coverage', '.git', 'playwright-report', 'test-results'];

const GITHUB_OWNER = 'sandrinecipolla';
const STOCKHUB_REPOS = ['stockhub_v2_front', 'stockhub_back', 'stockhub_design_system'];

const root = process.cwd();
const CONFIG_PATH = '.docs-check.json';
const config = existsSync(CONFIG_PATH) ? JSON.parse(readFileSync(CONFIG_PATH, 'utf-8')) : {};
const BASELINE_PATH = config.baseline ?? 'scripts/docs-links-baseline.json';
const GUIDE_PATH = config.guide ?? 'docs/technical/guide-redaction.md';
// Documents non réécrits : archives figées, historiques et fichiers générés
const STYLE_EXCLUDE = config.styleExclude ?? ['CHANGELOG.md'];
const SIBLINGS_DIR = resolve(process.env.DOCS_SIBLINGS_DIR ?? join(root, '..'));

function detectBaseRef() {
    if (process.env.DOCS_BASE_REF) return process.env.DOCS_BASE_REF;
    const candidates = [];
    try {
        candidates.push(execSync('git symbolic-ref --short refs/remotes/origin/HEAD', {encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore']}).trim());
    } catch {
        // origin/HEAD absent dans un clone CI, on essaie les noms usuels
    }
    candidates.push('origin/main', 'origin/master');
    for (const ref of candidates) {
        try {
            execSync(`git rev-parse --verify ${ref}`, {stdio: 'ignore'});
            return ref;
        } catch {
            // référence suivante
        }
    }
    return 'origin/main';
}

/** Nom du repo courant, déduit de l'URL du remote origin. */
function currentRepoName() {
    try {
        const url = execSync('git remote get-url origin', {encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore']}).trim();
        return url.replace(/\.git$/, '').split('/').pop().toLowerCase();
    } catch {
        return '';
    }
}

const BASE_REF = detectBaseRef();
const CURRENT_REPO = currentRepoName();

const args = process.argv.slice(2);
const checkAll = args.includes('--all');
const linksOnly = args.includes('--links-only');

function walkMarkdownFiles(dir, acc = []) {
    for (const item of readdirSync(dir)) {
        if (EXCLUDE_DIRS.includes(item)) continue;
        const fullPath = join(dir, item);
        if (statSync(fullPath).isDirectory()) walkMarkdownFiles(fullPath, acc);
        else if (item.endsWith('.md')) acc.push(fullPath);
    }
    return acc;
}

/** Les fichiers suivis par git, pour ignorer d'office ce que .gitignore exclut. */
function findMarkdownFiles(root) {
    try {
        const tracked = execSync('git ls-files "*.md"', {encoding: 'utf-8'});
        const untracked = execSync('git ls-files --others --exclude-standard "*.md"', {encoding: 'utf-8'});
        return [...new Set(`${tracked}\n${untracked}`.split('\n'))]
            .map(line => line.trim())
            .filter(line => line.endsWith('.md'))
            .map(line => resolve(root, line))
            .filter(existsSync);
    } catch {
        return walkMarkdownFiles(root);
    }
}

function toPosix(path) {
    return path.split('\\').join('/');
}

/** Vrai pour un bloc de code indenté : 4 espaces après une ligne vide, hors liste et tableau. */
function isIndentedCodeStart(lines, index) {
    if (!/^(\t| {4})\S/.test(lines[index])) return false;
    let previous = index - 1;
    while (previous >= 0 && lines[previous].trim() === '') previous--;
    if (previous < 0) return false;
    if (index - previous < 2) return false; // pas de ligne vide avant, donc pas un bloc
    return !/^\s*([-*+]|\d+\.|\||>)/.test(lines[previous]);
}

/** Masque les blocs et spans de code : le guide de rédaction ne s'applique pas au code. */
function stripCode(content) {
    const masked = content
        .replace(/^(```|~~~)[\s\S]*?^\1/gm, m => m.replace(/[^\n]/g, ' '))
        .replace(/`[^`\n]*`/g, m => ' '.repeat(m.length))
        // Entités HTML : leur point-virgule n'est pas de la ponctuation
        .replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, m => ' '.repeat(m.length));

    const lines = masked.split('\n');
    let inIndentedBlock = false;
    return lines
        .map((line, index) => {
            if (inIndentedBlock) {
                if (line.trim() === '' || /^(\t| {4})/.test(line)) return line.replace(/[^\n]/g, ' ');
                inIndentedBlock = false;
            } else if (isIndentedCodeStart(lines, index)) {
                inIndentedBlock = true;
                return line.replace(/[^\n]/g, ' ');
            }
            return line;
        })
        .join('\n');
}

const dirCache = new Map();

/**
 * Existence avec la casse exacte de chaque segment sous `base`, même sur un
 * système de fichiers insensible à la casse. Hors de `base`, simple existence.
 */
function existsExact(path, base = root) {
    const absolute = resolve(path);
    if (!existsSync(absolute)) return false;
    const rel = relative(base, absolute);
    if (rel.startsWith('..')) return true;
    let current = base;
    for (const part of rel.split(/[\\/]/).filter(Boolean)) {
        if (!dirCache.has(current)) dirCache.set(current, readdirSync(current));
        if (!dirCache.get(current).includes(part)) return false;
        current = join(current, part);
    }
    return true;
}

/** Racine locale d'un repo StockHub : le repo courant, ou un clone dans SIBLINGS_DIR. */
function repoRoot(repo) {
    if (repo === CURRENT_REPO) return root;
    if (!existsSync(SIBLINGS_DIR)) return null;
    const match = readdirSync(SIBLINGS_DIR).find(name => name.toLowerCase() === repo);
    return match ? join(SIBLINGS_DIR, match) : null;
}

const GITHUB_FILE_LINK = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|tree)\/[^/]+\/([^?#]+)/i;
const skippedRepos = new Map();

function checkLinks(files, root) {
    const broken = [];
    for (const file of files) {
        // Les exemples en bloc ou en span de code ne sont pas des liens à suivre
        const content = stripCode(readFileSync(file, 'utf-8'));
        // Le chemin peut contenir une paire de parenthèses, par exemple fichier(1).md
        const inline = [...content.matchAll(/!?\[[^\]]*]\(\s*<?([^()<>\s]+(?:\([^()\s]*\)[^()<>\s]*)*)>?\s*(?:"[^"]*")?\)/g)];
        // Liens de référence : [texte][ref] défini plus bas par [ref]: cible
        const references = [...content.matchAll(/^\s{0,3}\[[^\]]+]:\s*<?(\S+)>?/gm)];
        for (const match of [...inline, ...references]) {
            const target = match[1];
            const github = target.match(GITHUB_FILE_LINK);
            if (github) {
                const [, owner, repoRaw, path] = github;
                const repo = repoRaw.toLowerCase();
                if (owner.toLowerCase() !== GITHUB_OWNER || !STOCKHUB_REPOS.includes(repo)) continue;
                const base = repoRoot(repo);
                if (!base) {
                    skippedRepos.set(repo, (skippedRepos.get(repo) ?? 0) + 1);
                    continue;
                }
                if (!existsExact(join(base, decodeURIComponent(path).replace(/\/$/, '')), base)) {
                    broken.push({file: toPosix(relative(root, file)), target});
                }
                continue;
            }
            if (/^(https?:|mailto:|#)/.test(target)) continue;
            const path = target.split('#')[0];
            if (!path) continue;
            const resolved = normalize(join(dirname(file), decodeURIComponent(path)));
            if (!existsExact(resolved)) {
                broken.push({file: toPosix(relative(root, file)), target});
            }
        }
    }
    return broken;
}

function changedMarkdownFiles(root) {
    try {
        execSync(`git rev-parse --verify ${BASE_REF}`, {stdio: 'ignore'});
    } catch {
        // Historique tronqué (checkout superficiel) : sans base de comparaison, on
        // ne vérifie rien plutôt que tout, le dépôt ayant une dette antérieure à
        // la règle. Utiliser --all pour l'audit complet.
        console.warn(`⚠️  Référence ${BASE_REF} introuvable, vérification de style ignorée.`);
        return [];
    }
    // Commits de la branche, plus ce qui est en cours dans la copie de travail
    const commands = [
        `git diff --name-only --diff-filter=ACMR ${BASE_REF}...HEAD`,
        'git diff --name-only --diff-filter=ACMR HEAD',
        'git ls-files --others --exclude-standard',
    ];
    const files = new Set();
    for (const command of commands) {
        for (const line of execSync(command, {encoding: 'utf-8'}).split('\n')) {
            const name = line.trim();
            if (name.endsWith('.md')) files.add(resolve(root, name));
        }
    }
    return [...files].filter(existsSync);
}

const STYLE_RULES = [
    {pattern: /—/g, message: 'tiret cadratin'},
    {pattern: /\S\s+;|\S;\s/g, message: 'point-virgule en prose'},
    {pattern: /·/g, message: 'point médian'},
];

function checkStyle(files, root) {
    const violations = [];
    for (const file of files) {
        const relPath = toPosix(relative(root, file));
        if (STYLE_EXCLUDE.some(prefix => relPath.startsWith(prefix) || relPath === prefix)) continue;

        const lines = stripCode(readFileSync(file, 'utf-8')).split('\n');
        lines.forEach((line, index) => {
            for (const rule of STYLE_RULES) {
                const count = (line.match(rule.pattern) || []).length;
                if (count > 0) {
                    violations.push({file: relPath, line: index + 1, message: rule.message, count});
                }
            }
        });
    }
    return violations;
}

const allFiles = findMarkdownFiles(root);
let failed = false;

// 1. Liens
const brokenRaw = checkLinks(allFiles, root);
const seen = new Set();
const broken = brokenRaw.filter(entry => {
    const key = `${entry.file} -> ${entry.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});
const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')) : {knownBroken: config.knownBroken ?? []};
const known = new Set(baseline.knownBroken.map(entry => `${entry.file} -> ${entry.target}`));
const current = new Set(broken.map(entry => `${entry.file} -> ${entry.target}`));

const newlyBroken = broken.filter(entry => !known.has(`${entry.file} -> ${entry.target}`));
const fixed = [...known].filter(entry => !current.has(entry));

console.log(`🔗 Liens Markdown : ${allFiles.length} fichiers, ${broken.length} lien(s) cassé(s), dont ${known.size} connus.`);
if (newlyBroken.length > 0) {
    failed = true;
    console.error(`\n❌ ${newlyBroken.length} nouveau(x) lien(s) cassé(s) :`);
    for (const entry of newlyBroken) console.error(`   ${entry.file} -> ${entry.target}`);
    console.error(`\n   Corriger le lien, ou l'ajouter à ${BASELINE_PATH} si la cible est perdue.`);
}
if (skippedRepos.size > 0) {
    console.warn(`\n⚠️  Liens vers d'autres repos non vérifiés (clone absent de ${SIBLINGS_DIR}) :`);
    for (const [repo, count] of skippedRepos) console.warn(`   ${repo} : ${count} lien(s)`);
}
if (fixed.length > 0) {
    console.log(`\n✨ ${fixed.length} lien(s) du baseline sont réparés, à retirer de ${BASELINE_PATH} :`);
    for (const entry of fixed) console.log(`   ${entry}`);
}

// 2. Style
if (!linksOnly) {
    const targets = checkAll ? allFiles : changedMarkdownFiles(root);
    const violations = checkStyle(targets, root);
    const scope = checkAll ? 'tous les fichiers' : `fichiers modifiés vs ${BASE_REF}`;
    console.log(`\n✍️  Guide de rédaction (${scope}) : ${targets.length} fichier(s) vérifié(s).`);
    if (violations.length > 0) {
        failed = !checkAll;
        const log = checkAll ? console.log : console.error;
        log(`\n${checkAll ? '📋' : '❌'} ${violations.length} occurrence(s) :`);
        for (const v of violations) log(`   ${v.file}:${v.line}  ${v.message}${v.count > 1 ? ` (x${v.count})` : ''}`);
        log(`\n   Règles : ${GUIDE_PATH}`);
    }
}

if (failed) process.exit(1);
console.log('\n✅ Documentation conforme.');
