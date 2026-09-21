# Prompt Claude Code — Front #98 : StockFormModal (create + edit)

## Contexte

**Issue** : #98 — StockFormModal — créer et éditer un stock via modale  
**Repo** : `stockHub_V2_front`  
**Dépendance** : Back #75/#93 doit être mergé et déployé avant les tests d'intégration réels.
Pour le développement du composant, utiliser des données mockées.

---

## Étape 0 — Audit préalable (lire avant de créer quoi que ce soit)

```bash
# 1. Structure des pages et composants existants
find src/pages -type f | sort
find src/components -type f | sort

# 2. Hooks existants liés aux stocks
find src/hooks -type f | sort
cat src/hooks/useStocks.ts   # ou useItems.ts — adapter selon ce qui existe

# 3. API layer
find src/api -o -name "*API*" -o -name "*api*" | grep -v node_modules | sort
cat src/api/itemsAPI.ts 2>/dev/null || cat src/api/stocksAPI.ts 2>/dev/null

# 4. Types existants
cat src/types/index.ts

# 5. Composants DS utilisés dans le projet (pour cohérence)
grep -r "sh-button\|sh-input\|sh-card\|sh-modal" src --include="*.tsx" -l | head -10

# 6. Pattern d'une modale existante (si elle existe)
find src/components -name "*Modal*" -o -name "*modal*" | grep -v test

# 7. Fixtures de test existantes
ls src/test/fixtures/ 2>/dev/null || ls src/__tests__/fixtures/ 2>/dev/null
```

Rapporte la structure avant de continuer.

---

## User Story (#98)

**En tant qu'utilisateur**, je veux pouvoir créer un nouveau stock ou modifier un stock existant
via une modale, afin de gérer mon inventaire sans quitter la page en cours.

### Critères d'acceptance

- [ ] Mode **create** : formulaire vide, titre "Nouveau stock", bouton "Créer"
- [ ] Mode **edit** : formulaire pré-rempli avec les données du stock, titre "Modifier le stock", bouton "Enregistrer"
- [ ] Champs : `label` (requis), `description` (optionnel), `category` (optionnel)
- [ ] Validation : `label` non vide, message d'erreur visible si soumission invalide
- [ ] Soumission réussie : modale se ferme, liste des stocks se rafraîchit
- [ ] Annulation : modale se ferme sans modification
- [ ] Loading state pendant la soumission (bouton désactivé + spinner)
- [ ] Gestion d'erreur API : message d'erreur affiché dans la modale (pas de toast externe)
- [ ] Accessible : focus sur le premier champ à l'ouverture, Escape ferme la modale, aria-modal

---

## Étape 1 — Types

Vérifier dans `src/types/index.ts` si ces types existent, sinon les ajouter :

```typescript
// Payload pour créer un stock
export interface CreateStockPayload {
  label: string;
  description?: string;
  category?: string;
}

// Payload pour modifier un stock (id requis)
export interface UpdateStockPayload extends CreateStockPayload {
  id: number;
}

// Props de la modale
export type StockFormMode = 'create' | 'edit';

export interface StockFormModalProps {
  mode: StockFormMode;
  stock?: {
    // présent en mode edit, absent en mode create
    id: number;
    label: string;
    description?: string;
    category?: string;
  };
  onSuccess: () => void; // appelé après succès → déclenche le refresh
  onClose: () => void;
}
```

---

## Étape 2 — API layer

Vérifier dans `src/api/stocksAPI.ts` (ou équivalent) si ces fonctions existent.
Les ajouter si absentes, en suivant le pattern `ConfigManager` existant pour les headers auth :

```typescript
// POST /api/v2/stocks
export async function createStock(payload: CreateStockPayload): Promise<Stock> {
  // utiliser le pattern ConfigManager existant pour les headers
  // ex: const headers = ConfigManager.getAuthHeaders()
}

// PUT /api/v2/stocks/:id  (ou PATCH selon le backend)
export async function updateStock(id: number, payload: CreateStockPayload): Promise<Stock> {
  // même pattern
}
```

> Vérifier la méthode HTTP exacte attendue par le back (PUT ou PATCH) dans `docs/openapi.yaml`
> du repo back ou dans les routes existantes. Adapter en conséquence.

---

## Étape 3 — Composant StockFormModal

Créer `src/components/stocks/StockFormModal.tsx` :

### Structure du composant

```tsx
// Squelette — adapter selon les patterns DS existants dans le projet
import { useState, useEffect, useRef } from 'react';
import type { StockFormModalProps, CreateStockPayload } from '@/types';
// Importer les WC du DS
import '@stockhub/design-system';

export function StockFormModal({ mode, stock, onSuccess, onClose }: StockFormModalProps) {
  // State du formulaire
  const [label, setLabel] = useState(stock?.label ?? '');
  const [description, setDescription] = useState(stock?.description ?? '');
  const [category, setCategory] = useState(stock?.category ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus sur le premier champ à l'ouverture
  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Fermeture par Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
    // Validation
    if (!label.trim()) {
      setError('Le nom du stock est requis.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: CreateStockPayload = { label: label.trim(), description, category };
      if (mode === 'create') {
        await createStock(payload);
      } else {
        await updateStock(stock!.id, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === 'create' ? 'Nouveau stock' : 'Modifier le stock';
  const submitLabel = mode === 'create' ? 'Créer' : 'Enregistrer';

  return (
    // Overlay + dialog accessible
    // Utiliser les WC DS (sh-button, sh-input) ou les équivalents React existants
    // selon le pattern déjà utilisé dans le projet
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-form-title"
      // ... styles overlay
    >
      <h2 id="stock-form-title">{title}</h2>

      {/* Champ label */}
      <sh-input
        ref={firstInputRef}
        label="Nom du stock *"
        value={label}
        // ... gestion onChange via event listener WC
        error={error && !label.trim() ? error : undefined}
      />

      {/* Champ description */}
      {/* Champ category */}

      {/* Message d'erreur global */}
      {error && <p role="alert">{error}</p>}

      {/* Actions */}
      <sh-button variant="ghost" onClick={onClose} disabled={isSubmitting}>
        Annuler
      </sh-button>
      <sh-button
        variant="primary"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {submitLabel}
      </sh-button>
    </div>
  );
}
```

> **Important** : les Web Components Lit émettent des événements custom (`sh-input` émet probablement
> un event custom, pas un `onChange` React standard). Vérifier le pattern d'intégration WC déjà
> utilisé dans les composants existants du projet (ex: `StockDetailPage`, `Dashboard`) et reproduire
> le même pattern. Ne pas réinventer.

---

## Étape 4 — Hook useStockForm (optionnel mais recommandé)

Si le projet suit le pattern "logique dans les hooks", extraire la logique de soumission :

```typescript
// src/hooks/useStockForm.ts
export function useStockForm(mode: StockFormMode, stockId?: number) {
  // État formulaire + submit + validation
  // Retourne : { fields, errors, isSubmitting, handleSubmit }
}
```

Seulement si ce pattern est déjà utilisé dans le projet. Sinon, garder tout dans le composant.

---

## Étape 5 — Tests

### Fichier : `src/components/stocks/__tests__/StockFormModal.test.tsx`

Suivre le pattern BDD à deux niveaux `describe` existant dans le projet.

```typescript
describe("StockFormModal", () => {

  describe("when mode is create", () => {
    it("should render with empty fields and 'Nouveau stock' title", ...)
    it("should show error when label is empty on submit", ...)
    it("should call createStock and onSuccess on valid submit", ...)
    it("should call onClose on cancel", ...)
    it("should show loading state during submission", ...)
    it("should show error message on API failure", ...)
  })

  describe("when mode is edit", () => {
    it("should render with pre-filled fields and 'Modifier le stock' title", ...)
    it("should call updateStock with stock id on valid submit", ...)
    it("should not call updateStock when label is cleared", ...)
  })

  describe("accessibility", () => {
    it("should close on Escape key", ...)
    it("should have role=dialog and aria-modal", ...)
  })
})
```

Utiliser les fixtures existantes (`src/test/fixtures/stock.ts`) pour les données de test.
Mocker `createStock` et `updateStock` depuis l'API layer.

```bash
npm run test:run -- StockFormModal
npm run test:coverage -- StockFormModal
```

---

## Étape 6 — Intégration dans le Dashboard (point d'entrée)

Dans `src/pages/Dashboard.tsx` (ou équivalent), ajouter le bouton "Nouveau stock"
qui ouvre la modale en mode create :

```tsx
const [isFormOpen, setIsFormOpen] = useState(false)
const [editingStock, setEditingStock] = useState<Stock | null>(null)

// Ouverture en mode create
<sh-button variant="primary" iconBefore="Plus" onClick={() => setIsFormOpen(true)}>
  Nouveau stock
</sh-button>

// Rendu conditionnel de la modale
{isFormOpen && (
  <StockFormModal
    mode={editingStock ? "edit" : "create"}
    stock={editingStock ?? undefined}
    onSuccess={() => {
      refetchStocks()  // ou équivalent dans le hook useStocks
      setEditingStock(null)
    }}
    onClose={() => {
      setIsFormOpen(false)
      setEditingStock(null)
    }}
  />
)}
```

> `setEditingStock` sera aussi appelé depuis StockDetailPage (#99) via une prop `onEdit`.

---

## Étape 7 — Conventional commit et PR

```bash
git checkout -b feat/stock-form-modal

git add -A
git commit -m "feat(stocks): add StockFormModal component with create and edit modes

- StockFormModal supports create and edit modes
- Validation on label field with inline error
- Loading state and error handling during API calls
- Accessible: aria-modal, Escape to close, focus management
- Tests: XX tests covering both modes and accessibility
- Integrated in Dashboard with 'Nouveau stock' button
- Closes #98"

git push origin feat/stock-form-modal
```

PR titre : `feat(stocks): StockFormModal create + edit — closes #98`

---

## Checklist finale avant PR

- [ ] `npm run type-check` → 0 erreur TypeScript
- [ ] `npm run lint` → 0 warning
- [ ] `npm run test:run` → tous les tests passent
- [ ] `npm run build` → build OK
- [ ] Modale testée manuellement : create, edit, cancel, Escape, erreur API simulée
- [ ] Pattern WC événements cohérent avec le reste du projet
