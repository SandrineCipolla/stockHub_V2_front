---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-002-web-components-lit.md
---

# ADR-001 - Séparation du Design System en repository indépendant

**Date** : 2025-10

---

## Contexte

Le frontend V2 hébergeait ses composants UI directement dans `src/components/`. Leur nombre a augmenté, et le besoin de les documenter de façon interactive a posé la question de leur organisation.

Contrainte de fond : le projet est développé en solo, environ un jour par semaine. Aucune infrastructure demandant un entretien régulier n'est tenable.

Critères retenus pour trancher : réutilisabilité future, sur mobile ou sur un autre projet, et possibilité de vérifier la qualité des composants indépendamment du frontend.

## Décision

Extraire les composants UI dans un repository séparé, `stockhub_design_system`, consommé comme package `@stockhub/design-system`.

Ce qui a emporté la décision : une documentation Storybook déployée en continu sur Chromatic, indépendante du cycle de release de l'application, et une frontière explicite entre le socle UI et le code métier.

## Alternatives

| Alternative                           | Pourquoi rejetée                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo avec workspaces              | Le tooling d'orchestration est disproportionné pour un projet solo, et demande un entretien que le budget temps ne permet pas             |
| Dossier `packages/` dans le même repo | Plus simple, mais ni Storybook indépendant ni validation qualité isolée. Compromis envisageable si le projet était refait, pas retenu ici |

## Conséquences

- **Positif** : Storybook déployé en continu, versioning du design system indépendant de l'application
- **Positif** : la qualité des composants est mesurée pour elle-même, hors du contexte applicatif
- **Négatif** : un troisième repository à entretenir, avec sa CI et ses tests
- **Négatif** : toute évolution de composant demande un cycle de publication puis une mise à jour de la dépendance côté front, là où une modification locale suffisait

## Critères de vérification

Rouvrir cette décision si le cycle de publication devient un frein mesurable, par exemple plusieurs jours d'attente répétés pour propager un changement de composant jusqu'au frontend.

## Liens

- Repository : [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system)
- Storybook : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- ADR liée : [ADR-002](./ADR-002-web-components-lit.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
