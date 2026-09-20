# ADR-007 - Choix du framework frontend : React 19

**Date** : 2025-04
**Statut** : Accepté

---

## Contexte

Choix du framework principal de StockHub V2, au démarrage du projet. Deux contraintes pesaient sur la décision autant que les qualités techniques : le projet sert de support à une certification visant l'insertion professionnelle, et il est développé en solo, environ un jour par semaine.

Critères retenus pour trancher : représentativité sur le marché de l'emploi, compatibilité avec une éventuelle V3 mobile, et interopérabilité avec un Design System en Web Components ([ADR-002](./ADR-002-web-components-lit.md)).

## Décision

React 19, avec TypeScript en mode strict et Vite comme build tool ([ADR-008](./ADR-008-vite-build-tool.md)). Les versions exactes au moment du choix sont dans l'historique de `package.json`.

Ce qui a emporté la décision :

- **Employabilité** : React est déclaré en usage professionnel par 44,7 % des répondants de la Stack Overflow Developer Survey 2025, et domine les offres françaises. Pour un projet de certification tourné vers l'insertion, le choix d'une technologie représentative est une décision d'architecture à part entière.
- **Continuité mobile** : React Native partage les mêmes paradigmes, composants, hooks et TypeScript. Une V3 mobile réutiliserait la logique métier plutôt que de repartir de zéro.
- **React 19 en particulier** : les primitives Actions et `useOptimistic` simplifient les états asynchrones, et l'interopérabilité avec les Web Components y est meilleure, ce qui est déterminant pour intégrer le Design System en Lit.

## Hypothèses et preuves

| Affirmation                                        | Nature    | Vérification                                                          |
| -------------------------------------------------- | --------- | --------------------------------------------------------------------- |
| React domine le marché de l'emploi front en France | Preuve    | Stack Overflow Developer Survey 2025                                  |
| Une V3 mobile sera développée                      | Hypothèse | Non engagée à ce stade, elle oriente le choix sans le justifier seule |

## Alternatives

| Alternative            | Pourquoi rejetée                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Vue 3, Svelte, Angular | Identifiées mais non évaluées en profondeur. Le temps disponible et la clarté des deux critères principaux ne justifiaient pas l'investigation                           |
| Next.js                | L'application est une SPA entièrement authentifiée derrière Azure AD B2C. Le rendu serveur n'apporte rien sur des pages privées, et ajoute une complexité de déploiement |

## Conséquences

- **Positif** : écosystème large, compétences recherchées, continuité possible vers React Native
- **Négatif** : aucun bénéfice de référencement ou de rendu serveur, ce qui est sans effet ici
- **Négatif** : React 19 était récent au moment du choix, certaines librairies tierces n'étaient pas encore compatibles

## Critères de vérification

Rouvrir cette décision si le projet devait exposer des pages publiques demandant du référencement, ou si React perdait sa position dominante sur le marché français.

## Liens

- ADR liée : [ADR-008](./ADR-008-vite-build-tool.md)
- ADR liée : [ADR-002](./ADR-002-web-components-lit.md)
