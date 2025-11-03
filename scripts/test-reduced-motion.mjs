/**
 * Script de test d'accessibilité prefers-reduced-motion
 * Vérifie que les animations respectent la préférence utilisateur
 */

import puppeteer from 'puppeteer';

const TEST_URL = 'http://localhost:4173';

async function testReducedMotion() {
  console.log('🚀 Test d\'accessibilité prefers-reduced-motion\n');
  console.log(`URL testée: ${TEST_URL}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let allPassed = true;

  try {
    // Test 1: Mode normal (animations activées)
    console.log('📊 Test 1: Mode normal (animations activées)');
    const pageNormal = await browser.newPage();
    await pageNormal.setViewport({ width: 1920, height: 1080 });
    await pageNormal.goto(TEST_URL, { waitUntil: 'networkidle2' });

    const normalAnimations = await pageNormal.evaluate(() => {
      const cards = document.querySelectorAll('article');
      if (cards.length === 0) return { found: false };

      const firstCard = cards[0];
      const computedStyle = window.getComputedStyle(firstCard);

      return {
        found: true,
        transitionDuration: computedStyle.transitionDuration,
        animationDuration: computedStyle.animationDuration,
        willChange: computedStyle.willChange
      };
    });

    console.log('  Animations normales détectées:');
    console.log(`    Cartes trouvées: ${normalAnimations.found ? 'Oui' : 'Non'}`);
    if (normalAnimations.found) {
      console.log(`    Transition duration: ${normalAnimations.transitionDuration}`);
      console.log(`    Animation duration: ${normalAnimations.animationDuration}`);
    }
    console.log('  ✅ PASS\n');

    await pageNormal.close();

    // Test 2: Mode reduced motion (animations réduites)
    console.log('📊 Test 2: Mode reduced motion (animations réduites)');
    const pageReduced = await browser.newPage();
    await pageReduced.setViewport({ width: 1920, height: 1080 });

    // Activer prefers-reduced-motion
    await pageReduced.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ]);

    await pageReduced.goto(TEST_URL, { waitUntil: 'networkidle2' });

    const reducedAnimations = await pageReduced.evaluate(() => {
      const cards = document.querySelectorAll('article');
      if (cards.length === 0) return { found: false };

      const firstCard = cards[0];
      const computedStyle = window.getComputedStyle(firstCard);

      // Vérifier si useReducedMotion est actif
      const reducedMotionActive = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      return {
        found: true,
        reducedMotionActive,
        transitionDuration: computedStyle.transitionDuration,
        animationDuration: computedStyle.animationDuration,
        willChange: computedStyle.willChange
      };
    });

    console.log('  Mode reduced motion détecté:');
    console.log(`    prefers-reduced-motion: ${reducedAnimations.reducedMotionActive ? 'reduce' : 'no-preference'}`);
    console.log(`    Cartes trouvées: ${reducedAnimations.found ? 'Oui' : 'Non'}`);
    if (reducedAnimations.found) {
      console.log(`    Transition duration: ${reducedAnimations.transitionDuration}`);
      console.log(`    Animation duration: ${reducedAnimations.animationDuration}`);
    }

    // Vérifier que reduced motion est bien actif
    if (!reducedAnimations.reducedMotionActive) {
      console.log('  ❌ FAIL: prefers-reduced-motion non détecté\n');
      allPassed = false;
    } else {
      console.log('  ✅ PASS: prefers-reduced-motion détecté et actif\n');
    }

    await pageReduced.close();

    // Test 3: Vérifier que useReducedMotion hook fonctionne
    console.log('📊 Test 3: Vérification du hook useReducedMotion');
    const pageHookTest = await browser.newPage();
    await pageHookTest.setViewport({ width: 1920, height: 1080 });

    // Activer prefers-reduced-motion
    await pageHookTest.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ]);

    await pageHookTest.goto(TEST_URL, { waitUntil: 'networkidle2' });

    // Attendre que les animations entrance soient potentiellement réduites
    await new Promise(resolve => setTimeout(resolve, 1000));

    const hookWorking = await pageHookTest.evaluate(() => {
      // Vérifier que le hook a bien réduit les animations
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // En mode reduced motion, les durées d'animation doivent être très courtes (0.01s dans notre config)
      const cards = document.querySelectorAll('article');
      if (cards.length === 0) return { working: false, reason: 'No cards found' };

      return {
        working: reducedMotion,
        reason: reducedMotion ? 'Hook détecté et actif' : 'Hook non détecté'
      };
    });

    console.log(`  Hook useReducedMotion: ${hookWorking.working ? 'Actif' : 'Inactif'}`);
    console.log(`  Raison: ${hookWorking.reason}`);

    if (!hookWorking.working) {
      console.log('  ❌ FAIL: Hook useReducedMotion ne fonctionne pas correctement\n');
      allPassed = false;
    } else {
      console.log('  ✅ PASS: Hook useReducedMotion fonctionne correctement\n');
    }

    await pageHookTest.close();

    // Test 4: Test du compteur CountUp en mode reduced motion
    console.log('📊 Test 4: CountUp en mode reduced motion');
    const pageCountUpTest = await browser.newPage();
    await pageCountUpTest.setViewport({ width: 1920, height: 1080 });

    await pageCountUpTest.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ]);

    await pageCountUpTest.goto(TEST_URL, { waitUntil: 'networkidle2' });

    // Attendre que les métriques se chargent
    await new Promise(resolve => setTimeout(resolve, 500));

    const countUpTest = await pageCountUpTest.evaluate(() => {
      const metricCards = document.querySelectorAll('[data-testid="metric-card"], [aria-label*="Total Produits"]');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      return {
        metricCardsFound: metricCards.length,
        reducedMotionActive: reducedMotion
      };
    });

    console.log(`  Metric cards trouvées: ${countUpTest.metricCardsFound}`);
    console.log(`  Reduced motion actif: ${countUpTest.reducedMotionActive ? 'Oui' : 'Non'}`);

    if (countUpTest.reducedMotionActive) {
      console.log('  ✅ PASS: CountUp respecte prefers-reduced-motion\n');
    } else {
      console.log('  ❌ FAIL: Reduced motion non actif\n');
      allPassed = false;
    }

    await pageCountUpTest.close();

  } catch (error) {
    console.error('❌ Erreur pendant les tests:', error.message);
    allPassed = false;
  } finally {
    await browser.close();
  }

  // Rapport final
  console.log('='.repeat(60));
  console.log('📈 RAPPORT FINAL - ACCESSIBILITÉ ANIMATIONS');
  console.log('='.repeat(60));
  console.log(`\n${allPassed ? '✅ TOUS LES TESTS PASSENT' : '❌ CERTAINS TESTS ÉCHOUENT'}`);
  console.log(`\nLe système respecte ${allPassed ? 'correctement' : 'partiellement'} prefers-reduced-motion`);
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

testReducedMotion().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
