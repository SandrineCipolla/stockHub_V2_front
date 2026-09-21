# Corrections — Connexion Items & Page Détail Stock

> **Mode d'emploi** : Dépose ce fichier dans `stockHub_V2_front`.
> Dans Claude Code : **"Lis CORRECTIONS_CONNEXION_ITEMS.md et commence par la Correction 1"**
> Traite une correction à la fois, attends ma validation avant de passer à la suivante.

---

## CONTEXTE

La connexion stocks est fonctionnelle (Bearer token ✅, CRUD stocks ✅, CORS ✅).
Ce qui reste à câbler :

- Les 4 endpoints items (GET, POST, PATCH, DELETE)
- La page détail `/stocks/:id`
- `deleteMultipleStocks` encore mocké
- `quantity` et `status` hardcodés à 0 / 'optimal'

**Endpoints back disponibles (déjà protégés par Bearer token)** :

- `GET    /api/v2/stocks/:stockId/items`
- `POST   /api/v2/stocks/:stockId/items`
- `PATCH  /api/v2/stocks/:stockId/items/:itemId`
- `DELETE /api/v2/stocks/:stockId/items/:itemId`

---

## CORRECTION 1 — Créer `itemsAPI.ts` + `useItems.ts`

**Durée estimée** : 1h
**Critère RNCP** : Ce2.4 #2 — liaison front/back assurée par API

### Étapes

**1. Lis d'abord ces fichiers** pour comprendre le pattern existant :

- `src/services/stocksAPI.ts` (ou équivalent) — pattern des appels API stocks
- `src/hooks/useStocks.ts` (ou équivalent) — pattern du hook de data fetching
- `src/types/` — types Stock et Item existants

**2. Crée `src/services/itemsAPI.ts`** en suivant exactement le même pattern que `stocksAPI.ts` :

```typescript
// Pattern attendu — adapte selon ce que tu trouves dans stocksAPI.ts
import { getAuthHeader } from './authHelper'; // ou équivalent

const API_BASE = import.meta.env.VITE_API_SERVER_URL;

export const itemsAPI = {
  getItems: async (stockId: string): Promise<Item[]> => {
    const response = await fetch(`${API_BASE}/api/v2/stocks/${stockId}/items`, {
      headers: await getAuthHeader(),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  addItem: async (stockId: string, item: CreateItemDTO): Promise<Item> => {
    const response = await fetch(`${API_BASE}/api/v2/stocks/${stockId}/items`, {
      method: 'POST',
      headers: { ...(await getAuthHeader()), 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  updateItem: async (stockId: string, itemId: string, updates: UpdateItemDTO): Promise<Item> => {
    const response = await fetch(`${API_BASE}/api/v2/stocks/${stockId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { ...(await getAuthHeader()), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  deleteItem: async (stockId: string, itemId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/v2/stocks/${stockId}/items/${itemId}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  },
};
```

**3. Crée `src/hooks/useItems.ts`** en suivant le pattern de `useStocks.ts` :

```typescript
// Pattern attendu — adapte selon useStocks.ts existant
export const useItems = (stockId: string) => {
  // useState + useEffect ou React Query selon le pattern existant
  // Expose : items, isLoading, error, addItem, updateItem, deleteItem
};
```

**4. Vérifie que TypeScript compile** : `npx tsc --noEmit`

### Livrable

- `src/services/itemsAPI.ts`
- `src/hooks/useItems.ts`
- Commit : `feat(api): add itemsAPI service and useItems hook (Ce2.4 #2)`

---

## CORRECTION 2 — Créer la page détail stock `/stocks/:id`

**Durée estimée** : 1h30
**Critère RNCP** : Ce2.4 #2

### Étapes

**1. Lis ces fichiers** pour comprendre le pattern existant :

- `src/pages/` ou `src/views/` — liste des pages existantes
- La page liste des stocks — pour comprendre comment les données sont affichées
- `src/App.tsx` — pour voir comment les routes sont déclarées
- Les composants du design system disponibles (`sh-stock-card`, `sh-metric-card`, etc.)

**2. Crée `src/pages/StockDetailPage.tsx`** (ou équivalent selon ta convention de nommage) :

La page doit :

- Récupérer le `stockId` depuis les paramètres de route (`useParams`)
- Charger les détails du stock via le hook existant (`useStocks` ou équivalent)
- Charger les items via `useItems(stockId)` (Correction 1)
- Afficher :
  - En-tête : nom du stock, catégorie, description
  - Métriques : nombre d'items total, quantité totale, items en stock bas
  - Liste des items avec quantité et statut
  - Boutons : ajouter un item, modifier, supprimer

**3. Ajoute la route dans `src/App.tsx`** :

```typescript
// Ajoute après la route /stocks existante
<Route path="/stocks/:stockId" element={<StockDetailPage />} />
```

**4. Depuis la liste des stocks, rends chaque carte cliquable** vers `/stocks/:stockId`

**5. Vérifie TypeScript** : `npx tsc --noEmit`
**6. Lance les tests** : `npm run test`

### Livrable

- `src/pages/StockDetailPage.tsx`
- Route ajoutée dans `App.tsx`
- Navigation depuis la liste vers le détail
- Commit : `feat(pages): add stock detail page with items list (Ce2.4 #2)`

---

## CORRECTION 3 — Câbler `deleteMultipleStocks`

**Durée estimée** : 30 min

### Étapes

**1. Trouve le composant** qui contient `deleteMultipleStocks` avec `setTimeout` mocké

**2. Remplace le mock** par un appel réel :

```typescript
// Remplace le setTimeout par :
const deleteMultipleStocks = async (stockIds: string[]) => {
  await Promise.all(stockIds.map(id => stocksAPI.deleteStock(id)));
  // refresh de la liste après suppression
};
```

**3. Gère les erreurs** : si une suppression échoue, affiche un message d'erreur sans planter les autres.

**4. Vérifie TypeScript** : `npx tsc --noEmit`

### Livrable

- Composant modifié sans `setTimeout` mock
- Commit : `fix(stocks): replace mocked deleteMultipleStocks with real API call`

---

## CORRECTION 4 — Calculer `quantity` et `status` depuis les items

**Durée estimée** : 30 min

### Étapes

**1. Trouve où** `quantity: 0` et `status: 'optimal'` sont hardcodés dans la liste des stocks

**2. Une fois que `useItems` est disponible (Correction 1)**, calcule dynamiquement :

```typescript
// quantity totale = somme des quantités de tous les items du stock
const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

// status = logique métier
const status = items.some(item => item.quantity <= item.minimumStock)
  ? 'low'
  : items.length === 0
    ? 'empty'
    : 'optimal';
```

**Note** : cette correction dépend de la Correction 1 (useItems).
Si charger les items pour chaque stock dans la liste est trop coûteux (N+1),
documente-le comme limitation connue et utilise les valeurs du back si disponibles.

### Livrable

- `quantity` et `status` calculés dynamiquement
- Commit : `fix(stocks): calculate quantity and status from items data`

---

## ORDRE D'EXÉCUTION

```
Correction 1 (itemsAPI + useItems)
  → Correction 2 (page détail — dépend de useItems)
  → Correction 3 (deleteMultipleStocks — indépendant)
  → Correction 4 (quantity/status — dépend de useItems)
```

## APRÈS CHAQUE CORRECTION

```bash
npx tsc --noEmit     # 0 erreur TypeScript
npm run test         # tests existants passent
npm run lint         # 0 nouvelle erreur
```

**⚠️ Ne touche pas aux fichiers non mentionnés.**
**⚠️ Conserve le pattern d'authentification existant (getAuthHeader ou équivalent) — ne réinvente pas la gestion du token.**
