/**
 * Script de test d'accessibilité prefers-reduced-motion (robuste)
 */
import puppeteer from 'puppeteer';
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {execSync, spawn} from 'child_process';

const TEST_URL = 'http://localhost:4173';
const OUTPUT_DIR = './documentation/metrics/data';

async function ensureServer() {
  // Build si dist absent
  if (!existsSync('dist')) {
    console.log('⚙️ Build manquant → lancement build avant preview…');
    try { execSync ? execSync('npm run build', { stdio:'inherit' }) : console.log('⏳ Impossible execSync'); } catch(e){ console.log('❌ Build échoué:', e.message); }
  }
  return new Promise(resolve => {
    let resolved = false;
    const server = spawn('npm', ['run', 'preview'], { stdio: 'pipe', shell: true });
    server.stdout.on('data', d => {
      const text = d.toString();
      if (/localhost:4173/.test(text) && !resolved) { resolved = true; resolve(server); }
    });
    server.stderr.on('data', d => {
      const text = d.toString();
      if (/EADDRINUSE/.test(text)) { // déjà lancé
        if (!resolved) { resolved = true; resolve(null); }
      }
    });
    // Timeout démarrage serveur
    setTimeout(()=> { if (!resolved) { resolved=true; resolve(server); } }, 10000);
  });
}

async function testReducedMotion() {
  console.log("♿ Test d'accessibilité prefers-reduced-motion\n");
  console.log(`URL testée: ${TEST_URL}\n`);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const server = await ensureServer();

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  let allPassed = true; const notes=[];
  try {
    async function evalPage(prefReduce) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      if (prefReduce) await page.emulateMediaFeatures([{ name:'prefers-reduced-motion', value:'reduce' }]);
      await page.goto(TEST_URL, { waitUntil:'networkidle2' });
      await new Promise(res => setTimeout(res, 1500));
      return page.evaluate(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const selector = 'article,[role=article],[data-motion],[data-testid*=card],.card,.motion,.framer-motion';
        const nodes = Array.from(document.querySelectorAll(selector));
        const durations = nodes.map(el => {
          const st = getComputedStyle(el);
            return { transition: st.transitionDuration, animation: st.animationDuration };
        });
        return { reduced, nodesLength: nodes.length, durations };
      });
    }

    console.log('📊 Mode normal');
    const normal = await evalPage(false);
    console.log(`  Éléments candidats: ${normal.nodesLength}`);

    console.log('📊 Mode reduced');
    const reduced = await evalPage(true);
    console.log(`  Reduced active: ${reduced.reduced} Éléments candidats: ${reduced.nodesLength}`);
    if (!reduced.reduced) { allPassed=false; notes.push('prefers-reduced-motion non détecté'); }

    function durationOk(value){
      if (!value || value === '0s' || value === '0ms') return true;
      const parts = value.split(',').map(p=>p.trim());
      return parts.every(p=>{
        const m = p.match(/([0-9]*\.?[0-9]+)(ms|s)/);
        if (!m) return false;
        const num = parseFloat(m[1]);
        const unit = m[2];
        const ms = unit === 's' ? num*1000 : num;
        return ms <= 300;
      });
    }

    if (reduced.nodesLength === 0) {
      // Aucun élément animé → conforme par défaut (pas de mouvement)
      notes.push('Aucun élément animé détecté (conforme)');
    } else {
      const problematic = reduced.durations.filter(d => d.animation && !durationOk(d.animation));
      if (problematic.length) {
        allPassed = false;
        notes.push(`${problematic.length} animation(s) >300ms en mode réduit`);
      }
    }

  } catch (e) {
    console.error('❌ Erreur tests:', e.message); allPassed=false; notes.push(e.message);
  } finally {
    await browser.close();
    // Nettoyage serveur si nous l'avons démarré localement
    if (server && !server.killed) {
      try { server.kill(); } catch(_) {}
    }
  }

  console.log('============================================================');
  console.log('📈 RAPPORT FINAL - ACCESSIBILITÉ ANIMATIONS');
  console.log('============================================================');
  // Messages harmonisés pour generate-a11y (détection robuste)
  if (allPassed) {
    console.log('\n✅ TOUS LES TESTS PASSENT');
  } else {
    console.log('\n⚠️ TESTS PARTIELLEMENT RÉUSSIS');
  }
  console.log('Notes: ' + (notes.length? notes.join('; ') : 'RAS'));
  console.log('============================================================\n');

  const jsonPath = `${OUTPUT_DIR}/a11y-${Date.now()}.json`;
  const json = { allPassed, notes, timestamp: new Date().toISOString(), success: allPassed };
  try { writeFileSync(jsonPath, JSON.stringify(json, null, 2)); } catch(e) { console.error('Impossible d écrire le fichier JSON', e.message); }
  console.log(`💾 Rapport JSON généré : ${jsonPath}`);
  // Ligne structurée pour parse par generate-a11y
  console.log(`A11Y_RESULT success=${allPassed} path=${jsonPath}`);
  process.exit(0);
}

testReducedMotion().catch(e=> {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.error('❌ Erreur fatale:', e.message);
  const p=`${OUTPUT_DIR}/a11y-${Date.now()}.json`;
  try { writeFileSync(p, JSON.stringify({ allPassed:false, error:e.message, timestamp:new Date().toISOString(), success:false },null,2)); } catch{};
  console.log(`A11Y_RESULT success=false path=${p}`);
  process.exit(1);
});
