# Guide des Web Components du Design System

> Utiliser les web components du StockHub Design System dans React, et faire évoluer le Design System depuis le frontend

## 📋 Table des matières

- [Frontend et Design System](#frontend-et-design-system)
- [Installation](#installation)
- [Pattern recommandé](#pattern-recommandé)
- [Gestion du thème](#gestion-du-thème)
- [Événements custom](#événements-custom)
- [Propriétés booléennes](#propriétés-booléennes)
- [Exemples dans le code](#exemples-dans-le-code)
- [Bonnes pratiques](#bonnes-pratiques)
- [Troubleshooting](#troubleshooting)
- [Ajouter ou modifier un composant du Design System](#ajouter-ou-modifier-un-composant-du-design-system)
- [Ressources](#ressources)

---

## Frontend et Design System

Le Design System vit dans son propre dépôt, [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system). Les raisons de cette séparation et du choix de Lit sont dans [ADR-001](adr/ADR-001-separation-design-system.md) et [ADR-002](adr/ADR-002-web-components-lit.md).

| Dépôt         | Contient                                                                           |
| ------------- | ---------------------------------------------------------------------------------- |
| Design System | Web components `sh-*` (Lit), design tokens, Storybook, tests d'interaction         |
| Frontend      | Wrappers React autour des web components, pages, hooks, logique métier, appels API |

Le catalogue des composants, leurs propriétés et leurs événements sont dans le [Storybook](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/), qui fait foi.

### Où créer un nouveau composant

**Dans le Design System** si le composant est de la présentation pure, réutilisable, sans logique métier ni dépendance à React.

**Dans le frontend** s'il porte une logique métier, un état React, des hooks, ou s'il n'a de sens que pour une page.

| Composant       | Où            | Pourquoi                         |
| --------------- | ------------- | -------------------------------- |
| `sh-button`     | Design System | Présentation pure, réutilisable  |
| `sh-stock-card` | Design System | Présentation d'un stock          |
| `Dashboard.tsx` | Frontend      | Page, logique métier             |
| `StockForm.tsx` | Frontend      | Formulaire avec validation React |

---

## Installation

```bash
npm install github:SandrineCipolla/stockhub_design_system#<tag>
```

Le tag est la dernière version publiée du Design System, visible dans ses [releases](https://github.com/SandrineCipolla/stockhub_design_system/releases). La version installée dans ce dépôt est celle que porte `package.json`.

Le chargement se fait dans [`src/main.tsx`](../src/main.tsx) : les design tokens CSS sont importés au démarrage, les web components sont chargés ensuite par un import dynamique, pour ne pas retarder le premier rendu.

---

## Pattern recommandé

### ✅ React.createElement()

C'est le pattern de tous les wrappers du projet.

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

### ❌ JSX

```typescript
// ❌ Ne pas faire
return (
  <sh-component-name
    data-theme={theme}
    attribute="value"
  />
);
```

Problèmes rencontrés avec JSX :

- Les propriétés booléennes ne passent pas correctement
- Le thème peut ne pas s'appliquer
- Comportement incohérent avec les événements custom

Pourquoi passer par des wrappers plutôt que d'utiliser les web components directement dans les pages : [V2/DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md).

---

## Gestion du thème

### Attribut data-theme

Tous les composants du Design System reçoivent le thème par l'attribut `data-theme`.

```typescript
import { useTheme } from '@/hooks/useTheme';

export const MyComponent: React.FC = () => {
  const { theme } = useTheme(); // 'light' | 'dark'

  return React.createElement('sh-component-name', {
    'data-theme': theme,
  });
};
```

Le hook est dans [`src/hooks/useTheme.ts`](../src/hooks/useTheme.ts).

---

## Événements custom

Les web components émettent des événements custom, préfixés `sh-`, qu'il faut écouter avec `addEventListener`.

```typescript
useEffect(() => {
  const handleEvent = (e: Event) => {
    const { detail } = e as CustomEvent;
    onCustomAction?.(detail);
  };

  const element = componentRef.current;
  if (element) {
    element.addEventListener('sh-custom-event', handleEvent);
    return () => element.removeEventListener('sh-custom-event', handleEvent);
  }
}, [onCustomAction]);
```

La liste des événements de chaque composant est dans le Storybook. Les types TypeScript de leurs `detail` sont dans [`src/types/web-component-events.ts`](../src/types/web-component-events.ts).

---

## Propriétés booléennes

Les propriétés booléennes (`selected`, `disabled`, `loading`) s'assignent en JavaScript, pas comme attributs HTML.

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

```typescript
// ❌ Ne fonctionne pas correctement
return React.createElement('sh-component-name', {
  selected: selected, // Converti en chaîne "true" ou "false"
});
```

---

## Exemples dans le code

- [`src/components/analytics/StatCard.tsx`](../src/components/analytics/StatCard.tsx) : événement de sélection, propriété booléenne `selected`, thème
- [`src/components/ai/StockPrediction.tsx`](../src/components/ai/StockPrediction.tsx) : carte de prédiction
- Les wrappers de `src/components/*/*Wrapper.tsx`, par exemple [`ButtonWrapper.tsx`](../src/components/common/ButtonWrapper.tsx)

---

## Bonnes pratiques

### 1. Toujours utiliser des refs

```typescript
const componentRef = useRef<HTMLElement>(null);
```

Les refs donnent accès à l'instance réelle du web component pour écouter les événements, assigner des propriétés JavaScript et appeler ses méthodes publiques.

### 2. Attendre customElements.whenDefined

```typescript
customElements.whenDefined('sh-component-name').then(() => {
  // Le composant est défini et prêt
});
```

Le web component est ainsi enregistré avant toute interaction. C'est nécessaire ici, puisque le Design System est chargé après le premier rendu.

### 3. Nettoyer les event listeners

```typescript
useEffect(() => {
  const element = componentRef.current;
  const handler = () => {
    /* ... */
  };

  if (element) {
    element.addEventListener('event', handler);
    return () => element.removeEventListener('event', handler);
  }
}, []);
```

### 4. Conventions de nommage

| Type         | Convention              | Exemple         |
| ------------ | ----------------------- | --------------- |
| Composant    | kebab-case              | `sh-stat-card`  |
| Attribut     | kebab-case              | `risk-level`    |
| Propriété JS | camelCase               | `riskLevel`     |
| Événement    | kebab-case avec préfixe | `sh-stat-click` |

### 5. TypeScript

Les déclarations des web components pour TypeScript sont dans [`src/types/web-components.d.ts`](../src/types/web-components.d.ts). Un nouveau composant utilisé dans le frontend y est déclaré avec ses propriétés.

---

## Troubleshooting

### Le web component ne s'affiche pas

Causes possibles :

1. Chargement du Design System en échec : voir la console, [`src/main.tsx`](../src/main.tsx) y journalise l'erreur
2. Design tokens CSS non importés
3. Nom de composant erroné

### Le thème ne s'applique pas

L'attribut `data-theme` est absent ou mal nommé.

```typescript
return React.createElement('sh-component', {
  'data-theme': theme, // kebab-case, entre guillemets
});
```

### La propriété `selected` ne fonctionne pas

Elle est passée comme attribut HTML au lieu d'être assignée en JavaScript. Voir [Propriétés booléennes](#propriétés-booléennes).

### Les événements ne sont pas reçus

`onClick` ne fonctionne pas avec les événements des web components : utiliser `addEventListener` sur l'événement `sh-*` du composant. Voir [Événements custom](#événements-custom).

### Erreur TypeScript « Property does not exist »

Le composant n'est pas déclaré dans [`src/types/web-components.d.ts`](../src/types/web-components.d.ts). Les autres erreurs TypeScript liées aux web components sont dans [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md).

---

## Ajouter ou modifier un composant du Design System

1. **Dans le Design System** : issue, branche, composant, story Storybook, tests, PR. Le processus est dans le [CONTRIBUTING du Design System](https://github.com/SandrineCipolla/stockhub_design_system/blob/master/CONTRIBUTING.md).
2. **Publication** : à la fusion sur `master`, Release Please ouvre une PR de release. Sa fusion crée le tag de la nouvelle version.
3. **Dans le frontend** : installer le nouveau tag (voir [Installation](#installation)). Une nouvelle version majeure du Design System signale un changement incompatible : lire son CHANGELOG avant de mettre à jour.
4. **Wrapper React** si le composant est utilisé à plusieurs endroits, selon le [pattern recommandé](#pattern-recommandé), et déclaration dans `src/types/web-components.d.ts`.
5. **Vérification** : `npm run ci:check`, puis un test visuel avec `npm run dev`.

Un besoin découvert dans le frontend (nouveau composant, bug, accessibilité) fait l'objet d'une issue dans le dépôt du Design System, pas d'un contournement dans le frontend.

---

## Ressources

- [Storybook du Design System](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)
- [Dépôt du Design System](https://github.com/SandrineCipolla/stockhub_design_system)
- [Documentation Lit](https://lit.dev/)
- [Web Components sur MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
