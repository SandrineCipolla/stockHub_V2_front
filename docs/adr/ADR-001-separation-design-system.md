# ADR-001 - Séparation du Design System en repository indépendant

**Date** : octobre 2025
**Statut** : Accepté

---

## Contexte

Le frontend V2 hébergeait ses composants UI directement dans `src/components/`. Le nombre de composants a augmenté, et le besoin de les documenter de façon interactive (visualiser les variantes, les états, les props) a posé la question de leur organisation : les garder dans le repo applicatif ou les extraire.

## Décision

Extraire les composants UI dans un repository séparé, `stockhub_design_system`, consommé par le frontend comme dépendance `@stockhub/design-system`.

Motifs du choix :

- Documentation Storybook indépendante du cycle de release de l'application, déployée en continu sur Chromatic
- Réutilisabilité future : une application mobile ou un autre frontend peut consommer le même package
- Frontière explicite entre le socle UI et le code métier de l'application

## Alternatives

| Alternative                         | Raison du rejet                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| Garder les composants dans le front | Pas de documentation interactive autonome, pas de réutilisation possible     |
| Monorepo (Nx, Turborepo)            | Tooling disproportionné pour un projet solo, coût d'entrée supérieur au gain |

## Conséquences

- **Positif** : Storybook déployé en continu, versioning du design system indépendant de l'application
- **Négatif** : toute évolution de composant demande un cycle publication puis mise à jour de la dépendance côté front, au lieu d'une modification locale
- **Négatif** : deux repos à maintenir, deux CI, deux jeux de tests

## Liens

- Repo : https://github.com/SandrineCipolla/stockhub_design_system
- Storybook : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- Décision liée : [ADR-002](./ADR-002-web-components-lit.md)
