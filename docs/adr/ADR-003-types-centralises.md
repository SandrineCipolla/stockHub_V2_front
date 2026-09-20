# ADR-003 - Types TypeScript centralisés dans `src/types/`

**Date** : octobre 2025
**Statut** : Accepté

---

## Contexte

Plusieurs interfaces TypeScript décrivant les mêmes objets métier (stock, item, erreur API) étaient déclarées localement dans les composants, les hooks et les fichiers de tests. Les définitions divergeaient au fil des modifications, sans que le compilateur signale la divergence puisqu'il s'agissait de types distincts.

## Décision

Centraliser les types dans `src/types/`, supprimer les interfaces déclarées localement, et importer depuis ce dossier.

Le dossier est découpé par domaine : `stock.ts`, `api.ts`, `components.ts`, `dashboard.ts`, `error.ts`, `ui.ts`, `utils.ts`, `collaboration.ts`, `web-component-events.ts`, avec un `index.ts` qui réexporte.

## Conséquences

- **Positif** : une seule définition par concept, une modification se propage à tous les consommateurs et casse la compilation là où c'est nécessaire
- **Positif** : les tests utilisent les mêmes types que le code de production
- **Négatif** : un import supplémentaire dans chaque fichier, et un dossier à faire vivre quand un domaine nouveau apparaît

## Critères de vérification

Aucune `interface` ou `type` décrivant un objet métier ne doit être déclarée hors de `src/types/`. `npm run clean:deadcode` (Knip) signale les types exportés et jamais consommés.

## Liens

- Code concerné : `src/types/`
