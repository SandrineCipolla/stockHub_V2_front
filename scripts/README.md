# 📁 Scripts de Tests Automatisés - StockHub V2

## 📋 Liste des Scripts

| Script                 | Description                                | Commande                   |
| ---------------------- | ------------------------------------------ | -------------------------- |
| `audit-fps.mjs`        | Tests FPS avec animations                  | `npm run audit:fps`        |
| `audit-a11y.mjs`       | Tests accessibilité prefers-reduced-motion | `npm run audit:a11y`       |
| `audit-datasets.mjs`   | Tests scalabilité avec différents datasets | `npm run audit:datasets`   |
| `audit-colorblind.mjs` | Tests contraste et daltonisme (4 types)    | `npm run audit:daltonisme` |
| `audit-full.mjs`       | Audit complet (tout-en-un)                 | `npm run audit:full`       |
| `generate-sitemap.ts`  | Génération sitemap SEO                     | Automatique dans build     |

---

## 📚 check-docs.mjs

Vérifie la documentation Markdown : liens relatifs cassés (avec baseline dans `docs-links-baseline.json`) et règles fixes de `docs/technical/guide-redaction.md` sur les fichiers modifiés.

```bash
npm run check:docs        # liens + style sur les fichiers modifiés (inclus dans ci:quality)
npm run check:docs:all    # audit de style sur tout le dépôt, sans échec
```

## 🚀 Utilisation Rapide

### Prérequis

```bash
# 1. Build l'application
npm run build

# 2. Lancer le serveur preview
npm run preview

# Laisser tourner dans ce terminal
```

### Tests Individuels

```bash
# Dans un autre terminal

# Tests FPS (5 scénarios, ~30s)
npm run audit:fps

# Tests accessibilité (~20s)
npm run audit:a11y

# Tests scalabilité (4 datasets, ~60s)
npm run audit:datasets

# Tests daltonisme et contraste (~10s)
npm run audit:daltonisme
```

### Audit Complet

```bash
# Tous les tests + Lighthouse + Qualité code (~5-10min)
npm run audit:full
```

---

## 📊 audit-fps.mjs

### Objectif

Mesurer les FPS pendant les animations pour garantir une expérience fluide.

### Scénarios

1. **Chargement initial** : Animations entrance avec délai en cascade
2. **Hover animations** : Scale + élévation des cartes
3. **Scroll** : Smooth scrolling avec animations
4. **Filtrage** : Layout animations lors de recherche
5. **Compteurs** : Animations CountUp des métriques

### Seuil de Réussite

- FPS moyen ≥ 55

### Résultats Actuels

- FPS moyen : **60.81** ✅
- Tous scénarios passent

### Technologie

- Puppeteer (browser automation)
- requestAnimationFrame (mesure FPS)

---

## ♿ audit-a11y.mjs

### Objectif

Vérifier le respect de la préférence utilisateur `prefers-reduced-motion`.

### Tests

1. **Mode normal** : Animations activées
2. **Mode reduced motion** : Durées réduites à 0.00001s
3. **Hook useReducedMotion** : Détection media query
4. **CountUp** : Respecte la préférence

### Conformité

- WCAG 2.1 - Animation from Interactions

### Résultats Actuels

- **100% des tests passent** ✅

### Technologie

- Puppeteer
- emulateMediaFeatures (simulation prefers-reduced-motion)

---

## 🎨 audit-colorblind.mjs

### Objectif

Vérifier l'accessibilité visuelle des couleurs de statuts pour tous les utilisateurs, y compris ceux atteints de daltonisme.

### Tests Effectués

#### 1. Contraste WCAG

- Teste toutes les couleurs de statuts (5 statuts × 2 thèmes)
- Vérifie les ratios de contraste selon WCAG 2.1
- Niveaux : UI (≥3:1), AA (≥4.5:1), AAA (≥7:1)

#### 2. Simulation Daltonisme

- **Protanopie** : Déficit rouge (~1% hommes)
- **Deutéranopie** : Déficit vert (~1% hommes)
- **Tritanopie** : Déficit bleu (~0.01% population)
- **Achromatopsie** : Vision monochrome (très rare)

#### 3. Différentiabilité

- Calcule la distance perceptuelle (Delta E) entre couleurs
- Seuil de différentiabilité : ≥40 en espace RGB euclidien
- Teste toutes les paires de statuts (10 combinaisons)

#### 4. Indicateurs Non-Couleur

- Vérifie la présence d'icônes (✓, ⚠, !, ✕, ↑)
- Labels textuels visibles
- Bordures colorées de 4px
- Attributs ARIA (role="status", aria-label)

### Résultats Actuels

- Contraste : **8/10 tests passent** (optimal et low échouent sur fond clair)
- Protanopie : 9/10 paires ✅
- Deutéranopie : 10/10 paires ✅
- Tritanopie : 9/10 paires ✅
- Achromatopsie : 4/10 paires ⚠️ (compensé par icônes)

### Conclusion

✅ **BON** - Quelques paires de couleurs difficiles à différencier pour certains types de daltonisme, mais **parfaitement compensées** par les indicateurs visuels non-couleur (icônes, labels, bordures, ARIA).

L'application reste **pleinement utilisable même en vision monochrome**.

### Technologie

- Algorithmes de Brettel, Viénot et Mollon (1997)
- Matrices de transformation RGB pour simulation
- Calcul luminance relative (WCAG)
- Distance Delta E (approximation euclidienne RGB)

### Rapport JSON

Sauvegardé dans `docs/metrics/daltonisme-{timestamp}.json`

---

## 📈 audit-datasets.mjs

### Objectif

Mesurer la scalabilité des animations avec différentes tailles de données.

### Datasets Testés

- **Petit** : 5 stocks
- **Moyen** : 50 stocks
- **Grand** : 200 stocks
- **Très grand** : 500 stocks

### Métriques

- FPS moyen par dataset
- Dégradation de performance

### Seuil de Réussite

- Dégradation < 10%

### Résultats Actuels

- FPS moyen : **60.93**
- Dégradation : **0.8%** ⭐

### Technologie

- Puppeteer
- localStorage injection (mock datasets)

---

## 🔍 audit-full.mjs

### Objectif

Script tout-en-un regroupant tous les audits de performance, accessibilité, éco-conception et qualité code.

### Catégories Testées

#### 1. Performance (📊)

- Tests FPS (5 scénarios)
- Tests scalabilité (4 datasets)
- Audit Lighthouse (performance + metrics)

#### 2. Accessibilité (♿)

- prefers-reduced-motion (4 tests)
- Contraste des couleurs (5 statuts × 2 thèmes)
- Navigation clavier (info)
- Score Lighthouse accessibility

#### 3. Éco-conception (🌱)

- Analyse bundle (taille + gzip)
- Estimation CO2 par chargement
- Analyse requêtes réseau
- Bonnes pratiques (6 checks)

#### 4. Qualité Code (💎)

- Vérification TypeScript
- Tests unitaires (369 tests)
- Coverage (info)

### Rapport JSON

Génère un rapport JSON complet :

```
docs/metrics/audit-complet-{timestamp}.json
```

### Structure du Rapport

```json
{
  "performance": {
    "fps": { "value": 60.81, "passed": true },
    "scalability": { "degradation": 0.8 },
    "lighthouse": { "performance": 99, "accessibility": 96 }
  },
  "accessibility": {
    "reducedMotion": { "passed": true },
    "contrast": { "passed": true }
  },
  "ecoConception": {
    "bundle": { "gzip": 113.99 },
    "estimatedCO2": "0.057",
    "requests": { "total": 3 }
  },
  "qualiteCode": {
    "typescript": { "passed": true },
    "tests": { "passed": 369 }
  }
}
```

### Durée

~5-10 minutes (selon la machine)

---

## 🛠️ Développement

### Ajouter un Nouveau Test

1. **Créer le script**

   ```bash
   touch scripts/test-nouveau.mjs
   ```

2. **Structure de base**

   ```javascript
   import puppeteer from 'puppeteer';

   const TEST_URL = 'http://localhost:4173';

   async function runTests() {
     const browser = await puppeteer.launch({ headless: true });
     const page = await browser.newPage();

     try {
       await page.goto(TEST_URL);
       // Vos tests ici
     } finally {
       await browser.close();
     }
   }

   runTests().catch(console.error);
   ```

3. **Ajouter le script npm**

   ```json
   "scripts": {
     "audit:nouveau": "node scripts/test-nouveau.mjs"
   }
   ```

4. **Intégrer dans audit-complet.mjs**
   ```javascript
   const nouveauResult = runCommand('node scripts/test-nouveau.mjs', 'Nouveau test');
   ```

---

## 📚 Dépendances

### Puppeteer (^24.24.0)

- Browser automation
- Tests E2E
- Mesure performance

**Installation** :

```bash
npm install -D puppeteer
```

### Lighthouse (via npx)

- Audit performance
- Audit accessibilité
- Web Vitals

**Utilisation** :

```bash
npx lighthouse http://localhost:4173
```

---

## 🎯 Objectifs de Performance

| Métrique                 | Objectif | Actuel   | Status |
| ------------------------ | -------- | -------- | ------ |
| FPS moyen                | >55      | 60.81    | ✅     |
| Lighthouse Performance   | ≥98      | 99       | ✅     |
| Lighthouse Accessibility | ≥96      | 96       | ✅     |
| Dégradation scalabilité  | <10%     | 0.8%     | ⭐     |
| Bundle gzippé            | <600KB   | 113.99KB | ✅     |
| Tests unitaires          | >300     | 369      | ✅     |
| TypeScript errors        | 0        | 0        | ✅     |

---

## 🔄 CI/CD

### Intégration GitHub Actions

Créer `.github/workflows/audit.yml` :

```yaml
name: Performance Audit

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npm run build

      - name: Start preview server
        run: npm run preview &

      - name: Wait for server
        run: sleep 10

      - name: Run FPS tests
        run: npm run audit:fps

      - name: Run accessibility tests
        run: npm run audit:a11y

      - name: Run full audit
        run: npm run audit:full

      - name: Upload audit reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: audit-reports
          path: docs/metrics/
```

---

## 🐛 Troubleshooting

### "ECONNREFUSED"

**Cause** : Serveur preview non lancé

**Solution** :

```bash
npm run build && npm run preview
```

### "Could not find Chrome"

**Cause** : Puppeteer mal installé

**Solution** :

```bash
npm install -D puppeteer
```

### Tests FPS échouent

**Causes possibles** :

- Machine surchargée
- Serveur pas prêt
- Animations non chargées

**Solutions** :

- Fermer applications gourmandes
- Augmenter timeout dans le script
- Vérifier que le build est à jour

---

## 📖 Documentation

### Complète

- TESTS-PERFORMANCE.md (document disparu depuis, non retrouvé)
- [ANIMATIONS.md](../docs/technical/ANIMATIONS.md)

### Lighthouse

- [Documentation officielle](https://developers.google.com/web/tools/lighthouse)

### Puppeteer

- [Documentation officielle](https://pptr.dev/)

---

## 📝 Changelog

### 2025-10-20

- ✅ Création `audit-fps.mjs`
- ✅ Création `audit-a11y.mjs`
- ✅ Création `audit-datasets.mjs`
- ✅ Création `audit-full.mjs`
- ✅ Ajout scripts npm
- ✅ Documentation complète

---

**Développé par** : Sandrine Cipolla
**Projet** : StockHub V2 - RNCP 7
**Date** : Octobre 2025
