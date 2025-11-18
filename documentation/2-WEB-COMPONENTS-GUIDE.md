# Guide d'Utilisation des Web Components du Design System

> Guide pratique pour intégrer les web components du StockHub Design System dans React

## 📋 Table des matières

- [Introduction](#introduction)
- [Pattern Recommandé](#pattern-recommandé)
- [Gestion du Thème](#gestion-du-thème)
- [Événements Custom](#événements-custom)
- [Propriétés Booléennes](#propriétés-booléennes)
- [Exemples Complets](#exemples-complets)
- [Bonnes Pratiques](#bonnes-pratiques)
- [Troubleshooting](#troubleshooting)

---

## Introduction

Le StockHub Design System est basé sur des **Web Components** construits avec Lit Element. Pour les utiliser dans React, il faut suivre certaines conventions spécifiques.

### Installation

```bash
npm install github:SandrineCipolla/stockhub_design_system#v1.3.1
```

### Import Global

Dans `main.tsx` :

```typescript
import '@stockhub/design-system/dist/index.js';
import '@stockhub/design-system/dist/tokens/design-tokens.css';
```

---

## Pattern Recommandé

### ✅ Pattern React.createElement() (RECOMMANDÉ)

C'est le pattern utilisé par tous les wrappers du projet. Il garantit un fonctionnement optimal.

```typescript
import React, { useRef, useEffect } from 'react';

export const MyComponent: React.FC<Props> = ({ theme, selected, onClick }) => {
  const componentRef = useRef<HTMLElement>(null);

  // Gestion des événements
  useEffect(() => {
    const handleClick = () => {
      onClick?.();
    };

    const element = componentRef.current;
    if (element) {
      element.addEventListener('sh-custom-event', handleClick);
      return () => element.removeEventListener('sh-custom-event', handleClick);
    }
  }, [onClick]);

  // Gestion des propriétés booléennes
  useEffect(() => {
    if (componentRef.current) {
      customElements.whenDefined('sh-component-name').then(() => {
        if (componentRef.current) {
          // @ts-expect-error - propriété native du web component
          componentRef.current.selected = selected;
        }
      });
    }
  }, [selected]);

  return React.createElement('sh-component-name', {
    ref: componentRef,
    'data-theme': theme,
    attribute: 'value',
    className: 'custom-class',
  });
};
```

### ❌ Pattern JSX (NON RECOMMANDÉ)

```typescript
// ❌ Ne pas faire - peut causer des problèmes de rendu
return (
  <sh-component-name
    data-theme={theme}
    attribute="value"
  />
);
```

**Problèmes rencontrés avec JSX :**

- Les propriétés booléennes ne passent pas correctement
- Le thème peut ne pas s'appliquer
- Comportement incohérent avec les événements custom

---

## Gestion du Thème

### Attribut data-theme

Tous les composants du Design System supportent le thème via l'attribut `data-theme`.

```typescript
import { useTheme } from '@/hooks/useTheme';

export const MyComponent: React.FC = () => {
  const { theme } = useTheme(); // 'light' | 'dark'

  return React.createElement('sh-component-name', {
    'data-theme': theme,
    // ... autres props
  });
};
```

### Hook useTheme

```typescript
// src/hooks/useTheme.tsx
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
};
```

---

## Événements Custom

Les web components émettent des événements custom qu'il faut écouter avec `addEventListener`.

### Pattern d'Écoute

```typescript
useEffect(() => {
  const handleEvent = (e: Event) => {
    const customEvent = e as CustomEvent;
    const { detail } = customEvent;

    console.log('Event detail:', detail);
    onCustomAction?.(detail);
  };

  const element = componentRef.current;
  if (element) {
    element.addEventListener('sh-custom-event', handleEvent);
    return () => element.removeEventListener('sh-custom-event', handleEvent);
  }
}, [onCustomAction]);
```

### Événements Disponibles

| Composant                  | Événement             | Detail                                  |
| -------------------------- | --------------------- | --------------------------------------- |
| `sh-stat-card`             | `sh-stat-click`       | `{ label, value, riskLevel, selected }` |
| `sh-stock-prediction-card` | `sh-prediction-click` | `{ stockId, stockName, riskLevel }`     |
| `sh-button`                | `sh-click`            | `{ disabled, loading }`                 |

---

## Propriétés Booléennes

Les propriétés booléennes (comme `selected`, `disabled`, `loading`) doivent être assignées via JavaScript, pas comme attributs HTML.

### Pattern avec customElements.whenDefined

```typescript
useEffect(() => {
  if (componentRef.current) {
    customElements.whenDefined('sh-component-name').then(() => {
      if (componentRef.current) {
        // @ts-expect-error - propriété native du web component
        componentRef.current.selected = selected;
      }
    });
  }
}, [selected]);
```

### ❌ Ne pas faire

```typescript
// ❌ Ne fonctionne pas correctement
return React.createElement('sh-component-name', {
  selected: selected, // Sera converti en string "true"/"false"
});
```

---

## Exemples Complets

### Exemple 1 : StatCard avec Filtre

**Fichier :** `src/components/analytics/StatCard.tsx`

```typescript
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface StatCardProps {
  value: number;
  label: string;
  riskLevel?: 'default' | 'critical' | 'high' | 'medium' | 'low';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  riskLevel = 'default',
  selected = false,
  onClick,
  className = '',
}) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLElement>(null);

  // Écouter l'événement sh-stat-click
  useEffect(() => {
    const handleClick = () => {
      onClick?.();
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('sh-stat-click', handleClick);
      return () => card.removeEventListener('sh-stat-click', handleClick);
    }
  }, [onClick]);

  // Assigner la propriété selected via JavaScript
  useEffect(() => {
    if (cardRef.current) {
      customElements.whenDefined('sh-stat-card').then(() => {
        if (cardRef.current) {
          // @ts-expect-error - propriété native du web component
          cardRef.current.selected = selected;
        }
      });
    }
  }, [selected]);

  return React.createElement('sh-stat-card', {
    ref: cardRef,
    label: label,
    value: value.toString(),
    'risk-level': riskLevel,
    'data-theme': theme,
    className: className,
  });
};
```

**Utilisation :**

```typescript
const [filter, setFilter] = useState<string | null>(null);

<StatCard
  value={15}
  label="Critique (≤3j)"
  riskLevel="critical"
  selected={filter === 'critical'}
  onClick={() => setFilter('critical')}
/>
```

### Exemple 2 : StockPrediction Card

**Fichier :** `src/components/ai/StockPrediction.tsx`

```typescript
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { StockPrediction as StockPredictionData } from '@/utils/mlSimulation';

export interface StockPredictionProps {
  prediction: StockPredictionData;
  className?: string;
  showDetails?: boolean;
}

export const StockPrediction: React.FC<StockPredictionProps> = ({
  prediction,
  className = '',
  showDetails = true,
}) => {
  const { theme } = useTheme();

  const {
    stockId,
    stockName,
    riskLevel,
    daysUntilRupture,
    dateOfRupture,
    confidence,
    dailyConsumptionRate,
    currentQuantity,
    daysUntilRupturePessimistic,
    daysUntilRuptureOptimistic,
    recommendedReorderDate,
    recommendedReorderQuantity,
  } = prediction;

  return React.createElement('sh-stock-prediction-card', {
    'stock-id': stockId,
    'stock-name': stockName,
    'risk-level': riskLevel,
    'days-until-rupture': daysUntilRupture !== null ? daysUntilRupture : undefined,
    'date-of-rupture': dateOfRupture ? dateOfRupture.toISOString() : undefined,
    confidence: confidence,
    'daily-consumption-rate': dailyConsumptionRate,
    'current-quantity': currentQuantity,
    'days-until-rupture-pessimistic': daysUntilRupturePessimistic,
    'days-until-rupture-optimistic': daysUntilRuptureOptimistic,
    'recommended-reorder-date': recommendedReorderDate
      ? recommendedReorderDate.toISOString()
      : undefined,
    'recommended-reorder-quantity': recommendedReorderQuantity,
    'show-details': showDetails ? '' : undefined,
    'data-theme': theme,
    className: className,
  });
};
```

---

## Bonnes Pratiques

### 1. Toujours Utiliser des Refs

```typescript
const componentRef = useRef<HTMLElement>(null);
```

Les refs permettent d'accéder à l'instance réelle du web component pour :

- Écouter les événements
- Assigner des propriétés JavaScript
- Appeler des méthodes publiques

### 2. Attendre customElements.whenDefined

```typescript
customElements.whenDefined('sh-component-name').then(() => {
  // Le composant est défini et prêt
});
```

Cela garantit que le web component est enregistré avant d'interagir avec lui.

### 3. Nettoyer les Event Listeners

```typescript
useEffect(() => {
  const element = componentRef.current;
  const handler = () => {
    /* ... */
  };

  if (element) {
    element.addEventListener('event', handler);
    return () => element.removeEventListener('event', handler); // ✅ Cleanup
  }
}, []);
```

### 4. Conventions de Nommage

| Type         | Convention              | Exemple         |
| ------------ | ----------------------- | --------------- |
| Composant    | kebab-case              | `sh-stat-card`  |
| Attribut     | kebab-case              | `risk-level`    |
| Propriété JS | camelCase               | `riskLevel`     |
| Événement    | kebab-case avec préfixe | `sh-stat-click` |

### 5. TypeScript

```typescript
// Déclarer les types globaux (déjà fait dans src/types/web-components.d.ts)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sh-stat-card': any;
    }
  }
}
```

---

## Troubleshooting

### Problème : Le web component ne s'affiche pas

**Causes possibles :**

1. Import manquant dans `main.tsx`
2. CSS du Design System non importé
3. Mauvais nom de composant

**Solution :**

```typescript
// main.tsx
import '@stockhub/design-system/dist/index.js';
import '@stockhub/design-system/dist/tokens/design-tokens.css';
```

### Problème : Le thème ne s'applique pas

**Cause :** Attribut `data-theme` manquant ou mal passé

**Solution :**

```typescript
return React.createElement('sh-component', {
  'data-theme': theme, // ✅ Kebab-case avec guillemets
});
```

### Problème : La propriété `selected` ne fonctionne pas

**Cause :** Tentative d'assigner via attribut HTML au lieu de propriété JS

**Solution :**

```typescript
// ❌ Ne fonctionne pas
<sh-stat-card selected={true} />

// ✅ Fonctionne
useEffect(() => {
  if (ref.current) {
    customElements.whenDefined('sh-stat-card').then(() => {
      ref.current.selected = selected;
    });
  }
}, [selected]);
```

### Problème : Les événements ne sont pas reçus

**Cause :** Utilisation de `onClick` au lieu d'`addEventListener`

**Solution :**

```typescript
// ❌ Ne fonctionne pas avec web components
<sh-button onClick={handleClick} />

// ✅ Fonctionne
useEffect(() => {
  const element = ref.current;
  if (element) {
    element.addEventListener('sh-click', handleClick);
    return () => element.removeEventListener('sh-click', handleClick);
  }
}, [handleClick]);
```

### Problème : Erreur TypeScript "Property does not exist"

**Cause :** Déclarations TypeScript manquantes

**Solution :**
Vérifier que `src/types/web-components.d.ts` contient les déclarations :

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sh-stat-card': any;
      'sh-stock-prediction-card': any;
      // ...
    }
  }
}
```

---

## Ressources

- [Design System Repository](https://github.com/SandrineCipolla/stockhub_design_system)
- [Storybook Documentation](https://SandrineCipolla.github.io/stockhub_design_system/)
- [Lit Element Documentation](https://lit.dev/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

---

## Changelog

| Date       | Version | Changements               |
| ---------- | ------- | ------------------------- |
| 2025-11-17 | 1.0.0   | Création du guide initial |
