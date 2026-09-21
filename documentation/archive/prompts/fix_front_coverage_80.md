# Tests manquants — coverage front de 66% → 80%+

## Contexte

Projet StockHub V2 — React 19 + TypeScript + Vitest.
Coverage actuel : statements 66.38%, functions 55.19%, lines 66.38%.
Cause : useItems.ts, useStockDetail.ts, itemsAPI.ts sont à 0% coverage.
Objectif : atteindre 80% sur statements, functions et lines.

## Critère RNCP

Ce3.2 #15 — taux de couverture mesuré avec seuil configuré.

## Branche à créer

```
fix/coverage-useItems-useStockDetail-itemsAPI
```

## Issue à créer

```bash
gh issue create \
  --title "test(coverage): add tests for useItems, useStockDetail and itemsAPI to reach 80% threshold" \
  --body "## Problème\nCoverage actuel : statements 66.38%, functions 55.19% — sous le seuil de 80%.\nuseItems.ts, useStockDetail.ts et itemsAPI.ts sont à 0% coverage.\n\n## Critère RNCP\nCe3.2 #15 — taux de couverture mesuré et documenté avec seuil défini\n\n## Actions\n- Tests useItems.ts\n- Tests useStockDetail.ts\n- Tests itemsAPI.ts" \
  --label "testing"
```

---

## Fichier 1 — Tests pour useItems.ts

**Fichier à créer :** `src/hooks/__tests__/useItems.test.ts`

### Modèle

Calque sur les tests existants dans `src/hooks/` (useStocks.test.ts ou useFrontendState.test.ts).
Utilise les fixtures existantes dans `src/test/fixtures/`.

### Cas à couvrir (minimum 12 tests)

**loadItems :**

- Appelle `ItemsAPI.fetchItems(stockId)` avec le bon stockId
- Retourne les items reçus de l'API
- En cas d'erreur réseau → `errors.load` contient une FrontendError de type 'network'
- `isLoading.load` est true pendant l'exécution, false après

**addItem :**

- Appelle `ItemsAPI.addItem(stockId, itemData)` avec les bons args
- Validation : label vide → `errors.add` de type 'validation', ItemsAPI.addItem NON appelé
- Validation : quantity négative → `errors.add` de type 'validation', ItemsAPI.addItem NON appelé
- Label valide + quantity >= 0 → ItemsAPI.addItem appelé
- En cas d'erreur réseau → `errors.add` de type 'network'

**updateItem :**

- Appelle `ItemsAPI.updateItem(stockId, itemId, updates)` avec les bons args
- Validation : quantity négative → erreur validation
- quantity undefined (édition label seul) → pas d'erreur validation quantity
- label vide → erreur validation label
- label undefined (édition quantity seule) → pas d'erreur validation label
- En cas d'erreur réseau → `errors.update` de type 'network'

**deleteItem :**

- Appelle `ItemsAPI.deleteItem(stockId, itemId)` avec les bons args
- En cas d'erreur réseau → `errors.delete` de type 'network'

**resetErrors :**

- Après une erreur sur addItem, resetErrors.add() remet errors.add à null

### Setup mock

```typescript
vi.mock('@/services/api/itemsAPI', () => ({
  ItemsAPI: {
    fetchItems: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
  },
}));
```

---

## Fichier 2 — Tests pour useStockDetail.ts

**Fichier à créer :** `src/hooks/__tests__/useStockDetail.test.ts`

### Lire d'abord useStockDetail.ts pour comprendre ce qu'il expose

```
src/hooks/useStockDetail.ts
```

### Cas à couvrir (minimum 8 tests)

Sur la base de ce que useStockDetail expose, couvrir :

- Chargement du stock detail : appelle la bonne méthode API avec le bon stockId
- Succès → données stock disponibles
- Erreur réseau → état d'erreur exposé
- `isLoading` correct pendant/après le chargement
- Si useStockDetail expose des actions (updateStock, deleteStock) → les tester
- Si useStockDetail calcule des métriques (totalItems, lowStockCount) → tester les calculs

> Lis le fichier useStockDetail.ts avant d'écrire les tests pour couvrir
> exactement ce qu'il expose — ne pas inventer des fonctionnalités.

---

## Fichier 3 — Tests pour itemsAPI.ts

**Fichier à créer :** `src/services/api/__tests__/itemsAPI.test.ts`

### Modèle

Calque sur les tests de stocksAPI s'ils existent dans `src/services/api/__tests__/`.
Si aucun modèle n'existe, utilise un mock de `fetch` global.

### Setup mock fetch

```typescript
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock getApiConfig
vi.mock('@/services/api/utils', () => ({
  getApiConfig: vi.fn().mockResolvedValue({
    apiUrl: 'http://localhost:3000/api/v2',
    config: { method: 'GET', headers: { Authorization: 'Bearer token' } },
  }),
}));
```

### Cas à couvrir (minimum 10 tests)

**fetchItems :**

- Appelle fetch avec la bonne URL `/stocks/:stockId/items`
- Retourne les items parsés depuis la réponse JSON
- Response non-ok (400) → throw Error avec le status

**addItem :**

- Appelle fetch avec POST et le body correct (label, quantity, description, minimumStock)
- Retourne le nouvel item créé
- Response non-ok → throw Error

**updateItem :**

- Appelle fetch avec PATCH et seulement les champs définis dans updates
  - Si `{ quantity: 5 }` → body contient quantity mais pas label/description/minimumStock
  - Si `{ label: "test", minimumStock: 3 }` → body contient label+minimumStock mais pas quantity
- Retourne l'item mis à jour
- Response non-ok → throw Error

**deleteItem :**

- Appelle fetch avec DELETE sur la bonne URL
- Response ok → pas d'erreur
- Response non-ok → throw Error

---

## Après avoir écrit les tests

Lance le coverage pour vérifier :

```bash
npm run test:coverage
```

Si le coverage n'atteint pas encore 80% sur statements/functions/lines, identifie
les fichiers encore à 0% et propose des exclusions justifiées dans vitest.config.ts
(fichiers de configuration, types, main.tsx, etc. — comme mlSimulation.ts est déjà exclu).

**Ne pas exclure** useItems.ts, useStockDetail.ts ni itemsAPI.ts — ce sont des fichiers
métier importants qui doivent être couverts.

---

## Commit

```
test(coverage): add tests for useItems, useStockDetail and itemsAPI — closes #[numero]

Coverage: statements 66% → 80%+, functions 55% → 80%+
```

## Validation finale

- [ ] `npm run test` — tous les tests passent (aucune régression)
- [ ] `npm run test:coverage` — statements ≥ 80%, functions ≥ 80%, lines ≥ 80%
- [ ] `npm run build` sans erreur TypeScript
- [ ] `npm run lint` sans erreur
