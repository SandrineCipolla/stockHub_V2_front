# 🎁 Pourquoi des Wrappers pour les Web Components ?

> Documentation technique sur l'architecture d'intégration du Design System dans StockHub V2

---

## 🤔 La Question

**Pourquoi créer des wrappers React pour encapsuler les web components Lit ?**

Au lieu de :

```tsx
<sh-button variant="primary">Click me</sh-button>
```

On fait :

```tsx
<ButtonWrapper variant="primary">Click me</ButtonWrapper>
```

---

## 🎯 Les Raisons Techniques

### 1. **Problème TypeScript JSX**

**Problème** : TypeScript ne reconnaît pas automatiquement les custom elements dans JSX.

```tsx
// ❌ Erreur TypeScript
<sh-button variant="primary">Click</sh-button>
// TS2322: Property 'sh-button' does not exist on type 'JSX.IntrinsicElements'
```

**Solutions possibles** :

#### A. Déclarer globalement (non recommandé)

```typescript
// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'sh-button': any; // ❌ Perd le typage fort
  }
}
```

- ❌ Perd le typage des props
- ❌ Pas d'autocomplétion
- ❌ Pas de validation à la compilation

#### B. Utiliser React.createElement (verbose)

```tsx
// ✅ Fonctionne mais verbeux partout
React.createElement(
  'sh-button',
  {
    variant: 'primary',
    'icon-before': 'Plus',
  },
  'Click me'
);
```

#### C. Wrapper React (recommandé) ✨

```tsx
// ✅ API React propre + typage fort
<ButtonWrapper variant="primary" icon={Plus}>
  Click me
</ButtonWrapper>
```

---

### 2. **Conversion des Types de Données**

**Problème** : Incompatibilité entre types React et Web Components.

#### Exemple : Icônes Lucide

**React** utilise des **composants** :

```tsx
import { Plus, Download } from 'lucide-react';
<Button icon={Plus} />; // Composant React
```

**Web Components** utilisent des **strings** :

```html
<sh-button icon-before="Plus"></sh-button>
```

**Le wrapper fait la conversion** :

```typescript
// ButtonWrapper.tsx
const iconMap = new Map<LucideIcon, string>([
  [Plus, 'Plus'],
  [Download, 'Download'],
]);

const iconName = iconMap.get(icon); // Composant → String
```

---

### 3. **Gestion des Événements Custom**

**Problème** : Les événements des web components ne sont pas des événements React.

#### Web Component émet :

```typescript
// Dans sh-button.ts
this.dispatchEvent(
  new CustomEvent('sh-button-click', {
    bubbles: true,
    composed: true,
  })
);
```

#### React attend :

```tsx
<Button onClick={e => console.log(e)} />
```

#### Le wrapper fait le pont :

```typescript
// ButtonWrapper.tsx
const handleClick = (e: Event) => {
  if (onClick && !disabled && !loading) {
    onClick(e as any); // Bridge entre CustomEvent et React SyntheticEvent
  }
};

return React.createElement('sh-button', {
  'onsh-button-click': handleClick, // ✅ Événement custom → prop React
});
```

---

### 4. **Props Complexes (Objets/Tableaux)**

**Problème** : Les attributs HTML ne supportent que des strings.

#### Exemple : Suggestions IA

```typescript
// ❌ Ne fonctionne pas via attribut HTML
<sh-ia-alert-banner alerts="[{...}, {...}]"></sh-ia-alert-banner>

// ✅ Doit passer par JavaScript
const element = document.querySelector('sh-ia-alert-banner');
element.alerts = [{...}, {...}]; // Assignation JS
```

#### Le wrapper gère ça automatiquement :

```typescript
// AIAlertBannerWrapper.tsx
return React.createElement('sh-ia-alert-banner', {
  alerts: alerts, // ✅ Passé directement comme property JS
});
```

React.createElement assigne les propriétés via JS, pas via attributs HTML.

---

### 5. **Gestion Centralisée du Thème**

**Problème** : Chaque composant DS a besoin du thème actuel.

#### Sans wrapper (répétitif) :

```tsx
const { theme } = useTheme();

<sh-button data-theme={theme}>Button 1</sh-button>
<sh-button data-theme={theme}>Button 2</sh-button>
<sh-button data-theme={theme}>Button 3</sh-button>
```

#### Avec wrapper (DRY) :

```typescript
// ButtonWrapper.tsx
export const ButtonWrapper = ({ ...props }) => {
  const { theme } = useTheme(); // ✅ Centralisé dans le wrapper

  return React.createElement('sh-button', {
    'data-theme': theme, // Automatiquement ajouté
    ...props,
  });
};
```

---

### 6. **API Cohérente avec le Code React Existant**

**Problème** : L'équipe a l'habitude de React, pas de web components.

#### Avant (composants React) :

```tsx
<Button variant="primary" size="md" icon={Plus} onClick={handleClick} loading={isLoading}>
  Ajouter
</Button>
```

#### Après (wrapper avec API identique) :

```tsx
<ButtonWrapper variant="primary" size="md" icon={Plus} onClick={handleClick} loading={isLoading}>
  Ajouter
</ButtonWrapper>
```

**Avantages** :

- ✅ Même signature d'API
- ✅ Pas de formation nécessaire
- ✅ Refactoring minimal
- ✅ Alias possible : `import { ButtonWrapper as Button }`

---

### 7. **Typage Fort TypeScript**

**Avec wrapper** :

```typescript
interface ButtonWrapperProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    loading?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
}

export const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ ... }) => {
    // ✅ Autocomplétion complète
    // ✅ Validation à la compilation
    // ✅ Documentation inline (JSDoc)
};
```

**Résultat** : IntelliSense, validation, documentation automatique.

---

## 📊 Comparaison des Approches

| Critère                       | Sans Wrapper      | Avec Wrapper   |
| ----------------------------- | ----------------- | -------------- |
| **Typage TypeScript**         | ❌ Aucun ou `any` | ✅ Fort        |
| **Autocomplétion IDE**        | ❌ Non            | ✅ Oui         |
| **Conversion types**          | ❌ Manuel partout | ✅ Centralisé  |
| **Gestion événements**        | ❌ Verbeux        | ✅ Transparent |
| **API cohérente**             | ❌ Mélange styles | ✅ 100% React  |
| **Maintenance**               | ❌ Dispersée      | ✅ Centralisée |
| **DX (Developer Experience)** | 😞 Moyen          | 😊 Excellent   |

---

## 🏗️ Architecture Mise en Place

### Pattern Utilisé

```typescript
// Template de wrapper
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export const ComponentWrapper: React.FC<ComponentProps> = ({
  // Props React standard
  variant,
  size,
  children,
  onClick,
  ...props
}) => {
  const { theme } = useTheme();

  // Conversions de données si nécessaire
  const convertedData = convertReactToWebComponent(props);

  // Handlers d'événements
  const handleEvent = (e: Event) => {
    if (onClick) {
      onClick(e as any);
    }
  };

  // Création du web component
  return React.createElement(
    'sh-component',
    {
      variant,
      size,
      'data-theme': theme,
      'onsh-event': handleEvent,
      ...convertedData,
    },
    children
  );
};
```

### Wrappers Créés

```
src/components/
├── layout/
│   └── HeaderWrapper.tsx        (sh-header)
├── dashboard/
│   ├── MetricCardWrapper.tsx    (sh-metric-card)
│   └── StockCardWrapper.tsx     (sh-stock-card)
├── common/
│   └── ButtonWrapper.tsx        (sh-button)
└── ai/
    └── AIAlertBannerWrapper.tsx (sh-ia-alert-banner)
```

### Composants sans Wrapper

Certains composants n'ont PAS besoin de wrapper :

```tsx
// ✅ sh-footer - Pas de props complexes, utilisé directement
<sh-footer
    app-name="STOCK HUB"
    year="2025"
    data-theme="dark"
/>

// ✅ sh-search-input - API simple, pas de conversion nécessaire
<sh-search-input
    placeholder="Rechercher..."
    value={searchTerm}
    onsh-search-change={handleChange}
/>
```

**Critères pour ne PAS créer de wrapper** :

- ✅ Props simples (strings, numbers, booleans)
- ✅ Pas de conversion de types nécessaire
- ✅ Événements simples
- ✅ Utilisé peu souvent

---

## 🎓 Leçons Apprises

### Ce qui fonctionne bien ✅

1. **React.createElement** au lieu de JSX
   - Évite les conflits TypeScript
   - Permet de passer des propriétés JS complexes

2. **Mapping manuel des icônes**
   - Plus fiable que les introspections automatiques
   - Explicit > Implicit

3. **Centralisation du thème**
   - Un seul point de modification
   - Garantit la cohérence

4. **Alias d'import**
   ```typescript
   import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
   // Permet d'utiliser <Button> au lieu de <ButtonWrapper>
   ```

### Ce qui pourrait être amélioré 🔄

1. **Génération automatique des wrappers**
   - Script qui lit custom-elements.json du DS
   - Génère les wrappers TypeScript automatiquement

2. **Types partagés**
   - Exporter les types depuis le DS
   - Les réutiliser dans les wrappers

3. **HOC réutilisable**
   - Higher-Order Component pour éviter duplication
   - `withWebComponent('sh-button', ButtonWrapper)`

---

## 📝 Conclusion

**Les wrappers ne sont PAS un surcoût**, ils sont une **couche d'abstraction nécessaire** pour :

1. ✅ Intégrer proprement web components dans React
2. ✅ Maintenir le typage TypeScript fort
3. ✅ Offrir une DX cohérente à l'équipe
4. ✅ Centraliser les conversions et la logique commune
5. ✅ Faciliter la maintenance future

**Alternative envisagée** : Réécrire tous les composants en React

- ❌ Perte de l'avantage "Design System réutilisable"
- ❌ Duplication de code
- ❌ Maintenance double (DS + React)

**Choix fait** : Web Components + Wrappers React

- ✅ Meilleur des deux mondes
- ✅ Design System framework-agnostic
- ✅ Intégration propre dans React

---

## 🔗 Références

**Documentation officielle** :

- [Lit - React Integration](https://lit.dev/docs/frameworks/react/)
- [React - Web Components](https://react.dev/reference/react-dom/components#custom-html-elements)
- [MDN - Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

**Fichiers clés** :

- `src/components/common/ButtonWrapper.tsx` - Exemple de wrapper complet
- `src/components/ai/AIAlertBannerWrapper.tsx` - Conversion de types complexes
- `src/components/dashboard/StockCardWrapper.tsx` - Gestion état local + web component

---

**Date** : 03 Novembre 2024
**Auteur** : Équipe StockHub V2
**Version** : 1.0
