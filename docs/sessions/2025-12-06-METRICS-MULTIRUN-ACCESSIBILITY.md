# Session 2025-12-06 : Métriques Multi-Run & Analyse Accessibilité

> Implémentation d'audits Lighthouse multi-run avec médiane et analyse approfondie des problèmes d'accessibilité

---

## 📋 Contexte

Suite à la session précédente (2025-12-05) sur l'optimisation des performances, cette session se concentre sur :

1. **Clarification des métriques** : App vs Dashboard de métriques
2. **Stabilisation des scores Lighthouse** via multi-run
3. **Analyse des problèmes d'accessibilité critiques**

---

## 🎯 Objectifs

- [ ] ✅ Clarifier la différence entre métriques app et métriques dashboard
- [ ] ✅ Comprendre la variabilité des scores Lighthouse
- [ ] ✅ Implémenter un système multi-run avec médiane
- [ ] ✅ Identifier et documenter les problèmes d'accessibilité
- [ ] ✅ Créer un plan d'action pour améliorer l'accessibilité
- [ ] ✅ Créer une issue GitHub pour le suivi

---

## 🔍 Analyse Initiale

### Confusion Métriques

**Problème initial** : Confusion entre :

- **App** : Application StockHub V2 (page Dashboard `/`)
- **Dashboard** : Dashboard de visualisation des métriques (`/docs/metrics/`)

**Clarification** : Les audits Lighthouse doivent cibler **l'application**, pas le dashboard de métriques.

### Variabilité des Scores

Observation de scores différents selon l'environnement :

| Source             | Perf | A11y | BP  | SEO |
| ------------------ | ---- | ---- | --- | --- |
| Script automatique | 94   | 86   | 100 | 100 |
| DevTools manuel 1  | 100  | 86   | 74  | 100 |
| DevTools manuel 2  | 100  | 86   | 96  | 100 |
| Production Vercel  | 97   | 86   | 100 | 100 |

**Constat** :

- Performance varie de 94 à 100 (±6 points)
- Accessibility stable à 86 (problèmes structurels)
- Best Practices varie de 74 à 100 (console errors, extensions)
- SEO stable à 100

---

## 💡 Solution : Multi-Run avec Médiane

### Pourquoi les Scores Varient ?

1. **Variabilité intrinsèque Lighthouse** - Pas déterministe
2. **Conditions d'exécution différentes** - Headless vs DevTools
3. **État du serveur** - Multiples instances preview en parallèle
4. **Cache & état initial** - Premier vs second run
5. **Throttling CPU/Network** - Simulation conditions mobiles

### Implémentation

**Fichier** : `scripts/generate-lighthouse.mjs` (Version 2.0)

**Principe** :

1. Exécuter 3 audits successifs
2. Calculer la médiane de chaque score
3. Afficher min/max/range pour traçabilité
4. Sauvegarder scores médians + range dans JSON

**Avantages** :

- ✅ Scores plus stables
- ✅ Marge de variabilité documentée
- ✅ Meilleure représentativité

**Code clé** :

```javascript
const NUM_RUNS = 3;

function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Calcul statistiques
const stats = {
  performance: {
    median: Math.round(median(perfScores)),
    min: Math.min(...perfScores),
    max: Math.max(...perfScores),
    range: Math.max(...perfScores) - Math.min(...perfScores),
  },
  // ... autres catégories
};
```

**Nouveau format JSON** :

```json
{
  "scores": {
    "performance": 95,
    "accessibility": 86,
    "bestPractices": 100,
    "seo": 100
  },
  "scoresRange": {
    "performance": "95-95",
    "accessibility": "86-86",
    "bestPractices": "100-100",
    "seo": "100-100"
  },
  "info": {
    "multiRun": {
      "runs": 3,
      "method": "median"
    }
  }
}
```

---

## 📊 Résultats Multi-Run

### Output Console

```
🚀 Audit Lighthouse Multi-Run (3 runs)
📍 URL: http://localhost:4176/

⏳ Run 1/3...
   Perf 95 | A11y 86 | BP 100 | SEO 100
⏳ Run 2/3...
   Perf 95 | A11y 86 | BP 100 | SEO 100
⏳ Run 3/3...
   Perf 95 | A11y 86 | BP 100 | SEO 100

📊 Calcul des statistiques...

📈 Résultats finaux:

✅ Performance     : 95 (stable)    [min: 95, max: 95]
⚠️ Accessibility   : 86 (stable)    [min: 86, max: 86]
✅ Best Practices  : 100 (stable)    [min: 100, max: 100]
✅ SEO             : 100 (stable)    [min: 100, max: 100]
```

### Scores Finaux Recommandés

**Pour la documentation officielle** :

- **Performance** : **97** (score production Vercel)
- **Accessibility** : **86** (stable, à améliorer)
- **Best Practices** : **100**
- **SEO** : **100**

**Avec marge acceptée** : Performance 95-97 (±2 points)

---

## ♿ Analyse Accessibilité (86/100)

### 4 Problèmes Critiques Détectés

#### 1. ARIA Prohibited Attributes (Design System)

**Impact** : Lecteurs d'écran reçoivent informations contradictoires
**Éléments** : `<sh-button>` (3+ instances)

```html
<!-- ❌ Problème -->
<sh-button icon-before="Plus" aria-label="Ajouter un nouveau stock"> </sh-button>
```

**Cause** : Web Components Shadow DOM ne propagent pas `aria-label` du host au bouton interne

**Solutions** :

- **Frontend (temporaire)** : Utiliser attribut `label` au lieu de `aria-label`
- **Design System (permanent)** : Modifier `sh-button` pour propager aria-label

**Fichiers** :

- `src/pages/Dashboard.tsx`
- `src/components/Header.tsx`

---

#### 2. Buttons Without Accessible Name (Design System)

**Impact** : Lecteurs d'écran annoncent "button" sans contexte

```html
<!-- ❌ Problème -->
<button type="button" class="primary sm" aria-busy="false">
  <!-- Contenu dans shadow DOM -->
</button>
```

**Cause** : Même que #1 - propagation manquante

**Solution** : Dépend du fix #1 dans Design System

---

#### 3. Color Contrast Issues (Frontend)

**Impact** : Texte illisible pour utilisateurs malvoyants
**Éléments** : Badges IA (3+ instances)

**Ratio actuel** : < 4.5:1 (non conforme WCAG AA)
**Ratio requis** : ≥ 4.5:1

**Solution** :

1. Identifier couleurs exactes
2. Vérifier avec WebAIM Contrast Checker
3. Ajuster pour ratio ≥ 4.5:1
4. Tester avec `npm run audit:risk-levels`

**Fichiers** :

- `src/components/IAAlertBanner.tsx`
- Styles CSS badges IA

---

#### 4. Label Content Name Mismatch (Frontend)

**Impact** : Confusion pour utilisateurs commande vocale
**Éléments** : Bouton notifications

```html
<!-- ❌ Problème -->
<button aria-label="Notifications (3 non lues)">Notifications</button>

<!-- ✅ Solution -->
<button aria-label="Notifications">
  Notifications
  <span class="sr-only">(3 non lues)</span>
</button>
```

**Règle WCAG** : [2.5.3 Label in Name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)

**Fichier** : `src/components/Header.tsx`

---

## 📋 Plan d'Action

### Phase 1 - Fixes Frontend (2-3h) → 86 → 92

- [ ] **Contraste badges IA** (1h)
  - Identifier couleurs
  - Calculer ratios ≥ 4.5:1
  - Appliquer CSS
  - Tester

- [ ] **Label notifications** (30min)
  - Modifier `Header.tsx`
  - Utiliser span sr-only
  - Tester navigation clavier

- [ ] **Attributs ARIA sh-button** (1h)
  - Remplacer `aria-label` par `label`
  - Tester lecteur d'écran

### Phase 2 - Fix Design System (3-5h) → 92 → 95+

- [ ] **Issue Design System**
  - Créer issue propagation aria-label
  - Documenter problème
  - Fournir exemple code

- [ ] **PR Design System**
  - Modifier `sh-button`
  - Tests accessibilité
  - Documentation Storybook

- [ ] **Intégration Frontend**
  - Bump version
  - Tester
  - Re-audit

### Phase 3 - Vérification

- [ ] Audit Lighthouse ≥ 95/100
- [ ] Tests manuels (clavier, lecteur d'écran, zoom)
- [ ] Audits spécialisés (WCAG, daltonisme, risk-levels)

---

## 🔧 Modifications Techniques

### 1. Script Lighthouse (`generate-lighthouse.mjs`)

**Changements** :

- ✅ Multi-run avec 3 audits
- ✅ Calcul médiane
- ✅ Statistiques min/max/range
- ✅ URL configurable via CLI
- ✅ Nouveau champ `scoresRange`
- ✅ Nouveau champ `info.multiRun`
- ✅ Nettoyage fichiers temporaires

**Utilisation** :

```bash
node scripts/generate-lighthouse.mjs http://localhost:4176/
```

---

### 2. Dashboard Metrics (`index.html`)

**Changements** :

- ✅ Affichage range sous chaque score
- ✅ Message éducatif multi-run
- ✅ Rétrocompatible (anciens JSON)

**Affichage** :

```html
<div class="text-sm font-medium">Performance</div>
<div class="text-xs text-gray-500">Vitesse de chargement</div>
<div class="text-[10px] text-gray-600 mt-1">Range: 95-95</div>
```

**Message éducatif** :

```
📊 Multi-Run : Ces scores sont la médiane de 3 audits
successifs pour des résultats stables.
```

---

### 3. Documentation (`15-APP-QUALITY-METRICS.md`)

**Nouveau document créé** :

- Métriques actuelles détaillées
- Comparaison multi-environnements
- 4 problèmes d'accessibilité critiques
- Solutions détaillées pour chaque problème
- Plan d'action priorisé
- Ressources et outils

**Ajouté à** : `docs/0-INDEX.md`

---

## 📌 GitHub Issue #51

**Titre** : fix(a11y): Improve accessibility score from 86 to 95+ (4 critical issues)
**URL** : https://github.com/SandrineCipolla/stockHub_V2_front/issues/51

**Contenu** :

- Description 4 problèmes critiques
- Solutions Frontend + Design System
- Plan d'action 3 phases avec checklists
- Objectif : 86 → 95+/100 (+9 points)

---

## 📈 Métriques Finales

### Scores Multi-Run (Médiane de 3 Runs)

| Catégorie          | Score | Range            | Évolution     |
| ------------------ | ----- | ---------------- | ------------- |
| **Performance**    | 95    | 95-95 (stable)   | 89→94→95 (+6) |
| **Accessibility**  | 86    | 86-86 (stable)   | 86 (stable)   |
| **Best Practices** | 100   | 100-100 (stable) | 100 (stable)  |
| **SEO**            | 100   | 100-100 (stable) | 100 (stable)  |

### Comparaison Environnements

| Environnement     | Perf | A11y | BP  | SEO |
| ----------------- | ---- | ---- | --- | --- |
| Script multi-run  | 95   | 86   | 100 | 100 |
| DevTools local    | 100  | 86   | 96  | 100 |
| Production Vercel | 97   | 86   | 100 | 100 |

---

## 📦 Fichiers Modifiés/Créés

| Fichier                                                      | Action     | Description                      |
| ------------------------------------------------------------ | ---------- | -------------------------------- |
| `scripts/generate-lighthouse.mjs`                            | ✅ Modifié | Multi-run + médiane (v2.0)       |
| `docs/metrics/index.html`                                    | ✅ Modifié | Affichage range + multi-run info |
| `docs/15-APP-QUALITY-METRICS.md`                             | ✅ Créé    | Métriques app + problèmes a11y   |
| `docs/0-INDEX.md`                                            | ✅ Modifié | Ajout doc 15                     |
| `docs/sessions/2025-12-06-METRICS-MULTIRUN-ACCESSIBILITY.md` | ✅ Créé    | Cette session                    |
| GitHub Issue #51                                             | ✅ Créé    | Plan accessibilité               |

---

## 🎓 Apprentissages

### 1. Variabilité Lighthouse

**Constat** : Lighthouse n'est pas déterministe

- Performance peut varier de ±5 points
- Conditions d'exécution influencent les résultats
- Cache navigateur a un impact significatif

**Solution** : Multi-run avec médiane pour stabilité

---

### 2. App vs Dashboard Metrics

**Confusion fréquente** :

- Dashboard de métriques (`/docs/metrics/`) ≠ App (`/`)
- Lighthouse doit auditer l'app, pas le dashboard
- Important de bien documenter l'URL testée

---

### 3. Web Components & Accessibilité

**Problème** : Shadow DOM complique la propagation ARIA

- Attributs ARIA sur host ne se propagent pas automatiquement
- Nécessite modification du composant pour propager

**Solution temporaire** : Utiliser attributs natifs du composant
**Solution permanente** : Corriger le Design System

---

### 4. Stabilité des Scores

**Méthode multi-run** :

- 3 runs = bon compromis temps/précision
- Médiane > moyenne (moins sensible aux outliers)
- Range indique la fiabilité (0 = très stable)

---

## 🔄 Prochaines Étapes

### Immédiat

1. ✅ Commit des modifications
2. ✅ Mise à jour documentation session (ce fichier)
3. [ ] Push vers GitHub
4. [ ] Vérifier issue #51 visible

### Court Terme (Issue #51 - Phase 1)

1. [ ] Fixer contraste badges IA
2. [ ] Corriger label notifications
3. [ ] Workaround aria-label sh-button
4. [ ] Re-audit → Objectif 92/100

### Moyen Terme (Issue #51 - Phase 2)

1. [ ] Issue Design System propagation aria-label
2. [ ] PR Design System
3. [ ] Intégration nouvelle version
4. [ ] Re-audit → Objectif 95+/100

---

## 🔗 Liens Utiles

### Documentation Créée

- [15-APP-QUALITY-METRICS.md](../15-APP-QUALITY-METRICS.md)
- [GitHub Issue #51](https://github.com/SandrineCipolla/stockHub_V2_front/issues/51)

### Documentation Connexe

- [12-PERFORMANCE-ANALYSIS.md](../archive/metrics/12-PERFORMANCE-ANALYSIS.md)
- [14-CI-CD-WORKFLOWS.md](../14-CI-CD-WORKFLOWS.md)
- [6-ACCESSIBILITY.md](../6-ACCESSIBILITY.md)

### Outils

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## ✅ Résumé

**Réalisations** :

- ✅ Clarification métriques app vs dashboard
- ✅ Implémentation multi-run Lighthouse avec médiane
- ✅ Analyse approfondie 4 problèmes accessibilité critiques
- ✅ Documentation complète créée (15-APP-QUALITY-METRICS.md)
- ✅ Issue GitHub #51 créée avec plan d'action détaillé
- ✅ Dashboard metrics mis à jour pour afficher range

**Scores finaux** :

- Performance : **95-97** (excellent)
- Accessibility : **86** (à améliorer → 95+)
- Best Practices : **100** (parfait)
- SEO : **100** (parfait)

**Objectif prioritaire** : Améliorer accessibilité de 86 à 95+ (Issue #51)

---

**📅 Date** : 2025-12-06
**⏱️ Durée** : ~2h
**👤 Développeur** : Sandrine Cipolla
**🤖 Assistance** : Claude Code
**📊 Version Doc** : 2.5 (Métriques multi-run + Accessibilité)
