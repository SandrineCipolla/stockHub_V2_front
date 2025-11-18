# TROUBLESHOOTING-WEB-COMPONENTS.md - Résolution des erreurs TypeScript et optimisations

## Problème : Erreur TS2339 sur les Web Components

**Date :** 21 octobre 2025  
**Composant affecté :** `StockCard.tsx`  
**Erreur initiale :** `TS2339: Property 'sh-status-badge' does not exist on type 'JSX.IntrinsicElements'`

---

## 🔴 Description du problème

Lors de l'utilisation du web component `<sh-status-badge>` dans le composant `StockCard`, TypeScript ne reconnaissait pas l'élément comme valide et générait une erreur de compilation.

### Erreurs rencontrées (dans l'ordre)

1. **TS2339** : Property 'sh-status-badge' does not exist on type 'JSX.IntrinsicElements'
2. **TS1005** : '}' expected (erreur de syntaxe dans web-components.d.ts)
3. **TS2322** : Type 'StockStatus' is not assignable (incompatibilité camelCase vs kebab-case)
4. **Type safety** : Utilisation de `any` dans les CustomEvent (recommandation Copilot)
5. **Attributs boolean** : Attributs sans valeur explicite (recommandation Copilot)

---

## 🔍 Causes identifiées

### 1. Erreur de syntaxe dans web-components.d.ts

**Fichier :** `src/types/web-components.d.ts`

Le fichier contenait une erreur de syntaxe à la dernière ligne :

```typescript
// ❌ AVANT (INCORRECT)
export {}
}
```

Il y avait une accolade fermante en trop qui invalidait tout le fichier de déclaration globale.

### 2. Conflit entre fichiers de déclaration

Deux fichiers déclaraient les mêmes web components :

- `src/react-app-env.d.ts` - déclarations simples
- `src/types/web-components.d.ts` - déclarations complètes

Cela créait une ambiguïté pour TypeScript.

### 3. Incompatibilité de format de statut

Le type `StockStatus` utilise le format **camelCase** :

```typescript
type StockStatus = 'optimal' | 'low' | 'critical' | 'outOfStock' | 'overstocked';
```

Mais le web component `sh-status-badge` attend le format **kebab-case** :

```typescript
status?: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
```

### 4. Utilisation du type `any` pour les CustomEvent

**Fichier :** `src/pages/Dashboard.tsx`

Le code utilisait le type `any` pour les événements custom, ce qui désactive la vérification de types TypeScript :

```typescript
// ❌ AVANT (INCORRECT)
onsh-search-change={(e: any) => handleSearchChange(e.detail.value)}
```

### 5. Attributs boolean sans valeur explicite

Les attributs boolean des web components n'avaient pas de valeur explicite, générant des avertissements :

```typescript
// ❌ AVANT (AVERTISSEMENT)
<sh-search-input clearable />
```

---

## ✅ Solutions appliquées

### Solution 1 : Correction de web-components.d.ts

**Fichier modifié :** `src/types/web-components.d.ts`

```typescript
// ✅ APRÈS (CORRECT)
export {};
```

Suppression de l'accolade en trop pour rétablir la syntaxe correcte.

### Solution 2 : Consolidation dans vite-env.d.ts

**Fichier modifié :** `src/vite-env.d.ts`

Ajout des déclarations directement dans `vite-env.d.ts` (automatiquement chargé par Vite) :

```typescript
/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sh-status-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        status?: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
        size?: 'sm' | 'md' | 'lg';
        'show-icon'?: boolean;
        'data-theme'?: 'light' | 'dark';
      };
      'sh-search-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        // ...
      };
      'sh-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        // ...
      };
    }
  }
}
```

### Solution 3 : Fonction de conversion de format

**Fichier modifié :** `src/components/dashboard/StockCard.tsx`

Création d'une fonction de conversion pour mapper camelCase → kebab-case :

```typescript
// Conversion du format StockStatus (camelCase) vers le format du web component (kebab-case)
const convertStatusToWebComponent = (
  status: StockStatus
): 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked' => {
  const statusMap: Record<
    StockStatus,
    'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked'
  > = {
    optimal: 'optimal',
    low: 'low',
    critical: 'critical',
    outOfStock: 'out-of-stock', // 🔑 Conversion ici
    overstocked: 'overstocked',
  };
  return statusMap[status];
};
```

Utilisation dans le JSX :

```tsx
<sh-status-badge status={convertStatusToWebComponent(stock.status)} />
```

### Solution 4 : Configuration TypeScript optimisée

**Fichier modifié :** `tsconfig.json`

```json
{
  "compilerOptions": {
    // ...existing options...
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": [
    "src/**/*",
    "src/types/**/*.d.ts", // Inclusion explicite des fichiers de déclaration
    "documentation/V2/ARCHITECTURE.md",
    "node_modules/vitest/globals.d.ts"
  ]
}
```

### Solution 5 : Typage strict des CustomEvent

**Fichier modifié :** `src/pages/Dashboard.tsx`

Remplacement du type `any` par le type exact du CustomEvent :

```typescript
// ✅ APRÈS (CORRECT)
onsh-search-change={(e: CustomEvent<{ query: string }>) => handleSearchChange(e.detail.query)}
```

**Avantages :**

- ✅ Type safety complète
- ✅ Autocomplétion fonctionnelle dans l'IDE
- ✅ Détection d'erreurs à la compilation
- ✅ Correspondance exacte avec la signature du web component

### Solution 6 : Valeurs explicites pour attributs boolean

**Fichier modifié :** `src/pages/Dashboard.tsx`

Ajout de valeurs explicites pour les attributs boolean :

```typescript
// ✅ APRÈS (CORRECT)
<sh-search-input
  clearable={true}
  onsh-search-change={(e: CustomEvent<{ query: string }>) => handleSearchChange(e.detail.query)}
/>
```

**Bonnes pratiques :**

- Toujours spécifier `={true}` ou `={false}` pour les attributs boolean
- Évite les ambiguïtés dans le code
- Plus clair pour les autres développeurs

---

## 📝 Bonnes pratiques identifiées

### 1. **Placement des déclarations globales**

Pour les projets Vite + React, privilégier `vite-env.d.ts` pour les déclarations JSX car :

- ✅ Toujours chargé automatiquement par Vite
- ✅ Pas besoin de configuration supplémentaire
- ✅ Évite les conflits de modules

### 2. **Typage strict pour web components**

Toujours spécifier le type union littéral exact, pas un `string` générique :

```typescript
// ❌ INCORRECT
const convert = (status: StockStatus): string => { ... }

// ✅ CORRECT
const convert = (status: StockStatus): 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked' => { ... }
```

**Pour les CustomEvent, toujours typer la structure du détail :**

```typescript
// ❌ INCORRECT
onsh-search-change={(e: any) => handleSearch(e.detail.query)}

// ✅ CORRECT
onsh-search-change={(e: CustomEvent<{ query: string }>) => handleSearch(e.detail.query)}
```

### 3. **Conventions de nommage**

- **Types TypeScript** : camelCase (`outOfStock`)
- **Attributs HTML/Web Components** : kebab-case (`out-of-stock`)
- **Toujours créer une fonction de conversion** quand ces deux mondes se rencontrent

### 4. **Vérification de syntaxe**

Toujours vérifier les accolades fermantes dans les fichiers `.d.ts` :

```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // ...
    } // ← Fermeture IntrinsicElements
  } // ← Fermeture JSX
} // ← Fermeture global

export {}; // ← Ne PAS ajouter d'accolade ici
```

### 5. **Attributs boolean explicites**

Toujours spécifier des valeurs explicites pour les attributs boolean :

```typescript
// ❌ DÉCONSEILLÉ (génère avertissements)
<sh-search-input clearable disabled />

// ✅ RECOMMANDÉ (clair et sans avertissement)
<sh-search-input clearable={true} disabled={false} />
```

---

## 🔧 Commandes utiles pour diagnostiquer

### Supprimer le cache TypeScript

```bash
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
```

### Vérifier les erreurs TypeScript

```bash
npx tsc --noEmit
```

### Redémarrer le serveur TypeScript (IntelliJ/WebStorm)

1. `Ctrl+Shift+A`
2. Taper "Restart TypeScript Service"
3. Entrée

---

## 📊 Impact

- ✅ **Compilation TypeScript** : Plus d'erreurs
- ✅ **Type safety** : Conservation du typage strict + CustomEvent typés
- ✅ **DX (Developer Experience)** : Autocomplétion fonctionnelle
- ✅ **Maintenabilité** : Code documenté et patterns réutilisables
- ✅ **Qualité du code** : Respect des recommandations Copilot AI

---

## 🔗 Fichiers modifiés

1. `src/types/web-components.d.ts` - Correction syntaxe
2. `src/vite-env.d.ts` - Ajout déclarations web components
3. `src/components/dashboard/StockCard.tsx` - Fonction de conversion
4. `src/pages/Dashboard.tsx` - Typage CustomEvent + attributs boolean explicites
5. `tsconfig.json` - Configuration typeRoots + exclusion .md
6. `tsconfig.app.json` - Suppression référence react-app-env + exclusion .md
7. `src/react-app-env.d.ts` - ❌ Supprimé (obsolète)

---

## 📚 Ressources

- [TypeScript - Global Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)
- [React TypeScript - JSX.IntrinsicElements](https://react-typescript-cheatsheet.netlify.app/docs/advanced/misc_concerns/#custom-elements--web-components)
- [Vite - TypeScript Configuration](https://vitejs.dev/guide/features.html#typescript)
- [TypeScript - CustomEvent Typing](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html#customevent)
