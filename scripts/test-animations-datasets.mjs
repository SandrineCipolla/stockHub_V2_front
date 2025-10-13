/**
 * Script de test des animations avec différentes tailles de datasets
 * Mesure la performance des animations avec 5, 50, 200, 500 stocks
 */

import puppeteer from 'puppeteer';

const TEST_URL = 'http://localhost:4173';
const MIN_FPS_THRESHOLD = 55;
const TEST_DURATION = 3000; // 3 secondes

const DATASET_SIZES = [
  { name: 'Petit (5 stocks)', count: 5 },
  { name: 'Moyen (50 stocks)', count: 50 },
  { name: 'Grand (200 stocks)', count: 200 },
  { name: 'Très grand (500 stocks)', count: 500 }
];

async function createMockStocks(count) {
  const statuses = ['optimal', 'low', 'critical', 'outOfStock', 'overstocked'];
  const categories = ['Électronique', 'Alimentaire', 'Vêtements', 'Mobilier', 'Livres'];

  return Array.from({ length: count }, (_, i) => ({
    id: `stock-${i + 1}`,
    name: `Produit ${i + 1}`,
    description: `Description du produit ${i + 1}`,
    quantity: Math.floor(Math.random() * 100),
    minQuantity: 10,
    maxQuantity: 100,
    price: Math.random() * 100,
    category: categories[i % categories.length],
    status: statuses[i % statuses.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

async function measureFPSWithDataset(page, datasetSize) {
  console.log(`\n📊 Test: ${datasetSize.name}`);

  // Naviguer vers la page
  await page.goto(TEST_URL, { waitUntil: 'networkidle2' });

  // Injecter le dataset dans localStorage
  const mockStocks = await createMockStocks(datasetSize.count);

  await page.evaluate((stocks) => {
    localStorage.setItem('stocks', JSON.stringify(stocks));
  }, mockStocks);

  // Recharger pour que les stocks soient pris en compte
  await page.reload({ waitUntil: 'networkidle2' });

  // Attendre que les cartes se chargent
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Compter les cartes visibles
  const cardCount = await page.evaluate(() => {
    return document.querySelectorAll('article').length;
  });

  console.log(`  Cartes chargées: ${cardCount}/${datasetSize.count}`);

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

  // Attendre la durée du test
  await new Promise(resolve => setTimeout(resolve, TEST_DURATION));

  // Récupérer les données FPS
  const results = await page.evaluate(() => window.fpsData || []);

  if (!results || results.length === 0) {
    console.log('  ⚠️  Aucune donnée FPS collectée');
    return {
      datasetName: datasetSize.name,
      datasetCount: datasetSize.count,
      cardCount,
      avgFPS: 0,
      minFPS: 0,
      maxFPS: 0,
      frameCount: 0,
      passed: false
    };
  }

  const fpsValues = results.map(r => r.fps).filter(fps => fps > 0 && fps < 1000);

  if (fpsValues.length === 0) {
    console.log('  ⚠️  Aucune valeur FPS valide');
    return {
      datasetName: datasetSize.name,
      datasetCount: datasetSize.count,
      cardCount,
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

  const passed = avgFPS >= MIN_FPS_THRESHOLD;

  console.log(`  Moyenne: ${avgFPS.toFixed(2)} FPS`);
  console.log(`  Min: ${minFPS} FPS`);
  console.log(`  Max: ${maxFPS} FPS`);
  console.log(`  Frames: ${fpsValues.length}`);
  console.log(`  ${passed ? '✅ PASS' : '❌ FAIL'} (seuil: ${MIN_FPS_THRESHOLD} FPS)`);

  return {
    datasetName: datasetSize.name,
    datasetCount: datasetSize.count,
    cardCount,
    avgFPS,
    minFPS,
    maxFPS,
    frameCount: fpsValues.length,
    passed
  };
}

async function runDatasetTests() {
  console.log('🚀 Test des animations avec différents datasets\n');
  console.log(`URL testée: ${TEST_URL}`);
  console.log(`Seuil FPS minimum: ${MIN_FPS_THRESHOLD}`);
  console.log(`Durée par test: ${TEST_DURATION}ms`);
  console.log(`Datasets testés: ${DATASET_SIZES.map(d => d.count).join(', ')} stocks\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const results = [];

  try {
    for (const datasetSize of DATASET_SIZES) {
      const result = await measureFPSWithDataset(page, datasetSize);
      results.push(result);
    }
  } catch (error) {
    console.error('❌ Erreur pendant les tests:', error.message);
  } finally {
    await browser.close();
  }

  // Rapport final
  console.log('\n' + '='.repeat(70));
  console.log('📈 RAPPORT FINAL - PERFORMANCE PAR DATASET');
  console.log('='.repeat(70));

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.datasetName}`);
    console.log(`   Stocks: ${result.datasetCount} | Cartes: ${result.cardCount}`);
    console.log(`   FPS Moyen: ${result.avgFPS.toFixed(2)} ${result.passed ? '✅' : '❌'}`);
    console.log(`   FPS Min: ${result.minFPS} | FPS Max: ${result.maxFPS}`);
  });

  const allPassed = results.every(r => r.passed);
  const validResults = results.filter(r => r.avgFPS > 0);
  const avgOverall = validResults.length > 0
    ? validResults.reduce((sum, r) => sum + r.avgFPS, 0) / validResults.length
    : 0;

  console.log('\n' + '='.repeat(70));
  console.log(`Performance globale moyenne: ${avgOverall.toFixed(2)} FPS`);
  console.log(`Tests passés: ${results.filter(r => r.passed).length}/${results.length}`);
  console.log(allPassed ? '✅ TOUS LES DATASETS PASSENT' : '⚠️  CERTAINS DATASETS SOUS LE SEUIL');

  // Analyse de scalabilité
  if (validResults.length >= 2) {
    const firstFPS = validResults[0].avgFPS;
    const lastFPS = validResults[validResults.length - 1].avgFPS;
    const degradation = ((firstFPS - lastFPS) / firstFPS) * 100;

    console.log(`\n📊 Analyse de scalabilité:`);
    console.log(`   Dégradation: ${degradation.toFixed(1)}% (${validResults[0].datasetCount} → ${validResults[validResults.length - 1].datasetCount} stocks)`);

    if (degradation < 10) {
      console.log(`   ✅ Excellente scalabilité (< 10% de dégradation)`);
    } else if (degradation < 20) {
      console.log(`   ✅ Bonne scalabilité (< 20% de dégradation)`);
    } else {
      console.log(`   ⚠️  Scalabilité à surveiller (≥ 20% de dégradation)`);
    }
  }

  console.log('='.repeat(70) + '\n');

  process.exit(allPassed ? 0 : 1);
}

runDatasetTests().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
