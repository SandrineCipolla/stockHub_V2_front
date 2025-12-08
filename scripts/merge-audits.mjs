/**
 * 🔗 MERGE AUDITS – Regroupe les audits existants sans les relancer
 */
import {readdirSync, readFileSync, statSync, writeFileSync} from 'fs';

const DATA_DIR = './documentation/metrics/data/';
const TIMESTAMP = Date.now();

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

console.log('🔗 Regroupement des audits existants...\n');

// Lecture des derniers fichiers
const lighthouseRaw = readJSONSafe(latestFile('lighthouse', ['raw']));
const ecoRaw = readJSONSafe(latestFile('eco', []));
const coverageRaw = readJSONSafe(latestFile('coverage', []));
const fpsRaw = readJSONSafe(latestFile('fps', []));
const datasetsRaw = readJSONSafe(latestFile('datasets', []));
const a11yRaw = readJSONSafe(latestFile('a11y', []));
const daltonismeRaw = readJSONSafe(latestFile('daltonisme', []));
const riskRaw = readJSONSafe(latestFile('risk-levels', []));

// Fonctions de réduction
function reduceLighthouse(lh) {
  if (!lh) return null;
  return { scores: lh.scores, timestamp: lh.timestamp };
}

function reduceEco(eco) {
  if (!eco) return null;
  return eco; // garder éco complet
}

function reduceCoverage(cov) {
  if (!cov || !cov.global) return null;
  return {
    lines: cov.global.lines,
    branches: cov.global.branches,
    functions: cov.global.functions,
    statements: cov.global.statements
  };
}

function reduceFps(fps) {
  if (!fps) return null;
  return { avgOverall: fps.avgOverall, allPassed: fps.allPassed };
}

function reduceDatasets(ds) {
  if (!ds) return null;
  return { avgFps: ds.avgFps, degradation: ds.degradation, allPass: ds.allPass };
}

function reduceA11y(a11y) {
  if (!a11y) return null;
  return { summary: a11y.summary };
}

function reduceDaltonisme(dalt) {
  if (!dalt) return null;
  return dalt; // garder complet pour le dashboard
}

function reduceRisk(risk) {
  if (!risk) return null;
  return { summary: risk.summary, modeLight: risk.modeLight, modeDark: risk.modeDark };
}

// Construction du rapport
const report = {
  timestamp: new Date().toISOString(),
  lighthouse: reduceLighthouse(lighthouseRaw),
  eco: reduceEco(ecoRaw),
  coverage: reduceCoverage(coverageRaw),
  fps: reduceFps(fpsRaw),
  datasets: reduceDatasets(datasetsRaw),
  a11y: reduceA11y(a11yRaw),
  daltonisme: reduceDaltonisme(daltonismeRaw),
  riskLevels: reduceRisk(riskRaw)
};

const outputPath = `${DATA_DIR}audit-complet-${TIMESTAMP}.json`;
try {
  writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`✅ Audit complet regroupé : ${outputPath}\n`);
} catch (e) {
  console.error('❌ Échec écriture audit-complet:', e.message);
}
