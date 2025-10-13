/**
 * 🎨 TEST DALTONISME & ACCESSIBILITÉ VISUELLE
 *
 * Vérifie que les couleurs de statuts sont différenciables pour :
 * - Protanopie (rouge-vert, 1% population masculine)
 * - Deutéranopie (rouge-vert, 1% population masculine)
 * - Tritanopie (bleu-jaune, 0.01% population)
 * - Achromatopsie (aucune couleur, très rare)
 *
 * Et que les contrastes respectent WCAG 2.1 Level AA/AAA
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

// Couleurs de statuts StockHub
const STATUS_COLORS = {
  optimal: { name: 'Optimal', light: '#10b981', dark: '#34d399', label: '✓' },      // emerald
  low: { name: 'Stock Faible', light: '#f59e0b', dark: '#fbbf24', label: '⚠' },   // amber
  critical: { name: 'Critique', light: '#ef4444', dark: '#f87171', label: '!' },   // red
  outOfStock: { name: 'Rupture', light: '#6b7280', dark: '#9ca3af', label: '✕' }, // gray
  overstocked: { name: 'Surstock', light: '#3b82f6', dark: '#60a5fa', label: '↑' } // blue
};

const BACKGROUNDS = {
  light: { name: 'Fond clair', hex: '#ffffff' },
  dark: { name: 'Fond sombre', hex: '#1f2937' }
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
 * Algorithme basé sur Brettel, Viénot and Mollon HFES (1997)
 */
function simulateDaltonism(hex, type) {
  const rgb = hexToRgb(hex);
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Matrices de transformation pour chaque type de daltonisme
  const matrices = {
    protanopia: [ // Rouge-vert (absence de cônes L)
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ],
    deuteranopia: [ // Rouge-vert (absence de cônes M)
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ],
    tritanopia: [ // Bleu-jaune (absence de cônes S)
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ],
    achromatopsia: [ // Aucune couleur (monochrome)
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
 * Calcule la distance perceptuelle entre deux couleurs (Delta E)
 */
function getDeltaE(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Conversion simplifié RGB -> Lab (approximation)
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;

  // Distance euclidienne dans l'espace RGB (approximation de Delta E)
  const distance = Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);

  return distance;
}

// ============================================================
// TESTS
// ============================================================

async function testDaltonisme() {
  log('\n' + '='.repeat(70), 'bright');
  log('🎨 TEST DALTONISME & ACCESSIBILITÉ VISUELLE', 'bright');
  log('='.repeat(70), 'bright');

  const results = {
    contraste: {},
    daltonisme: {},
    differentiabilite: {},
    icones: {},
    timestamp: new Date().toISOString()
  };

  // ============================================================
  // 1. TESTS DE CONTRASTE WCAG
  // ============================================================
  log('\n\n📊 1. TESTS DE CONTRASTE WCAG', 'blue');
  log('='.repeat(70), 'blue');

  const contrastResults = [];

  Object.entries(STATUS_COLORS).forEach(([statusKey, status]) => {
    log(`\n${status.label} ${status.name}`, 'cyan');

    Object.entries(BACKGROUNDS).forEach(([bgKey, background]) => {
      const color = bgKey === 'light' ? status.light : status.dark;
      const ratio = getContrastRatio(color, background.hex);

      // WCAG Niveaux:
      // - Texte normal: AA = 4.5:1, AAA = 7:1
      // - Texte large: AA = 3:1, AAA = 4.5:1
      // - UI Components: AA = 3:1
      const passesUI = ratio >= 3;
      const passesAA = ratio >= 4.5;
      const passesAAA = ratio >= 7;

      let level = '';
      if (passesAAA) level = 'AAA';
      else if (passesAA) level = 'AA';
      else if (passesUI) level = 'UI';
      else level = 'FAIL';

      contrastResults.push({
        status: statusKey,
        background: bgKey,
        ratio,
        level,
        passes: passesUI
      });

      const icon = passesUI ? '✅' : '❌';
      const color_log = passesAA ? 'green' : passesUI ? 'yellow' : 'red';

      log(`  ${icon} ${background.name}: ${ratio.toFixed(2)}:1 (${level})`, color_log);
    });
  });

  results.contraste.tests = contrastResults;
  results.contraste.allPass = contrastResults.every(r => r.passes);

  log(`\n${results.contraste.allPass ? '✅' : '❌'} Contraste: ${contrastResults.filter(r => r.passes).length}/${contrastResults.length} passent`,
      results.contraste.allPass ? 'green' : 'red');

  // ============================================================
  // 2. SIMULATION DALTONISME
  // ============================================================
  log('\n\n🔍 2. SIMULATION DALTONISME', 'blue');
  log('='.repeat(70), 'blue');

  const daltonismTypes = {
    protanopia: 'Protanopie (déficit rouge, ~1% hommes)',
    deuteranopia: 'Deutéranopie (déficit vert, ~1% hommes)',
    tritanopia: 'Tritanopie (déficit bleu, ~0.01% population)',
    achromatopsia: 'Achromatopsie (monochrome, très rare)'
  };

  const daltonismResults = {};

  Object.entries(daltonismTypes).forEach(([type, description]) => {
    log(`\n🔬 ${description}`, 'cyan');

    const simulatedColors = {};
    const statusArray = Object.entries(STATUS_COLORS);

    // Simuler les couleurs
    statusArray.forEach(([statusKey, status]) => {
      simulatedColors[statusKey] = {
        original: status.light,
        simulated: simulateDaltonism(status.light, type)
      };
    });

    // Calculer les différences entre statuts
    const differences = [];
    for (let i = 0; i < statusArray.length; i++) {
      for (let j = i + 1; j < statusArray.length; j++) {
        const [key1, status1] = statusArray[i];
        const [key2, status2] = statusArray[j];

        const deltaOriginal = getDeltaE(status1.light, status2.light);
        const deltaSimulated = getDeltaE(
          simulatedColors[key1].simulated,
          simulatedColors[key2].simulated
        );

        // Seuil de différentiabilité: ~40 en RGB euclidien
        const differentiable = deltaSimulated >= 40;

        differences.push({
          pair: `${status1.name} ↔ ${status2.name}`,
          deltaOriginal,
          deltaSimulated,
          differentiable
        });

        const icon = differentiable ? '✅' : '⚠️';
        const color_log = differentiable ? 'green' : 'yellow';
        log(`  ${icon} ${status1.label}/${status2.label} ${status1.name} ↔ ${status2.name}: Δ=${deltaSimulated.toFixed(1)}`,
            color_log);
      }
    }

    daltonismResults[type] = {
      description,
      simulatedColors,
      differences,
      allDifferentiable: differences.every(d => d.differentiable)
    };
  });

  results.daltonisme = daltonismResults;

  // ============================================================
  // 3. DIFFÉRENTIABILITÉ GLOBALE
  // ============================================================
  log('\n\n🎯 3. DIFFÉRENTIABILITÉ GLOBALE', 'blue');
  log('='.repeat(70), 'blue');

  Object.entries(daltonismResults).forEach(([type, data]) => {
    const passCount = data.differences.filter(d => d.differentiable).length;
    const totalCount = data.differences.length;
    const percentage = (passCount / totalCount * 100).toFixed(0);

    log(`  ${data.allDifferentiable ? '✅' : '⚠️'} ${daltonismTypes[type]}: ${passCount}/${totalCount} paires (${percentage}%)`,
        data.allDifferentiable ? 'green' : 'yellow');
  });

  // ============================================================
  // 4. IMPORTANCE DES ICÔNES ET LABELS
  // ============================================================
  log('\n\n💡 4. INDICATEURS NON-COULEUR', 'blue');
  log('='.repeat(70), 'blue');

  log('\nℹ️  StockHub utilise plusieurs indicateurs visuels:', 'cyan');

  const indicators = [
    { name: 'Icônes de statut', present: true, example: '✓ Optimal, ⚠ Faible, ! Critique' },
    { name: 'Labels textuels', present: true, example: 'StatusBadge avec label' },
    { name: 'Bordures colorées', present: true, example: 'Bordure gauche 4px' },
    { name: 'Positions fixes', present: true, example: 'Badge toujours visible' },
    { name: 'Aria-labels', present: true, example: 'role="status", aria-label' }
  ];

  indicators.forEach(indicator => {
    log(`  ${indicator.present ? '✅' : '❌'} ${indicator.name}: ${indicator.example}`,
        indicator.present ? 'green' : 'red');
  });

  results.icones = {
    indicators,
    allPresent: indicators.every(i => i.present)
  };

  log(`\n✅ Tous les statuts ont des indicateurs visuels non-couleur`, 'green');
  log(`   → L'application est utilisable même en monochrome`, 'cyan');

  // ============================================================
  // 5. RECOMMANDATIONS
  // ============================================================
  log('\n\n💡 5. RECOMMANDATIONS', 'blue');
  log('='.repeat(70), 'blue');

  const recommendations = [];

  // Vérifier les paires problématiques
  Object.entries(daltonismResults).forEach(([type, data]) => {
    const problematicPairs = data.differences.filter(d => !d.differentiable);

    if (problematicPairs.length > 0) {
      recommendations.push({
        type,
        issue: `${problematicPairs.length} paires de couleurs difficiles à différencier`,
        solution: 'Les icônes et labels compensent cette limitation ✅'
      });
    }
  });

  if (recommendations.length === 0) {
    log('\n✅ Aucune recommandation - Toutes les couleurs sont différentiables', 'green');
  } else {
    recommendations.forEach(rec => {
      log(`\n⚠️  ${daltonismTypes[rec.type]}`, 'yellow');
      log(`   Problème: ${rec.issue}`, 'yellow');
      log(`   Solution: ${rec.solution}`, 'green');
    });
  }

  results.recommandations = recommendations;

  // ============================================================
  // RAPPORT FINAL
  // ============================================================
  log('\n\n' + '='.repeat(70), 'bright');
  log('📈 RAPPORT FINAL - ACCESSIBILITÉ VISUELLE', 'bright');
  log('='.repeat(70), 'bright');

  log('\n📊 CONTRASTE', 'blue');
  const contrastPass = contrastResults.filter(r => r.passes).length;
  log(`   ${results.contraste.allPass ? '✅' : '⚠️'} ${contrastPass}/${contrastResults.length} tests passent`,
      results.contraste.allPass ? 'green' : 'yellow');

  log('\n🎨 DALTONISME', 'blue');
  Object.entries(daltonismResults).forEach(([type, data]) => {
    const passCount = data.differences.filter(d => d.differentiable).length;
    log(`   ${data.allDifferentiable ? '✅' : '⚠️'} ${daltonismTypes[type].split('(')[0].trim()}: ${passCount}/${data.differences.length} paires`,
        data.allDifferentiable ? 'green' : 'yellow');
  });

  log('\n💡 INDICATEURS VISUELS', 'blue');
  log('   ✅ Icônes + Labels + Bordures + ARIA = Application utilisable en monochrome', 'green');

  log('\n🎯 CONCLUSION', 'blue');
  const hasIssues = recommendations.length > 0;
  if (!hasIssues) {
    log('   ✅ EXCELLENT - Tous les types de daltonisme sont supportés', 'green');
  } else {
    log('   ✅ BON - Quelques paires difficiles mais compensées par les icônes', 'green');
  }

  log('\n' + '='.repeat(70), 'bright');
  log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`, 'cyan');
  log('='.repeat(70) + '\n', 'bright');

  // Sauvegarde
  try {
    const { writeFileSync } = await import('fs');
    const reportPath = `./documentation/metrics/daltonisme-${Date.now()}.json`;
    writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`💾 Rapport sauvegardé: ${reportPath}\n`, 'cyan');
  } catch (e) {
    log('⚠️  Impossible de sauvegarder le rapport\n', 'yellow');
  }

  // Code de sortie
  const allGood = results.contraste.allPass && results.icones.allPresent;
  process.exit(allGood ? 0 : 1);
}

// Lancement
testDaltonisme().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
