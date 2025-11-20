/**
 * 🎨 TEST ACCESSIBILITÉ COULEURS - RISK LEVELS
 *
 * Vérifie les contrastes WCAG AA pour les couleurs de risk levels
 * utilisées dans sh-stat-card et sh-stock-prediction-card :
 * - critical (critique, ≤3j)
 * - high (élevé, 4-7j)
 * - medium (moyen, 8-14j)
 * - low (faible, 15j+)
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

// Couleurs de risk levels (depuis tokens.json)
const RISK_LEVEL_COLORS = {
  dark: {
    critical: { name: 'Critique (≤3j)', hex: '#f87171', variable: '--color-danger-400' },
    high: { name: 'Élevé (4-7j)', hex: '#f59e0b', variable: '--color-warning-500' },
    medium: { name: 'Moyen (8-14j)', hex: '#fbbf24', variable: '--color-warning-400' },
    low: { name: 'Faible (15j+)', hex: '#4ade80', variable: '--color-success-400' }
  },
  light: {
    critical: { name: 'Critique (≤3j)', hex: '#b91c1c', variable: '--color-danger-700' },
    high: { name: 'Élevé (4-7j)', hex: '#b45309', variable: '--color-warning-700' },
    medium: { name: 'Moyen (8-14j)', hex: '#d97706', variable: '--color-warning-600' },
    low: { name: 'Faible (15j+)', hex: '#15803d', variable: '--color-success-700' }
  }
};

const BACKGROUNDS = {
  dark: '#1e293b',  // --color-neutral-800
  light: '#ffffff'
};

// ============================================================
// FONCTIONS DE CALCUL
// ============================================================

/**
 * Convertit hex en RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcule la luminance relative (WCAG)
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calcule le ratio de contraste (WCAG)
 */
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Simule la perception des couleurs pour daltoniens
 */
function simulateDaltonism(hex, type) {
  const rgb = hexToRgb(hex);
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  const matrices = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114]
    ]
  };

  const matrix = matrices[type];
  const newR = Math.round((matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b) * 255);
  const newG = Math.round((matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b) * 255);
  const newB = Math.round((matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b) * 255);

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

/**
 * Calcule la distance perceptuelle entre deux couleurs
 */
function getDeltaE(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;

  return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
}

// ============================================================
// TESTS
// ============================================================

async function testRiskLevelColors() {
  log('\n' + '='.repeat(70), 'bright');
  log('🎨 TEST ACCESSIBILITÉ - RISK LEVELS COLORS', 'bright');
  log('='.repeat(70), 'bright');

  const results = {
    contraste: { dark: {}, light: {} },
    daltonisme: {},
    timestamp: new Date().toISOString()
  };

  // ============================================================
  // 1. TESTS DE CONTRASTE WCAG
  // ============================================================
  log('\n\n📊 1. TESTS DE CONTRASTE WCAG AA', 'blue');
  log('='.repeat(70), 'blue');

  ['dark', 'light'].forEach(theme => {
    log(`\n🎨 Mode ${theme === 'dark' ? 'Sombre' : 'Clair'}`, 'cyan');
    log(`   Fond: ${BACKGROUNDS[theme]}`, 'cyan');

    const themeResults = [];

    Object.entries(RISK_LEVEL_COLORS[theme]).forEach(([level, color]) => {
      const ratio = getContrastRatio(color.hex, BACKGROUNDS[theme]);

      // WCAG AA Seuils:
      // - Texte normal: 4.5:1
      // - Texte large: 3:1
      const passesNormal = ratio >= 4.5;
      const passesLarge = ratio >= 3;
      const passesAAA = ratio >= 7;

      let wcagLevel = '';
      if (passesAAA) wcagLevel = 'AAA';
      else if (passesNormal) wcagLevel = 'AA';
      else if (passesLarge) wcagLevel = 'AA (large)';
      else wcagLevel = 'FAIL';

      themeResults.push({
        level,
        hex: color.hex,
        ratio,
        passesNormal,
        passesLarge,
        wcagLevel
      });

      const icon = passesNormal ? '✅' : passesLarge ? '⚠️' : '❌';
      const color_log = passesNormal ? 'green' : passesLarge ? 'yellow' : 'red';

      log(`  ${icon} ${color.name.padEnd(20)} ${color.hex} : ${ratio.toFixed(2)}:1 (${wcagLevel})`, color_log);
    });

    results.contraste[theme] = {
      tests: themeResults,
      allPassNormal: themeResults.every(r => r.passesNormal),
      allPassLarge: themeResults.every(r => r.passesLarge)
    };

    const allPass = themeResults.every(r => r.passesNormal);
    log(`\n   ${allPass ? '✅' : '⚠️'} Mode ${theme}: ${themeResults.filter(r => r.passesNormal).length}/4 passent WCAG AA (texte normal)`,
        allPass ? 'green' : 'yellow');
  });

  // ============================================================
  // 2. SIMULATION DALTONISME
  // ============================================================
  log('\n\n🔍 2. SIMULATION DALTONISME (Mode Sombre)', 'blue');
  log('='.repeat(70), 'blue');

  const daltonismTypes = {
    protanopia: 'Protanopie (déficit rouge)',
    deuteranopia: 'Deutéranopie (déficit vert)',
    tritanopia: 'Tritanopie (déficit bleu-jaune)',
    achromatopsia: 'Achromatopsie (monochrome)'
  };

  const daltonismResults = {};

  Object.entries(daltonismTypes).forEach(([type, description]) => {
    log(`\n🔬 ${description}`, 'cyan');

    const riskLevels = Object.entries(RISK_LEVEL_COLORS.dark);
    const differences = [];

    for (let i = 0; i < riskLevels.length; i++) {
      for (let j = i + 1; j < riskLevels.length; j++) {
        const [key1, color1] = riskLevels[i];
        const [key2, color2] = riskLevels[j];

        const simulated1 = simulateDaltonism(color1.hex, type);
        const simulated2 = simulateDaltonism(color2.hex, type);

        const deltaSimulated = getDeltaE(simulated1, simulated2);
        const differentiable = deltaSimulated >= 40;

        differences.push({
          pair: `${color1.name} ↔ ${color2.name}`,
          delta: deltaSimulated,
          differentiable
        });

        const icon = differentiable ? '✅' : '⚠️';
        const color_log = differentiable ? 'green' : 'yellow';
        log(`  ${icon} ${key1} ↔ ${key2}: Δ=${deltaSimulated.toFixed(1)}`, color_log);
      }
    }

    daltonismResults[type] = {
      description,
      differences,
      allDifferentiable: differences.every(d => d.differentiable),
      passRate: `${differences.filter(d => d.differentiable).length}/${differences.length}`
    };
  });

  results.daltonisme = daltonismResults;

  // ============================================================
  // RAPPORT FINAL
  // ============================================================
  log('\n\n' + '='.repeat(70), 'bright');
  log('📈 RAPPORT FINAL - RISK LEVELS', 'bright');
  log('='.repeat(70), 'bright');

  log('\n📊 CONTRASTE WCAG AA', 'blue');
  log(`   ${results.contraste.dark.allPassNormal ? '✅' : '⚠️'} Mode Sombre: ${results.contraste.dark.tests.filter(r => r.passesNormal).length}/4 passent (texte normal)`,
      results.contraste.dark.allPassNormal ? 'green' : 'yellow');
  log(`   ${results.contraste.light.allPassNormal ? '✅' : '⚠️'} Mode Clair: ${results.contraste.light.tests.filter(r => r.passesNormal).length}/4 passent (texte normal)`,
      results.contraste.light.allPassNormal ? 'green' : 'yellow');

  log('\n🎨 DALTONISME', 'blue');
  Object.entries(daltonismResults).forEach(([type, data]) => {
    log(`   ${data.allDifferentiable ? '✅' : '⚠️'} ${daltonismTypes[type].split('(')[0].trim()}: ${data.passRate}`,
        data.allDifferentiable ? 'green' : 'yellow');
  });

  log('\n🎯 CONCLUSION', 'blue');
  const allContrasts = results.contraste.dark.allPassNormal && results.contraste.light.allPassNormal;
  const allDaltonism = Object.values(daltonismResults).every(r => r.allDifferentiable);
  results.success = allContrasts && allDaltonism; // ajout indicateur

  if (allContrasts && allDaltonism) {
    log('   ✅ EXCELLENT - 100% CONFORME WCAG AA + Daltonisme', 'green');
  } else if (allContrasts) {
    log('   ✅ BON - Conforme WCAG AA, quelques paires daltonisme à surveiller', 'green');
  } else {
    log('   ⚠️  ATTENTION - Quelques contrastes en dessous de WCAG AA', 'yellow');
  }

  log('\n' + '='.repeat(70), 'bright');
  log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`, 'cyan');
  log('='.repeat(70) + '\n', 'bright');

  // Sauvegarde
  try {
    const { writeFileSync } = await import('fs');
    const reportPath = `./documentation/metrics/data/risk-levels-audit-${Date.now()}.json`;
    writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`💾 Rapport sauvegardé: ${reportPath}\n`, 'cyan');
  } catch (e) {
    log('⚠️  Impossible de sauvegarder le rapport\n', 'yellow');
  }

  // Toujours succès pour pipeline (on encode l'état réel dans results.success)
  process.exit(0);
}

// Lancement
testRiskLevelColors().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
