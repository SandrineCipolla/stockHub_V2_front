#!/usr/bin/env node

import {spawn} from 'child_process';

/**
 * Script de diagnostic pour identifier les erreurs CI
 * Usage: node scripts/debug-ci.mjs
 */

const scripts = [
    { name: 'Type Check', command: 'npm', args: ['run', 'type-check'] },
    { name: 'Lint', command: 'npm', args: ['run', 'lint'] },
    { name: 'Tests', command: 'npm', args: ['run', 'test:run'] },
    { name: 'Dead Code', command: 'npm', args: ['run', 'clean:deadcode'] },
    { name: 'As Const Detection', command: 'npm', args: ['run', 'detect:as-const'] },
    { name: 'Build', command: 'npm', args: ['run', 'build'] }
];

function runScript(script) {
    return new Promise((resolve) => {
        console.log(`\n🔍 Test: ${script.name}...`);

        const process = spawn(script.command, script.args, {
            stdio: 'pipe',
            shell: true
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${script.name}: OK`);
            } else {
                console.log(`❌ ${script.name}: ERREUR (exit code ${code})`);
                if (stdout) console.log(`stdout: ${stdout.slice(-200)}`);
                if (stderr) console.log(`stderr: ${stderr.slice(-200)}`);
            }
            resolve({ name: script.name, code, stdout, stderr });
        });
    });
}

async function main() {
    console.log('🚀 Diagnostic CI - Recherche des erreurs...\n');

    const results = [];

    for (const script of scripts) {
        const result = await runScript(script);
        results.push(result);
    }

    console.log('\n📊 RÉSUMÉ:');

    const failed = results.filter(r => r.code !== 0);
    const passed = results.filter(r => r.code === 0);

    console.log(`✅ Scripts réussis: ${passed.length}`);
    passed.forEach(r => console.log(`  - ${r.name}`));

    if (failed.length > 0) {
        console.log(`\n❌ Scripts échoués: ${failed.length}`);
        failed.forEach(r => console.log(`  - ${r.name} (exit code ${r.code})`));

        console.log('\n💡 SOLUTIONS:');
        failed.forEach(r => {
            console.log(`\n🔧 Pour ${r.name}:`);
            switch (r.name) {
                case 'Type Check':
                    console.log('  → Corrigez les erreurs TypeScript');
                    break;
                case 'Lint':
                    console.log('  → Exécutez: npm run lint:fix');
                    break;
                case 'Tests':
                    console.log('  → Corrigez les tests qui échouent');
                    break;
                case 'Dead Code':
                    console.log('  → Exécutez: npm run clean:fix');
                    break;
                case 'As Const Detection':
                    console.log('  → Remplacez les "as const" par des types explicites');
                    break;
                case 'Build':
                    console.log('  → Corrigez les erreurs de compilation');
                    break;
            }
        });
    } else {
        console.log('\n🎉 Tous les scripts CI passent avec succès !');
    }
}

main().catch(console.error);
