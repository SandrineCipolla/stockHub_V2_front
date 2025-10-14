# 🗺️ Roadmap - Évolution Architecture StockHub V2

> **État actuel** : Architecture par items individuels
> **Vision future** : Architecture par catégories + Shopping List

---

## 📊 État actuel (Phase 1 - ACTUEL)

### Architecture
```
Dashboard
├── StockCard: "Acrylique Bleu Cobalt" (65%, 1 tube)
├── StockCard: "Acrylique Rouge" (15%, 1 tube)
├── StockCard: "Tissu Coton" (3.5m)
└── StockCard: "Farine" (2.5kg)
```

### Fonctionnalités
- ✅ Affichage de tous les items individuellement
- ✅ Unités flexibles (%, ml, m, kg, etc.)
- ✅ Bouton "Session" pour enregistrer l'usage (tubes peinture)
- ✅ Algorithmes IA adaptés au contexte créatif
- ✅ Gestion des containers (tubes)

### Limites
- ❌ Trop de cartes si beaucoup de produits (18 actuellement)
- ❌ Pas de regroupement par catégorie
- ❌ Pas de système d'achat/shopping list
- ❌ Difficulté de navigation avec >50 items

---

## 🎯 Option B : Architecture par Catégories (Phase 2)

### Vision

```
Dashboard (Vue compacte)
├── CategoryCard: "Peinture Acrylique"
│   ├── Métriques: 4 items, 175% total, 2 critiques
│   ├── [Détails] → Ouvre modal/page
│   │   └── Liste des items:
│   │       ├── Bleu Cobalt (65%, 1 tube) [Session] [Edit] [Delete]
│   │       ├── Rouge (15%, 1 tube) ⚠️ [Session] [Edit] [Delete]
│   │       ├── Blanc (90%, 1 tube) [Session] [Edit] [Delete]
│   │       └── Jaune (5%, 1 tube) 🔴 [Session] [Edit] [Delete]
│
├── CategoryCard: "Tissus"
│   ├── Métriques: 3 items, 6m total, 1 critique
│   └── [Détails] → Liste items
│
└── CategoryCard: "Cellier"
    ├── Métriques: 7 items, €50 total, 2 low
    └── [Détails] → Liste items
```

### Bénéfices
- ✅ Dashboard **beaucoup moins chargé** (3-5 cartes au lieu de 18+)
- ✅ Organisation naturelle par usage (peinture, couture, cuisine)
- ✅ Métriques agrégées par catégorie
- ✅ Navigation hiérarchique claire
- ✅ Scalabilité : 100 items = toujours 5 catégories visibles

### Types/Interfaces à créer

```typescript
// Nouvelle interface pour catégories
interface StockCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  items: Stock[];  // Les items de cette catégorie

  // Métriques agrégées
  totalItems: number;
  criticalCount: number;
  lowCount: number;
  optimalCount: number;
  totalValue: number;

  // Style
  color: string;  // 'purple' pour peinture, 'blue' pour tissus, etc.
}

// Nouveau composant
interface CategoryCardProps {
  category: StockCategory;
  onViewDetails: (categoryId: string) => void;
  onAddItem: (categoryId: string) => void;
}
```

### Composants à créer

1. **`CategoryCard.tsx`** - Carte de catégorie
   - Affiche métriques agrégées
   - Bouton "Détails" → ouvre modal
   - Bouton "Ajouter item"

2. **`CategoryDetailModal.tsx`** - Modal/Page avec liste des items
   - Table/Liste des items de la catégorie
   - Actions par item (Session, Edit, Delete)
   - Filtres/Recherche dans la catégorie

3. **`CategoryManager.tsx`** - Gestion des catégories
   - CRUD catégories
   - Assigner items aux catégories

### Estimation
- **Temps** : 4-6 heures
- **Complexité** : Moyenne (restructuration données)
- **Impact** : Haut (UX beaucoup mieux)

---

## 🛒 Option C : Shopping List (Phase 3)

### Vision

```
Navbar
└── [🛒 Shopping List (3)] ← Badge avec nombre d'items

ShoppingListPage
├── Header: "Liste de courses - 3 articles à acheter"
├── Items:
│   ├── [✓] Acrylique Rouge (1 tube, 12€)
│   │   └── [Réceptionner] → Ajoute au stock réel
│   ├── [ ] Farine T55 (2kg, 5€)
│   └── [ ] Tissu Coton (3m, 30€)
├── Total: 47€
└── [Vider la liste] [Tout réceptionner]

StockCard
└── Bouton [Ajouter à acheter] ← Au lieu de "Acheter"
```

### Workflow

1. **Ajouter à la liste de courses**
   - User click "Ajouter à acheter" sur une carte
   - Dialogue : "Combien de tubes veux-tu acheter ?"
   - Item ajouté à la shopping list (état: "à acheter")

2. **Acheter réellement**
   - User va au magasin physique
   - Coche les items achetés dans l'app

3. **Réceptionner**
   - User click "Réceptionner" sur un item acheté
   - Stock réel mis à jour automatiquement
   - Item retiré de la shopping list

### Types/Interfaces à créer

```typescript
interface ShoppingListItem {
  id: string;
  stockId?: number;        // Lien vers stock existant (optional)
  name: string;
  quantity: number;
  unit: StockUnit;
  estimatedPrice: number;
  category: string;

  // État
  status: 'to-buy' | 'purchased' | 'received';
  addedDate: Date;
  purchasedDate?: Date;
  receivedDate?: Date;

  // Métadonnées
  notes?: string;
  urgent?: boolean;
}

interface ShoppingList {
  id: string;
  items: ShoppingListItem[];
  totalEstimatedPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Composants à créer

1. **`ShoppingListPage.tsx`** - Page dédiée liste de courses
   - Liste des items à acheter
   - Checkboxes pour marquer "acheté"
   - Bouton "Réceptionner" par item

2. **`AddToShoppingListModal.tsx`** - Modal d'ajout
   - Sélection quantité
   - Prix estimé
   - Notes optionnelles

3. **`ShoppingListBadge.tsx`** - Badge navbar
   - Affiche nombre d'items à acheter
   - Link vers ShoppingListPage

4. **`ReceiveStockModal.tsx`** - Modal de réception
   - Confirme réception
   - Met à jour le stock réel
   - Historique de réception

### Fonctionnalités avancées

**Phase 3a - MVP** :
- Ajouter à la liste
- Marquer comme acheté
- Réceptionner dans le stock

**Phase 3b - Avancé** :
- 📍 Shopping list par magasin ("Cultura", "Biocoop", etc.)
- 🔔 Notifications push quand stock critique
- 📊 Historique des achats (budget tracking)
- 🏷️ Scanner de codes-barres pour ajouter items
- 📅 Rappels "Acheter avant le [date]"
- 💰 Comparateur de prix entre magasins

### Estimation
- **Temps MVP (3a)** : 3-4 heures
- **Temps Avancé (3b)** : 6-8 heures
- **Complexité** : Moyenne-Haute
- **Impact** : Très haut (feature killer)

---

## 📅 Planning proposé

### Séquence recommandée

**SEMAINE 6 - Option B (Architecture catégories)**
- Lundi : Design & Types (CategoryCard, interfaces)
- Mardi : Implémentation CategoryCard
- Mercredi : Implémentation CategoryDetailModal
- Jeudi : Migration données + Tests
- Vendredi : Polish & Documentation

**SEMAINE 7 - Option C (Shopping List MVP)**
- Lundi : Design & Types (ShoppingList interfaces)
- Mardi : Implémentation ShoppingListPage
- Mercredi : Implémentation AddToShoppingListModal
- Jeudi : Workflow "Ajouter → Acheter → Réceptionner"
- Vendredi : Tests & Documentation

**SEMAINE 8+ - Option C Avancé (si temps)**
- Features avancées progressivement
- Budget tracking
- Multi-magasins
- Scanner codes-barres

### Alternative : Quick Win

Si pas le temps pour full refactor :
1. **Garder architecture actuelle** (items individuels)
2. **Implémenter juste Shopping List** (Option C MVP)
3. **Ajouter filtres par catégorie** dans le Dashboard actuel
4. **Reporter Option B** pour plus tard

---

## 🔄 Migration de données

### Pour Option B

```typescript
// Migration : Items individuels → Catégories
const categories: StockCategory[] = [
  {
    id: 'peinture',
    name: 'Peinture Acrylique',
    icon: Palette,
    items: stockData.filter(s => s.category === 'Peinture'),
    totalItems: 7,
    criticalCount: 1,
    color: 'purple'
  },
  {
    id: 'tissu',
    name: 'Tissus & Couture',
    icon: Scissors,
    items: stockData.filter(s => s.category === 'Tissu'),
    totalItems: 4,
    criticalCount: 1,
    color: 'blue'
  },
  // etc.
];
```

Pas de perte de données, juste regroupement.

---

## 💭 Réflexions & Questions

### Questions à résoudre pour Option B
- [ ] Modal ou page dédiée pour les détails de catégorie ?
- [ ] Permettre de créer des catégories custom ?
- [ ] Drag & drop pour réorganiser items entre catégories ?
- [ ] Vue "flat" (actuelle) vs vue "catégories" switchable ?

### Questions à résoudre pour Option C
- [ ] Stocker shopping list en localStorage ou backend ?
- [ ] Permettre plusieurs listes (courses semaine, projets, etc.) ?
- [ ] Intégration avec calendrier ?
- [ ] Export shopping list en PDF/email ?

---

## 🎯 Décision à prendre

**Quelle option prioriser ?**

**Option 1** : B puis C (Recommandé)
- Meilleure architecture globale
- Scalabilité maximale
- ~10-12h total

**Option 2** : C puis B
- Feature visible immédiatement
- Moins de refactor initial
- ~8-10h total

**Option 3** : Quick Win (Filtres + Shopping List MVP)
- Rapide (4-6h)
- Garde architecture actuelle
- Compromis raisonnable

---

**Date création** : 14 Octobre 2025
**Status** : 📋 Planning - Awaiting decision
**Priorité** : Moyenne (amélioration UX, pas bloquant)
