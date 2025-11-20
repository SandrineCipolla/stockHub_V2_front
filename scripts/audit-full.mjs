/**
 * 🔍 AUDIT COMPLET – StockHub V2 (léger)
 * Agrège audits JSON individuels en forme réduite pour éviter un fichier trop lourd côté dashboard.
 */
import {execSync} from 'child_process';
import {readdirSync, readFileSync, statSync, writeFileSync} from 'fs';

const DATA_DIR = './documentation/metrics/data/';
const TIMESTAMP = Date.now();

function runScript(cmd, name) {
  console.log(`\n⏳ Audit : ${name}`);
  try { execSync(cmd, { stdio: 'inherit' }); console.log(`✅ ${name} OK`); } catch (err) { console.log(`❌ ${name} échoué: ${err.message}`); }
}

function listFiles(prefix) {
  try { return readdirSync(DATA_DIR).filter(f => f.startsWith(prefix)); } catch { return []; }
}
function latestFile(prefix, exclude=[]) {
  const files = listFiles(prefix).filter(f=> !exclude.some(ex=> f.includes(ex)));
  if (!files.length) return null;
  files.sort((a,b)=> statSync(DATA_DIR+b).mtimeMs - statSync(DATA_DIR+a).mtimeMs);
  return files[0];
}
function readJSONSafe(fname) {
  if (!fname) return null;
  try { return JSON.parse(readFileSync(DATA_DIR + fname, 'utf-8')); } catch { return null; }
}

// Lancement scripts (génèrent les fichiers bruts)
runScript('node scripts/generate-lighthouse.mjs', 'Lighthouse');
runScript('node scripts/generate-eco.mjs', 'Éco-conception');
runScript('node scripts/generate-coverage.mjs', 'Coverage');
runScript('node scripts/audit-fps.mjs', 'FPS');
runScript('node scripts/audit-datasets.mjs', 'Datasets');
runScript('node scripts/audit-a11y.mjs', 'Reduced Motion');
runScript('node scripts/audit-colorblind.mjs', 'Daltonisme');
runScript('node scripts/audit-wcag.mjs', 'WCAG Risk Levels');

// Lecture et réduction
const lighthouseRaw = readJSONSafe(latestFile('lighthouse', ['raw'])); // exclure raw
const ecoRaw = readJSONSafe(latestFile('eco', []));
const coverageRaw = readJSONSafe(latestFile('coverage', []));
const fpsRaw = readJSONSafe(latestFile('fps', []));
const datasetsRaw = readJSONSafe(latestFile('datasets', []));
const a11yRaw = readJSONSafe(latestFile('a11y', []));
const daltonismeRaw = readJSONSafe(latestFile('daltonisme', []));
const riskRaw = readJSONSafe(latestFile('risk-levels', []));

function reduceLighthouse(lh) {
  if (!lh) return null;
  return { scores: lh.scores, timestamp: lh.timestamp }; // garder seulement scores + timestamp
}
function reduceEco(eco) {
  if (!eco) return null;
  const { summary } = eco;
  return summary || eco; // si summary existe garder summary sinon eco complet
}
function reduceCoverage(cov) {
  if (!cov) return null;
  // Nouveau format: { global: { lines, branches, functions }, files: [...], ... }
  if (cov.global) {
    const g = cov.global;
    return {
      lines: g.lines ? parseFloat(g.lines) : null,
      branches: g.branches ? parseFloat(g.branches) : null,
      functions: g.functions ? parseFloat(g.functions) : null,
      statements: null // non fourni dans ce rapport
    };
  }
  // Ancien fallback éventuel
  const s = cov.summary || cov;
  const pick = (k)=> s[k]?.pct ?? null;
  return {
    statements: pick('statements'),
    functions: pick('functions'),
    branches: pick('branches'),
    lines: pick('lines')
  };
}
function reduceFPS(f) { if (!f) return null; const { avgOverall, allPassed } = f; return { avgOverall, allPassed }; }
function reduceDatasets(d) { if (!d) return null; return { degradation: d.degradation, status: d.status }; }
function reduceA11y(a) { if (!a) return null; return { passed: a.passed }; }
function reduceDaltonisme(d) { return d || null; }
function reduceRisk(r) { if (!r) return null; const { critique, eleve, moyen, faible } = r; return { critique, eleve, moyen, faible }; }

const report = {
  timestamp: new Date().toISOString(),
  lighthouse: reduceLighthouse(lighthouseRaw),
  eco: reduceEco(ecoRaw),
  coverage: reduceCoverage(coverageRaw),
  fps: reduceFPS(fpsRaw),
  datasets: reduceDatasets(datasetsRaw),
  a11y: reduceA11y(a11yRaw),
  daltonisme: reduceDaltonisme(daltonismeRaw),
  riskLevels: reduceRisk(riskRaw)
};

const outputPath = `${DATA_DIR}audit-complet-${TIMESTAMP}.json`;
try { writeFileSync(outputPath, JSON.stringify(report, null, 2)); console.log(`\n🎉 AUDIT COMPLET LÉGER -> ${outputPath}\n`); } catch (e) { console.error('❌ Échec écriture audit-complet:', e.message); }
