# Documentation - Lighthouse Dynamic Audits Extraction

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Problématique](#problématique)
- [Architecture](#architecture)
- [Fonctionnement technique](#fonctionnement-technique)
- [Structure des données](#structure-des-données)
- [Fonctions JavaScript](#fonctions-javascript)
- [Avantages](#avantages)
- [Guide de maintenance](#guide-de-maintenance)
- [Tests et validation](#tests-et-validation)

---

## Vue d'ensemble

Le système d'**extraction dynamique des audits Lighthouse échoués** permet au dashboard de métriques d'afficher automatiquement les recommandations spécifiques basées sur les audits réellement échoués dans le dernier rapport Lighthouse, au lieu d'afficher des recommandations génériques basées uniquement sur le score global.

### Objectifs

- ✅ Afficher les **vrais problèmes détectés** par Lighthouse
- ✅ Mise à jour **automatique** lors de nouveaux audits
- ✅ **Précision** : Recommandations avec valeurs mesurées
- ✅ **Traçabilité** : Chaque recommandation provient d'un audit officiel
- ✅ **Pédagogie** : Descriptions officielles de Lighthouse

### Fichiers concernés

- **HTML/CSS/JS**: `documentation/metrics/index.html`
  - Fonction `extractFailedAudits()` (lignes ~910-956)
  - Fonction `loadAllData()` (lignes ~958-987)
  - Fonction `renderLighthouseDetails()` (lignes ~3235-3500+)
- **Données sources**: `documentation/metrics/data/lighthouse-raw-{timestamp}.json`
- **Accès**: `http://localhost:5173/documentation/metrics/` → Section Lighthouse

---

## Problématique

### ❌ Avant : Recommandations génériques basées sur seuils

```javascript
// Code précédent
if (scores.performance < 90) {
  recommendations.push({
    icon: '📦',
    title: 'Optimiser les ressources (images, JS, CSS)',
    desc: 'Compresser les images (WebP), minifier JS/CSS...',
  });
}
```

**Problèmes** :

- ⚠️ Recommandations **génériques** pas forcément applicables
- ⚠️ Basées uniquement sur le **score global**, pas les audits individuels
- ⚠️ Pas de **valeurs mesurées** (temps, économies potentielles)
- ⚠️ **Statiques** : ne reflètent pas l'évolution du projet

### ✅ Après : Audits réels extraits dynamiquement

```javascript
// Code actuel
if (failedAudits?.performance && failedAudits.performance.length > 0) {
  failedAudits.performance.forEach(audit => {
    recommendations.push({
      icon: '🎨',
      title: audit.title, // "First Contentful Paint"
      desc: audit.description,
      displayValue: audit.displayValue, // "2.4s"
    });
  });
}
```

**Avantages** :

- ✅ Recommandations **spécifiques** aux vrais problèmes
- ✅ Basées sur les **audits individuels échoués** (score < 1.0)
- ✅ Affichage des **valeurs mesurées** (2.4s, 150ms, etc.)
- ✅ **Dynamiques** : se mettent à jour automatiquement

---

## Architecture

### Flux de données

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Génération du rapport Lighthouse                          │
│    npm run audit:lighthouse                                  │
│    └─> lighthouse-raw-{timestamp}.json                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Chargement de la page (index.html)                        │
│    loadAllData()                                             │
│    └─> findLatestJSON('lighthouse-raw')                     │
│        └─> Trouve le fichier le plus récent                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Extraction des audits échoués                             │
│    extractFailedAudits(rawData)                              │
│    └─> Filtre les audits avec score < 1.0                   │
│    └─> Catégorise par type (perf, a11y, seo, bp)            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Affichage dans le dashboard                               │
│    renderLighthouseDetails(lighthouse, scores, failedAudits) │
│    └─> Affiche les recommandations spécifiques              │
└─────────────────────────────────────────────────────────────┘
```

### Catégorisation des audits

Les audits échoués sont automatiquement classés par catégorie selon leur ID :

| Catégorie          | Patterns d'ID                                                                                        | Exemples                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Performance**    | `paint`, `speed`, `render`, `layout`, `cls`, `lcp`, `fcp`, `tti`, `tbt`, `blocking`                  | `first-contentful-paint`, `render-blocking-resources`, `largest-contentful-paint`      |
| **Accessibilité**  | `contrast`, `aria`, `label`, `heading`, `button`, `link`, `tabindex`, `lang`, `meta`, `name`, `role` | `color-contrast`, `button-name`, `aria-prohibited-attr`, `label-content-name-mismatch` |
| **SEO**            | `meta-description`, `robots`, `canonical`, `hreflang`, `title`                                       | `meta-description`, `document-title`, `robots-txt`                                     |
| **Best Practices** | `https`, `console`, `image`, `doctype`, `charset`, `vulnerable`                                      | `is-on-https`, `no-vulnerable-libraries`, `doctype`                                    |

---

## Fonctionnement technique

### 1. Détection du fichier le plus récent

```javascript
// dans findLatestJSON()
const prefixMapping = {
  'lighthouse-raw': /^lighthouse-raw-\d+\.json$/,
  // ... autres patterns
};

const staticFileList = [
  'lighthouse-raw-1763634146672.json',
  // ... autres fichiers
];
```

**Logique** :

1. Cherche dans la liste statique tous les fichiers matching le pattern
2. Trie par timestamp décroissant (le plus récent en premier)
3. Retourne le chemin du fichier le plus récent

### 2. Extraction des audits échoués

```javascript
function extractFailedAudits(rawLighthouseData) {
  if (!rawLighthouseData || !rawLighthouseData.audits) {
    return null;
  }

  const categories = {
    performance: [],
    accessibility: [],
    'best-practices': [],
    seo: [],
  };

  // Filtrer les audits échoués (score < 1.0)
  Object.entries(rawLighthouseData.audits).forEach(([id, audit]) => {
    if (audit.score !== null && audit.score < 1) {
      const failedAudit = {
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        displayValue: audit.displayValue,
      };

      // Catégorisation par pattern d'ID
      if (id.includes('paint') || id.includes('blocking')) {
        categories.performance.push(failedAudit);
      }
      // ... autres catégories
    }
  });

  return categories;
}
```

**Critère d'échec** : `audit.score !== null && audit.score < 1`

- `score = 1.0` → Audit 100% réussi ✅
- `score = 0.7` → Audit partiellement réussi ⚠️ (70%)
- `score = 0` → Audit complètement échoué ❌
- `score = null` → Audit non applicable (ignoré)

### 3. Affichage dynamique

```javascript
// Onglet Performance
if (failedAudits?.performance && failedAudits.performance.length > 0) {
  // Utiliser les vrais audits échoués
  failedAudits.performance.forEach(audit => {
    let icon = '⚡';
    if (audit.id.includes('paint')) icon = '🎨';
    else if (audit.id.includes('blocking')) icon = '🚫';

    perfRecommendations.push({
      icon: icon,
      title: audit.title,
      desc: audit.description.replace(/\[.*?\]\(.*?\)/g, '').substring(0, 150),
      displayValue: audit.displayValue || '',
    });
  });
} else {
  // Fallback sur recommandations génériques si pas de données
  if (scores.performance < 90) {
    perfRecommendations.push({
      icon: '📦',
      title: 'Optimiser les ressources',
      desc: 'Compresser les images, minifier JS/CSS...',
    });
  }
}
```

**Mécanisme de fallback** :

- Si `failedAudits` disponible → Affiche les audits réels
- Sinon → Affiche les recommandations génériques (compatibilité)

---

## Structure des données

### Fichier source : `lighthouse-raw-{timestamp}.json`

```json
{
  "audits": {
    "first-contentful-paint": {
      "id": "first-contentful-paint",
      "title": "First Contentful Paint",
      "description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
      "score": 0.7,
      "scoreDisplayMode": "numeric",
      "numericValue": 2410.5551,
      "displayValue": "2.4 s"
    },
    "render-blocking-resources": {
      "id": "render-blocking-resources",
      "title": "Eliminate render-blocking resources",
      "description": "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/).",
      "score": 0,
      "displayValue": "Est savings of 150 ms"
    },
    "button-name": {
      "id": "button-name",
      "title": "Buttons do not have an accessible name",
      "description": "When a button doesn't have an accessible name, screen readers announce it as \"button\", making it unusable for users who rely on screen readers. [Learn how](https://dequeuniversity.com/rules/axe/4.10/button-name).",
      "score": 0,
      "scoreDisplayMode": "binary"
    }
  }
}
```

### Données extraites : `lighthouseFailedAudits`

```javascript
{
  performance: [
    {
      id: "first-contentful-paint",
      title: "First Contentful Paint",
      description: "First Contentful Paint marks the time at which...",
      score: 0.7,
      displayValue: "2.4 s"
    },
    {
      id: "render-blocking-resources",
      title: "Eliminate render-blocking resources",
      description: "Resources are blocking the first paint...",
      score: 0,
      displayValue: "Est savings of 150 ms"
    }
  ],
  accessibility: [
    {
      id: "button-name",
      title: "Buttons do not have an accessible name",
      description: "When a button doesn't have an accessible name...",
      score: 0,
      displayValue: undefined
    }
  ],
  seo: [],
  "best-practices": []
}
```

---

## Fonctions JavaScript

### `extractFailedAudits(rawLighthouseData)`

**Rôle** : Extrait et catégorise les audits échoués depuis le rapport Lighthouse brut.

**Paramètres** :

- `rawLighthouseData` (Object) : Données du fichier `lighthouse-raw-*.json`

**Retour** :

- Object avec 4 catégories : `{performance, accessibility, seo, best-practices}`
- `null` si données invalides

**Logique** :

1. Vérifie que `rawLighthouseData.audits` existe
2. Parcourt tous les audits
3. Filtre ceux avec `score !== null && score < 1`
4. Extrait les propriétés utiles (id, title, description, score, displayValue)
5. Catégorise selon les patterns d'ID
6. Retourne l'objet catégorisé

**Emplacement** : `index.html` lignes ~910-956

---

### `loadAllData()` (modifiée)

**Rôle** : Charge toutes les données du dashboard, incluant l'extraction des audits Lighthouse.

**Modifications apportées** :

```javascript
// Nouveau code ajouté
let lighthouseFailedAudits = null;
try {
  const rawLighthouse = await loadJSON('lighthouse-raw');
  if (rawLighthouse) {
    lighthouseFailedAudits = extractFailedAudits(rawLighthouse);
    console.log('✅ Audits Lighthouse échoués extraits dynamiquement:', lighthouseFailedAudits);
  }
} catch (e) {
  console.log("⚠️ Impossible d'extraire les audits échoués depuis le fichier raw:", e);
}

renderCharts({ lighthouse, wcag, daltonisme, fps, a11y, datasets, lighthouseFailedAudits });
```

**Emplacement** : `index.html` lignes ~958-987

---

### `renderLighthouseDetails(lighthouse, scores, failedAudits)` (modifiée)

**Rôle** : Affiche les détails Lighthouse dans les onglets, avec audits dynamiques.

**Nouveau paramètre** :

- `failedAudits` (Object|null) : Audits échoués extraits dynamiquement

**Modifications** :

**AVANT** (recommandations génériques) :

```javascript
const perfRecommendations = [];
if (scores.performance < 90) {
  perfRecommendations.push({
    icon: '📦',
    title: 'Optimiser les ressources',
    desc: 'Compresser les images, minifier JS/CSS...',
  });
}
```

**APRÈS** (audits réels) :

```javascript
const perfRecommendations = [];
if (failedAudits?.performance && failedAudits.performance.length > 0) {
  failedAudits.performance.forEach(audit => {
    let icon = '⚡';
    if (audit.id.includes('paint')) icon = '🎨';
    else if (audit.id.includes('blocking')) icon = '🚫';

    perfRecommendations.push({
      icon: icon,
      title: audit.title,
      desc: audit.description.replace(/\[.*?\]\(.*?\)/g, '').substring(0, 150),
      displayValue: audit.displayValue || '',
    });
  });
} else {
  // Fallback sur recommandations génériques
}
```

**Emplacement** : `index.html` lignes ~3235-3500+

---

## Avantages

### ✅ Précision

**Avant** :

> Score Performance = 94 → "Optimiser les ressources"

**Après** :

> - First Contentful Paint (2.4s)
> - Eliminate render-blocking resources (150ms d'économies)
> - Largest Contentful Paint (2.4s)

### ✅ Traçabilité

Chaque recommandation affichée provient d'un audit officiel Lighthouse avec :

- Titre exact de l'audit
- Description officielle
- Valeur mesurée (temps, pourcentage, etc.)
- Score précis (0.7, 0.91, etc.)

### ✅ Mesurabilité

Affichage des valeurs mesurées :

- Temps : `2.4s`, `150ms`
- Économies potentielles : `Est savings of 150 ms`
- Permet de **quantifier** l'impact des optimisations

### ✅ Maintenance automatique

Quand un nouveau rapport Lighthouse est généré :

1. Le fichier `lighthouse-raw-NOUVEAU_TIMESTAMP.json` est créé
2. Au prochain chargement de la page :
   - `findLatestJSON('lighthouse-raw')` trouve automatiquement le nouveau fichier
   - `extractFailedAudits()` extrait les nouveaux audits échoués
   - Le dashboard affiche les **nouvelles** recommandations

**Zéro intervention manuelle nécessaire** 🚀

### ✅ Pédagogie

Les descriptions proviennent de la documentation officielle Lighthouse :

- Liens vers les guides officiels (markdown supprimé pour l'affichage)
- Explications techniques précises
- Contexte de chaque métrique

### ✅ Compatibilité

Mécanisme de **fallback** :

- Si `lighthouse-raw-*.json` n'existe pas → Recommandations génériques
- Si extraction échoue → Console warning + recommandations génériques
- Pas de régression si le système ne fonctionne pas

---

## Guide de maintenance

### Ajouter une nouvelle catégorie d'audits

**Exemple** : Ajouter la catégorie "PWA"

1. **Modifier `extractFailedAudits()`** :

```javascript
const categories = {
    performance: [],
    accessibility: [],
    'best-practices': [],
    seo: [],
    pwa: []  // Nouvelle catégorie
};

// Ajouter la logique de catégorisation
else if (id.includes('service-worker') || id.includes('manifest') ||
         id.includes('installable') || id.includes('offline')) {
    categories.pwa.push(failedAudit);
}
```

2. **Modifier `renderLighthouseDetails()`** :

```javascript
// Créer l'onglet PWA
const pwaRecommendations = [];
if (failedAudits?.pwa && failedAudits.pwa.length > 0) {
  failedAudits.pwa.forEach(audit => {
    // ... même logique que les autres catégories
  });
}
```

3. **Ajouter l'onglet dans le HTML** :

```html
<button class="lighthouse-tab" data-tab="pwa">📱 PWA</button>
```

### Modifier les patterns de catégorisation

Si un audit est mal catégorisé, modifier les conditions dans `extractFailedAudits()` :

```javascript
// Exemple : Déplacer les audits "image" de best-practices vers performance
if (id.includes('image')) {
  categories.performance.push(failedAudit); // Au lieu de best-practices
}
```

### Personnaliser les icônes

Dans `renderLighthouseDetails()`, modifier les conditions d'attribution des icônes :

```javascript
let icon = '⚡';
if (audit.id.includes('paint')) icon = '🎨';
else if (audit.id.includes('blocking')) icon = '🚫';
else if (audit.id.includes('image')) icon = '🖼️';
else if (audit.id.includes('lazy')) icon = '💤';
```

### Ajouter le fichier à la liste statique

Quand un nouveau rapport Lighthouse est généré, **optionnellement** l'ajouter à `staticFileList` pour compatibilité :

```javascript
const staticFileList = [
  'lighthouse-raw-1763634146672.json',
  'lighthouse-raw-1763734567890.json', // Nouveau fichier
  // ...
];
```

**Note** : Pas obligatoire si le listage dynamique fonctionne, mais recommandé pour GitHub Pages.

---

## Tests et validation

### ✅ Test 1 : Extraction réussie

**Console** :

```
Fichier statique trouvé pour lighthouse-raw: lighthouse-raw-1763634146672.json
✅ Audits Lighthouse échoués extraits dynamiquement: {performance: Array(5), accessibility: Array(4), ...}
```

**Dashboard** :

- Section "⚠️ Points à améliorer (depuis rapport Lighthouse)" affichée
- Audits listés avec titre, description, displayValue
- Icônes appropriées selon le type d'audit

### ✅ Test 2 : Aucun audit échoué (score 100)

**Console** :

```
✅ Audits Lighthouse échoués extraits dynamiquement: {performance: [], accessibility: [], ...}
```

**Dashboard** :

- Pas de section "Points à améliorer" (ou message de succès si implémenté)
- Score affiché : 100/100 ✅

### ✅ Test 3 : Fichier raw non disponible

**Console** :

```
Pattern non trouvé pour le préfixe: lighthouse-raw
⚠️ Impossible d'extraire les audits échoués depuis le fichier raw: ...
```

**Dashboard** :

- Fallback sur recommandations génériques basées sur le score
- Pas de régression, le dashboard fonctionne normalement

### ✅ Test 4 : Mise à jour automatique

**Procédure** :

1. Noter les audits affichés actuellement
2. Lancer `npm run audit:lighthouse` pour générer un nouveau rapport
3. Rafraîchir la page du dashboard
4. Vérifier que les nouveaux audits sont affichés

**Résultat attendu** :

- Nouveau fichier `lighthouse-raw-NOUVEAU_TIMESTAMP.json` chargé
- Audits mis à jour automatiquement

### ✅ Test 5 : Catégorisation correcte

**Vérifier** :

- **Performance** : FCP, LCP, TBT, CLS, render-blocking
- **Accessibilité** : ARIA, contrastes, labels, buttons
- **SEO** : meta-description, robots.txt, canonical
- **Best Practices** : HTTPS, console errors, vulnerabilities

**Méthode** :
Inspecter `lighthouseFailedAudits` dans la console :

```javascript
console.log(lighthouseFailedAudits);
```

### Checklist de validation

- [ ] Console affiche "✅ Audits Lighthouse échoués extraits dynamiquement"
- [ ] Onglet Performance affiche les audits réels (FCP, LCP, etc.)
- [ ] Onglet Accessibilité affiche les audits réels (ARIA, contrastes, etc.)
- [ ] displayValue affiché quand disponible (2.4s, 150ms, etc.)
- [ ] Descriptions tronquées à 150 caractères avec "..."
- [ ] Icônes contextuelles selon le type d'audit
- [ ] Fallback sur recommandations génériques si pas de données
- [ ] Pas d'erreur console
- [ ] Mise à jour automatique après nouveau rapport Lighthouse

---

## Logs console

### Succès

```
Fichier statique trouvé pour lighthouse-raw: lighthouse-raw-1763634146672.json
✅ Audits Lighthouse échoués extraits dynamiquement: {
  performance: [
    {id: 'first-contentful-paint', title: 'First Contentful Paint', score: 0.7, displayValue: '2.4 s'},
    {id: 'render-blocking-resources', title: 'Eliminate render-blocking resources', score: 0, displayValue: 'Est savings of 150 ms'},
    ...
  ],
  accessibility: [
    {id: 'button-name', title: 'Buttons do not have an accessible name', score: 0},
    {id: 'color-contrast', title: 'Background and foreground colors do not have sufficient contrast', score: 0},
    ...
  ],
  seo: [],
  best-practices: []
}
```

### Erreur (fichier non trouvé)

```
Pattern non trouvé pour le préfixe: lighthouse-raw
⚠️ Impossible d'extraire les audits échoués depuis le fichier raw: TypeError: Cannot read properties of null
```

---

## Exemple d'affichage

### Onglet Performance (Score 94)

```
💡 Pourquoi la Performance est cruciale ?
Une application rapide améliore l'expérience utilisateur, réduit le taux de rebond...

┌─────────────────────┐
│        94           │ Score Performance
│   ✅ Bon score !    │
└─────────────────────┘

⚠️ Points à améliorer (depuis rapport Lighthouse)

🎨 First Contentful Paint                                    2.4 s
   First Contentful Paint marks the time at which the first
   text or image is painted. Learn more about the...

🚫 Eliminate render-blocking resources          Est savings of 150 ms
   Resources are blocking the first paint of your page.
   Consider delivering critical JS/CSS inline and...

🎨 Largest Contentful Paint                                  2.4 s
   Largest Contentful Paint marks the time at which the
   largest text or image is painted...

⚡ Core Web Vitals
┌──────────────────────────────────────┐
│ First Contentful Paint (FCP)   2.4s  │
│ Largest Contentful Paint (LCP) 2.4s  │
│ Total Blocking Time (TBT)      0ms   │
└──────────────────────────────────────┘
```

---

## Résumé technique

| Aspect                    | Détails                                         |
| ------------------------- | ----------------------------------------------- |
| **Fichier source**        | `lighthouse-raw-{timestamp}.json`               |
| **Fonction d'extraction** | `extractFailedAudits(rawData)`                  |
| **Critère d'échec**       | `score !== null && score < 1.0`                 |
| **Catégories**            | Performance, Accessibilité, SEO, Best Practices |
| **Mise à jour**           | Automatique au chargement de la page            |
| **Fallback**              | Recommandations génériques si extraction échoue |
| **Logs**                  | Console avec ✅/⚠️ pour traçabilité             |

---

**Version** : 1.0
**Date** : 26 novembre 2025
**Auteur** : Sandrine Cipolla
**Projet** : StockHub V2 - Dashboard Métriques Qualité
