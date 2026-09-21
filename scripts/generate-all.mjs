// scripts/generate-all.mjs
/**
 * 🚀 Génération complète des rapports JSON pour le Dashboard StockHub V2
 * Exécute tous les scripts "generate-*" dans l'ordre logique :
 *  - Lighthouse
 *  - Éco-conception
 *  - Coverage
 *  - Accessibilité (A11Y)
 *  - WCAG (Couleurs / Daltonisme)
 */

import {execSync} from "child_process";

const generators = [
    { name: "Lighthouse", cmd: "node scripts/generate-lighthouse.mjs" },
    { name: "Éco-conception", cmd: "node scripts/generate-eco.mjs" },
    { name: "Coverage", cmd: "node scripts/generate-coverage.mjs" },
    { name: "Accessibilité (A11Y)", cmd: "node scripts/generate-a11y.mjs" },
    { name: "WCAG / Couleurs", cmd: "node scripts/generate-wcag.mjs" }
];

console.log("📊 Lancement de la génération complète du Dashboard StockHub V2\n");

for (const { name, cmd } of generators) {
    console.log(`\n==============================`);
    console.log(`🧩 ${name}`);
    console.log(`==============================`);
    try {
        execSync(cmd, { stdio: "inherit" });
    } catch (err) {
        console.error(`❌ Erreur pendant ${name}:`, err.message);
    }
}

console.log("\n✅ Tous les rapports JSON ont été générés !");
console.log("➡️  Ils sont disponibles dans docs/metrics/data/");

// Ajout Audit Complet
try {
  console.log('\n==============================');
  console.log('🧩 Audit Complet Agrégé');
  console.log('==============================');
  execSync('node scripts/audit-full.mjs', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Audit complet échoué:', e.message);
}
