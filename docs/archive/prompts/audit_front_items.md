# Audit — EditItem flow (frontend)

## Contexte

Projet StockHub V2 — React 19 + TypeScript + Vite.
Il existe déjà `useItems.ts` et `itemsAPI.ts` qui gèrent le CRUD items.
`UpdateItemData` ne contient actuellement que `quantity`.
On veut ajouter une modale d'édition complète : `label`, `description`, `minimumStock`.

## Objectif de cet audit

Cartographier exactement ce qui existe autour des items côté frontend,
afin d'identifier précisément ce qu'il faut créer ou modifier.

## Ce que tu dois faire

### 1. Lire et rapporter ces fichiers

```
src/types/stock.ts         → interfaces StockItem, UpdateItemData, CreateItemData
src/services/api/itemsAPI.ts   → méthodes CRUD exposées
src/hooks/useItems.ts      → actions disponibles, gestion erreurs
```

Pour chaque fichier, rapporte :

- Les interfaces/types liés aux items
- Les méthodes disponibles et leurs signatures
- Ce qui manque pour supporter l'édition complète (label/description/minimumStock)

### 2. Trouver la page StockDetail

Cherche le fichier qui affiche la liste des items d'un stock.
Probablement dans `src/pages/` ou `src/components/`.

Rapporte :

- Le chemin exact du fichier
- Comment les items sont actuellement affichés (cards ? liste ?)
- Quels composants enfants sont utilisés pour afficher/modifier un item
- Comment `useItems` est actuellement appelé dans cette page

### 3. Vérifier les composants modales existants

Cherche s'il existe déjà des composants de type modale ou dialog dans le projet :

```
src/components/**/*Modal*
src/components/**/*Dialog*
src/components/**/*modal*
```

Rapporte :

- Les chemins trouvés
- La structure/props de chaque composant trouvé
- Si le design system (`stockhub_design_system`) expose un composant Modal utilisable

### 4. Vérifier les tests existants liés aux items

Cherche les fichiers de test mentionnant "item" ou "Item" :

```
src/**/*.test.ts
src/**/*.test.tsx
```

Rapporte :

- Les fichiers de test existants pour les items
- Ce qu'ils testent (hooks, composants, API)
- Ce qu'il faudra ajouter comme tests pour couvrir l'édition

### 5. Synthèse — ce qu'il faudra créer/modifier

Sur la base de l'audit, liste précisément :

- Les fichiers à CRÉER (avec leur chemin complet suggéré)
- Les fichiers à MODIFIER (avec les changements à apporter)
- L'ordre recommandé d'implémentation
- Les tests à créer ou mettre à jour

## Format de réponse attendu

Réponds en markdown structuré avec un titre par section.
Sois exhaustif sur les chemins de fichiers et les signatures de types/fonctions —
c'est ce qui servira de base pour le prompt d'implémentation suivant.
