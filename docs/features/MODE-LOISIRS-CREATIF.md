# 🎨 Mode Loisirs/Créatif - Documentation

> **Version** : 2.0
> **Date** : 29 Octobre 2024
> **Statut** : ✅ Option A Implémentée

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Système d'unités flexibles](#système-dunités-flexibles)
3. [Algorithmes IA adaptés](#algorithmes-ia-adaptés)
4. [Guide d'utilisation](#guide-dutilisation)
5. [Exemples concrets](#exemples-concrets)
6. [Architecture technique](#architecture-technique)

---

## 🎯 Vue d'ensemble

StockHub V2 supporte désormais la gestion de stocks pour **usage familial et créatif**, avec des fonctionnalités adaptées aux besoins spécifiques :

### Cas d'usage supportés

- 🎨 **Arts créatifs** : peinture acrylique, aquarelle, vernis
- ✂️ **Couture** : tissus, fils, accessoires
- 🍳 **Cellier/Cuisine** : farine, sucre, huile, conserves
- 🏠 **Usage domestique** : produits fractionnaires

### Problèmes résolus

- ✅ Quantités fractionnaires (0.5m de tissu, 65% d'un tube)
- ✅ Unités variées (%, ml, g, meter, liter, kg, pièces)
- ✅ Prédictions adaptées (sessions créatives vs jours)
- ✅ Affichage intelligent avec symboles d'unités

---

## 🔢 Système d'unités flexibles

### Unités supportées

| Unité        | Symbole | Usage typique             | Décimales | Exemples                       |
| ------------ | ------- | ------------------------- | --------- | ------------------------------ |
| `piece`      | -       | Objets entiers            | 0         | 8 pinceaux, 6 paquets de pâtes |
| `percentage` | %       | Tubes partiellement vides | 0         | 65% (tube de peinture)         |
| `ml`         | ml      | Petits volumes liquides   | 0         | 150ml (vernis)                 |
| `liter`      | L       | Volumes liquides moyens   | 2         | 1.2L (médium gel)              |
| `g`          | g       | Petites masses            | 0         | 80g (levure)                   |
| `kg`         | kg      | Masses importantes        | 2         | 2.5kg (farine)                 |
| `meter`      | m       | Longueurs (tissus)        | 2         | 3.5m (tissu coton)             |

### Configuration technique

Chaque unité possède une configuration dans `utils/unitFormatter.ts` :

```typescript
export const UNIT_CONFIG: Record<StockUnit, UnitConfig> = {
  percentage: {
    symbol: '%',
    position: 'after',
    space: false,
    decimals: 0,
    label: 'pourcentage',
  },
  meter: {
    symbol: 'm',
    position: 'after',
    space: false,
    decimals: 2,
    label: 'mètres',
  },
  // ... etc
};
```

### Formatage automatique

La fonction `formatQuantityWithUnit()` gère l'affichage :

```typescript
formatQuantityWithUnit(65, 'percentage'); // "65%"
formatQuantityWithUnit(0.5, 'meter'); // "0,5m"
formatQuantityWithUnit(150, 'ml'); // "150ml"
formatQuantityWithUnit(2.5, 'kg'); // "2,5kg"
```

---

## 🤖 Algorithmes IA adaptés

### Calcul de sessions restantes

Au lieu de prédire "X jours avant rupture", l'IA calcule maintenant les **sessions d'utilisation restantes** pour les unités créatives :

#### Pour les tubes de peinture (percentage)

```typescript
// 1 session créative = 10-15% de consommation moyenne
quantity: 65%  →  ~5 sessions restantes
quantity: 15%  →  ~1 session restante
```

#### Pour les tissus (meter)

```typescript
// 1 projet couture = 1.5m en moyenne
quantity: 3.5m  →  ~2 projets possibles
quantity: 0.5m  →  ~0 projets (insuffisant)
```

#### Pour les liquides (ml/liter)

```typescript
// 1 session = 75ml en moyenne
quantity: 150ml  →  ~2 utilisations restantes
quantity: 1.2L   →  ~16 utilisations restantes
```

### Messages contextuels

L'IA génère des messages adaptés au type d'usage :

**Peinture (percentage)** :

> "Il reste 65% de Acrylique Bleu Cobalt. Estimation : ~5 sessions créatives avant d'être vide."

**Tissu (meter)** :

> "Il reste 0.5m de Feutrine Rouge. Insuffisant pour la plupart des projets couture (besoin d'environ 1.5-2m par projet)."

**Liquide (ml)** :

> "Il reste 150ml de Vernis Acrylique Mat. Estimation : ~2 utilisations restantes."

**Cellier (kg)** :

> "Stock Farine T55 (2.5kg) sera épuisé dans 12 jours selon l'analyse des tendances."

### Fonction `calculateSessionsRemaining()`

Implémentée dans `utils/aiPredictions.ts` :

```typescript
function calculateSessionsRemaining(stock: Stock): number | null {
  const unit = stock.unit ?? 'piece';

  if (unit === 'percentage') {
    const avgConsumptionPerSession = 12; // 12% par session
    return Math.floor(stock.quantity / avgConsumptionPerSession);
  }

  if (unit === 'meter') {
    const avgConsumptionPerProject = 1.5; // 1.5m par projet
    return Math.floor(stock.quantity / avgConsumptionPerProject);
  }

  if (unit === 'ml' || unit === 'liter') {
    const quantityInMl = unit === 'liter' ? stock.quantity * 1000 : stock.quantity;
    const avgConsumptionPerSession = 75; // 75ml par session
    return Math.floor(quantityInMl / avgConsumptionPerSession);
  }

  // ... autres unités
}
```

---

## 📖 Guide d'utilisation

### 1. Ajouter un stock créatif

Lors de la création d'un stock, spécifiez l'unité appropriée :

```typescript
{
  name: "Acrylique Bleu Cobalt",
  quantity: 65,
  unit: 'percentage',  // ← Unité flexible
  minThreshold: 20,
  maxThreshold: 100,
  category: "Peinture"
}
```

### 2. Interpréter les suggestions IA

Les suggestions s'adaptent automatiquement au type d'unité :

**Pour les tubes de peinture** :

- ⚠️ Critique : < 20% (< 2 sessions)
- 📅 Réapprovisionner : < 40% (< 3 sessions)
- ✅ Optimal : 40-100%

**Pour les tissus** :

- ⚠️ Critique : < 1m (insuffisant pour 1 projet)
- 📅 Réapprovisionner : < 2m
- ✅ Optimal : > 2m (plusieurs projets possibles)

### 3. Affichage sur les cartes

Les quantités s'affichent automatiquement avec leur symbole :

```
┌─────────────────────────┐
│ Acrylique Bleu Cobalt   │
│                         │
│      65%                │  ← Formatage automatique
│   Quantité              │
│                         │
│ ⚡ IA : ~5 sessions     │
│    créatives restantes  │
└─────────────────────────┘
```

---

## 💡 Exemples concrets

### Exemple 1 : Gestion atelier peinture

```typescript
// Stocks peinture
const stocks = [
  {
    name: 'Acrylique Bleu Cobalt',
    quantity: 65,
    unit: 'percentage',
    status: 'optimal', // ✅ ~5 sessions restantes
  },
  {
    name: 'Acrylique Rouge Vermillon',
    quantity: 15,
    unit: 'percentage',
    status: 'low', // ⚠️ 1 session restante
  },
  {
    name: 'Vernis Mat',
    quantity: 150,
    unit: 'ml',
    status: 'optimal', // ✅ ~2 utilisations
  },
];
```

**Suggestions IA générées** :

- ⚠️ "Acrylique Rouge Vermillon : Il reste 15%, environ 1 session créative. Prévoir 85%"
- 📅 "Vernis Mat : 150ml restants, ~2 utilisations. Prévoir 350ml"

### Exemple 2 : Gestion atelier couture

```typescript
const stocks = [
  {
    name: 'Tissu Coton Fleuri',
    quantity: 3.5,
    unit: 'meter',
    status: 'optimal', // ✅ ~2 projets possibles
  },
  {
    name: 'Feutrine Rouge',
    quantity: 0.5,
    unit: 'meter',
    status: 'low', // ⚠️ Insuffisant pour 1 projet
  },
  {
    name: 'Bobines de Fil',
    quantity: 12,
    unit: 'piece',
    status: 'optimal', // ✅ Stock confortable
  },
];
```

**Suggestions IA générées** :

- ⚠️ "Feutrine Rouge : 0.5m restants. Insuffisant pour la plupart des projets couture (besoin 1.5-2m)"
- ✅ "Tissu Coton Fleuri : 3.5m disponibles. Suffisant pour 2 projets de couture environ"

### Exemple 3 : Gestion cellier

```typescript
const stocks = [
  {
    name: 'Farine T55',
    quantity: 2.5,
    unit: 'kg',
    status: 'optimal', // ✅ ~12 utilisations
  },
  {
    name: 'Levure Chimique',
    quantity: 80,
    unit: 'g',
    status: 'low', // ⚠️ < seuil minimum (100g)
  },
  {
    name: "Huile d'Olive",
    quantity: 0.75,
    unit: 'liter',
    status: 'optimal',
  },
];
```

---

## 🏗️ Architecture technique

### Fichiers modifiés/créés

#### 1. `src/types/stock.ts`

```typescript
export type StockUnit = 'piece' | 'percentage' | 'ml' | 'g' | 'meter' | 'liter' | 'kg';

export interface Stock {
  // ... autres champs
  unit?: StockUnit; // ← Nouveau champ
}
```

#### 2. `src/utils/unitFormatter.ts` (NOUVEAU)

- `formatQuantityWithUnit()` : Formatage pour affichage
- `parseQuantityInput()` : Parse les entrées utilisateur
- `getUnitLabel()` : Labels complets pour formulaires
- `UNIT_CONFIG` : Configuration de toutes les unités

#### 3. `src/components/dashboard/StockCard.tsx`

```typescript
// Avant
<div>{stock.quantity}</div>

// Après
<div>{formatQuantityWithUnit(stock.quantity, stock.unit)}</div>
```

#### 4. `src/utils/aiPredictions.ts`

Nouvelles fonctions :

- `calculateSessionsRemaining()` : Calcul sessions créatives
- `getUsageAdaptedMessage()` : Messages contextuels

Fonctions mises à jour :

- `generateRuptureRiskSuggestion()` : Utilise sessions + formatage
- `generateReorderSuggestion()` : Messages adaptés
- `generateOverstockSuggestion()` : Formatage avec unités
- `generateOptimizeSuggestion()` : Seuils formatés

#### 5. `src/data/stockData.ts`

18 exemples de stocks réalistes :

- 7 stocks peinture/arts (%, ml, L, piece)
- 4 stocks couture (meter, piece)
- 7 stocks cellier (kg, g, L, piece)

### Flux de données

```
┌─────────────────────────────────────────────────────────────┐
│                     Création de Stock                        │
│  { name: "Acrylique", quantity: 65, unit: 'percentage' }   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   StockCard Component                        │
│  formatQuantityWithUnit(65, 'percentage') → "65%"           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Prediction Engine                        │
│  calculateSessionsRemaining(stock) → 5 sessions             │
│  getUsageAdaptedMessage() → "~5 sessions créatives"        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Suggestion Badge                       │
│  "⚠️ Il reste ~5 sessions créatives avant d'être vide"     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔮 Évolutions futures

### Option B - Fréquence d'Activité (À venir)

- Tracking de fréquence : `sporadic`, `weekly`, `monthly`, `seasonal`
- Prédictions ajustées selon régularité d'usage
- Message : "~5 sessions restantes (2-6 mois selon ton activité)"

### Option C - Mode Projets (Optionnel)

- Création de projets créatifs avec liste de matériaux
- Vérification stocks avant de commencer un projet
- Tracking consommation réelle vs prévision

---

## 📊 Métriques & Performance

**Bundle size impact** :

- Avant : 377.80 KB
- Après : 382.01 KB (+4.21 KB, +1.1%)
- Gzipped : 121.22 KB (+0.67 KB)

**Fonctionnalités ajoutées** :

- 7 nouvelles unités supportées
- 2 nouvelles fonctions IA (calcul sessions, messages adaptés)
- 1 nouveau fichier utility (unitFormatter.ts)
- 4 fonctions IA mises à jour

**Couverture de tests** :

- Coverage actuel: 60.67% global (374 tests, composants 90-98%)
- 18 stocks de test couvrant tous les cas d'usage
- Tests wrappers React pour web components
- Note: unitFormatter.ts 62.96% coverage

---

## ❓ FAQ

### Comment gérer un tube de peinture partiellement vide ?

Utilisez l'unité `percentage` et estimez le pourcentage restant (ex: 65% pour un tube à 2/3 plein).

### Puis-je mélanger différentes unités dans mon stock ?

Oui ! Chaque stock a son unité propre. Vous pouvez avoir des tubes en %, du tissu en mètres, et de la farine en kg.

### Comment l'IA estime-t-elle les "sessions créatives" ?

L'IA utilise des moyennes basées sur le type d'unité :

- Peinture (%) : 12% par session
- Tissu (m) : 1.5m par projet
- Liquides (ml) : 75ml par session

### Que se passe-t-il si je ne spécifie pas d'unité ?

L'unité par défaut est `piece` (pièces entières).

### Les algorithmes IA s'améliorent-ils avec le temps ?

Actuellement, les algorithmes utilisent des moyennes simulées. Dans une version future, ils pourront s'adapter à votre historique d'utilisation réel.

---

**Version** : 2.0 - Option A Implémentée
