# Issues à Créer Suite à l'Intégration CRUD Backend

**Date**: 2026-01-07
**Context**: Après implémentation des endpoints PATCH/DELETE et intégration backend
**Issues liées**: #74 (backend), #57 (frontend)

---

## Backend Repository (stockhub_back)

### Issue 1: [OPTIONAL] Implémenter CASCADE DELETE dans le schéma Prisma

**Title**: `chore: implement CASCADE DELETE in Prisma schema for stocks-items relation`

**Labels**: `enhancement`, `database`, `low-priority`

**Description**:
Actuellement, la relation `stocks` ↔ `items` utilise `onDelete: NoAction` dans le schéma Prisma, ce qui nécessite une suppression manuelle des items avant de supprimer un stock.

**Situation actuelle**:

```prisma
model items {
  stocks  stocks? @relation(fields: [STOCK_ID], references: [ID], onDelete: NoAction, onUpdate: NoAction)
}
```

**Code actuel (workaround)**:

```typescript
// Dans PrismaStockCommandRepository.deleteStock()
await this.prisma.items.deleteMany({ where: { STOCK_ID: stockId } });
await this.prisma.stocks.delete({ where: { ID: stockId } });
```

**Proposition**:

```prisma
model items {
  stocks  stocks? @relation(fields: [STOCK_ID], references: [ID], onDelete: Cascade, onUpdate: NoAction)
}
```

**Avantages**:

- Simplification du code (pas besoin de suppression manuelle)
- Garantie de cohérence au niveau base de données
- Comportement standard SQL CASCADE

**Inconvénients**:

- Nécessite une migration Prisma
- Peut impacter d'autres parties du code

**Décision**: À discuter avec l'équipe. Le workaround actuel fonctionne correctement.

**Fichiers concernés**:

- `prisma/schema.prisma`
- `src/infrastructure/stock-management/manipulation/repositories/PrismaStockCommandRepository.ts`

---

### Issue 2: Décider de l'architecture quantity/value pour les Stocks

**Title**: `discussion: decide architecture for Stock quantity and value properties`

**Labels**: `discussion`, `architecture`, `DDD`, `enhancement`

**Description**:
Actuellement, l'entité Stock backend ne possède que les propriétés de base (`id`, `label`, `description`, `category`). Les propriétés `quantity` et `value` ne sont pas présentes.

**Question architecturale**: Doit-on ajouter `quantity` et `value` au niveau Stock?

**Option A: Stock = Conteneur Simple (recommandé)**

- Stock n'a que: id, label, description, category
- Quantity/value sont gérés au niveau Item
- Calculs dérivés si nécessaires (somme des items)

**Avantages**:

- ✅ Séparation claire des responsabilités
- ✅ Pas de duplication de données
- ✅ Cohérence garantie (source unique de vérité = items)

**Inconvénients**:

- ❌ Calculs nécessaires pour obtenir quantity/value globaux
- ❌ Peut être moins performant si beaucoup d'items

**Option B: Ajouter des Propriétés Calculées**

- Stock retourne quantity/value calculés depuis items
- Ajout de méthodes/getters dans l'entité Stock

**Avantages**:

- ✅ API simple pour le frontend
- ✅ Pas de stockage redondant

**Inconvénients**:

- ❌ Calculs à chaque requête GET
- ❌ Complexité dans les getters

**Option C: Ajouter des Propriétés Stockées**

- Ajouter `quantity` et `value` en DB
- Mettre à jour via triggers ou logique applicative

**Avantages**:

- ✅ Performance optimale (pas de calculs)

**Inconvénients**:

- ❌ Duplication de données
- ❌ Risque de désynchronisation
- ❌ Complexité de maintien de cohérence

**Recommandation**: **Option A** - Garder Stock comme conteneur simple et laisser le frontend calculer si nécessaire.

**Impact**:

- Frontend (déjà implémenté): mapper avec valeurs par défaut
- Backend: aucun changement si Option A choisie

**Documentation**:

- `docs/technical/frontend-v2-integration.md` (section Limitations)
- Frontend: `documentation/INTEGRATION_BACKEND_SESSION.md`

---

## Frontend Repository (stockHub_V2_front)

### Issue 3: Implémenter les formulaires UI pour l'édition de stocks

**Title**: `feat: implement stock edit form UI with modal or dedicated page`

**Labels**: `enhancement`, `ui`, `forms`, `user-story`

**Description**:
Actuellement, le bouton "Edit" sur les cartes de stocks n'a pas d'interface utilisateur associée. Il faut créer un formulaire pour permettre l'édition des stocks.

**User Story**:
En tant qu'utilisateur, je veux pouvoir éditer un stock existant (label, description, category) via une interface graphique.

**Comportement actuel**:

- Clic sur "Edit" → visuellement rien ne se passe
- L'API PATCH fonctionne (testé via console)

**Comportement attendu**:

- Clic sur "Edit" → Ouvre un modal ou redirige vers une page d'édition
- Formulaire pré-rempli avec les données actuelles du stock
- Validation frontend avant envoi
- Appel à `StocksAPI.updateStock()` au submit
- Feedback visuel (succès/erreur)
- Refresh automatique de la liste après modification

**Champs éditables** (selon backend actuel):

- ✅ `label` (string, required)
- ✅ `description` (string, optional)
- ✅ `category` (string, optional)
- ❌ `quantity`, `value` - Non supportés par le backend actuellement

**Suggestions d'implémentation**:

1. **Option A: Modal** (recommandé pour UX simple)
   - Composant `<EditStockModal>`
   - S'ouvre au-dessus de la page actuelle
   - Design cohérent avec le Design System

2. **Option B: Page dédiée**
   - Route `/stocks/:id/edit`
   - Formulaire complet avec plus d'options
   - Navigation avec React Router

**Composants à créer**:

- `components/forms/StockForm.tsx` (formulaire réutilisable)
- `components/modals/EditStockModal.tsx` (wrapper modal)
- Validation avec react-hook-form ou similaire (optionnel)

**API utilisée**:

- `StocksAPI.updateStock(data)` (déjà implémenté)
- PATCH /api/v2/stocks/:id

**Fichiers concernés**:

- `src/components/stock/StockCardWrapper.tsx` (ajouter handler)
- `src/hooks/useStocks.ts` (updateStock déjà implémenté)
- Nouveaux composants de formulaire

**Tests à ajouter**:

- [ ] Test unitaire du formulaire
- [ ] Test de validation des champs
- [ ] Test d'intégration avec l'API

**Design**:

- Utiliser les composants du Design System (`<sh-input>`, `<sh-button>`)
- Suivre les guidelines RGAA pour l'accessibilité

---

### Issue 4: Ajouter modal de confirmation avant suppression de stock

**Title**: `feat: add confirmation modal before deleting stock with items warning`

**Labels**: `enhancement`, `ui`, `safety`, `user-story`

**Description**:
Actuellement, la suppression d'un stock se fait sans confirmation. Il faut ajouter un modal de confirmation pour éviter les suppressions accidentelles, et avertir l'utilisateur que les items associés seront également supprimés.

**User Story**:
En tant qu'utilisateur, je veux avoir une confirmation avant de supprimer un stock, avec un avertissement clair que tous les items associés seront également supprimés.

**Comportement actuel**:

- Clic sur "Delete" → Suppression immédiate
- Aucun avertissement sur les items associés

**Comportement attendu**:

```
┌─────────────────────────────────────────┐
│ ⚠️ Confirmer la suppression             │
│                                          │
│ Êtes-vous sûr de vouloir supprimer le   │
│ stock "Café Arabica Premium" ?          │
│                                          │
│ ⚠️ ATTENTION: Cette action supprimera   │
│ également tous les items associés à ce  │
│ stock (3 items).                         │
│                                          │
│ Cette action est irréversible.          │
│                                          │
│  [Annuler]  [Supprimer définitivement]  │
└─────────────────────────────────────────┘
```

**Fonctionnalités**:

- ✅ Afficher le nom du stock à supprimer
- ✅ Compter et afficher le nombre d'items associés (si disponible)
- ✅ Avertissement clair sur le caractère irréversible
- ✅ Bouton "Supprimer" en rouge pour signaler le danger
- ✅ Bouton "Annuler" pour fermer le modal
- ✅ Échap ou clic à l'extérieur ferme le modal (annulation)

**Composants à créer**:

- `components/modals/ConfirmDeleteModal.tsx`
- Props: `{ stockName, itemsCount, onConfirm, onCancel }`

**API utilisée**:

- `StocksAPI.deleteStock(id)` (déjà implémenté)
- DELETE /api/v2/stocks/:id (avec cascade delete des items)

**Fichiers concernés**:

- `src/components/stock/StockCardWrapper.tsx` (ajouter modal)
- `src/hooks/useStocks.ts` (deleteStock déjà implémenté)

**Design**:

- Utiliser `<sh-button variant="danger">` du Design System
- Modal accessible (ARIA, focus trap)
- Animation d'entrée/sortie (Framer Motion)

**Tests à ajouter**:

- [ ] Test d'affichage du modal
- [ ] Test de confirmation → suppression effective
- [ ] Test d'annulation → modal fermé, stock non supprimé
- [ ] Test accessibilité (navigation clavier, Échap)

**Documentation**:

- Documenter le comportement CASCADE DELETE dans les comments

---

### Issue 5: Améliorer le formatage de la date lastUpdate

**Title**: `feat: format lastUpdate date with relative time display ("il y a X temps")`

**Labels**: `enhancement`, `ui`, `i18n`, `nice-to-have`

**Description**:
Actuellement, `lastUpdate` affiche une date ISO brute (`2026-01-07T14:32:03.172Z`). Il faut formater cette date de manière plus lisible avec un format relatif.

**Comportement actuel**:

```
Nouveau Stock
Mis à jour il y a 2026-01-07T14:32:03.172Z
```

**Comportement attendu**:

```
Nouveau Stock
Mis à jour il y a 5 minutes
```

```
Café Arabica
Mis à jour il y a 2 heures
```

```
Thé Vert
Mis à jour il y a 3 jours
```

**Formats suggérés**:

- < 1 minute: "À l'instant"
- < 1 heure: "Il y a X minutes"
- < 24 heures: "Il y a X heures"
- < 7 jours: "Il y a X jours"
- \>= 7 jours: "Le DD/MM/YYYY"

**Bibliothèques suggérées**:

1. **date-fns** (recommandé - léger)

   ```bash
   npm install date-fns
   ```

   ```typescript
   import { formatDistanceToNow } from 'date-fns';
   import { fr } from 'date-fns/locale';

   formatDistanceToNow(new Date(lastUpdate), {
     addSuffix: true,
     locale: fr,
   });
   // → "il y a 5 minutes"
   ```

2. **dayjs** (alternative)
   ```bash
   npm install dayjs
   ```

**Composants à créer**:

- `utils/dateFormatting.ts` (fonction utilitaire)
  ```typescript
  export function formatRelativeTime(isoDate: string): string {
    return formatDistanceToNow(new Date(isoDate), {
      addSuffix: true,
      locale: fr,
    });
  }
  ```

**Fichiers concernés**:

- `src/components/stock/StockCard.tsx` ou similaire
- Tous les endroits où `lastUpdate` est affiché

**Tests à ajouter**:

- [ ] Test formatage "il y a X minutes"
- [ ] Test formatage "il y a X heures"
- [ ] Test formatage "il y a X jours"
- [ ] Test formatage date absolue pour anciennes dates

**Accessibilité**:

- Ajouter un attribut `title` avec la date complète au format long
  ```html
  <span title="7 janvier 2026 à 14:32">il y a 5 minutes</span>
  ```

**i18n (futur)**:

- Prévoir l'internationalisation si support multi-langues

---

### Issue 6: Fix refresh automatique de la liste après update/delete

**Title**: `bug: stock list doesn't auto-refresh after update/delete without page reload`

**Labels**: `bug`, `state-management`, `user-experience`

**Description**:
Actuellement, après une mise à jour (PATCH) ou une suppression (DELETE) d'un stock, la liste des stocks ne se rafraîchit pas automatiquement. L'utilisateur doit recharger manuellement la page (F5) pour voir les changements.

**Comportement actuel**:

1. User clique "Edit" → modifie stock → Save
2. API PATCH réussit (200 OK)
3. `useStocks` met à jour l'état local: `setStocks(updatedStocks)`
4. ❌ L'UI ne se met pas à jour
5. User recharge la page → ✅ Changements visibles

**Comportement attendu**:

1. User clique "Edit" → modifie stock → Save
2. API PATCH réussit (200 OK)
3. `useStocks` met à jour l'état local
4. ✅ L'UI se rafraîchit immédiatement

**Fichiers concernés**:

- `src/hooks/useStocks.ts` (lignes 148-151 pour update, 186-187 pour delete)
- Composants qui consomment `useStocks`

**Code actuel (update)**:

```typescript
// src/hooks/useStocks.ts:148-151
const updatedStocks = stocks.map(stock => (stock.id === updateData.id ? updatedStock : stock));
setStocks(updatedStocks);
```

**Code actuel (delete)**:

```typescript
// src/hooks/useStocks.ts:186-187
const updatedStocks = stocks.filter(stock => stock.id !== stockId);
setStocks(updatedStocks);
```

**Hypothèses de cause**:

1. Problème de référence immutable (React ne détecte pas le changement)
2. Problème de propagation du contexte React
3. Composants ne réagissent pas au changement d'état
4. Cache localStorage interfère

**Debugging suggéré**:

```typescript
// Ajouter des logs pour tracer le problème
console.log('Before update:', stocks);
setStocks(updatedStocks);
console.log('After update:', updatedStocks);
```

**Solutions possibles**:

1. **Forcer un re-render** avec `React.useState` key change
2. **Utiliser une librairie de state management** (Zustand, Jotai)
3. **Ajouter un `useEffect` trigger** sur les modifications
4. **Invalider le cache** et recharger depuis l'API

**Tests à ajouter**:

- [ ] Test: update stock → vérifier que la liste se rafraîchit
- [ ] Test: delete stock → vérifier que le stock disparaît
- [ ] Test: vérifier que `setStocks` déclenche un re-render

**Priority**: High (impact utilisateur majeur)

---

### Issue 7: Simplifier le type CreateStockData selon décision architecture

**Title**: `refactor: simplify CreateStockData type to match backend limitations`

**Labels**: `refactor`, `types`, `technical-debt`, `blocked`

**Description**:
Le type `CreateStockData` frontend contient de nombreuses propriétés que le backend n'accepte pas. Il faut simplifier ce type pour refléter la réalité de l'API backend.

**⚠️ Blocked by**: Issue #2 (Backend - Décision architecture quantity/value)

**Type actuel** (`src/types/stock.ts`):

```typescript
export interface CreateStockData {
  label: string;
  quantity: number; // ❌ Non supporté par backend
  unit?: StockUnit; // ❌ Non supporté
  value: number; // ❌ Non supporté
  description?: string; // ✅ Supporté
  category?: string; // ✅ Supporté
  supplier?: string; // ❌ Non supporté
  minThreshold?: number; // ❌ Non supporté
  maxThreshold?: number; // ❌ Non supporté
}
```

**Type proposé (Option A - si backend reste simple)**:

```typescript
export interface CreateStockData {
  label: string; // Obligatoire
  description?: string; // Optionnel
  category?: string; // Optionnel, défaut: 'alimentation'
}

// Propriétés retirées car non supportées par backend:
// quantity, unit, value, supplier, minThreshold, maxThreshold
```

**Type proposé (Option B - si backend implémente quantity/value)**:

```typescript
export interface CreateStockData {
  label: string;
  description?: string;
  category?: string;
  quantity?: number; // Ajouté dans backend
  value?: number; // Ajouté dans backend
  // Toujours pas: unit, supplier, minThreshold, maxThreshold
}
```

**Impact**:

- Fichiers concernés:
  - `src/types/stock.ts`
  - `src/hooks/useStocks.ts` (validation à ajuster)
  - `src/services/api/stocksAPI.ts` (déjà adapté)
  - Tous les formulaires de création de stock

**Migration**:
Si Option A choisie, les formulaires existants doivent être modifiés pour ne plus demander `quantity` et `value` lors de la création.

**Alternative**:
Garder le type actuel mais documenter clairement que certaines propriétés sont ignorées.

**Décision à prendre**:
Attendre la résolution de l'Issue #2 (Backend) avant de procéder.

---

## Résumé des Issues

### Backend (stockhub_back)

1. ⚪ **OPTIONAL**: Implémenter CASCADE DELETE dans Prisma
2. 🔴 **DISCUSSION**: Décider architecture quantity/value

### Frontend (stockHub_V2_front)

3. 🟢 **ENHANCEMENT**: Formulaires UI pour édition de stocks
4. 🟢 **ENHANCEMENT**: Modal de confirmation avant suppression
5. 🟡 **NICE-TO-HAVE**: Formatage date relative ("il y a X temps")
6. 🔴 **BUG**: Fix refresh automatique après update/delete
7. 🟡 **REFACTOR**: Simplifier CreateStockData (bloqué par #2)

**Priorités**:

1. 🔴 Issue #6 (Bug refresh) - High priority
2. 🔴 Issue #2 (Architecture) - Blocking
3. 🟢 Issue #3 (Formulaires) - User-facing
4. 🟢 Issue #4 (Confirmation modal) - Safety
5. 🟡 Issue #5 (Date formatting) - UX improvement
6. 🟡 Issue #7 (Refactor types) - Technical debt
7. ⚪ Issue #1 (CASCADE DELETE) - Optional optimization

---

**Date de création**: 2026-01-07
**Auteur**: Session d'intégration CRUD Backend
**Branches concernées**: `feat/issue-74-crud-endpoints` (backend), `feat/backend-integration` (frontend)
