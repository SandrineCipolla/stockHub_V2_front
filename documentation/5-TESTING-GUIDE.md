# 🔍 Tests de Performance & Audits - StockHub V2

## 📋 Vue d'ensemble

StockHub V2 dispose d'une suite complète de tests automatisés couvrant :

- **Performance** (FPS, Lighthouse, scalabilité)
- **Accessibilité** (WCAG, prefers-reduced-motion, contraste)
- **Éco-conception** (bundle, CO2, requêtes)
- **Qualité code** (TypeScript, tests, coverage)

---

## 🚀 Commandes Rapides

```bash
# Lancer le serveur de preview (requis pour tous les tests)
npm run build && npm run preview

# Dans un autre terminal
npm run audit:full        # Audit complet (recommandé)
npm run audit:fps         # Tests FPS uniquement
npm run audit:a11y        # Tests accessibilité uniquement
npm run audit:datasets    # Tests scalabilité uniquement
npm run audit:daltonisme  # Tests daltonisme et contraste uniquement
```

---

## 📊 1. Tests de Performance

### 1.1 Tests FPS (test-performance-fps.mjs)

**Objectif** : Mesurer les FPS pendant les animations

**Scénarios testés** :

- Chargement initial (entrance animations)
- Hover sur les cartes
- Scroll avec animations
- Recherche/Filtrage (layout animations)
- Compteurs animés (CountUp)

**Seuil** : >55 FPS en moyenne

**Commande** :

```bash
npm run audit:fps
```

**Résultats actuels** :

- FPS moyen : **60.81 FPS** ✅
- Tous les scénarios passent

**Technologie** : Puppeteer + requestAnimationFrame

---

### 1.2 Tests Scalabilité (test-animations-datasets.mjs)

**Objectif** : Mesurer la performance avec différentes tailles de datasets

**Datasets testés** :

- 5 stocks (petit)
- 50 stocks (moyen)
- 200 stocks (grand)
- 500 stocks (très grand)

**Seuil** : Dégradation <10%

**Commande** :

```bash
npm run audit:datasets
```

**Résultats actuels** :

- FPS moyen : **60.93 FPS**
- Dégradation : **0.8%** (excellente scalabilité) ⭐

**Analyse** : Performance reste stable même avec 500 stocks

---

### 1.3 Audit Lighthouse

**Objectif** : Audit complet performance et accessibilité

**Métriques mesurées** :

- Performance score
- Accessibility score
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

**Seuils** :

- Performance : ≥98/100
- Accessibility : ≥96/100

**Commande** :

```bash
npx lighthouse http://localhost:4173 --view
```

**Résultats** : ceux que la commande affiche. Les valeurs suivies dans le temps sont dans [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md), et le workflow `Quality Audits` les recalcule à chaque passage.

**Rapports** : Sauvegardés dans `documentation/metrics/`

---

## ♿ 2. Tests d'Accessibilité

### 2.1 Tests prefers-reduced-motion (test-reduced-motion.mjs)

**Objectif** : Vérifier le respect de la préférence utilisateur

**Tests effectués** :

1. Mode normal (animations activées)
2. Mode reduced motion (animations réduites)
3. Hook useReducedMotion fonctionnel
4. CountUp respecte la préférence

**Commande** :

```bash
npm run audit:a11y
```

**Résultats actuels** :

- **100% des tests passent** ✅
- Durées réduites à 0.00001s en mode accessibility
- Hook détecté et actif

**Conformité** : WCAG 2.1 - Animation from Interactions

---

### 2.2 Analyse Contraste des Couleurs

**Objectif** : Vérifier le contraste des couleurs de statuts

**Couleurs testées** :

- optimal (emerald)
- low (amber)
- critical (red)
- outOfStock (gray)
- overstocked (blue)

**Seuil** : Ratio ≥3:1 (WCAG AA pour UI components)

**Tests** :

- Mode light (fond blanc)
- Mode dark (fond gris foncé)

**Résultats** : Inclus dans `audit:full`

---

### 2.3 Tests Daltonisme et Contraste (test-daltonisme.mjs)

**Objectif** : Vérifier l'accessibilité visuelle des couleurs pour tous les utilisateurs

**Tests de contraste WCAG** :

- 5 couleurs de statuts (optimal, low, critical, outOfStock, overstocked)
- 2 thèmes (light, dark)
- Ratios de contraste calculés selon WCAG 2.1
- Niveaux : UI (≥3:1), AA (≥4.5:1), AAA (≥7:1)

**Simulation daltonisme** :

1. **Protanopie** : Déficit rouge (~1% hommes)
2. **Deutéranopie** : Déficit vert (~1% hommes)
3. **Tritanopie** : Déficit bleu (~0.01% population)
4. **Achromatopsie** : Vision monochrome (très rare)

**Algorithme** : Brettel, Viénot et Mollon (1997)

- Matrices de transformation RGB
- Calcul Delta E (distance perceptuelle)
- Seuil de différentiabilité : ≥40

**Commande** :

```bash
npm run audit:daltonisme
```

**Résultats actuels** :

- Contraste : **8/10 tests passent** ⚠️
  - Optimal/Low sur fond clair échouent (mais compensés par icônes)
- Protanopie : **9/10 paires** ✅
- Deutéranopie : **10/10 paires** ✅
- Tritanopie : **9/10 paires** ✅
- Achromatopsie : **4/10 paires** ⚠️

**Indicateurs non-couleur** :

- ✅ Icônes de statut (✓, ⚠, !, ✕, ↑)
- ✅ Labels textuels
- ✅ Bordures colorées 4px
- ✅ Attributs ARIA complets

**Conclusion** : ✅ **BON** - Application pleinement utilisable même en vision monochrome grâce aux indicateurs visuels non-couleur

**Conformité** : WCAG 2.1 - Use of Color (Level A)

**Rapports** : Sauvegardés dans `documentation/metrics/daltonisme-{timestamp}.json`

---

### 2.4 Navigation Clavier

**Vérifications** :

- ✅ Éléments sémantiques (article, button, input)
- ✅ Focus management (React)
- ✅ ARIA labels
- ✅ Role attributes

**Tests manuels recommandés** :

- Tab navigation
- Espace/Entrée pour activer
- Échap pour fermer modales

---

## 🌱 3. Éco-conception

### 3.1 Analyse Bundle

**Objectif** : Minimiser le poids de l'application

**Métriques** :

- Taille bundle total
- Taille gzippée
- Estimation CO2

**Seuil** : <600 KB gzippé

**Résultats actuels** :

- Bundle : 356.76 KB
- Gzippé : **113.99 KB** ✅
- CO2 estimé : **~0.057g par chargement** 🌍

**Formule CO2** : `gzip_KB × 0.0005g`

---

### 3.2 Analyse Requêtes

**Objectif** : Minimiser les requêtes réseau

**Architecture** :

- SPA (Single Page Application)
- Self-hosted (pas de CDN externes)

**Requêtes** :

- 1 HTML
- 1 JavaScript (bundle)
- 1 CSS

**Total : 3 requêtes** ✅

---

### 3.3 Bonnes Pratiques Éco

| Pratique          | Status | Description                   |
| ----------------- | ------ | ----------------------------- |
| Images optimisées | ✅     | SVG icons uniquement          |
| Lazy loading      | ✅     | React lazy + code splitting   |
| Cache strategy    | ✅     | Vite cache + immutable assets |
| Minification      | ✅     | Vite minification activée     |
| Tree shaking      | ✅     | ES modules utilisés           |
| Dark mode         | ✅     | Réduit luminosité écran       |

---

## 💎 4. Qualité Code

### 4.1 TypeScript

**Commande** :

```bash
npm run type-check
```

**Résultat actuel** : **0 erreur** ✅

---

### 4.2 Tests Unitaires

**Commande** :

```bash
npm run test:run
```

**Résultats actuels** :

- Tests : **369/369 passent** ✅
- Fichiers : 15
- Durée : ~14s

---

### 4.3 Coverage

**Commande** :

```bash
npm run test:coverage
```

**Résultats actuels** :

- Coverage global : **93.3%** ✅
- Components : 99.56%
- Hooks : 87.79%
- Pages : 90.84%

**Objectif** : ≥80% (largement dépassé)

---

## 🔄 Audit Complet (audit-complet.mjs)

### Fonctionnalités

Script tout-en-un qui exécute :

1. ✅ Tests FPS
2. ✅ Tests scalabilité
3. ✅ Audit Lighthouse
4. ✅ Tests accessibilité (prefers-reduced-motion)
5. ✅ Analyse contraste des couleurs
6. ✅ Analyse bundle et CO2
7. ✅ Analyse requêtes
8. ✅ Vérification TypeScript
9. ✅ Tests unitaires

### Rapport JSON

Génère un rapport JSON complet sauvegardé dans :

```
documentation/metrics/audit-complet-{timestamp}.json
```

### Commande

```bash
# Lancer le serveur
npm run build && npm run preview

# Dans un autre terminal
npm run audit:full
```

### Exemple de rapport

```json
{
  "performance": {
    "fps": { "value": 60.81, "passed": true },
    "scalability": { "degradation": 0.8, "passed": true },
    "lighthouse": {
      "performance": 99,
      "accessibility": 96,
      "fcp": "1.5 s",
      "lcp": "1.5 s",
      "tbt": "0 ms",
      "cls": "0.055"
    }
  },
  "accessibility": {
    "reducedMotion": { "passed": true },
    "contrast": { "passed": true }
  },
  "ecoConception": {
    "bundle": { "gzip": 113.99, "passed": true },
    "estimatedCO2": "0.057",
    "requests": { "total": 3, "passed": true }
  },
  "qualiteCode": {
    "typescript": { "passed": true },
    "tests": { "passed": 369 }
  }
}
```

---

## 📈 Historique des Audits

Les rapports sont sauvegardés dans `documentation/metrics/` :

- `lighthouse-report-{date}.json`
- `lighthouse-audit-{timestamp}.json`
- `audit-complet-{timestamp}.json`

---

## 🎯 Objectifs et Seuils

| Catégorie     | Métrique                | Objectif | Actuel   | Status |
| ------------- | ----------------------- | -------- | -------- | ------ |
| Performance   | FPS                     | >55      | 60.81    | ✅     |
| Performance   | Lighthouse              | ≥98      | 99       | ✅     |
| Performance   | Dégradation             | <10%     | 0.8%     | ⭐     |
| Accessibility | Lighthouse              | ≥96      | 96       | ✅     |
| Accessibility | Reduced Motion          | Conforme | Oui      | ✅     |
| Accessibility | Contraste WCAG          | ≥3:1 UI  | 8/10     | ⚠️     |
| Accessibility | Daltonisme Deutéranopie | Conforme | 10/10    | ✅     |
| Accessibility | Daltonisme Protanopie   | Conforme | 9/10     | ✅     |
| Accessibility | Daltonisme Tritanopie   | Conforme | 9/10     | ✅     |
| Accessibility | Indicateurs non-couleur | Présents | Oui      | ✅     |
| Éco           | Bundle gzippé           | <600KB   | 113.99KB | ✅     |
| Éco           | Requêtes                | <10      | 3        | ✅     |
| Éco           | CO2/chargement          | Minimal  | 0.057g   | ✅     |
| Qualité       | TypeScript              | 0 erreur | 0        | ✅     |
| Qualité       | Tests                   | >300     | 369      | ✅     |
| Qualité       | Coverage                | ≥80%     | 93.3%    | ✅     |

---

## 🔧 Troubleshooting

### Le serveur preview n'est pas lancé

**Erreur** : `ECONNREFUSED` ou `Failed to fetch`

**Solution** :

```bash
# Lancer le serveur dans un terminal
npm run build && npm run preview

# Attendre "Local: http://localhost:4173"
# Lancer les tests dans un autre terminal
```

---

### Puppeteer ne trouve pas Chrome

**Erreur** : `Could not find Chrome`

**Solution** :

```bash
# Réinstaller Puppeteer
npm install -D puppeteer
```

---

### Tests FPS échouent

**Cause possible** : Performance machine

**Solution** :

- Fermer les applications gourmandes
- Vérifier que le serveur preview tourne
- Relancer les tests

---

## 📚 Références

### Performance

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [FPS et Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Animation_performance_and_frame_rate)

### Accessibilité

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Contrast Ratio Calculator](https://contrast-ratio.com/)

### Éco-conception

- [GreenIT.fr](https://www.greenit.fr/)
- [Website Carbon Calculator](https://www.websitecarbon.com/)
- [Sustainable Web Design](https://sustainablewebdesign.org/)

---

## 🎓 CI/CD Integration

### GitHub Actions (exemple)

```yaml
name: Performance Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run build

      # Lancer le serveur en background
      - run: npm run preview &
      - run: sleep 5

      # Tests
      - run: npm run audit:full

      # Sauvegarder les rapports
      - uses: actions/upload-artifact@v3
        with:
          name: audit-reports
          path: documentation/metrics/
```

---

## 📝 Maintenance

### Fréquence recommandée

- **Tests FPS** : Après chaque modification d'animation
- **Tests Lighthouse** : Avant chaque release
- **Audit complet** : Hebdomadaire ou avant release majeure
- **Tests unitaires** : À chaque commit (CI/CD)

### Mise à jour des seuils

Si les performances s'améliorent, augmenter les seuils :

- Modifier les constantes dans les scripts
- Documenter les changements
- Mettre à jour ce README

---

**Dernière mise à jour** : 20/10/2025
**Développé par** : Sandrine Cipolla
**Projet** : StockHub V2 - RNCP 7
