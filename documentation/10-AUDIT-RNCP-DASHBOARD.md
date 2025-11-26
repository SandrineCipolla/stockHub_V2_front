# Documentation - Audit RNCP Dashboard

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Structure des données](#structure-des-données)
- [Composants UI](#composants-ui)
- [Fonctions JavaScript](#fonctions-javascript)
- [Guide de maintenance](#guide-de-maintenance)
- [Tests et validation](#tests-et-validation)

---

## Vue d'ensemble

La section **Audit RNCP** du dashboard de métriques qualité agrège tous les audits de qualité du projet StockHub V2 (Performance, Accessibilité, Éco-conception, Qualité du code) dans une interface unifiée avec navigation par onglets.

### Objectifs

- ✅ Centraliser tous les audits qualité en un seul endroit
- ✅ Fournir une vue d'ensemble avec score global RNCP
- ✅ Permettre l'exploration détaillée par catégorie
- ✅ Offrir du contenu éducatif pour comprendre chaque métrique
- ✅ Permettre le téléchargement des données brutes (JSON)

### Fichiers concernés

- **HTML/CSS/JS**: `documentation/metrics/index.html` (lignes ~156-3133)
- **Données**: `documentation/metrics/data/audit-complet-{timestamp}.json`
- **Accès**: `http://localhost:5173/documentation/metrics/`

---

## Architecture

### Structure HTML

```html
<section id="audit-rncp">
  <h2>📚 Audit Complet RNCP — Synthèse</h2>

  <!-- Navigation par onglets -->
  <div class="flex flex-wrap gap-1">
    <button class="rncp-tab active" data-tab="overview">📊 Vue d'ensemble</button>
    <button class="rncp-tab" data-tab="performance">⚡ Performance</button>
    <button class="rncp-tab" data-tab="accessibility">♿ Accessibilité</button>
    <button class="rncp-tab" data-tab="eco">🌱 Éco-conception</button>
    <button class="rncp-tab" data-tab="quality">💎 Qualité</button>
  </div>

  <!-- Contenu des onglets -->
  <div id="rncp-content">
    <div class="rncp-panel active" data-panel="overview">
      <div id="rncp-overview">⏳ Chargement...</div>
    </div>
    <div class="rncp-panel" data-panel="performance">...</div>
    <div class="rncp-panel" data-panel="accessibility">...</div>
    <div class="rncp-panel" data-panel="eco">...</div>
    <div class="rncp-panel" data-panel="quality">...</div>
  </div>
</section>
```

### Styles CSS (lignes 156-179)

```css
/* Onglets */
.rncp-tab {
  background-color: transparent;
  color: #9ca3af;
  border: none;
  cursor: pointer;
}

.rncp-tab.active {
  background-color: var(--sh-purple-500); /* #a855f7 */
  color: white;
}

/* Panneaux */
.rncp-panel {
  display: none;
}

.rncp-panel.active {
  display: block;
}
```

### JavaScript - Flux de données

```
loadAllData()
    ↓
fetch('data/audit-complet-{timestamp}.json')
    ↓
renderAudit(audit)
    ↓
├─ Vue d'ensemble (score global + gauges)
├─ Performance (Lighthouse + FPS + Datasets)
├─ Accessibilité (A11y + Daltonisme + WCAG)
├─ Éco-conception (Build + HTTP + Best practices)
└─ Qualité (Coverage: statements, lines, functions, branches)
```

---

## Fonctionnalités

### 1. Navigation par onglets

**Fichier**: `index.html` (lignes 3102-3133)

```javascript
function initRncpTabs() {
  const tabs = document.querySelectorAll('.rncp-tab');
  const panels = document.querySelectorAll('.rncp-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Désactiver tous les onglets
      tabs.forEach(t => {
        t.classList.remove('active', 'bg-purple-500', 'text-white');
        t.classList.add('text-gray-400');
      });

      // Désactiver tous les panneaux
      panels.forEach(p => p.classList.remove('active'));

      // Activer l'onglet et panneau cliqués
      tab.classList.add('active', 'bg-purple-500', 'text-white');
      tab.classList.remove('text-gray-400');

      const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}
```

**Appel**: Exécuté dans `loadAllData()` après le chargement des données.

---

### 2. Score global RNCP (Vue d'ensemble)

**Calcul**: Moyenne des 4 métriques principales

```javascript
// Ligne ~2492
let score = 0;
let totalMetrics = 0;

// 1. Performance Lighthouse
if (audit.lighthouse?.scores?.performance != null) {
  score += audit.lighthouse.scores.performance;
  totalMetrics++;
}

// 2. Accessibilité Lighthouse
if (audit.lighthouse?.scores?.accessibility != null) {
  score += audit.lighthouse.scores.accessibility;
  totalMetrics++;
}

// 3. Tests FPS (binaire: 100 si passed, 50 sinon)
if (audit.fps?.allPassed != null) {
  score += audit.fps.allPassed ? 100 : 50;
  totalMetrics++;
}

// 4. Couverture de code (fallback: statements || lines)
const coverageScore = audit.coverage?.statements || audit.coverage?.lines || 0;
if (coverageScore > 0) {
  score += coverageScore;
  totalMetrics++;
}

const avgScore = totalMetrics > 0 ? score / totalMetrics : 0;
```

**Affichage**: Badge de statut dynamique

```javascript
const badge =
  avgScore >= 90
    ? { text: '✅ Excellent', color: 'bg-green-500' }
    : avgScore >= 70
      ? { text: '⚠️ Bon', color: 'bg-yellow-500' }
      : { text: '❌ À améliorer', color: 'bg-red-500' };
```

---

### 3. Gauges visuelles (SVG)

**Fonction utilitaire**: `createScoreGauge()` (lignes 3034-3056)

```javascript
function createScoreGauge(label, score, icon) {
  const color =
    score >= 90
      ? '#10b981' // vert
      : score >= 50
        ? '#f59e0b' // orange
        : '#ef4444'; // rouge

  const strokeDasharray = `${(score / 100) * 251} 251`;

  return `
        <div class="text-center p-4 bg-gray-800/50 rounded-lg">
            <div class="relative mx-auto" style="width: 80px; height: 80px;">
                <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 84 84">
                    <!-- Cercle de fond gris -->
                    <circle cx="42" cy="42" r="40"
                            stroke="rgba(255,255,255,0.1)"
                            stroke-width="4"
                            fill="none"/>

                    <!-- Cercle de progression coloré -->
                    <circle cx="42" cy="42" r="40"
                            stroke="${color}"
                            stroke-width="4"
                            fill="none"
                            stroke-linecap="round"
                            stroke-dasharray="${strokeDasharray}"
                            class="transition-all duration-1000 ease-out"/>
                </svg>

                <!-- Score au centre -->
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-xl font-bold" style="color: ${color}">
                        ${score.toFixed(0)}
                    </div>
                </div>
            </div>
            <div class="text-sm mt-2">${icon} ${label}</div>
        </div>
    `;
}
```

**Calcul de `stroke-dasharray`**:

- Circonférence du cercle: `2πr = 2 × 3.14 × 40 ≈ 251`
- Pour 75%: `(75/100) × 251 = 188.25`
- Format: `"188.25 251"` (rempli sur 188.25, vide sur le reste)

---

### 4. Barres de progression (Coverage)

**Fonction utilitaire**: `createCoverageBar()` (lignes 3058-3074)

```javascript
function createCoverageBar(label, percentage) {
  const color =
    percentage >= 80
      ? '#10b981' // vert
      : percentage >= 60
        ? '#f59e0b' // orange
        : '#ef4444'; // rouge

  return `
        <div class="p-3 bg-gray-800/50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
                <div class="text-sm font-medium">${label}</div>
                <div class="text-lg font-bold" style="color: ${color}">
                    ${percentage.toFixed(1)}%
                </div>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-1000"
                     style="width: ${percentage}%; background: ${color}">
                </div>
            </div>
        </div>
    `;
}
```

**Utilisation**:

```javascript
createCoverageBar('Lignes de code', 79.05);
createCoverageBar('Fonctions', 72.34);
createCoverageBar('Branches', 68.91);
```

---

### 5. Téléchargement JSON par section

**Variable globale**: `currentAudit` (ligne 2973)

```javascript
let currentAudit = null; // Stocke l'audit complet pour téléchargement
```

**Fonction**: `downloadAuditJSON(section)` (lignes 2975-3031)

```javascript
function downloadAuditJSON(section = 'complet') {
  if (!currentAudit) {
    alert('Aucun audit disponible pour le téléchargement.');
    return;
  }

  const timestamp = new Date(currentAudit.timestamp).toISOString().split('T')[0];
  let filename, data;

  switch (section) {
    case 'complet':
      filename = `audit-rncp-complet-${timestamp}.json`;
      data = currentAudit;
      break;

    case 'performance':
      filename = `audit-performance-${timestamp}.json`;
      data = {
        timestamp: currentAudit.timestamp,
        lighthouse: currentAudit.lighthouse,
        fps: currentAudit.fps,
        datasets: currentAudit.datasets,
      };
      break;

    case 'accessibility':
      filename = `audit-accessibilite-${timestamp}.json`;
      data = {
        timestamp: currentAudit.timestamp,
        a11y: currentAudit.a11y,
        daltonisme: currentAudit.daltonisme,
        wcag: currentAudit.wcag,
      };
      break;

    case 'eco':
      filename = `audit-eco-conception-${timestamp}.json`;
      data = {
        timestamp: currentAudit.timestamp,
        eco: currentAudit.eco,
      };
      break;

    case 'quality':
      filename = `audit-qualite-${timestamp}.json`;
      data = {
        timestamp: currentAudit.timestamp,
        coverage: currentAudit.coverage,
      };
      break;
  }

  // Création du blob et téléchargement
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

**Boutons de téléchargement** (style uniforme):

```html
<div class="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
  <div class="flex items-center justify-between">
    <div>
      <div class="text-sm font-medium text-gray-300">📥 Télécharger l'audit [Section]</div>
      <div class="text-xs text-gray-400 mt-1">Fichier JSON avec métriques détaillées</div>
    </div>
    <button
      onclick="downloadAuditJSON('section')"
      class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
    >
      <span>📄</span>
      <span>Télécharger</span>
    </button>
  </div>
</div>
```

---

## Structure des données

### Format du fichier `audit-complet-{timestamp}.json`

```json
{
  "timestamp": "2025-11-20T10:22:48.788Z",

  "lighthouse": {
    "scores": {
      "performance": 99,
      "accessibility": 96,
      "bestPractices": 100,
      "seo": 91
    },
    "metrics": {
      "firstContentfulPaint": 0.6,
      "largestContentfulPaint": 0.6,
      "totalBlockingTime": 0,
      "cumulativeLayoutShift": 0,
      "speedIndex": 0.6
    }
  },

  "fps": {
    "allPassed": true,
    "results": [
      {
        "page": "Home",
        "url": "/",
        "avgFps": 60,
        "minFps": 60,
        "maxFps": 60,
        "passed": true
      }
    ]
  },

  "datasets": {
    "allPassed": true,
    "details": [
      {
        "page": "Inventory",
        "url": "/inventory",
        "datasetSize": 100,
        "avgFps": 59.8,
        "passed": true
      }
    ]
  },

  "a11y": {
    "passed": true,
    "details": {
      "reducedMotionSupport": true,
      "keyboardNavigation": true,
      "ariaLabels": true
    }
  },

  "daltonisme": {
    "differentiabilite": {
      "allDifferentiable": true
    },
    "contraste": {
      "allConformRatios": true
    },
    "icones": {
      "allAccessible": true
    },
    "daltonisme": {
      "protanopia": {
        "allDifferentiable": true,
        "description": "Vision rouge-vert (absence de cônes rouges)"
      },
      "deuteranopia": {
        "allDifferentiable": true,
        "description": "Vision rouge-vert (absence de cônes verts)"
      },
      "tritanopia": {
        "allDifferentiable": true,
        "description": "Vision bleu-jaune (absence de cônes bleus)"
      },
      "achromatopsia": {
        "allDifferentiable": true,
        "description": "Vision en niveaux de gris (aucun cône)"
      }
    }
  },

  "wcag": {
    "levels": {
      "A": { "passed": 12, "failed": 0, "total": 12 },
      "AA": { "passed": 8, "failed": 0, "total": 8 },
      "AAA": { "passed": 4, "failed": 1, "total": 5 }
    }
  },

  "eco": {
    "build": {
      "succeeded": true
    },
    "bundle": {
      "sizeKB": null,
      "gzipKB": null
    },
    "carbon": {
      "estimatedCO2g": null
    },
    "requests": {
      "count": 1,
      "passed": true
    },
    "bestPractices": [
      {
        "name": "Images optimisées",
        "status": "✅ Appliqué"
      },
      {
        "name": "Lazy loading",
        "status": "✅ Appliqué"
      }
    ],
    "notes": ["Aucun fichier index-*.js trouvé pour analyse bundle"],
    "success": true
  },

  "coverage": {
    "statements": null,
    "lines": 79.05,
    "functions": 72.34,
    "branches": 68.91
  }
}
```

### Gestion des valeurs nulles

**Problème**: Certaines métriques peuvent être `null` (ex: `statements`, `bundle.sizeKB`).

**Solution**: Utiliser des fallbacks et vérifications conditionnelles.

```javascript
// Exemple: Coverage statements
const coverageScore = audit.coverage?.statements || audit.coverage?.lines || 0;

// Exemple: Bundle size
if (audit.eco?.bundle?.sizeKB != null) {
  // Afficher la taille
} else {
  // Afficher "Non disponible"
}
```

---

## Composants UI

### 1. Badge de statut

**Localisation**: Header de la section (ligne ~698)

```html
<div class="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300" id="audit-rncp-status-badge">
  ⏳ Chargement...
</div>
```

**Mise à jour dynamique** (ligne ~2512):

```javascript
const badge =
  avgScore >= 90
    ? { text: '✅ Excellent', color: 'bg-green-500' }
    : avgScore >= 70
      ? { text: '⚠️ Bon', color: 'bg-yellow-500' }
      : { text: '❌ À améliorer', color: 'bg-red-500' };

document.getElementById('audit-rncp-status-badge').innerHTML = `
    <span class="${badge.color} text-white px-3 py-1 rounded-full text-xs font-medium">
        ${badge.text} — ${avgScore.toFixed(1)}%
    </span>
`;
```

---

### 2. Contenu éducatif (💡)

**Pattern réutilisable**:

```html
<div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
  <div class="flex items-start gap-3">
    <div class="text-2xl">💡</div>
    <div>
      <div class="text-sm font-semibold text-blue-300 mb-2">Titre de l'explication</div>
      <div class="text-xs text-gray-300 space-y-1">
        <p>Explication détaillée...</p>
        <p>Points clés:</p>
        <ul class="list-disc list-inside ml-2 space-y-1">
          <li>Point 1</li>
          <li>Point 2</li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

**Utilisé dans**:

- Vue d'ensemble (explication de l'audit RNCP)
- Performance (explication Lighthouse)
- Accessibilité (importance RGAA)
- Éco-conception (impact environnemental)
- Qualité (rôle du test coverage)

---

### 3. Grille de métriques

**Pattern 2×2 ou 4 colonnes**:

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  ${createScoreGauge('Performance', perfScore, '⚡')} ${createScoreGauge('Accessibilité', a11yScore,
  '♿')} ${createScoreGauge('Qualité', qualityScore, '💎')} ${createScoreGauge('FPS', fpsScore,
  '🎬')}
</div>
```

---

### 4. Liste de checks (Tests daltonisme)

```html
<div class="space-y-2">
  ${Object.entries(audit.daltonisme.daltonisme).map(([type, data]) => `
  <div class="flex items-center justify-between p-2 bg-gray-700/50 rounded">
    <div>
      <div class="font-medium">
        ${type === 'protanopia' ? 'Protanopie (rouge-vert)' : type === 'deuteranopia' ?
        'Deutéranopie (rouge-vert)' : type === 'tritanopia' ? 'Tritanopie (bleu-jaune)' :
        'Achromatopsie (niveaux de gris)'}
      </div>
      <div class="text-[10px] text-gray-400">${data.description}</div>
    </div>
    <span class="text-lg"> ${data.allDifferentiable ? '✅' : '⚠️'} </span>
  </div>
  ` ).join('')}
</div>
```

---

### 5. Détails Lighthouse (Performance)

```html
<div class="mt-6 space-y-2">
  <div class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
    <div class="text-sm">
      <span class="text-gray-400">First Contentful Paint</span>
    </div>
    <div class="text-sm font-bold text-green-400">
      ${audit.lighthouse.metrics.firstContentfulPaint}s
    </div>
  </div>
  <!-- Répéter pour LCP, TBT, CLS, Speed Index -->
</div>
```

---

## Fonctions JavaScript

### Fonction principale: `renderAudit(audit)`

**Localisation**: Lignes 2483-2971

**Rôle**: Génère tout le contenu HTML des 5 onglets RNCP.

**Structure**:

```javascript
function renderAudit(audit) {
  if (!audit) {
    // Gestion erreur
    return;
  }

  // 1. Stocker pour téléchargement
  currentAudit = audit;

  // 2. Calculer score global (4 métriques)
  const avgScore = calculateGlobalScore(audit);

  // 3. Mettre à jour badge de statut
  updateStatusBadge(avgScore);

  // 4. Remplir onglet "Vue d'ensemble"
  document.getElementById('rncp-overview').innerHTML = `
        <!-- Contenu éducatif -->
        <!-- Grille de gauges -->
        <!-- Résumé des tests -->
        <!-- Bouton de téléchargement -->
    `;

  // 5. Remplir onglet "Performance"
  document.getElementById('rncp-performance').innerHTML = `
        <!-- Lighthouse scores + metrics -->
        <!-- Tests FPS -->
        <!-- Tests Datasets -->
        <!-- Bouton de téléchargement -->
    `;

  // 6. Remplir onglet "Accessibilité"
  document.getElementById('rncp-accessibility').innerHTML = `
        <!-- Tests A11y (Reduced Motion) -->
        <!-- Tests Daltonisme -->
        <!-- WCAG compliance -->
        <!-- Bouton de téléchargement -->
    `;

  // 7. Remplir onglet "Éco-conception"
  document.getElementById('rncp-eco').innerHTML = `
        <!-- Build status -->
        <!-- HTTP requests -->
        <!-- Best practices list -->
        <!-- Bouton de téléchargement -->
    `;

  // 8. Remplir onglet "Qualité"
  document.getElementById('rncp-quality').innerHTML = `
        <!-- Gauge coverage globale -->
        <!-- Barres de progression (lines, functions, branches) -->
        <!-- Bouton de téléchargement -->
    `;
}
```

---

### Fonction: `loadAllData()`

**Localisation**: Lignes 3076-3100

**Rôle**: Charge tous les fichiers JSON et initialise l'interface.

```javascript
async function loadAllData() {
  try {
    // 1. Charger lighthouse
    const lighthouseData = await fetch('data/lighthouse-results.json').then(res => res.json());
    renderLighthouse(lighthouseData);

    // 2. Charger FPS
    const fpsData = await fetch('data/fps-results.json').then(res => res.json());
    renderFPS(fpsData);

    // 3. Charger daltonisme
    const daltonismeData = await fetch('data/daltonisme-results.json').then(res => res.json());
    renderDaltonisme(daltonismeData);

    // ... autres fichiers ...

    // 4. Charger audit complet RNCP
    const auditCompletFiles = await fetch('data/')
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
          .map(a => a.getAttribute('href'))
          .filter(href => href && href.startsWith('audit-complet-'));
        return links;
      });

    if (auditCompletFiles.length > 0) {
      const latestAuditFile = auditCompletFiles.sort().reverse()[0];
      const auditData = await fetch(`data/${latestAuditFile}`).then(res => res.json());

      renderAudit(auditData);
      initRncpTabs(); // Initialiser navigation onglets
    }
  } catch (error) {
    console.error('Erreur chargement données:', error);
  }
}
```

---

## Guide de maintenance

### Ajouter un nouvel onglet

**Étape 1**: Ajouter le bouton dans le HTML (ligne ~707)

```html
<button class="rncp-tab" data-tab="nouveau-tab">🔍 Nouveau Tab</button>
```

**Étape 2**: Ajouter le panneau (ligne ~730)

```html
<div class="rncp-panel" data-panel="nouveau-tab">
  <div id="rncp-nouveau-tab">⏳ Chargement...</div>
</div>
```

**Étape 3**: Remplir le contenu dans `renderAudit()` (après ligne 2971)

```javascript
document.getElementById('rncp-nouveau-tab').innerHTML = `
    <div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
        <div class="flex items-start gap-3">
            <div class="text-2xl">💡</div>
            <div>
                <div class="text-sm font-semibold text-blue-300 mb-2">
                    C'est quoi le Nouveau Tab ?
                </div>
                <div class="text-xs text-gray-300">
                    Explication...
                </div>
            </div>
        </div>
    </div>

    <!-- Contenu spécifique -->

    <!-- Bouton de téléchargement -->
    <div class="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div class="flex items-center justify-between">
            <div>
                <div class="text-sm font-medium text-gray-300">
                    📥 Télécharger l'audit Nouveau Tab
                </div>
            </div>
            <button onclick="downloadAuditJSON('nouveau-tab')"
                    class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2">
                <span>📄</span>
                <span>Télécharger</span>
            </button>
        </div>
    </div>
`;
```

**Étape 4**: Ajouter le cas dans `downloadAuditJSON()` (ligne ~3000)

```javascript
case 'nouveau-tab':
    filename = `audit-nouveau-tab-${timestamp}.json`;
    data = {
        timestamp: currentAudit.timestamp,
        nouveauTabData: currentAudit.nouveauTabData
    };
    break;
```

---

### Modifier le calcul du score global

**Localisation**: Lignes 2492-2507 dans `renderAudit()`

**Exemple**: Ajouter une 5ème métrique (Éco-conception)

```javascript
// Avant (4 métriques)
let score = 0;
let totalMetrics = 0;

if (audit.lighthouse?.scores?.performance != null) {
  score += audit.lighthouse.scores.performance;
  totalMetrics++;
}
// ... 3 autres métriques ...

// Après (5 métriques)
if (audit.eco?.requests?.passed != null) {
  score += audit.eco.requests.passed ? 100 : 0;
  totalMetrics++;
}

const avgScore = totalMetrics > 0 ? score / totalMetrics : 0;
```

**⚠️ Attention**: Mettre à jour la ligne 2519 pour afficher le bon nombre:

```javascript
<div class="text-xs text-gray-400">Basé sur ${totalMetrics} métriques principales</div>
```

---

### Personnaliser les couleurs de seuils

**Localisation**: Fonctions `createScoreGauge()` et `createCoverageBar()`

**Actuellement**:

- 🟢 Vert (`#10b981`): ≥ 90% (excellent)
- 🟠 Orange (`#f59e0b`): 50-89% (acceptable)
- 🔴 Rouge (`#ef4444`): < 50% (critique)

**Modification**:

```javascript
// Exemple: Seuils plus stricts
function createScoreGauge(label, score, icon) {
  const color =
    score >= 95
      ? '#10b981' // vert si ≥95%
      : score >= 80
        ? '#f59e0b' // orange si 80-94%
        : '#ef4444'; // rouge si <80%

  // Reste du code...
}
```

---

### Ajouter un nouveau type de contenu éducatif

**Pattern d'alerte** (au lieu du bleu informatif):

```html
<div class="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-6">
  <div class="flex items-start gap-3">
    <div class="text-2xl">⚠️</div>
    <div>
      <div class="text-sm font-semibold text-yellow-300 mb-2">Attention</div>
      <div class="text-xs text-gray-300">Message d'avertissement...</div>
    </div>
  </div>
</div>
```

**Couleurs disponibles**:

- 🔵 Bleu (`blue-500`): Information
- 🟡 Jaune (`yellow-500`): Avertissement
- 🔴 Rouge (`red-500`): Erreur
- 🟢 Vert (`green-500`): Succès
- 🟣 Violet (`purple-500`): Conseil

---

## Tests et validation

### Checklist de vérification

**Fonctionnalités à tester**:

1. ✅ **Navigation par onglets**
   - Cliquer sur chaque onglet
   - Vérifier que l'onglet actif devient violet
   - Vérifier que le contenu change

2. ✅ **Affichage des données**
   - Vue d'ensemble: 4 gauges + score global
   - Performance: Lighthouse + FPS + Datasets
   - Accessibilité: A11y + Daltonisme + WCAG
   - Éco-conception: Build + HTTP + Best practices
   - Qualité: Coverage avec 4 barres

3. ✅ **Gestion des valeurs nulles**
   - Tester avec `statements: null` → doit utiliser `lines`
   - Tester avec `bundle.sizeKB: null` → doit afficher "Non disponible"

4. ✅ **Téléchargements JSON**
   - Cliquer sur chaque bouton de téléchargement
   - Vérifier le nom du fichier (format: `audit-{section}-{date}.json`)
   - Ouvrir le JSON téléchargé et vérifier le contenu

5. ✅ **Responsive design**
   - Tester sur mobile (grille 2 colonnes)
   - Tester sur desktop (grille 4 colonnes)
   - Vérifier que les onglets wrap correctement

6. ✅ **Badge de statut**
   - Score ≥ 90%: Badge vert "✅ Excellent"
   - Score 70-89%: Badge jaune "⚠️ Bon"
   - Score < 70%: Badge rouge "❌ À améliorer"

---

### Tests manuels

**Commandes**:

```bash
# 1. Lancer le serveur dev
npm run dev

# 2. Ouvrir le navigateur
# http://localhost:5173/documentation/metrics/

# 3. Tester navigation
# - Cliquer sur chaque onglet RNCP
# - Vérifier que le contenu change

# 4. Tester téléchargements
# - Cliquer sur "Télécharger" dans chaque onglet
# - Vérifier que le fichier JSON est téléchargé

# 5. Tester responsive
# - Ouvrir DevTools (F12)
# - Passer en mode responsive
# - Tester sur iPhone, iPad, Desktop
```

---

### Debugging

**Console JavaScript**:

```javascript
// Vérifier que l'audit est chargé
console.log(currentAudit);

// Vérifier le score calculé
const score = currentAudit.lighthouse.scores.performance;
console.log('Score Performance:', score);

// Forcer le téléchargement
downloadAuditJSON('complet');

// Vérifier les onglets actifs
document.querySelectorAll('.rncp-tab.active');
document.querySelectorAll('.rncp-panel.active');
```

**Erreurs courantes**:

| Erreur                                           | Cause probable                    | Solution                                |
| ------------------------------------------------ | --------------------------------- | --------------------------------------- |
| "Cannot read property 'statements' of undefined" | `audit.coverage` est `null`       | Ajouter `?.` optional chaining          |
| "downloadAuditJSON is not defined"               | Fonction appelée avant définition | Vérifier l'ordre du code                |
| Onglet ne change pas de couleur                  | Classes CSS manquantes            | Vérifier `classList.add/remove`         |
| JSON téléchargé vide                             | `currentAudit` non défini         | Vérifier que `renderAudit()` est appelé |

---

## Ressources

### Documentation externe

- **TailwindCSS**: https://tailwindcss.com/docs
- **SVG stroke-dasharray**: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
- **Blob API**: https://developer.mozilla.org/en-US/docs/Web/API/Blob
- **Optional chaining**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

### Fichiers du projet

- **HTML**: `documentation/metrics/index.html`
- **Données**: `documentation/metrics/data/audit-complet-*.json`
- **Scripts d'audit**: `scripts/audit-*.js`
- **Documentation projet**: `CLAUDE.md`

---

## Historique des modifications

### v1.0 - 2025-11-26

**Ajouts**:

- ✅ Navigation par onglets (5 tabs)
- ✅ Score global RNCP (moyenne 4 métriques)
- ✅ Gauges visuelles SVG
- ✅ Barres de progression (coverage)
- ✅ Contenu éducatif (💡)
- ✅ Téléchargements JSON par section
- ✅ Style uniforme avec boutons violets

**Corrections**:

- ✅ Score calculé sur 4 métriques (était 3)
- ✅ Affichage daltonisme (noms français)
- ✅ Affichage éco-conception (données structurées)
- ✅ Gestion des valeurs nulles (`statements` → `lines`)

---

## Contact & Support

Pour toute question ou suggestion d'amélioration, consultez le **GitHub Project**: https://github.com/users/SandrineCipolla/projects/3

**Auteur**: Sandrine Cipolla
**Projet**: StockHub V2
**Licence**: MIT
