# 📊 Analyse des Performances - StockHub V2 Front (Archivé)

> ⚠️ **DOCUMENT ARCHIVÉ - TRAÇABILITÉ RNCP**  
> Ce document conserve l'analyse post-mortem de la dégradation des performances de nov. 2025. Pour la **Source de Vérité Unique** sur les métriques et audits vivants du projet, consulter [`docs/15-APP-QUALITY-METRICS.md`](../../15-APP-QUALITY-METRICS.md).

---

## 📈 Historique des Performances

### Octobre 2025 - Performances Optimales

```json
{
  "performance": 96,
  "fcp": "1.5 s",
  "lcp": "1.5 s",
  "tbt": "< 150 ms"
}
```

### Novembre 2025 - Dégradation Observée

```json
{
  "performance": 89,      ⚠️ -7 points
  "fcp": "2.4 s",         ❌ +60% (0.9s de plus)
  "lcp": "2.4 s",         ❌ +60% (0.9s de plus)
  "tbt": "290 ms",        ⚠️ +93% (140ms de plus)
  "cls": "0"              ✅ Parfait
}
```

**Impact** : Dégradation de **60% du temps de chargement initial**.

---

## 🔍 Causes Identifiées

### 1. **Import Synchrone du Design System** (Cause Principale)

**Fichier** : `src/main.tsx` (lignes 6-10 - ancienne version)

```typescript
// ❌ AVANT - Import synchrone bloquant
import '@stockhub/design-system';
import '@stockhub/design-system/dist/tokens/design-tokens.css';
```

**Problème** :

- Le Design System (~300 KB) était chargé **de manière synchrone**
- Bloquait le rendu initial de React
- Tous les Web Components étaient parsés avant le premier paint

**Impact mesuré** :

- FCP : 1.5s → 2.4s (+0.9s)
- LCP : 1.5s → 2.4s (+0.9s)
- TBT : ~150ms → 290ms (+140ms)

---

### 2. **Lazy Loading des Pages mal optimisé**

**Fichier** : `src/App.tsx` (lignes 6-8)

```typescript
const Dashboard = lazy(() =>
  import('@/pages/Dashboard.tsx').then(module => ({ default: module.Dashboard }))
);
const Analytics = lazy(() =>
  import('@/pages/Analytics.tsx').then(module => ({ default: module.Analytics }))
);
```

**Problème potentiel** :

- Les pages Dashboard et Analytics sont lazy-loadées
- Mais si les Web Components ne sont pas chargés, cela crée un délai supplémentaire

---

### 3. **Ressources Render-Blocking**

D'après l'audit Lighthouse (`lighthouse-1764235132743.json`) :

**Audits en échec** :

```json
{
  "id": "render-blocking-resources",
  "title": "Eliminate render-blocking resources",
  "score": 0
}
```

**Fichiers identifiés** :

- `@stockhub/design-system` (300 KB)
- CSS tokens potentiellement bloquants

---

### 4. **JavaScript Non Utilisé**

```json
{
  "id": "unused-javascript",
  "title": "Reduce unused JavaScript",
  "score": 0
}
```

**Analyse** :

- Le Design System contient plusieurs dizaines de Web Components, le Storybook en fait foi
- Mais toutes les pages n'utilisent pas tous les composants
- Tree-shaking insuffisant

---

## ✅ Solutions Appliquées

### Solution 1 : Lazy Loading du Design System

**Fichier** : `src/main.tsx` (version actuelle)

```typescript
// ✅ APRÈS - Import critique uniquement
import '@stockhub/design-system/dist/tokens/design-tokens.css';

// Lazy loading du Design System (Web Components)
setTimeout(() => {
  import('@stockhub/design-system')
    .then(() => {
      console.log('✅ Design System chargé');
    })
    .catch(err => {
      console.error('❌ Erreur lors du chargement du Design System:', err);
    });
}, 100); // Délai de 100ms pour laisser React charger d'abord
```

**Avantages** :

- ✅ CSS tokens chargés immédiatement (variables CSS critiques)
- ✅ Web Components chargés en arrière-plan après React
- ✅ Délai de 100ms permet à l'app de démarrer

**Gains attendus** :

- FCP : 2.4s → **~1.6s** (-33%)
- LCP : 2.4s → **~1.6s** (-33%)
- TBT : 290ms → **~180ms** (-38%)

---

### Solution 2 : Optimisation du Lazy Loading

**Stratégie actuelle** :

```typescript
// Pages lazy-loadées avec Suspense
const Dashboard = lazy(() => import('@/pages/Dashboard.tsx')...);
```

**LoadingFallback optimisé** :

- Spinner accessible avec `aria-live="polite"`
- CSS animations GPU-accélérées
- Pas de JavaScript bloquant

---

### Solution 3 : Code Splitting Automatique (Vite)

**Configuration** : `vite.config.ts`

Vite effectue automatiquement :

- ✅ Tree-shaking agressif
- ✅ Code splitting par route
- ✅ Chunks optimisés

---

## 📊 Résultats Attendus

### Objectifs de Performance

| Métrique              | Avant | Après Optimisation | Objectif |
| --------------------- | ----- | ------------------ | -------- |
| **Performance Score** | 89    | 94+                | 95+      |
| **FCP**               | 2.4s  | ~1.6s              | < 1.8s   |
| **LCP**               | 2.4s  | ~1.6s              | < 2.5s   |
| **TBT**               | 290ms | ~180ms             | < 200ms  |
| **CLS**               | 0     | 0                  | 0        |

---

## 🚀 Optimisations Supplémentaires Possibles

### Priorité Haute

1. **Preload des ressources critiques**

   ```html
   <link rel="preload" href="/design-system.css" as="style" />
   ```

2. **Service Worker pour mise en cache**
   - Cacher les Web Components après premier chargement
   - Stratégie Cache-First

3. **Compression Brotli**
   - Réduire taille du Design System de 300 KB → ~80 KB

### Priorité Moyenne

4. **Lazy-load des images**

   ```typescript
   <img loading="lazy" ... />
   ```

5. **Prefetch des routes**

   ```typescript
   <link rel="prefetch" href="/analytics" />
   ```

6. **Optimiser les fonts**
   - `font-display: swap`
   - Subset des fonts

---

## 🔧 Commandes de Test

### Mesurer les performances localement

```bash
# Build de production
npm run build

# Lighthouse CI
npm run generate:lighthouse

# Voir les métriques
cat docs/metrics/data/lighthouse-*.json | grep -A5 '"performance"'
```

### Comparer avant/après

```bash
# Voir l'historique des audits
ls -lt docs/metrics/data/lighthouse-*.json

# Comparer deux audits
diff docs/metrics/data/lighthouse-1764231849781.json \
     docs/metrics/data/lighthouse-1764235132743.json
```

---

## 📝 Checklist de Performance

Avant chaque release :

- [ ] Score Lighthouse Performance > 90
- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] TBT < 200ms
- [ ] CLS = 0
- [ ] Pas de ressources render-blocking critiques
- [ ] Bundle size < 150 KB (gzipped)
- [ ] Lazy loading des routes activé
- [ ] Images optimisées (WebP, lazy-load)

---

## 🐛 Problèmes Connus

### 1. Erreur TypeScript - Design System

**Erreur** :

```
Could not find a declaration file for module '@stockhub/design-system'
```

**Impact** : Bloque le build TypeScript

**Solution en cours** : Ajouter un fichier de déclaration `.d.ts`

---

## 📚 Références

### Documentation Externe

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Lazy Loading Best Practices](https://web.dev/lazy-loading/)

### Documentation Interne

- [Dashboard Qualité](../../9-DASHBOARD-QUALITY.md)
- [Métriques Live](../../metrics/index.html)

---

## 🔄 Changelog

### 2025-11-27

- ✅ Ajout du lazy loading du Design System
- ⚠️ Dégradation identifiée : FCP/LCP +60%
- 📝 Documentation créée

### 2025-10-13

- ✅ Performances optimales : FCP/LCP 1.5s
- ✅ Score Lighthouse 96/100

---

**Auteur** : Sandrine Cipolla
**Dernière mise à jour** : 2025-11-27
**Version** : v1.3.0
