# 15. Métriques Qualité - Application StockHub V2

> État actuel des performances et de l'accessibilité de **l'application** (Dashboard page)

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Métriques Lighthouse Actuelles](#métriques-lighthouse-actuelles)
- [Performance Détaillée](#performance-détaillée)
- [Problèmes d'Accessibilité Critiques](#problèmes-daccessibilité-critiques)
- [Plan d'Action](#plan-daction)
- [Évolution des Métriques](#évolution-des-métriques)
- [Ressources](#ressources)

---

## Vue d'ensemble

### URLs de Test

- **App** : http://localhost:4176/ (page Dashboard)
- **Métriques Dashboard** : http://localhost:5173/documentation/metrics/
- **GitHub Pages (Dashboard métriques)** : https://sandrinecipolla.github.io/stockHub_V2_front/

### ⚠️ Important

Ce document concerne les métriques de **l'application StockHub V2** (page Dashboard `/`), **pas** le dashboard de métriques (`documentation/metrics/index.html`).

---

## Métriques Lighthouse Actuelles

**Date de l'audit** : 2025-12-06
**Méthode** : Multi-Run (3 audits, médiane)
**Version Lighthouse** : 12.8.2
**Fichier** : `documentation/metrics/data/lighthouse-1765015324279.json`

### Scores Globaux (Médiane de 3 Runs)

| Catégorie          | Score   | Range            | Cible | Statut          |
| ------------------ | ------- | ---------------- | ----- | --------------- |
| **Performance**    | 95/100  | 95-95 (stable)   | ≥95   | ✅ Excellent    |
| **Accessibility**  | 86/100  | 86-86 (stable)   | ≥95   | ❌ **CRITIQUE** |
| **Best Practices** | 100/100 | 100-100 (stable) | ≥95   | ✅ Parfait      |
| **SEO**            | 100/100 | 100-100 (stable) | ≥95   | ✅ Parfait      |

### Comparaison Multi-Environnements

| Environnement                | Perf | A11y | BP  | SEO | Conditions                |
| ---------------------------- | ---- | ---- | --- | --- | ------------------------- |
| **Script Local (multi-run)** | 95   | 86   | 100 | 100 | Headless, 3 runs, médiane |
| **DevTools Local**           | 100  | 86   | 96  | 100 | Chrome, cache actif       |
| **Production Vercel**        | 97   | 86   | 100 | 100 | Réseau réel, CDN          |

**Scores recommandés pour documentation** : **97 / 86 / 100 / 100** (production)

### 🎯 Objectifs

- **Performance** : 95-97 → **Maintenir ≥95** ✅
- **Accessibility** : 86 → **95+/100** (+9 points) **PRIORITÉ ABSOLUE**
- **Best Practices** : ✅ Maintenir 100/100
- **SEO** : ✅ Maintenir 100/100

---

## Performance Détaillée

### Core Web Vitals

| Métrique                            | Valeur | Cible   | Statut     | Score   |
| ----------------------------------- | ------ | ------- | ---------- | ------- |
| **First Contentful Paint (FCP)**    | 2.2s   | < 1.8s  | ⚠️         | 77/100  |
| **Largest Contentful Paint (LCP)**  | 2.5s   | < 2.5s  | ✅         | 100/100 |
| **Total Blocking Time (TBT)**       | 120ms  | < 200ms | ✅         | 100/100 |
| **Cumulative Layout Shift (CLS)**   | 0      | < 0.1   | ✅ Parfait | 100/100 |
| **Max Potential First Input Delay** | N/A    | < 100ms | ⚠️         | 77/100  |

### Issues Performance Détectées

1. **First Contentful Paint (2.2s)**
   - Score: 77/100
   - Impact: Ressources bloquant le rendu
   - Solution: Inline CSS critique, defer JS non critique

2. **Render-Blocking Resources**
   - Score: 50/100 (0.5)
   - Impact: CSS/JS bloquent first paint
   - Solution: Optimiser chargement Design System

3. **Unused JavaScript**
   - Score: 0/100
   - Impact: Bundle contient du code non utilisé
   - Solution: Tree-shaking, code splitting

4. **Missing Source Maps**
   - Score: 0/100
   - Impact: Debugging production difficile
   - Solution: Activer `build.sourcemap: true` dans vite.config.ts

---

## Problèmes d'Accessibilité Critiques

### 📊 Résumé

**Score** : 86/100 (-14 points)
**Problèmes critiques** : **4**
**Impact** : Utilisateurs de lecteurs d'écran **bloqués**

---

### 1. 🔴 ARIA Prohibited Attributes (CRITIQUE)

**Impact** : Lecteurs d'écran reçoivent des informations contradictoires
**Nombre d'éléments affectés** : 3+

#### Éléments Concernés

```html
<!-- ❌ PROBLÈME : aria-label sur Web Component -->
<sh-button
  icon-before="Plus"
  data-theme="dark"
  class="w-auto max-w-[150px]"
  aria-label="Ajouter un nouveau stock à l'inventaire"
>
</sh-button>

<sh-button
  icon-before="BarChart3"
  data-theme="dark"
  class="w-auto max-w-[150px]"
  aria-label="Voir les analyses IA et prédictions ML"
>
</sh-button>

<sh-button
  icon-before="Search"
  data-theme="dark"
  aria-label="Ouvrir la page de recherche avancée de stocks"
>
</sh-button>
```

#### Cause Technique

Les Web Components avec Shadow DOM ne propagent pas automatiquement les attributs ARIA du host au bouton interne.

```
<sh-button aria-label="Texte">  ← Attribut sur le host
  #shadow-root
    <button>                     ← Pas d'aria-label ici!
```

#### Solutions

**Option A - Frontend (Temporaire)** :

```html
<!-- ✅ Utiliser l'attribut natif du composant -->
<sh-button icon-before="Plus" label="Ajouter un stock" data-theme="dark"> </sh-button>
```

**Option B - Design System (Recommandé)** :

Modifier `sh-button` pour propager aria-label:

```typescript
// Dans sh-button.ts
render() {
  const ariaLabel = this.getAttribute('aria-label');
  return html`
    <button
      type="button"
      class="${this.variant}"
      aria-label="${ariaLabel || ''}"
    >
      <slot></slot>
    </button>
  `;
}
```

#### Fichiers à Corriger

- `src/pages/Dashboard.tsx:XX` - Boutons d'action principaux (3 boutons)
- `src/components/Header.tsx:XX` - Boutons de navigation

---

### 2. 🔴 Buttons Without Accessible Name (CRITIQUE)

**Impact** : Lecteurs d'écran annoncent "button" sans contexte
**Nombre d'éléments affectés** : 3+

#### Éléments Concernés

```html
<!-- ❌ PROBLÈME : Boutons dans Shadow DOM sans nom -->
<button type="button" class="primary sm" aria-busy="false">
  <!-- Contenu dans le shadow DOM -->
</button>

<button type="button" class="primary md" aria-busy="false">
  <!-- Contenu dans le shadow DOM -->
</button>

<button type="button" class="secondary md" aria-busy="false">
  <!-- Contenu dans le shadow DOM -->
</button>
```

#### Cause Technique

Les boutons rendus dans le Shadow DOM de `<sh-button>` n'héritent pas automatiquement des noms accessibles du host.

#### Solution

**Dépend du problème #1** - Corriger la propagation aria-label dans le Design System résoudra ce problème.

**Alternative temporaire** :

Utiliser l'attribut `label` du composant:

```html
<sh-button label="Ajouter un stock" icon-before="Plus"> </sh-button>
```

---

### 3. 🔴 Color Contrast Issues (CRITIQUE)

**Impact** : Texte illisible pour utilisateurs malvoyants
**Nombre d'éléments affectés** : 3+ (badges IA)

#### Éléments Concernés

```html
<!-- ❌ PROBLÈME : Contraste insuffisant -->
<div class="ia-badge">
  <!-- Contenu du badge -->
</div>
```

#### Métriques

- **Ratio actuel** : < 4.5:1 (non conforme WCAG AA)
- **Ratio requis** : ≥ 4.5:1 pour texte normal
- **Ratio recommandé** : ≥ 7:1 pour WCAG AAA

#### Solution

1. **Identifier les couleurs exactes** :

```bash
# Inspecter les styles appliqués aux badges IA
```

2. **Vérifier le contraste** :
   - Utiliser WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

3. **Ajuster les couleurs** :

```css
/* Exemple de correction */
.ia-badge {
  /* ❌ Avant: */
  background-color: #8b5cf6; /* Purple-500 */
  color: #c4b5fd; /* Purple-300 - contraste 2.8:1 */

  /* ✅ Après: */
  background-color: #6d28d9; /* Purple-700 */
  color: #ffffff; /* White - contraste 7.2:1 */
}
```

4. **Tester** :

```bash
npm run audit:risk-levels  # Vérifie contraste risk levels
npm run audit:daltonisme   # Vérifie daltonisme
```

#### Fichiers à Corriger

- `src/components/IAAlertBanner.tsx` (ou équivalent)
- Styles CSS associés aux badges IA

---

### 4. 🔴 Label Content Name Mismatch (CRITIQUE)

**Impact** : Confusion pour utilisateurs de commande vocale
**Nombre d'éléments affectés** : 1+

#### Élément Concerné

```html
<!-- ❌ PROBLÈME : label visuel ≠ nom accessible -->
<button class="notification-btn" aria-label="Notifications (3 non lues)">Notifications</button>
```

#### Règle WCAG

[WCAG 2.1 Success Criterion 2.5.3 - Label in Name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)

> Le nom accessible doit **inclure** le texte visible.

**Problème** : Un utilisateur de commande vocale dit "Cliquer Notifications", mais le système cherche "Notifications (3 non lues)".

#### Solution

```html
<!-- ✅ CORRECT : Texte visible inclus dans aria-label -->
<button class="notification-btn" aria-label="Notifications">
  Notifications
  <span class="sr-only">(3 non lues)</span>
</button>

<!-- OU (recommandé) -->
<button class="notification-btn">
  Notifications
  <span aria-live="polite" class="notification-count"> 3 non lues </span>
</button>
```

#### Fichier à Corriger

- `src/components/Header.tsx:XX` - Bouton notifications

---

## Plan d'Action

### Priorité 1 - Fixes Rapides Frontend (2-3h)

**Objectif** : 86 → 92/100 (+6 points)

- [ ] **Contraste badges IA** (1h)
  - Identifier couleurs exactes
  - Ajuster pour ratio ≥ 4.5:1
  - Tester avec WebAIM

- [ ] **Label notifications** (30min)
  - Corriger mismatch aria-label
  - Ajouter span sr-only ou aria-live

- [ ] **Attributs ARIA sh-button** (1h)
  - Remplacer aria-label par `label` attribut
  - Tester avec lecteur d'écran (NVDA/JAWS)

### Priorité 2 - Fixes Design System (3-5h)

**Objectif** : 92 → 95+/100 (+3+ points)

- [ ] **Issue GitHub Design System**
  - Reporter problème propagation aria-label
  - Fournir exemple de code
  - Lien vers audit Lighthouse

- [ ] **PR Design System** (si compétence)
  - Corriger propagation aria-label dans sh-button
  - Ajouter tests a11y
  - Documentation

- [ ] **Attente nouvelle version**
  - Bump version Design System après merge
  - Tester dans l'app
  - Re-audit

### Priorité 3 - Optimisations Performance (2h)

**Objectif** : 94 → 96+/100 (+2 points)

- [ ] **Source Maps** (15min)
  - Activer `build.sourcemap: true` dans vite.config.ts

- [ ] **Inline Critical CSS** (1h)
  - Identifier CSS critique pour first paint
  - Inline dans `<head>`

- [ ] **Defer Non-Critical JS** (45min)
  - Déplacer scripts non critiques en fin de body
  - Utiliser `defer` ou `async`

### Priorité 4 - Vérification & Tests

- [ ] **Re-audit Lighthouse**

  ```bash
  npm run preview
  node scripts/generate-lighthouse.mjs http://localhost:4173/
  ```

- [ ] **Tests manuels**
  - Navigation clavier complète
  - Lecteur d'écran (NVDA Windows)
  - Zoom 200%

- [ ] **Audits spécialisés**
  ```bash
  npm run audit:wcag
  npm run audit:daltonisme
  npm run audit:risk-levels
  ```

---

## Évolution des Métriques

### Historique Performance

| Date           | Score | FCP  | TBT   | Notes                                 |
| -------------- | ----- | ---- | ----- | ------------------------------------- |
| **2025-12-04** | 89    | 2.8s | 290ms | Avant optimisation Design System      |
| **2025-12-05** | 94    | 2.3s | 120ms | Lazy loading Design System (-60% TBT) |
| **2025-12-06** | 94    | 2.2s | 120ms | Stable                                |

**Amélioration totale** : +5 points (+5.6%)

### Historique Accessibilité

| Date           | Score | Problèmes critiques | Notes                  |
| -------------- | ----- | ------------------- | ---------------------- |
| **2025-12-06** | 86    | 4                   | Premier audit détaillé |

### Objectifs

| Métrique           | Actuel  | Cible   | Écart  |
| ------------------ | ------- | ------- | ------ |
| **Performance**    | 94/100  | 96/100  | +2     |
| **Accessibility**  | 86/100  | 95/100  | **+9** |
| **Best Practices** | 100/100 | 100/100 | ✅     |
| **SEO**            | 100/100 | 100/100 | ✅     |

---

## Ressources

### Outils de Vérification

- **WebAIM Contrast Checker** : https://webaim.org/resources/contrastchecker/
- **axe DevTools** : Extension Chrome/Firefox pour audits a11y
- **Lighthouse CI** : https://github.com/GoogleChrome/lighthouse-ci
- **WAVE** : https://wave.webaim.org/
- **NVDA** : https://www.nvaccess.org/ (lecteur d'écran Windows gratuit)

### Documentation WCAG

- **WCAG 2.1 Quick Reference** : https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices** : https://www.w3.org/WAI/ARIA/apg/
- **RGAA 4.1** : https://accessibilite.numerique.gouv.fr/
- **Label in Name** : https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html

### Documentation Interne

- **CI/CD** : [14-CI-CD-WORKFLOWS.md](14-CI-CD-WORKFLOWS.md)
- **Performance Analysis** : [12-PERFORMANCE-ANALYSIS.md](12-PERFORMANCE-ANALYSIS.md)
- **Dashboard Métriques** : [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md)

### Repos Liés

- **Frontend** : https://github.com/SandrineCipolla/stockHub_V2_front
- **Design System** : https://github.com/SandrineCipolla/stockhub_design_system
- **Storybook** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/

---

## Commandes Utiles

### Génération Audits

```bash
# Build + preview
npm run build
npm run preview  # Port 4173 ou suivant

# Lighthouse
node scripts/generate-lighthouse.mjs http://localhost:4173/

# Audits accessibilité
npm run audit:wcag
npm run audit:daltonisme
npm run audit:risk-levels

# Performance
npm run audit:fps
npm run audit:datasets

# Complet
npm run audit:full
```

### Tests

```bash
# Tests unitaires
npm run test:run

# Tests avec coverage
npm run test:coverage

# Pipeline CI complet
npm run ci:check
```

### Serveurs

```bash
# Dev (app)
npm run dev  # http://localhost:5173

# Preview (build)
npm run preview  # http://localhost:4173

# Dashboard métriques
# Ouvrir http://localhost:5173/documentation/metrics/
```

---

## Notes Importantes

### App vs Dashboard Métriques

⚠️ **Ne pas confondre** :

1. **Application StockHub V2** (`/`)
   - Page Dashboard principale
   - URL: http://localhost:4176/
   - **Ce document concerne cette page**

2. **Dashboard Métriques** (`/documentation/metrics/`)
   - Visualisation des audits
   - URL: http://localhost:5173/documentation/metrics/
   - Documentation: [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md)

### Conformité RGAA

Pour être conforme RGAA niveau AA :

- ✅ Contraste minimum 4.5:1 (texte normal)
- ✅ Contraste minimum 3:1 (texte large > 18pt)
- ✅ Tous les boutons doivent avoir un nom accessible
- ✅ Les attributs ARIA doivent être utilisés correctement
- ✅ Le texte visible doit être inclus dans le nom accessible

**Objectif** : **95+/100** sur Lighthouse Accessibility = Conformité RGAA AA

---

**📅 Dernière mise à jour** : 2025-12-06
**📝 Auteur** : Sandrine Cipolla
**🤖 Généré avec** : Claude Code
**📊 Source** : Lighthouse audit `lighthouse-1765013588830.json`
