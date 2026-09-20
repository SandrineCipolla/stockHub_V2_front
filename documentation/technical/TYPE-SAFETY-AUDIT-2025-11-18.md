# 🔍 Audit Type Safety - StockHub V2 Frontend

> **Audit des types TypeScript et de la sécurité des types**
> Date: 18 Novembre 2025
> Issue: #23

---

## 📊 Vue d'Ensemble

### Résumé Exécutif

| Métrique                          | Résultat             | Statut        |
| --------------------------------- | -------------------- | ------------- |
| **Erreurs TypeScript**            | 0                    | ✅ Excellent  |
| **Occurrences `any`**             | 2 (tests uniquement) | ✅ Excellent  |
| **Types CustomEvent**             | 11/12 définis        | ⚠️ Bon        |
| **Web Components typés**          | 16/18 définis        | ⚠️ Bon        |
| **Directives `@ts-expect-error`** | 3 (justifiées)       | ⚠️ Acceptable |

**Note globale** : **8.5/10** - Très bonne sécurité des types

---

## ✅ Points Forts

### 1. Quasi-absence de types `any`

**Recherche effectuée** :

```bash
grep -rn ": any\b" src/ --include="*.ts" --include="*.tsx"
# Résultat: 0 occurrence
```

**Occurrences `as any` (2 total)** :

```typescript
// AIAlertBannerWrapper.test.tsx:270 - Test de validation
const invalidSuggestion = { ...criticalSuggestion, priority: 'unknown' as any };

// MetricCardWrapper.test.tsx:133 - Test de validation
<MetricCardWrapper title="Test" value="10" icon="package" color={'purple' as any} />
```

**Évaluation** : ✅ **Excellent** - Ces `as any` sont intentionnels dans les tests pour vérifier la gestion des valeurs invalides.

---

### 2. Types CustomEvent Bien Définis

**Fichier** : `src/types/web-component-events.ts` (109 lignes)

**Types définis (11 événements)** :

#### Search Input Events

```typescript
export interface SearchChangeEventDetail {
  value: string;
}
export type SearchChangeEvent = CustomEvent<SearchChangeEventDetail>;
export type SearchClearEvent = CustomEvent<void>;
```

#### Button & Card Events

```typescript
export type ButtonClickEvent = CustomEvent<void>;
export type CardClickEvent = CustomEvent<void>;
```

#### Metric Card Events

```typescript
export interface MetricClickEventDetail {
  value: number | string;
}
export type MetricClickEvent = CustomEvent<MetricClickEventDetail>;
```

#### Stock Card Events

```typescript
export interface StockCardEventDetail {
  stockId?: number | string;
}
export type StockSessionClickEvent = CustomEvent<StockCardEventDetail>;
export type StockDetailsClickEvent = CustomEvent<StockCardEventDetail>;
export type StockEditClickEvent = CustomEvent<StockCardEventDetail>;
export type StockDeleteClickEvent = CustomEvent<StockCardEventDetail>;
```

#### Footer Events

```typescript
export interface FooterLinkClickEventDetail {
  link: 'mentions-legales' | 'politique-confidentialite' | 'cgu' | 'cookies';
}
export type FooterLinkClickEvent = CustomEvent<FooterLinkClickEventDetail>;
```

#### Header Events

```typescript
export interface ThemeToggleEventDetail {
  previousTheme: string;
  newTheme: string;
}
export type ThemeToggleEvent = CustomEvent<ThemeToggleEventDetail>;

export interface NotificationClickEventDetail {
  count: number;
}
export type NotificationClickEvent = CustomEvent<NotificationClickEventDetail>;

export interface LogoutClickEventDetail {
  userName: string;
}
export type LogoutClickEvent = CustomEvent<LogoutClickEventDetail>;
```

#### IA Alert Banner Events

```typescript
export interface IAAlertItemClickEventDetail {
  product: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}
export type IAAlertItemClickEvent = CustomEvent<IAAlertItemClickEventDetail>;
```

**Évaluation** : ✅ **Excellent** - Types complets avec interfaces et union types.

---

### 3. Type `WebComponentStatus` Réutilisable

**Fichier** : `src/types/web-component-events.ts:16`

```typescript
/**
 * Type de statut accepté par les web components du Design System
 * (format kebab-case)
 */
export type WebComponentStatus = 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
```

**Utilisation** : Cohérence entre tous les composants utilisant des statuts (StockCard, StatusBadge, etc.).

---

## ⚠️ Types Manquants

### 1. Web Components Non Définis (Priorité: Moyenne)

**Fichier** : `src/types/web-components.d.ts`

**Composants manquants (2/18)** :

#### A. `sh-stat-card` ❌

**Utilisation** : `src/components/analytics/StatCard.tsx`

```typescript
// StatCard.tsx:60
return React.createElement('sh-stat-card', {
  label: label,
  value: value.toString(),
  'risk-level': riskLevel,
  'data-theme': theme,
  className: className,
});
```

**Type suggéré** :

```typescript
'sh-stat-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  label?: string;
  value?: string | number;
  'risk-level'?: 'default' | 'critical' | 'high' | 'medium' | 'low';
  selected?: boolean;
  'data-theme'?: 'light' | 'dark';
  'onsh-stat-click'?: (e: CustomEvent) => void;
};
```

---

#### B. `sh-stock-prediction-card` ❌

**Utilisation** : `src/components/ai/StockPrediction.tsx`

```typescript
// StockPrediction.tsx:48
return React.createElement('sh-stock-prediction-card', {
  'stock-id': stockId,
  'stock-name': stockName,
  'risk-level': riskLevel,
  'days-until-rupture': daysUntilRupture,
  'date-of-rupture': dateOfRupture?.toISOString(),
  confidence: confidence,
  'daily-consumption-rate': dailyConsumptionRate,
  'current-quantity': currentQuantity,
  'days-until-rupture-pessimistic': daysUntilRupturePessimistic,
  'days-until-rupture-optimistic': daysUntilRuptureOptimistic,
  'recommended-reorder-date': recommendedReorderDate?.toISOString(),
  'recommended-reorder-quantity': recommendedReorderQuantity,
  'show-details': showDetails,
  'data-theme': theme,
});
```

**Type suggéré** :

```typescript
'sh-stock-prediction-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  'stock-id'?: number | string;
  'stock-name'?: string;
  'risk-level'?: 'critical' | 'high' | 'medium' | 'low';
  'days-until-rupture'?: number;
  'date-of-rupture'?: string; // ISO 8601
  confidence?: number; // 0-100
  'daily-consumption-rate'?: number;
  'current-quantity'?: number;
  'days-until-rupture-pessimistic'?: number;
  'days-until-rupture-optimistic'?: number;
  'recommended-reorder-date'?: string; // ISO 8601
  'recommended-reorder-quantity'?: number;
  'show-details'?: boolean;
  'data-theme'?: 'light' | 'dark';
};
```

---

### 2. Événements Manquants (Priorité: Basse)

**Fichier** : `src/types/web-component-events.ts`

#### A. `sh-stat-click` ❌

**Utilisation** : `src/components/analytics/StatCard.tsx:43`

```typescript
card.addEventListener('sh-stat-click', handleClick);
```

**Type suggéré** :

```typescript
// StatCard Events
export type StatClickEvent = CustomEvent<void>;
```

---

### 3. Directives `@ts-expect-error` (Priorité: Basse)

**Total** : 3 occurrences (toutes justifiées)

#### A. StatCard.tsx:53

```typescript
React.useEffect(() => {
  if (cardRef.current) {
    customElements.whenDefined('sh-stat-card').then(() => {
      if (cardRef.current) {
        // @ts-expect-error - propriété native du web component
        cardRef.current.selected = selected;
      }
    });
  }
}, [selected]);
```

**Raison** : La propriété `selected` est une propriété JavaScript native du web component `sh-stat-card`, pas un attribut HTML. TypeScript ne peut pas la typer via `HTMLAttributes`.

**Solution possible** : Créer une interface étendue pour le web component.

---

#### B. SearchInputWrapper.tsx:99

```typescript
React.useEffect(() => {
  if (searchInputRef.current) {
    customElements.whenDefined('sh-search-input').then(() => {
      if (searchInputRef.current) {
        // @ts-expect-error - propriété native du web component
        searchInputRef.current.value = value;
      }
    });
  }
}, [value]);
```

**Raison** : Idem - propriété JavaScript native.

---

#### C. StockCardWrapper.tsx:47

```typescript
React.useEffect(() => {
  if (cardRef.current) {
    customElements.whenDefined('sh-stock-card').then(() => {
      if (cardRef.current) {
        // @ts-expect-error - propriété native du web component
        cardRef.current.percentage = percentage;
      }
    });
  }
}, [percentage]);
```

**Raison** : Idem - propriété JavaScript native.

---

## 🎯 Recommandations Priorisées

### Priorité 1 : Haute (Impact: Fort, Effort: Faible)

#### ✅ Ajouter définitions `sh-stat-card` et `sh-stock-prediction-card`

**Fichier** : `src/types/web-components.d.ts`

**Bénéfices** :

- Autocomplétion IDE pour ces composants
- Détection d'erreurs de props à la compilation
- Documentation inline des props disponibles

**Effort estimé** : **10 minutes**

**Code à ajouter** : Voir section "Types Manquants" ci-dessus.

---

### Priorité 2 : Moyenne (Impact: Moyen, Effort: Très Faible)

#### ✅ Ajouter type `StatClickEvent`

**Fichier** : `src/types/web-component-events.ts`

**Bénéfices** :

- Cohérence avec les autres événements
- Type safety pour les event listeners

**Effort estimé** : **2 minutes**

**Code à ajouter** :

```typescript
// ============================================
// Stat Card Events
// ============================================

export type StatClickEvent = CustomEvent<void>;
```

---

### Priorité 3 : Basse (Impact: Faible, Effort: Moyen)

#### ⚠️ Étendre les types pour propriétés natives web components

**Problème** : Les propriétés JavaScript natives (ex: `selected`, `value`) ne sont pas typées.

**Solutions possibles** :

**Option A** : Créer interfaces étendues pour chaque web component

```typescript
interface ShStatCardElement extends HTMLElement {
  selected: boolean;
  label: string;
  value: string;
  riskLevel: 'default' | 'critical' | 'high' | 'medium' | 'low';
}

declare global {
  interface HTMLElementTagNameMap {
    'sh-stat-card': ShStatCardElement;
  }
}
```

**Option B** : Utiliser `@ts-expect-error` avec commentaire explicatif (solution actuelle)

**Recommandation** : **Conserver solution actuelle** (@ts-expect-error avec commentaire).

**Raison** :

- Effort élevé (créer interfaces pour 18 web components)
- Bénéfice marginal (seulement 3 occurrences)
- Risque de désynchronisation avec le Design System
- Commentaires `@ts-expect-error` sont explicatifs et acceptables

---

## 📈 Impact RNCP

### C4.1 - Tests et Qualité Logicielle

**Points positifs** :

- ✅ Mode strict TypeScript activé
- ✅ 0 erreur de compilation
- ✅ Types `any` quasi-absents (seulement tests)
- ✅ Types CustomEvent bien définis
- ✅ Directives `@ts-expect-error` documentées

**Démonstration** :

- Maîtrise du système de types TypeScript
- Approche pragmatique (trade-off effort/bénéfice)
- Documentation des choix techniques

---

### C2.5 - Décisions Architecturales

**Justification des choix** :

1. **Utilisation de `@ts-expect-error` au lieu d'interfaces étendues**
   - Pragmatisme : 3 occurrences vs effort de typer 18 composants
   - Maintenabilité : Évite désynchronisation avec Design System externe
   - Clarté : Commentaires explicites

2. **Fichiers séparés pour types web components**
   - `web-components.d.ts` : Définitions JSX
   - `web-component-events.ts` : Types événements
   - Séparation des responsabilités claire

---

## 📝 Plan d'Action (Optionnel)

### Actions Recommandées

#### 1. Ajouter types manquants (Priorité 1)

**Issue à créer** : "Add TypeScript definitions for sh-stat-card and sh-stock-prediction-card"

**Fichiers à modifier** :

- `src/types/web-components.d.ts`
- `src/types/web-component-events.ts`

**Temps estimé** : 15 minutes

**Bénéfices** :

- Autocomplétion IDE complète
- 18/18 web components typés (100%)

---

#### 2. Documentation types (Priorité 2)

**Documenter** :

- Pourquoi certaines propriétés utilisent `@ts-expect-error`
- Lien vers documentation Design System pour référence des props

**Fichier** : `documentation/2-WEB-COMPONENTS-GUIDE.md`

**Temps estimé** : 10 minutes

---

## 📊 Métriques Finales

### Avant Audit (Estimé)

| Métrique             | Valeur      |
| -------------------- | ----------- |
| Web Components typés | 16/18 (89%) |
| Événements typés     | 11/12 (92%) |
| Types `any`          | 2 (tests)   |
| Erreurs TypeScript   | 0           |

### Après Corrections (Si appliquées)

| Métrique             | Valeur       | Delta |
| -------------------- | ------------ | ----- |
| Web Components typés | 18/18 (100%) | +11%  |
| Événements typés     | 12/12 (100%) | +8%   |
| Types `any`          | 2 (tests)    | =     |
| Erreurs TypeScript   | 0            | =     |

---

## 🎓 Conclusion

### Évaluation Globale : **8.5/10**

**Points forts** :

- ✅ Excellent respect du mode strict TypeScript
- ✅ Quasi-absence de types `any`
- ✅ Types CustomEvent complets et bien structurés
- ✅ 0 erreur de compilation

**Points d'amélioration** :

- ⚠️ 2 web components sans définition TypeScript (11% du total)
- ⚠️ 1 événement manquant (8% du total)
- ⚠️ 3 directives `@ts-expect-error` (justifiées mais documentables)

**Recommandation** :
Le niveau de sécurité des types est **excellent**. Les améliorations suggérées sont **optionnelles** et ont un impact limité. Le projet peut continuer en l'état sans risque.

**Prochaines étapes** :

1. **Optionnel** : Ajouter types manquants (15 min)
2. **Optionnel** : Documenter `@ts-expect-error` dans guide web components
3. **Recommandé** : Fermer Issue #23 avec ce rapport

---

## ✅ Corrections Appliquées (18 Novembre 2025)

### Branche : `feat/type-safety-improvements`

**Fichiers modifiés** : 3 fichiers

#### 1. `src/types/web-components.d.ts`

**Ajouté `sh-stat-card`** (lignes 117-124) :

```typescript
'sh-stat-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  label?: string;
  value?: string | number;
  'risk-level'?: 'default' | 'critical' | 'high' | 'medium' | 'low';
  selected?: boolean;
  'data-theme'?: 'light' | 'dark';
  'onsh-stat-click'?: (e: CustomEvent) => void;
};
```

**Ajouté `sh-stock-prediction-card`** (lignes 194-212) :

```typescript
'sh-stock-prediction-card': React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  'stock-id'?: number | string;
  'stock-name'?: string;
  'risk-level'?: 'critical' | 'high' | 'medium' | 'low';
  'days-until-rupture'?: number;
  'date-of-rupture'?: string;
  confidence?: number;
  'daily-consumption-rate'?: number;
  'current-quantity'?: number;
  'days-until-rupture-pessimistic'?: number;
  'days-until-rupture-optimistic'?: number;
  'recommended-reorder-date'?: string;
  'recommended-reorder-quantity'?: number;
  'show-details'?: boolean;
  'data-theme'?: 'light' | 'dark';
};
```

---

#### 2. `src/types/web-component-events.ts`

**Ajouté `StatClickEvent`** (lignes 98-102) :

```typescript
// ============================================
// Stat Card Events
// ============================================

export type StatClickEvent = CustomEvent<void>;
```

---

#### 3. `documentation/0-INDEX.md`

**Ajouté référence au rapport d'audit** (ligne 90) :

```markdown
- [TYPE-SAFETY-AUDIT-2025-11-18.md](./TYPE-SAFETY-AUDIT-2025-11-18.md) - Audit TypeScript & sécurité des types
```

---

### Vérifications Effectuées

| Check          | Commande             | Résultat                              |
| -------------- | -------------------- | ------------------------------------- |
| **TypeScript** | `npm run type-check` | ✅ 0 erreur                           |
| **Tests**      | `npm run test:run`   | ✅ 464 passed, 33 skipped (497 total) |
| **Build**      | `npm run build`      | ✅ 7.04s, 106.19 KB gzipped           |

---

### Métriques Après Corrections (Réelles)

| Métrique                 | Avant       | Après            | Amélioration |
| ------------------------ | ----------- | ---------------- | ------------ |
| **Web Components typés** | 16/18 (89%) | **18/18 (100%)** | ✅ **+11%**  |
| **Événements typés**     | 11/12 (92%) | **12/12 (100%)** | ✅ **+8%**   |
| **Types `any`**          | 2 (tests)   | 2 (tests)        | =            |
| **Erreurs TypeScript**   | 0           | 0                | =            |

---

### Note Finale : **9.5/10** ⬆️ (+1.0)

**Justification de l'amélioration** :

- ✅ 100% des web components désormais typés
- ✅ 100% des événements désormais typés
- ✅ Autocomplétion IDE complète pour tous les composants
- ✅ Détection d'erreurs de props à la compilation
- ✅ 0 erreur TypeScript maintenue

**Statut** : ✅ **Audit Web Components complété et corrections appliquées**

**Reste à faire (Optionnel - Priorité 3)** :

- ⚠️ Documenter `@ts-expect-error` dans `2-WEB-COMPONENTS-GUIDE.md` (10 min)
- ⚠️ Impact minimal, peut être fait ultérieurement

---

## 📋 Audit Complémentaire - Tech Debt Issue #23

> **Contexte** : L'Issue #23 originale mentionnait d'autres problèmes de types (post-merge `feature/ai-business-intelligence`). Voici un audit rapide de ces points.

### 1. Type `stockId` Inconsistant ⚠️

**Problème** : Type union `number | string` utilisé massivement

**Occurrences trouvées** : **14 occurrences** dans **8 fichiers**

| Fichier                             | Lignes        | Type                                                             |
| ----------------------------------- | ------------- | ---------------------------------------------------------------- |
| `src/types/stock.ts`                | 53, 107, 112  | `id` et `stockId`                                                |
| `src/types/components.ts`           | 55-57, 67-69  | Callbacks (onView, onEdit, onDelete)                             |
| `src/types/web-component-events.ts` | 57            | `StockCardEventDetail.stockId`                                   |
| `src/types/web-components.d.ts`     | 198           | `sh-stock-prediction-card['stock-id']`                           |
| `src/utils/mlSimulation.ts`         | 40            | `StockPrediction.stockId`                                        |
| `src/utils/aiPredictions.ts`        | 37            | `AISuggestion.stockId`                                           |
| `src/hooks/useStocks.ts`            | 175, 197      | Fonctions deleteStock, deleteMultipleStocks                      |
| `src/pages/Dashboard.tsx`           | 119, 123, 133 | Handlers (handleDeleteStock, handleUpdateStock, handleViewStock) |

**Impact** :

- ⚠️ Comparaisons potentiellement risquées (`1 === "1"` → false)
- ⚠️ Perte de sécurité des types
- ⚠️ Incohérence architecturale

**Solution recommandée** :
Choisir **UN SEUL type** pour tous les IDs :

- **Option A** : Tout en `string` (plus flexible, prépare pour UUIDs futurs)
- **Option B** : Tout en `number` (plus performant, cohérent avec backend actuel)

**Effort estimé** : **1-2 heures** (refactoring + tests)

---

### 2. Type Assertions `as unknown as` ⚠️

**Problème** : Perte de sécurité des types pour contourner incompatibilité Event vs React.MouseEvent

**Occurrences trouvées** : **2 en production** (1 en test acceptable)

| Fichier                                         | Ligne | Code                                                           |
| ----------------------------------------------- | ----- | -------------------------------------------------------------- |
| `src/components/common/ButtonWrapper.tsx`       | 53    | `onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)` |
| `src/components/common/CardWrapper.tsx`         | 47    | `onClick(e as unknown as React.MouseEvent<HTMLElement>)`       |
| `src/hooks/__tests__/useFrontendState.test.tsx` | 29    | ✅ Test (acceptable)                                           |

**Impact** :

- ⚠️ Contournement du système de types TypeScript
- ⚠️ Peut masquer des bugs à la compilation
- ⚠️ Code smell

**Solutions propres** :

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

**Effort estimé** : **30 minutes** (2 fichiers + tests)

---

### 3. Error Handling (Optionnel) ℹ️

**Problème** : Duplication du pattern `error instanceof Error ? error.message : 'Erreur inconnue'`

**Occurrences trouvées** : **4 fichiers**

- `src/pages/Dashboard.tsx`
- `src/utils/mlSimulation.ts`
- `src/hooks/useFrontendState.ts`
- `src/components/dashboard/StockCardWrapper.tsx`

**Solution** : Créer helper réutilisable

```typescript
// src/utils/errors.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Erreur inconnue';
}
```

**Effort estimé** : **15 minutes** (création helper + remplacement)

---

### Résumé Tech Debt Restant

| Point                              | Priorité   | Effort | Impact                |
| ---------------------------------- | ---------- | ------ | --------------------- |
| 1. Type `stockId` inconsistant     | 🔴 Haute   | 1-2h   | Fort (sécurité types) |
| 2. Type assertions `as unknown as` | 🟡 Moyenne | 30min  | Moyen (code smell)    |
| 3. Error handling duplication      | 🟢 Basse   | 15min  | Faible (DRY)          |

**Total effort estimé** : **2-3 heures**

**Recommandation** : Créer **nouvelle issue** pour traiter ces points séparément.

---

**Date audit web components** : 18 Novembre 2025
**Date corrections web components** : 18 Novembre 2025
**Date audit tech debt** : 18 Novembre 2025
**Auteure** : Sandrine Cipolla
**Version Frontend** : v1.1.0
**Version Design System** : v1.3.1
