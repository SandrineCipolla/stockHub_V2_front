/**
 * Script de test de performance FPS pour les animations
 * Mesure les FPS pendant le chargement et les interactions avec les animations
 */

import puppeteer from 'puppeteer';

const TEST_URL = 'http://localhost:4173';
const MIN_FPS_THRESHOLD = 55;
const TEST_DURATION = 5000; // 5 secondes

async function measureFPS(page, testName, action = null) {
  console.log(`\n📊 Test FPS: ${testName}`);

  // Injecter le code de mesure FPS
  await page.evaluate(() => {
    window.fpsData = [];
    let lastTime = performance.now();

    function measureFrame() {
      const now = performance.now();
      const delta = now - lastTime;
      const fps = delta > 0 ? 1000 / delta : 60;

      window.fpsData.push({
        fps: Math.round(fps),
        timestamp: now
      });

      lastTime = now;
      requestAnimationFrame(measureFrame);
    }

    requestAnimationFrame(measureFrame);
  });

  // Attendre un peu pour stabiliser
  await new Promise(resolve => setTimeout(resolve, 500));

  // Exécuter l'action si fournie
  if (action) {
    await action();
  }

  // Attendre la durée du test
  await new Promise(resolve => setTimeout(resolve, TEST_DURATION));

  // Récupérer les données FPS
  const results = await page.evaluate(() => window.fpsData || []);

  // Calculer les statistiques
  if (!results || results.length === 0) {
    console.log('  ⚠️  Aucune donnée FPS collectée');
    return {
      testName,
      avgFPS: 0,
      minFPS: 0,
      maxFPS: 0,
      frameCount: 0,
      passed: false
    };
  }

  const fpsValues = results.map(r => r.fps).filter(fps => fps > 0 && fps < 1000); // Filtrer les valeurs aberrantes

  if (fpsValues.length === 0) {
    console.log('  ⚠️  Aucune valeur FPS valide');
    return {
      testName,
      avgFPS: 0,
      minFPS: 0,
      maxFPS: 0,
      frameCount: 0,
      passed: false
    };
  }

  const avgFPS = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
  const minFPS = Math.min(...fpsValues);
  const maxFPS = Math.max(...fpsValues);

  // Critères de passage : moyenne >= 55 FPS (le min peut fluctuer pendant transitions)
  const passed = avgFPS >= MIN_FPS_THRESHOLD;

  console.log(`  Moyenne: ${avgFPS.toFixed(2)} FPS`);
  console.log(`  Min: ${minFPS} FPS`);
  console.log(`  Max: ${maxFPS} FPS`);
  console.log(`  Frames: ${fpsValues.length}`);
  console.log(`  ${passed ? '✅ PASS' : '❌ FAIL'} (seuil: ${MIN_FPS_THRESHOLD} FPS)`);

  return {
    testName,
    avgFPS,
    minFPS,
    maxFPS,
    frameCount: fpsValues.length,
    passed
  };
}

async function runPerformanceTests() {
  console.log('🚀 Démarrage des tests de performance FPS\n');
  console.log(`URL testée: ${TEST_URL}`);
  console.log(`Seuil minimum: ${MIN_FPS_THRESHOLD} FPS`);
  console.log(`Durée par test: ${TEST_DURATION}ms`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security'
    ]
  });

  const page = await browser.newPage();

  // Configuration de la page
  await page.setViewport({ width: 1920, height: 1080 });

  const results = [];

  try {
    // Test 1: Chargement initial avec animations entrance
    console.log('\n🔄 Chargement de la page...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    results.push(await measureFPS(page, 'Chargement initial (entrance animations)'));

    // Test 2: Hover sur les cartes
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre la fin des animations entrance

    results.push(await measureFPS(page, 'Hover animations', async () => {
      const cards = await page.$$('article');
      console.log(`    Nombre de cartes trouvées: ${cards.length}`);
      if (cards.length > 0) {
        for (let i = 0; i < Math.min(5, cards.length); i++) {
          await cards[i].hover();
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }));

    // Test 3: Scroll avec layout animations
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    results.push(await measureFPS(page, 'Scroll avec animations', async () => {
      await page.evaluate(() => {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }));

    // Test 4: Recherche avec filtrage (layout animations)
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    results.push(await measureFPS(page, 'Recherche/Filtrage (layout animations)', async () => {
      const searchInput = await page.$('input[placeholder*="Rechercher"]');
      if (searchInput) {
        await searchInput.type('iP', { delay: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
      }
    }));

    // Test 5: Compteurs animés (CountUp)
    await page.reload({ waitUntil: 'networkidle2' });
    results.push(await measureFPS(page, 'Compteurs animés (MetricCard CountUp)'));

  } catch (error) {
    console.error('❌ Erreur pendant les tests:', error.message);
  } finally {
    await browser.close();
  }

  // Rapport final
  console.log('\n' + '='.repeat(60));
  console.log('📈 RAPPORT FINAL DES TESTS FPS');
  console.log('='.repeat(60));

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.testName}`);
    console.log(`   Moyenne: ${result.avgFPS.toFixed(2)} FPS ${result.passed ? '✅' : '❌'}`);
    console.log(`   Min: ${result.minFPS} FPS | Max: ${result.maxFPS} FPS`);
  });

  const allPassed = results.every(r => r.passed);
  const validResults = results.filter(r => r.avgFPS > 0);
  const avgOverall = validResults.length > 0
    ? validResults.reduce((sum, r) => sum + r.avgFPS, 0) / validResults.length
    : 0;

  console.log('\n' + '='.repeat(60));
  console.log(`Performance globale: ${avgOverall.toFixed(2)} FPS`);
  console.log(`Tests passés: ${results.filter(r => r.passed).length}/${results.length}`);
  console.log(allPassed ? '✅ TOUS LES TESTS PASSENT' : '❌ CERTAINS TESTS ÉCHOUENT');
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

runPerformanceTests().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
