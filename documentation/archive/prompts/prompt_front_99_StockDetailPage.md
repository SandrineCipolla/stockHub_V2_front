# Prompt Claude Code — Front #99 : StockDetailPage

## Contexte

**Issue** : #99 — Page StockDetail — consulter et gérer les items d'un stock  
**Repo** : `stockHub_V2_front`  
**Dépendances résolues** :

- ✅ Back #75/#93 (PR #116) : `GET /api/v2/stocks/:id` retourne maintenant l'objet complet avec items + agrégats + status
- ✅ Front #98 : `StockFormModal` disponible (create + edit)
- ✅ DS : `sh-stock-prediction-card`, `sh-stock-item-card`, `sh-status-badge`, `sh-metric-card` disponibles en v1.3.1

---

## Étape 0 — Audit préalable (lire avant de créer quoi que ce soit)

```bash
# 1. Routing existant — comment navigue-t-on vers le détail d'un stock ?
cat src/App.tsx

# 2. Page existante ou squelette ?
cat src/pages/StockDetailPage.tsx 2>/dev/null || echo "Fichier inexistant"

# 3. API layer — fonctions existantes pour /stocks/:id et /stocks/:id/items
cat src/api/itemsAPI.ts 2>/dev/null
cat src/api/stocksAPI.ts 2>/dev/null

# 4. Hook useItems ou useStockDetail existant ?
find src/hooks -type f | sort
cat src/hooks/useItems.ts 2>/dev/null

# 5. Types — shape de Stock et StockItem côté front
cat src/types/index.ts

# 6. StockFormModal — vérifier l'interface exportée (issue #98)
cat src/components/stocks/StockFormModal.tsx 2>/dev/null

# 7. Pattern d'une page existante pour référence
cat src/pages/Dashboard.tsx 2>/dev/null || ls src/pages/
```

Rapporte la structure avant de continuer.

---

## User Story (#99)

**En tant qu'utilisateur**, je veux consulter le détail d'un stock et gérer ses items,
afin de voir l'état de mon inventaire et le mettre à jour.

### Critères d'acceptance

- [ ] Navigation vers `/stocks/:id` depuis le Dashboard (clic sur une StockCard)
- [ ] Affichage du nom, description, catégorie du stock
- [ ] Métriques en header : total items, quantité totale, items critiques
- [ ] Liste des items avec statut visuel (sh-status-badge ou sh-stock-item-card)
- [ ] Prédictions IA visibles via `sh-stock-prediction-card` pour les items à risque
- [ ] Bouton "Modifier le stock" → ouvre StockFormModal en mode edit
- [ ] Bouton "Retour" → retour au Dashboard
- [ ] Loading state pendant le fetch
- [ ] État vide : message si le stock n'a aucun item
- [ ] Gestion 404 : message si le stock n'existe pas
- [ ] Responsive : mobile first

---

## Étape 1 — Types

Vérifier / compléter dans `src/types/index.ts` :

```typescript
export type ItemStatus = 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';

export interface StockItem {
  id: number;
  label: string;
  description?: string;
  quantity: number;
  minimumStock?: number;
  status: ItemStatus;
  unit?: string;
}

export interface StockDetail {
  id: number;
  label: string;
  description: string;
  category?: string;
  totalItems: number;
  totalQuantity: number;
  criticalItemsCount: number;
  items: StockItem[];
}

// Pour les prédictions IA (calculées côté front à partir des items)
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface StockPrediction {
  stockName: string;
  stockId: string;
  riskLevel: RiskLevel;
  daysUntilRupture: number | null;
  confidence: number;
  dailyConsumptionRate: number;
  currentQuantity: number;
  recommendedReorderQuantity: number;
}
```

---

## Étape 2 — API layer

Vérifier dans `src/api/stocksAPI.ts` (ou `itemsAPI.ts`) si cette fonction existe.
L'ajouter si absente, en suivant le pattern `ConfigManager` existant :

```typescript
// GET /api/v2/stocks/:id
export async function getStockDetail(stockId: number): Promise<StockDetail> {
  // utiliser le pattern ConfigManager existant pour les headers auth
}
```

---

## Étape 3 — Hook useStockDetail

Créer `src/hooks/useStockDetail.ts` en suivant le pattern des hooks existants
(ex: `useStocks`, `useItems`) :

```typescript
export function useStockDetail(stockId: number) {
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStockDetail(stockId);
      setStock(data);
    } catch (err) {
      setError('Impossible de charger le stock.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [stockId]);

  return { stock, isLoading, error, refetch: fetchStock };
}
```

---

## Étape 4 — Calcul des prédictions IA (côté front)

Les prédictions sont calculées à partir des données items reçues du back.
Créer `src/utils/stockPredictions.ts` :

```typescript
// Calcule un taux de consommation journalière simulé à partir du statut
// (en production, ce serait basé sur l'historique — ici on simule pour le jury)
export function computePredictions(items: StockItem[]): StockPrediction[] {
  return items
    .filter(
      item => item.status === 'critical' || item.status === 'low' || item.status === 'out-of-stock'
    )
    .map(item => {
      const dailyRate = Math.max(1, Math.round(item.quantity * 0.1)); // 10% / jour simulé
      const daysUntilRupture = item.quantity === 0 ? 0 : Math.floor(item.quantity / dailyRate);
      const riskLevel: RiskLevel =
        item.status === 'out-of-stock'
          ? 'critical'
          : item.status === 'critical'
            ? 'high'
            : item.status === 'low'
              ? 'medium'
              : 'low';
      const confidence = item.status === 'out-of-stock' ? 99 : item.status === 'critical' ? 92 : 78;

      return {
        stockName: item.label,
        stockId: String(item.id),
        riskLevel,
        daysUntilRupture: item.quantity === 0 ? null : daysUntilRupture,
        confidence,
        dailyConsumptionRate: dailyRate,
        currentQuantity: item.quantity,
        recommendedReorderQuantity: Math.max(10, (item.minimumStock ?? 1) * 3),
      };
    });
}
```

> **Note jury** : Ce calcul est intentionnellement simplifié (pas d'historique réel).
> Il illustre le pattern d'intelligence artificielle prédictive (critère C2.5 RNCP).
> Une vraie implémentation utiliserait un historique de consommation ou l'API Claude/OpenAI.
> Documenter ce choix dans un commentaire dans le fichier.

---

## Étape 5 — Page StockDetailPage

Créer ou compléter `src/pages/StockDetailPage.tsx` :

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStockDetail } from '@/hooks/useStockDetail';
import { computePredictions } from '@/utils/stockPredictions';
import { StockFormModal } from '@/components/stocks/StockFormModal';
import '@stockhub/design-system';

export function StockDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stockId = Number(id);

  const { stock, isLoading, error, refetch } = useStockDetail(stockId);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Loading
  if (isLoading) return <div aria-busy="true">Chargement...</div>;

  // Erreur / 404
  if (error || !stock)
    return (
      <div role="alert">
        <p>{error ?? 'Stock introuvable.'}</p>
        <sh-button variant="ghost" onClick={() => navigate('/')}>
          Retour
        </sh-button>
      </div>
    );

  const predictions = computePredictions(stock.items);

  return (
    <main>
      {/* Header de page */}
      <sh-page-header title={stock.label} subtitle={stock.description} />

      {/* Bouton retour */}
      <sh-button variant="ghost" iconBefore="ArrowLeft" onClick={() => navigate('/')}>
        Retour
      </sh-button>

      {/* Bouton modifier */}
      <sh-button variant="secondary" iconBefore="Edit" onClick={() => setIsEditOpen(true)}>
        Modifier le stock
      </sh-button>

      {/* Métriques agrégées */}
      <section aria-label="Métriques du stock">
        <sh-metric-card icon="Package" label="Total items" value={stock.totalItems} />
        <sh-metric-card icon="BarChart" label="Quantité totale" value={stock.totalQuantity} />
        <sh-metric-card
          icon="AlertTriangle"
          label="Items critiques"
          value={stock.criticalItemsCount}
          variant={stock.criticalItemsCount > 0 ? 'danger' : 'success'}
        />
      </section>

      {/* Prédictions IA — affichées si items à risque */}
      {predictions.length > 0 && (
        <section aria-label="Alertes IA">
          <h2>Alertes intelligentes</h2>
          {predictions.map(pred => (
            <sh-stock-prediction-card
              key={pred.stockId}
              stock-name={pred.stockName}
              stock-id={pred.stockId}
              risk-level={pred.riskLevel}
              days-until-rupture={pred.daysUntilRupture}
              confidence={pred.confidence}
              daily-consumption-rate={pred.dailyConsumptionRate}
              current-quantity={pred.currentQuantity}
              recommended-reorder-quantity={pred.recommendedReorderQuantity}
              show-details
            />
          ))}
        </section>
      )}

      {/* Liste des items */}
      <section aria-label="Items du stock">
        <h2>Items ({stock.totalItems})</h2>

        {stock.items.length === 0 ? (
          <p>Ce stock ne contient pas encore d'items.</p>
        ) : (
          stock.items.map(item => (
            <sh-stock-item-card
              key={item.id}
              name={item.label}
              sku={String(item.id)}
              quantity={item.quantity}
              status={item.status}
              location={item.description}
            />
          ))
        )}
      </section>

      {/* Modal edit stock */}
      {isEditOpen && (
        <StockFormModal
          mode="edit"
          stock={stock}
          onSuccess={() => {
            refetch();
            setIsEditOpen(false);
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </main>
  );
}
```

> Adapter les attributs WC selon la vraie API des composants DS (vérifier le README DS ou Storybook).
> En particulier `sh-stock-item-card` et `sh-stock-prediction-card` — les noms d'attributs sont en kebab-case.

---

## Étape 6 — Routing

Dans `src/App.tsx`, s'assurer que la route existe :

```tsx
<Route path="/stocks/:id" element={<StockDetailPage />} />
```

Et dans le Dashboard, s'assurer que le clic sur une StockCard navigue vers cette route :

```tsx
// Dans le handler de clic sur une StockCard
navigate(`/stocks/${stock.id}`);
```

---

## Étape 7 — Tests

### Fichier : `src/pages/__tests__/StockDetailPage.test.tsx`

```typescript
describe("StockDetailPage", () => {

  describe("when loading", () => {
    it("should show loading indicator", ...)
  })

  describe("when stock is not found", () => {
    it("should show error message and back button", ...)
  })

  describe("when stock is loaded", () => {
    it("should display stock name and description", ...)
    it("should display metric cards with correct values", ...)
    it("should display items list", ...)
    it("should show empty state when stock has no items", ...)
    it("should display prediction cards for critical and low items", ...)
    it("should not display prediction section when all items are optimal", ...)
  })

  describe("when user clicks edit button", () => {
    it("should open StockFormModal in edit mode", ...)
    it("should refetch stock data after successful edit", ...)
  })

  describe("when user clicks back button", () => {
    it("should navigate to dashboard", ...)
  })
})
```

Mocker `useStockDetail` et `computePredictions`.
Utiliser les fixtures existantes (`src/test/fixtures/stock.ts`) — ajouter une fixture `StockDetail` si absente.

```bash
npm run test:run -- StockDetailPage
npm run test:coverage -- StockDetailPage
```

---

## Étape 8 — Conventional commit et PR

```bash
git checkout -b feat/stock-detail-page

git add -A
git commit -m "feat(stocks): add StockDetailPage with AI predictions

- StockDetailPage fetches and displays stock detail from GET /api/v2/stocks/:id
- useStockDetail hook for data fetching with loading/error states
- computePredictions utility for AI-based stock risk analysis (C2.5)
- Displays sh-metric-card aggregates, sh-stock-item-card items list
- sh-stock-prediction-card for critical/low items (IA Business Intelligence)
- StockFormModal integration for inline stock editing
- Route /stocks/:id wired in App.tsx
- Tests: XX tests covering loading, error, data display, navigation
- Closes #99"

git push origin feat/stock-detail-page
```

**PR titre** : `feat(stocks): StockDetailPage with AI predictions — closes #99`

---

## Checklist avant PR

- [ ] `npm run type-check` → 0 erreur TypeScript
- [ ] `npm run lint` → 0 warning
- [ ] `npm run test:run` → tous les tests passent
- [ ] `npm run build` → build OK
- [ ] Navigation Dashboard → StockDetail fonctionne
- [ ] Métriques affichées correctement
- [ ] Items listés avec status coloré
- [ ] Section IA visible pour items critiques/low
- [ ] Bouton "Modifier" ouvre la modale et rafraîchit après succès
- [ ] Bouton "Retour" navigue vers le Dashboard
- [ ] État vide et état erreur/404 gérés
- [ ] Mobile : layout responsive vérifié
