#!/usr/bin/env node

import {readdirSync, readFileSync, statSync} from 'fs';
import {extname, join} from 'path';
import {fileURLToPath} from 'url';

/**
 * Script pour détecter les usages de 'as const' dans le projet
 * Usage: node scripts/detect-as-const.mjs
 */

const __filename = fileURLToPath(import.meta.url);
const TYPESCRIPT_EXTENSIONS = ['.ts', '.tsx'];
const EXCLUDE_DIRS = ['node_modules', 'dist', 'coverage', '.git'];

function findTypeScriptFiles(dir) {
    const files = [];

    try {
        const items = readdirSync(dir);

        for (const item of items) {
            if (EXCLUDE_DIRS.includes(item)) continue;

            const fullPath = join(dir, item);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                files.push(...findTypeScriptFiles(fullPath));
            } else if (TYPESCRIPT_EXTENSIONS.includes(extname(item))) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        console.warn(`Erreur lors de la lecture du dossier ${dir}:`, error.message);
    }

    return files;
}

function detectAsConstInFile(filePath) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const detections = [];

        lines.forEach((line, index) => {
            // Ignorer les lignes avec commentaire "NÉCESSAIRE" ou "NECESSARY"
            if (line.includes('NÉCESSAIRE') || line.includes('NECESSARY')) {
                return;
            }

            // Regex pour détecter 'as const' avec différents espaces
            const asConstRegex = /\bas\s+const\b/g;
            let match;

            while ((match = asConstRegex.exec(line)) !== null) {
                detections.push({
                    line: index + 1,
                    column: match.index + 1,
                    text: line.trim(),
                    match: match[0]
                });
            }
        });

        return detections;
    } catch (error) {
        console.warn(`Erreur lors de la lecture du fichier ${filePath}:`, error.message);
        return [];
    }
}

function main() {
    console.log('🔍 Détection des usages "as const" dans le projet...\n');

    const projectRoot = process.cwd();
    const tsFiles = findTypeScriptFiles(projectRoot);

    if (tsFiles.length === 0) {
        console.log('❌ Aucun fichier TypeScript trouvé.');
        process.exit(1);
    }

    console.log(`📁 Analyse de ${tsFiles.length} fichiers TypeScript...\n`);

    let totalDetections = 0;
    let filesWithDetections = 0;

    tsFiles.forEach(filePath => {
        const detections = detectAsConstInFile(filePath);

        if (detections.length > 0) {
            filesWithDetections++;
            totalDetections += detections.length;

            console.log(`📄 ${filePath}:`);
            detections.forEach(detection => {
                console.log(`  ↳ Ligne ${detection.line}:${detection.column} - "${detection.match}"`);
                console.log(`    ${detection.text}`);
            });
            console.log('');
        }
    });

    console.log('📊 Résumé:');
    console.log(`  • Fichiers analysés: ${tsFiles.length}`);
    console.log(`  • Fichiers avec "as const": ${filesWithDetections}`);
    console.log(`  • Total d'usages "as const": ${totalDetections}`);

    if (totalDetections > 0) {
        console.log('\n⚠️  Des usages "as const" ont été détectés.');
        console.log('💡 Considérez utiliser des types explicites pour une meilleure lisibilité.');
        process.exit(1);
    } else {
        console.log('\n✅ Aucun usage "as const" détecté.');
        process.exit(0);
    }
}

// Exécution directe du script
main();
