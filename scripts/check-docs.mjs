#!/usr/bin/env node

import {execSync} from 'child_process';
import {existsSync, readdirSync, readFileSync, statSync} from 'fs';
import {dirname, join, normalize, relative, resolve} from 'path';

/**
 * Vérification de la documentation Markdown.
 *
 * 1. Liens : tout lien relatif doit pointer vers un fichier existant.
 *    Les liens déjà cassés au moment de la mise en place sont listés dans
 *    docs-links-baseline.json et n'échouent pas. Le baseline est fait pour
 *    diminuer, jamais pour grossir.
 * 2. Style : règles fixes de documentation/technical/guide-redaction.md
 *    (tiret cadratin, point-virgule en prose, point médian). Appliqué aux
 *    seuls fichiers modifiés par rapport à la branche de base, la règle
 *    étant récente.
 *
 * Usage :
 *   node scripts/check-docs.mjs              # liens + style sur les fichiers modifiés
 *   node scripts/check-docs.mjs --all        # style sur tous les fichiers (audit)
 *   node scripts/check-docs.mjs --links-only
 */

const EXCLUDE_DIRS = ['node_modules', 'dist', 'coverage', '.git', 'playwright-report', 'test-results'];

// Documents non réécrits : archives figées et fichiers générés
const STYLE_EXCLUDE = [
    'documentation/archive/',
    'documentation/designV1/',
    'CHANGELOG.md',
];

const BASELINE_PATH = 'scripts/docs-links-baseline.json';
const BASE_REF = process.env.DOCS_BASE_REF || 'origin/main';

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

/** Masque les blocs et spans de code : le guide de rédaction ne s'applique pas au code. */
function stripCode(content) {
    return content
        .replace(/```[\s\S]*?```/g, m => m.replace(/[^\n]/g, ' '))
        .replace(/`[^`\n]*`/g, m => ' '.repeat(m.length));
}

function checkLinks(files, root) {
    const broken = [];
    for (const file of files) {
        // Les exemples en bloc ou en span de code ne sont pas des liens à suivre
        const content = stripCode(readFileSync(file, 'utf-8'));
        for (const match of content.matchAll(/!?\[[^\]]*]\(([^)\s]+)\)/g)) {
            const target = match[1];
            if (/^(https?:|mailto:|#)/.test(target)) continue;
            const path = target.split('#')[0];
            if (!path) continue;
            const resolved = normalize(join(dirname(file), decodeURIComponent(path)));
            if (!existsSync(resolved)) {
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

const root = process.cwd();
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
const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')) : {knownBroken: []};
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
        log(`\n   Règles : documentation/technical/guide-redaction.md`);
    }
}

if (failed) process.exit(1);
console.log('\n✅ Documentation conforme.');
