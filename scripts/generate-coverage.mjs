/**
 * 📊 Génération JSON Coverage – StockHub V2 (robuste)
 * Parse coverage-final.json (Istanbul v8) pour produire un résumé léger.
 */
import {execSync} from 'child_process';
import {existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync} from 'fs';

async function generateCoverageJSON() {
  console.log('📊 Génération du JSON coverage…');
  const timestamp = Date.now();
  const coverageDir = './coverage';
  const coverageJsonPath = `${coverageDir}/coverage-final.json`;
  const summaryPath = `${coverageDir}/coverage-summary.json`;
  const outputPath = `./documentation/metrics/data/coverage-${timestamp}.json`;

  let success = false;
  let global = { statements:null, lines:null, branches:null, functions:null };
  const filesOut = [];
  const notes = [];

  try {
    console.log('⏳ Exécution des tests coverage (Vitest)...');
    execSync('npm run test:coverage', { stdio: 'inherit' });
  } catch (e) {
    notes.push('Tests échoués: ' + e.message);
  }

  if (!existsSync(coverageJsonPath)) {
    notes.push('coverage-final.json introuvable');
  } else {
    try {
      const data = JSON.parse(readFileSync(coverageJsonPath, 'utf-8'));
      // data: { filePath: { s,f,b,statementMap,... } }
      let totalStatements=0, coveredStatements=0;
      let totalBranches=0, coveredBranches=0;
      let totalFuncs=0, coveredFuncs=0;
      for (const [file, info] of Object.entries(data)) {
        if (!info || !info.s) continue;
        const sHits = Object.values(info.s);
        const fileStatements = sHits.length;
        const fileCoveredStatements = sHits.filter(v=>v>0).length;
        totalStatements += fileStatements;
        coveredStatements += fileCoveredStatements;
        if (info.f) {
          const fHits = Object.values(info.f);
          totalFuncs += fHits.length;
          coveredFuncs += fHits.filter(v=>v>0).length;
        }
        if (info.b) {
          for (const arr of Object.values(info.b)) {
            totalBranches += arr.length;
            coveredBranches += arr.filter(v=> v>0).length;
          }
        }
        const pct = fileStatements? (fileCoveredStatements/fileStatements*100):0;
        filesOut.push({ file, statements:fileStatements, covered:fileCoveredStatements, pct: +pct.toFixed(2) });
      }
      global.statements = totalStatements? +(coveredStatements/totalStatements*100).toFixed(2):0;
      global.functions = totalFuncs? +(coveredFuncs/totalFuncs*100).toFixed(2):0;
      global.branches = totalBranches? +(coveredBranches/totalBranches*100).toFixed(2):0;
      // Approximating lines: treat distinct start.line in statementMap as lines
      let totalLines=0, coveredLines=0;
      for (const info of Object.values(data)) {
        if (!info.statementMap || !info.s) continue;
        const lineMap = new Map();
        for (const [k, meta] of Object.entries(info.statementMap)) {
          const line = meta.start.line;
          const hits = info.s[k];
          lineMap.set(line, (lineMap.get(line)||0)+hits);
        }
        totalLines += lineMap.size;
        coveredLines += [...lineMap.values()].filter(v=>v>0).length;
      }
      global.lines = totalLines? +(coveredLines/totalLines*100).toFixed(2):0;
      success = true;
    } catch (e) {
      notes.push('Erreur parsing coverage-final: ' + e.message);
    }
  }

  // Fallback: coverage-summary.json si disponible
  if (existsSync(summaryPath)) {
    try {
      const summary = JSON.parse(readFileSync(summaryPath,'utf-8'));
      if (summary.total) {
        const t = summary.total;
        global.lines = t.lines?.pct ?? global.lines;
        global.branches = t.branches?.pct ?? global.branches;
        global.functions = t.functions?.pct ?? global.functions;
        global.statements = t.statements?.pct ?? global.statements;
        notes.push('Fusion avec coverage-summary.json');
      }
    } catch (e) { notes.push('Erreur lecture coverage-summary: '+e.message); }
  }

  const result = {
    timestamp: new Date().toISOString(),
    global,
    files: filesOut.sort((a,b)=> a.pct - b.pct),
    totalFiles: filesOut.length,
    notes,
    success
  };

  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`💾 Report coverage généré : ${outputPath}`);

  // Copier coverage-final.json vers documentation/metrics/coverage/ pour le dashboard
  const coverageDestDir = './documentation/metrics/coverage';
  if (existsSync(coverageJsonPath)) {
    mkdirSync(coverageDestDir, { recursive: true });
    const destPath = `${coverageDestDir}/coverage-final.json`;
    copyFileSync(coverageJsonPath, destPath);
    console.log(`📋 Fichier coverage-final.json copié vers ${destPath}`);
  } else {
    console.log(`⚠️  coverage-final.json non trouvé, impossible de copier`);
  }

  process.exit(0);
}

generateCoverageJSON();
