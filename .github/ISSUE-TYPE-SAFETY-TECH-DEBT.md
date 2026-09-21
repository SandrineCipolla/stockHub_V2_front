# tech-debt: fix remaining type safety issues (stockId, type assertions)

## 🎯 Contexte

Suite à l'audit Type Safety (Issue #23), les types web components ont été corrigés (100% typés).

Cependant, **3 problèmes de types** identifiés dans l'Issue #23 originale (post-merge `feature/ai-business-intelligence`) restent à traiter.

**Référence** : `docs/technical/TYPE-SAFETY-AUDIT-2025-11-18.md` (section "Audit Complémentaire")

---

## ⚠️ Problèmes à Résoudre

### 1. Type `stockId` Inconsistant (Priorité Haute 🔴)

**Problème** : Type union `number | string` utilisé massivement (14 occurrences, 8 fichiers)

**Impact** :

- ⚠️ Comparaisons potentiellement risquées (`1 === "1"` → false)
- ⚠️ Perte de sécurité des types TypeScript
- ⚠️ Incohérence architecturale

**Fichiers concernés** :

- `src/types/stock.ts` (lignes 53, 107, 112)
- `src/types/components.ts` (lignes 55-57, 67-69)
- `src/types/web-component-events.ts` (ligne 57)
- `src/types/web-components.d.ts` (ligne 198)
- `src/utils/mlSimulation.ts` (ligne 40)
- `src/utils/aiPredictions.ts` (ligne 37)
- `src/hooks/useStocks.ts` (lignes 175, 197)
- `src/pages/Dashboard.tsx` (lignes 119, 123, 133)

**Solutions proposées** :

- **Option A** : Tout en `string` (plus flexible, prépare pour UUIDs futurs)
- **Option B** : Tout en `number` (plus performant, cohérent avec backend actuel)

**Effort estimé** : 1-2 heures

---

### 2. Type Assertions `as unknown as` (Priorité Moyenne 🟡)

**Problème** : Perte de sécurité des types pour contourner incompatibilité Event vs React.MouseEvent

**Impact** :

- ⚠️ Contournement du système de types TypeScript
- ⚠️ Peut masquer des bugs à la compilation
- ⚠️ Code smell

**Fichiers concernés** :

- `src/components/common/ButtonWrapper.tsx` (ligne 53)
  ```typescript
  onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
  ```
- `src/components/common/CardWrapper.tsx` (ligne 47)
  ```typescript
  onClick(e as unknown as React.MouseEvent<HTMLElement>);
  ```

**Solutions proposées** :

**Option A** : Créer événement synthétique React

```typescript
const handleClick = (e: Event) => {
  const syntheticEvent = {
    ...e,
    currentTarget: e.target as HTMLButtonElement,
    nativeEvent: e,
  } as React.MouseEvent<HTMLButtonElement>;
  onClick(syntheticEvent);
};
```

**Option B** : Changer signature de onClick

```typescript
interface Props {
  onClick?: (e: Event) => void; // Au lieu de React.MouseEvent
}
```

**Effort estimé** : 30 minutes

---

## 3. Error Handling Duplication (Priorité Basse 🟢 - Optionnel)

**Problème** : Duplication du pattern `error instanceof Error ? error.message : 'Erreur inconnue'`

**Impact** :

- ⚠️ Violation du principe DRY
- ⚠️ Maintenance plus difficile

**Fichiers concernés** :

- `src/pages/Dashboard.tsx`
- `src/utils/mlSimulation.ts`
- `src/hooks/useFrontendState.ts`
- `src/components/dashboard/StockCardWrapper.tsx`

**Solution proposée** : Créer helper réutilisable

```typescript
// src/utils/errors.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Erreur inconnue';
}
```

**Effort estimé** : 15 minutes

---

## 📋 Plan d'Action

### Phase 1 : Type stockId (Priorité Haute)

- [ ] **Décider** : `string` ou `number` pour tous les IDs (discussion architecture)
- [ ] Mettre à jour `src/types/stock.ts` (Stock.id, StockMetadata.id, StockAlert.stockId)
- [ ] Mettre à jour `src/types/components.ts` (callbacks)
- [ ] Mettre à jour `src/types/web-component-events.ts`
- [ ] Mettre à jour `src/types/web-components.d.ts`
- [ ] Mettre à jour `src/utils/mlSimulation.ts`
- [ ] Mettre à jour `src/utils/aiPredictions.ts`
- [ ] Mettre à jour `src/hooks/useStocks.ts`
- [ ] Mettre à jour `src/pages/Dashboard.tsx`
- [ ] **Vérifier** : `npm run type-check` → 0 erreur
- [ ] **Vérifier** : `npm run test:run` → tous les tests passent

### Phase 2 : Type Assertions (Priorité Moyenne)

- [ ] Choisir solution (Option A ou B)
- [ ] Implémenter dans `ButtonWrapper.tsx`
- [ ] Implémenter dans `CardWrapper.tsx`
- [ ] **Vérifier** : Tests des wrappers passent
- [ ] **Vérifier** : Fonctionnalité clics fonctionne (test manuel)

### Phase 3 : Error Handling (Optionnel)

- [ ] Créer `src/utils/errors.ts`
- [ ] Remplacer duplications dans Dashboard.tsx
- [ ] Remplacer duplications dans mlSimulation.ts
- [ ] Remplacer duplications dans useFrontendState.ts
- [ ] Remplacer duplications dans StockCardWrapper.tsx
- [ ] **Vérifier** : Tests passent

---

## 📊 Effort Total Estimé

| Phase                     | Priorité   | Effort   |
| ------------------------- | ---------- | -------- |
| Phase 1 : Type `stockId`  | 🔴 Haute   | 1-2h     |
| Phase 2 : Type assertions | 🟡 Moyenne | 30min    |
| Phase 3 : Error handling  | 🟢 Basse   | 15min    |
| **Total**                 |            | **2-3h** |

---

## ✅ Critères de Validation

- [ ] `npm run type-check` → 0 erreur TypeScript
- [ ] `npm run test:run` → 464+ tests passent
- [ ] `npm run build` → Build réussit
- [ ] Tests manuels clics boutons/cartes fonctionnent
- [ ] Aucune régression fonctionnelle

---

## 🎓 Impact RNCP

**C4.1 - Tests et Qualité Logicielle** :

- Amélioration de la sécurité des types
- Élimination du code smell (`as unknown as`)
- Application du principe DRY

**C2.5 - Décisions Architecturales** :

- Choix justifié `string` vs `number` pour IDs
- Documentation des trade-offs

---

**Labels** : `tech-debt`, `front`, `typescript`
**Priorité** : P2 - Moyenne
**Effort** : 2-3 heures
**Milestone** : Type Safety Improvements

**Référence audit** : `docs/technical/TYPE-SAFETY-AUDIT-2025-11-18.md`
**Issue source** : #23 (partiellement traitée - web components 100% ✅)
