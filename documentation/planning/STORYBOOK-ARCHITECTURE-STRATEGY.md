# 🎨 Stratégie Storybook + Architecture - Option B

> **Date** : 14 Octobre 2025
> **Statut** : 📋 Planification complète
> **Durée estimée** : 6-7h total (4 sessions)

---

## 🎯 Vision Stratégique

### Objectif Global
Mettre en place un **Design System réutilisable** (web + mobile) avec **Storybook** AVANT de refactoriser l'architecture, afin de :
- ✅ Prototyper visuellement les nouveaux composants
- ✅ Éviter toute duplication de code
- ✅ Valider le design avant implémentation
- ✅ Créer une base solide pour l'app mobile future

### Architecture Cible

#### Avant (Actuel)
```
Dashboard
├── StockCard : "Acrylique Bleu Cobalt" (item individuel)
├── StockCard : "Acrylique Rouge" (item individuel)
├── StockCard : "Tissu Coton" (item individuel)
└── StockCard : "Farine" (item individuel)
```
❌ **Problème** : Pas scalable (18 cartes actuellement, ingérable avec 50+ items)

#### Après (Architecture finale à 2 niveaux)
```
Dashboard (Page d'accueil)
├── CategoryCard : "Peinture"
│   └── Métriques agrégées : 7 items, 2 critiques, €84 total
├── CategoryCard : "Tissus"
│   └── Métriques agrégées : 4 items, 1 critique, 45m total
└── CategoryCard : "Cellier"
    └── Métriques agrégées : 7 items, 2 low, €150 total

Click sur CategoryCard "Peinture" → Page Détails Peinture
├── StockItemCard : "Acrylique Bleu Cobalt" (65%, 1 tube)
├── StockItemCard : "Acrylique Rouge" (15%, 1 tube)
├── StockItemCard : "Acrylique Blanc" (90%, 1 tube)
└── etc.
```
✅ **Bénéfices** : Dashboard épuré (3-5 cartes), scalable, navigation claire

---

## 📋 Plan Détaillé (4 Sessions)

### 🔹 Session 1 (2h) : Storybook + Web Components Base

**Objectifs** :
- ✅ Setup Storybook avec React 19 + TypeScript + Vite
- ✅ Setup Lit Element pour Web Components
- ✅ Convertir Button en Web Component
- ✅ Première story interactive

**Actions** :

1. **Installation Storybook** (30min)
```bash
npx storybook@latest init
# Configuration automatique pour React + Vite
```
- Configuration `.storybook/main.ts`
- Configuration thèmes dark/light
- Vérifier fonctionnement sur `http://localhost:6006`

2. **Installation Lit Element** (30min)
```bash
npm install lit @lit/react
```
- Configuration TypeScript pour WC
- Setup build Vite pour WC
- Tester import WC dans React

3. **Conversion Button en Web Component** (45min)
- Créer `src/components/web-components/wc-button.ts` avec Lit
- Props : variant, size, disabled, loading, icon
- Styles CSS avec theming (custom properties)
- Wrapper React : `src/components/common/Button.tsx` (réutilise WC)

4. **Première Story** (15min)
- Créer `src/stories/Button.stories.tsx`
- Toutes les variantes : primary, secondary, ghost
- Toutes les tailles : sm, md, lg
- États : disabled, loading
- Playground interactif

**Livrables Session 1** :
- ✅ Storybook fonctionnel (`npm run storybook`)
- ✅ Lit Element configuré
- ✅ Button en WC + wrapper React (backward compatible)
- ✅ Story Button complète avec playground
- ✅ **Code existant non cassé** (wrapper garantit compatibilité)

---

### 🔹 Session 2 (2h) : Migration Composants UI + Stories

**Objectifs** :
- ✅ Convertir Badge, Card, StatusBadge, Input en Web Components
- ✅ Stories complètes pour chaque composant
- ✅ Design tokens centralisés

**Actions** :

1. **Conversion composants en WC** (90min)

**Badge** (20min)
- `wc-badge.ts` : variant (success, warning, danger, info), size (sm, md, lg)
- Wrapper `Badge.tsx`
- Story avec toutes variantes

**Card** (20min)
- `wc-card.ts` : hover states, padding variants
- Wrapper `Card.tsx`
- Story avec slots (header, body, footer)

**StatusBadge** (25min)
- `wc-status-badge.ts` : 5 statuts (optimal, low, critical, outOfStock, overstocked)
- Couleurs thématiques dark/light
- Wrapper `StatusBadge.tsx`
- Story avec tous les statuts + icônes

**Input** (25min)
- `wc-input.ts` : types (text, number, email), validation, erreurs
- Wrapper `Input.tsx`
- Story avec cas d'usage : normal, erreur, disabled

2. **Design Tokens** (30min)
- Créer `src/styles/design-tokens.css`
- CSS custom properties : couleurs, espacements, fonts, border-radius
- Documentation tokens dans Storybook (page dédiée)
- Import tokens dans tous les WC

**Livrables Session 2** :
- ✅ 5 composants UI en Web Components (Button, Badge, Card, StatusBadge, Input)
- ✅ Wrappers React pour chaque (backward compatible)
- ✅ 5 stories complètes avec playground
- ✅ Design tokens documentés
- ✅ **Code existant toujours fonctionnel**

**Architecture à ce stade** :
```
src/
├── components/
│   ├── web-components/
│   │   ├── wc-button.ts
│   │   ├── wc-badge.ts
│   │   ├── wc-card.ts
│   │   ├── wc-status-badge.ts
│   │   └── wc-input.ts
│   ├── common/              # Wrappers React (utilisation actuelle inchangée)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Input.tsx
│   └── dashboard/
│       └── StockCard.tsx    # Toujours utilisé comme avant
├── stories/
│   ├── Button.stories.tsx
│   ├── Badge.stories.tsx
│   ├── Card.stories.tsx
│   ├── StatusBadge.stories.tsx
│   └── Input.stories.tsx
└── styles/
    └── design-tokens.css
```

---

### 🔹 Session 3 (1h) : Prototypage CategoryCard dans Storybook

**Objectifs** :
- ✅ Designer visuellement CategoryCard AVANT d'implémenter
- ✅ Valider toutes les variantes
- ✅ Réutiliser Web Components existants

**Actions** :

1. **Design visuel CategoryCard** (30min)
- Créer story `CategoryCard.stories.tsx` avec mock data
- Tester différentes mises en page :
  - Icône + nom catégorie
  - Métriques agrégées (nombre items, critiques, valeur totale)
  - Mini preview items (3 premiers items avec thumbnails ?)
  - Bouton "Voir détails"
- Hover states
- Responsive (mobile/desktop)

2. **Validation variantes** (15min)
- Catégorie avec 0 items
- Catégorie avec items critiques (alerte rouge)
- Catégorie avec tout optimal (vert)
- Catégorie mixte
- Thèmes dark/light

3. **Documentation props** (15min)
- Définir interface `CategoryCardProps` dans story
- Documenter chaque prop
- Playground pour tester interactivement

**Livrables Session 3** :
- ✅ Story CategoryCard avec toutes variantes visuelles
- ✅ Interface `CategoryCardProps` définie
- ✅ **Validation visuelle AVANT implémentation**
- ✅ Décisions de design prises

**⚠️ Note** : À ce stade, CategoryCard n'est PAS encore implémenté, c'est juste un prototype visuel dans Storybook.

---

### 🔹 Session 4 (2-3h) : Refactoring Architecture

**Objectifs** :
- ✅ Renommer composants existants
- ✅ Implémenter CategoryCard avec WC
- ✅ Adapter Dashboard pour afficher catégories
- ✅ Créer page détails pour items

**Actions** :

1. **Renommage composants** (30min)

**Fichiers à renommer** :
```bash
# Composant
src/components/dashboard/StockCard.tsx → StockItemCard.tsx

# Tests
src/components/dashboard/StockCard.test.tsx → StockItemCard.test.tsx

# Stories
src/stories/StockCard.stories.tsx → StockItemCard.stories.tsx

# Types (si interface StockCardProps existe)
StockCardProps → StockItemCardProps
```

**Imports à mettre à jour** :
- `Dashboard.tsx` (temporairement cassé, on va le fixer après)
- Tous les fichiers important `StockCard`

2. **Création types catégories** (20min)

Créer `src/types/category.ts` :
```typescript
export interface StockCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  color: string; // 'purple', 'blue', 'green', etc.

  // Métriques agrégées
  totalItems: number;
  criticalCount: number;
  lowCount: number;
  optimalCount: number;
  totalValue: number;

  // Items de cette catégorie
  items: Stock[];
}
```

3. **Implémentation CategoryCard** (45min)

Créer `src/components/dashboard/CategoryCard.tsx` :
- Utilise les Web Components (Badge, Card, StatusBadge)
- Affiche métriques agrégées
- Bouton "Voir détails" → navigation vers page détails
- Animations Framer Motion (réutilise constantes existantes)
- Tests unitaires

4. **Adaptation Dashboard** (30min)

Modifier `src/pages/Dashboard.tsx` :
```typescript
// Avant
<StockGrid>
  {stocks.map(stock => <StockCard key={stock.id} stock={stock} />)}
</StockGrid>

// Après
<CategoryGrid>
  {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
</CategoryGrid>
```

Créer utility `src/utils/categoryAggregator.ts` :
- Fonction `groupStocksByCategory(stocks: Stock[]): StockCategory[]`
- Calcul métriques agrégées
- Tri par priorité

5. **Création page détails** (30min)

Créer `src/pages/CategoryDetailsPage.tsx` :
```typescript
// Affiche tous les items d'une catégorie
<StockGrid>
  {category.items.map(item => (
    <StockItemCard key={item.id} stock={item} />
  ))}
</StockGrid>
```

Routing :
```typescript
// src/App.tsx
<Route path="/category/:categoryId" element={<CategoryDetailsPage />} />
```

6. **Tests & Validation** (30min)
- Tests CategoryCard
- Tests categoryAggregator
- Tests navigation Dashboard → Détails
- Tests responsive
- Vérifier coverage maintenu ≥ 93%

**Livrables Session 4** :
- ✅ Architecture finale implémentée
- ✅ Dashboard affiche CategoryCard (3-5 cartes)
- ✅ Page détails affiche StockItemCard (items individuels)
- ✅ Navigation fonctionnelle
- ✅ Tests passent (100%)
- ✅ Build OK

**Architecture finale** :
```
src/
├── components/
│   ├── web-components/       # 5 WC (Button, Badge, Card, StatusBadge, Input)
│   ├── common/               # 5 wrappers React
│   └── dashboard/
│       ├── CategoryCard.tsx       # NOUVEAU - Affiche catégorie agrégée
│       ├── StockItemCard.tsx      # RENOMMÉ - Affiche item individuel
│       └── StockGrid.tsx
├── pages/
│   ├── Dashboard.tsx              # Affiche CategoryCard
│   └── CategoryDetailsPage.tsx   # NOUVEAU - Affiche StockItemCard
├── types/
│   ├── stock.ts
│   └── category.ts               # NOUVEAU
├── utils/
│   └── categoryAggregator.ts     # NOUVEAU
└── stories/
    ├── Button.stories.tsx
    ├── Badge.stories.tsx
    ├── Card.stories.tsx
    ├── StatusBadge.stories.tsx
    ├── Input.stories.tsx
    ├── CategoryCard.stories.tsx  # NOUVEAU
    └── StockItemCard.stories.tsx # RENOMMÉ
```

---

## 🎯 Récapitulatif Timeline

| Session | Durée | Objectif | Livrable |
|---------|-------|----------|----------|
| 1 | 2h | Storybook + Lit + Button WC | Design System base fonctionnel |
| 2 | 2h | 4 composants WC + Stories | Catalogue complet composants UI |
| 3 | 1h | Prototypage CategoryCard | Validation visuelle design |
| 4 | 2-3h | Refactoring architecture | Architecture finale implémentée |
| **TOTAL** | **6-7h** | | **Design System + Architecture finale** |

---

## ✅ Checklist Validation

### Après Session 1
- [ ] Storybook démarre sur `http://localhost:6006`
- [ ] Button fonctionne en Web Component
- [ ] Button fonctionne toujours dans l'app React (wrapper)
- [ ] Story Button affiche toutes les variantes

### Après Session 2
- [ ] 5 composants UI en Web Components
- [ ] 5 wrappers React fonctionnels
- [ ] 5 stories complètes avec playground
- [ ] Design tokens documentés
- [ ] App React toujours fonctionnelle (0 régression)

### Après Session 3
- [ ] CategoryCard prototypé visuellement dans Storybook
- [ ] Toutes les variantes validées
- [ ] Interface `CategoryCardProps` définie
- [ ] Design approuvé avant implémentation

### Après Session 4
- [ ] StockCard renommé en StockItemCard (+ tests + stories)
- [ ] CategoryCard implémenté
- [ ] Dashboard affiche 3-5 CategoryCard au lieu de 18 StockItemCard
- [ ] Page CategoryDetailsPage créée
- [ ] Navigation Dashboard → Détails fonctionne
- [ ] Tous les tests passent (≥ 93% coverage)
- [ ] Build réussit
- [ ] Performance maintenue (Lighthouse ≥ 98)

---

## 🚨 Points d'Attention

### Backward Compatibility
⚠️ **Critique** : Les wrappers React doivent garantir que le code existant fonctionne sans modification.

**Exemple Button** :
```typescript
// Avant (React natif)
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>

// Après (Wrapper de WC)
// DOIT FONCTIONNER EXACTEMENT PAREIL
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

Le wrapper gère la conversion React props → WC props automatiquement.

### Tests
⚠️ **Maintenir coverage ≥ 93%**
- Ajouter tests pour chaque WC
- Ajouter tests pour CategoryCard
- Ajouter tests pour categoryAggregator
- Tests navigation Dashboard → Détails

### Performance
⚠️ **Lighthouse doit rester ≥ 98/100**
- Web Components sont légers (Lit = 5KB)
- Lazy loading des WC si nécessaire
- Mesurer impact sur bundle size

### Mobile
✅ **Bénéfice long terme**
Les Web Components seront réutilisables dans l'app mobile (React Native avec Capacitor ou Ionic).

---

## 📚 Ressources

### Documentation
- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- [Lit Element](https://lit.dev/)
- [@lit/react](https://lit.dev/docs/frameworks/react/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

### Fichiers Clés à Consulter
- `src/types/stock.ts` - Types Stock existants
- `src/fixtures/stock.ts` - Fixtures pour tests
- `src/components/dashboard/StockCard.tsx` - Composant à renommer
- `documentation/planning/planning_ameliorations_v2.md` - Planning global

---

## 🎉 Résultat Final Attendu

### Design System
- ✅ Catalogue visuel Storybook avec 7+ composants
- ✅ Web Components réutilisables (web + mobile)
- ✅ Design tokens centralisés
- ✅ Documentation interactive

### Architecture Application
- ✅ Dashboard épuré (3-5 CategoryCard au lieu de 18 StockItemCard)
- ✅ Navigation claire : catégories → items
- ✅ Scalable jusqu'à 1000+ items
- ✅ Performance maintenue

### Code Quality
- ✅ 0 duplication de code
- ✅ Tests ≥ 93% coverage
- ✅ TypeScript strict mode OK
- ✅ Lighthouse ≥ 98/100

---

**Date création** : 14 Octobre 2025
**Statut** : 📋 Prêt à démarrer
**Prochaine action** : Session 1 - Setup Storybook + Lit Element
