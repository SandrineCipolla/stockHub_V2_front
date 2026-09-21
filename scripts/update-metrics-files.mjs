#!/usr/bin/env node

/**
 * Script pour mettre à jour automatiquement la liste des fichiers JSON
 * dans docs/metrics/index.html
 *
 * Utilisation: node scripts/update-metrics-files.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, '..');
const DATA_DIR = join(PROJECT_ROOT, 'docs', 'metrics', 'data');
const HTML_FILE = join(PROJECT_ROOT, 'docs', 'metrics', 'index.html');

/**
 * Trouve le fichier le plus récent pour chaque type
 */
function findLatestFiles() {
    const files = readdirSync(DATA_DIR);

    const patterns = {
        lighthouse: /^lighthouse-\d+\.json$/,
        'risk-levels': /^risk-levels-audit-\d+\.json$/,
        daltonisme: /^daltonisme-\d+\.json$/,
        fps: /^fps-\d+\.json$/,
        a11y: /^a11y-\d+\.json$/,
        datasets: /^datasets-\d+\.json$/,
        'audit-complet': /^audit-complet-\d+\.json$/
    };

    const latestFiles = {};

    for (const [type, pattern] of Object.entries(patterns)) {
        const matches = files
            .filter(f => pattern.test(f))
            .sort()
            .reverse(); // Le plus récent en premier

        if (matches.length > 0) {
            latestFiles[type] = matches[0];
        }
    }

    return latestFiles;
}

/**
 * Met à jour le fichier HTML avec la nouvelle liste
 */
function updateHTML(latestFiles) {
    let html = readFileSync(HTML_FILE, 'utf-8');

    // Créer le nouveau tableau JavaScript
    const fileList = Object.values(latestFiles).map(f => `'${f}'`).join(',\n            ');

    const newStaticFileList = `const staticFileList = [
            ${fileList}
        ];`;

    // Remplacer l'ancien tableau dans le HTML
    const staticFileListRegex = /const staticFileList = \[\s*[^;]*\];/;

    if (staticFileListRegex.test(html)) {
        html = html.replace(staticFileListRegex, newStaticFileList);
        writeFileSync(HTML_FILE, html, 'utf-8');
        console.log('✅ Fichier HTML mis à jour avec succès!');
        return true;
    } else {
        console.error('❌ Impossible de trouver le tableau staticFileList dans le HTML');
        return false;
    }
}

/**
 * Fonction principale
 */
function main() {
    console.log('🔍 Recherche des fichiers JSON les plus récents...\n');

    const latestFiles = findLatestFiles();

    console.log('📁 Fichiers trouvés:');
    for (const [type, file] of Object.entries(latestFiles)) {
        console.log(`  ${type.padEnd(15)} → ${file}`);
    }

    console.log('\n📝 Mise à jour du fichier HTML...');
    const success = updateHTML(latestFiles);

    if (success) {
        console.log('\n✨ Terminé! Le dashboard devrait maintenant fonctionner sur GitHub Pages.');
        console.log('   Pour tester en local: ouvrez docs/metrics/index.html');
    } else {
        process.exit(1);
    }
}

main();
