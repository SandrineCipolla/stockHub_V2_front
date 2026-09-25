# Implémentation — EditItem flow complet (frontend)

> Issues : #110 (table paginée), #111 (ItemFormModal), #112 (UpdateItemData)
> Branche à créer : `feat/110-111-112-items-table-and-modal`

## Contexte

Projet StockHub V2 — React 19 + TypeScript + Vite + TailwindCSS.
Le backend supporte maintenant PATCH `/stocks/:stockId/items/:itemId` avec `label`, `description`, `minimumStock`, `quantity` (tous optionnels).
On refactore l'affichage des items en table paginée avec filter chips, et on ajoute une modale d'édition.

## Règles importantes

- Créer la branche `feat/110-111-112-items-table-and-modal` avant de commencer
- Calquer `ItemFormModal` sur `StockFormModal` (src/components/stocks/StockFormModal.tsx) — même structure, même accessibilité (role=dialog, aria-modal, aria-labelledby, Escape, focus trap)
- Ne pas casser les tests existants — mettre à jour les tests impactés
- Commits conventionnels avec références issues :
  - `feat(items): extend UpdateItemData — closes #112`
  - `feat(items): add ItemFormModal — closes #111`
  - `feat(items): refactor StockDetailPage to paginated table — closes #110`
- Un seul changement à la fois, valider le build entre chaque étape

---

## Étape 1 — Étendre UpdateItemData dans types/stock.ts

**Fichier à modifier :** `src/types/stock.ts`

Remplacer :

```typescript
export interface UpdateItemData {
  quantity: number;
}
```

Par :

```typescript
export interface UpdateItemData {
  quantity?: number;
  label?: string;
  description?: string;
  minimumStock?: number;
}
```

Commit : `feat(items): extend UpdateItemData — closes #112`

---

## Étape 2 — Mettre à jour itemsAPI.ts

**Fichier à modifier :** `src/services/api/itemsAPI.ts`

Dans la méthode `updateItem`, remplacer le body qui n'envoie que `quantity` par tous les champs optionnels :

```typescript
static async updateItem(
  stockId: number | string,
  itemId: number | string,
  updates: UpdateItemData
): Promise<StockItem> {
  const body: Record<string, unknown> = {};
  if (updates.quantity !== undefined) body.quantity = updates.quantity;
  if (updates.label !== undefined) body.label = updates.label;
  if (updates.description !== undefined) body.description = updates.description;
  if (updates.minimumStock !== undefined) body.minimumStock = updates.minimumStock;

  const { apiUrl, config } = await getApiConfig('PATCH', 2, body);
  const response = await fetch(`${apiUrl}/stocks/${stockId}/items/${itemId}`, config);

  if (!response.ok) {
    throw new Error(`HTTP response with status ${response.status}`);
  }

  const updatedItem: StockItem = await response.json();
  return updatedItem;
}
```

---

## Étape 3 — Mettre à jour useItems.ts

**Fichier à modifier :** `src/hooks/useItems.ts`

Dans `updateItemAction`, rendre les validations conditionnelles :

```typescript
if (updates.quantity !== undefined && updates.quantity < 0) {
  throw createFrontendError('validation', 'La quantité ne peut pas être négative', 'quantity', {
    field: 'quantity',
  });
}

if (updates.label !== undefined && !updates.label.trim()) {
  throw createFrontendError('validation', "Le nom de l'item est obligatoire", 'label', {
    field: 'label',
  });
}
```

---

## Étape 4 — Créer ItemFormModal

**Fichier à créer :** `src/components/items/ItemFormModal.tsx`

Calquer sur `src/components/stocks/StockFormModal.tsx` avec ces adaptations :

**Props :**

```typescript
interface ItemFormModalProps {
  mode: 'create' | 'edit';
  stockId: number | string;
  item?: StockItem;
  onSuccess: () => void;
  onClose: () => void;
}
```

**Champs du formulaire :**

- `label` — texte, requis (aria-required, validation)
- `description` — texte, optionnel
- `minimumStock` — nombre, optionnel, min=0 (type="number")

**Comportement :**

- Mode `create` : appelle `ItemsAPI.addItem(stockId, { label, description, minimumStock, quantity: 0 })`
- Mode `edit` : appelle `ItemsAPI.updateItem(stockId, item.id, { label, description, minimumStock })`
- Même gestion Escape, clic backdrop, focus automatique, aria que StockFormModal
- Titre : "Nouvel item" (create) / "Modifier l'item" (edit)
- Bouton submit : "Créer" (create) / "Enregistrer" (edit)

Commit : `feat(items): add ItemFormModal — closes #111`

---

## Étape 5 — Refactorer StockDetailPage en table paginée

**Fichier à modifier :** cherche la page qui affiche les items d'un stock
(probablement `src/pages/StockDetailPage.tsx`).

### 5a — États nécessaires

```typescript
const [filterStatus, setFilterStatus] = useState<
  'all' | 'optimal' | 'low' | 'critical' | 'outOfStock'
>('all');
const [currentPage, setCurrentPage] = useState(1);
const [editingItem, setEditingItem] = useState<StockItem | null>(null);
const [showAddModal, setShowAddModal] = useState(false);
const ITEMS_PER_PAGE = 20;
```

### 5b — Calcul statut item

```typescript
const getItemStatus = (item: StockItem): 'optimal' | 'low' | 'critical' | 'outOfStock' => {
  if (item.quantity === 0) return 'outOfStock';
  if (item.quantity <= item.minimumStock * 0.5) return 'critical';
  if (item.quantity <= item.minimumStock) return 'low';
  return 'optimal';
};
```

### 5c — Filtrage et pagination (useMemo)

```typescript
const filteredItems = useMemo(() => {
  if (filterStatus === 'all') return items;
  return items.filter(item => getItemStatus(item) === filterStatus);
}, [items, filterStatus]);

const paginatedItems = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredItems.slice(start, start + ITEMS_PER_PAGE);
}, [filteredItems, currentPage]);

const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
```

### 5d — Structure de la table

Remplacer l'affichage actuel en cards par une table avec :

- Header : titre "Items (N)" + bouton "+ Ajouter un item"
- Filter chips : Tous / Rupture(n) / Stock bas(n) / OK(n)
- Colonnes thead : Nom/description | Statut | Quantité | Min | Actions
- Chaque row :
  - Pastille colorée + label + description en sous-texte
  - Statut texte coloré (outOfStock=red-600, critical=orange-500, low=yellow-600, optimal=green-600)
  - Boutons −/+ inline pour la quantité
  - Icône crayon + corbeille visibles au hover (group/group-hover Tailwind)
- Pagination : "1–20 sur N" + boutons page

### 5e — Actions

- `−` / `+` : `updateItem(item.id, { quantity: item.quantity ± 1 })`
- Crayon : `setEditingItem(item)`
- Corbeille : `window.confirm(...)` puis `deleteItem(item.id)`

Commit : `feat(items): refactor StockDetailPage to paginated table — closes #110`

---

## Étape 6 — Intégrer les modales

```tsx
{
  showAddModal && (
    <ItemFormModal
      mode="create"
      stockId={stockId}
      onSuccess={() => {
        loadItems();
        setShowAddModal(false);
      }}
      onClose={() => setShowAddModal(false)}
    />
  );
}

{
  editingItem && (
    <ItemFormModal
      mode="edit"
      stockId={stockId}
      item={editingItem}
      onSuccess={() => {
        loadItems();
        setEditingItem(null);
      }}
      onClose={() => setEditingItem(null)}
    />
  );
}
```

---

## Étape 7 — Tests

### Créer `src/components/items/__tests__/ItemFormModal.test.tsx`

Calquer sur `src/components/stocks/__tests__/StockFormModal.test.tsx`.

Cas à couvrir (minimum 8 tests) :

- Rendu mode create : titre "Nouvel item", bouton "Créer"
- Rendu mode edit : titre "Modifier l'item", champs pré-remplis avec item.label/description/minimumStock
- Validation : submit sans label → message d'erreur affiché
- Submit valide mode create → ItemsAPI.addItem appelé avec les bons args
- Submit valide mode edit → ItemsAPI.updateItem appelé avec label/description/minimumStock
- Escape → onClose appelé
- Clic backdrop → onClose appelé
- Focus automatique sur le premier champ à l'ouverture

### Mettre à jour les tests useItems existants

- Adapter les cas updateItem : quantity est maintenant optionnel
- Ajouter : updateItem avec label seul → pas d'erreur de validation quantity
- Ajouter : updateItem avec minimumStock seul → pas d'erreur de validation quantity

---

## Validation finale

- [ ] `npm run build` sans erreur TypeScript
- [ ] `npm run test` — tous les tests passent, aucune régression
- [ ] Table avec filter chips et pagination visible sur StockDetailPage
- [ ] Modale "Nouvel item" fonctionnelle depuis le bouton Ajouter
- [ ] Modale "Modifier l'item" fonctionnelle avec champs pré-remplis
- [ ] Boutons −/+ continuent de fonctionner
- [ ] Corbeille supprime l'item après confirmation
- [ ] `npm run lint` sans erreur
