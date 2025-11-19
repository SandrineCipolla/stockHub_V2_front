/**
 * 🔍 AUDIT COMPLET – StockHub V2 (version RNCP + Dashboard dynamique)
 *
 * Agrège TOUS les audits JSON individuels :
 *  - Lighthouse
 *  - FPS
 *  - Scalabilité datasets
 *  - Daltonisme
 *  - Risk-levels WCAG
 *  - Reduced motion
 *  - Éco-conception
 *  - Coverage
 *
 * Résultat final :
 *  ./documentation/metrics/data/audit-complet-TIMESTAMP.json
 */

import {execSync} from "child_process";
import {readFileSync, writeFileSync} from "fs";

const DATA_DIR = "./documentation/metrics/data/";
const TIMESTAMP = Date.now();

function runScript(cmd, name) {
  console.log(`\n⏳ Audit : ${name}`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ ${name} OK`);
  } catch (err) {
    console.log(`❌ ${name} échoué`);
  }
}

function getLatest(prefix) {
  const files = execSync(`ls -t ${DATA_DIR}`, { encoding: "utf-8" })
      .split("\n")
      .filter(f => f.startsWith(prefix));

  if (files.length === 0) return null;
  return JSON.parse(readFileSync(DATA_DIR + files[0], "utf-8"));
}

console.log("\n=======================================");
console.log("🔍 Lancement AUDIT COMPLET – StockHub V2");
console.log("=======================================\n");

/* -------------------------------------------------------------
   1° Lancer les scripts individuels JSON
------------------------------------------------------------- */

runScript("node scripts/generate-lighthouse.mjs", "Lighthouse JSON");
runScript("node scripts/generate-eco.mjs", "Éco-conception JSON");
runScript("node scripts/generate-coverage.mjs", "Coverage JSON");
runScript("node scripts/audit-fps.mjs", "Performance FPS");
runScript("node scripts/audit-datasets.mjs", "Datasets Scalabilité FPS");
runScript("node scripts/audit-a11y.mjs", "Accessibilité Reduced Motion");
runScript("node scripts/audit-colorblind.mjs", "Daltonisme");
runScript("node scripts/audit-wcag.mjs", "Risk Levels WCAG");

/* -------------------------------------------------------------
   2° Récupérer les derniers JSON générés
------------------------------------------------------------- */

const report = {
  timestamp: new Date().toISOString(),
  lighthouse: getLatest("lighthouse"),
  eco: getLatest("eco"),
  coverage: getLatest("coverage"),
  fps: getLatest("fps"),
  datasets: getLatest("datasets"),
  a11y: getLatest("a11y"),
  daltonisme: getLatest("daltonisme"),
  riskLevels: getLatest("risk-levels")
};

/* -------------------------------------------------------------
   3° Sauvegarde finale audit complet
------------------------------------------------------------- */

const outputPath = `${DATA_DIR}audit-complet-${TIMESTAMP}.json`;
writeFileSync(outputPath, JSON.stringify(report, null, 2));

console.log("\n=======================================");
console.log("🎉 AUDIT COMPLET TERMINÉ !");
console.log(`📁 Fichier généré : ${outputPath}`);
console.log("=======================================\n");
