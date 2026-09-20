---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-004-fixtures-centralisees.md
---

# ADR-003 - Types TypeScript centralisés dans `src/types/`

**Date** : 2025-10

---

## Contexte

Pendant le refactoring des tests, plusieurs interfaces TypeScript décrivant les mêmes objets métier étaient déclarées à la fois dans des composants, des hooks et des fichiers de tests. Les définitions divergeaient au fil des modifications sans que le compilateur signale rien, puisqu'il s'agissait de types distincts.

Critères retenus pour trancher : zéro duplication de types, et compatibilité ascendante avec les tests existants.

## Décision

Centraliser les types dans `src/types/`, découpés par domaine, et supprimer les interfaces déclarées localement dans les composants et les hooks. Des réexports maintiennent la compatibilité avec les imports existants.

La liste des fichiers du dossier fait foi, elle n'est pas recopiée ici.

## Alternatives

| Alternative                             | Pourquoi rejetée                                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types colocalisés avec chaque composant | Proximité agréable, mais duplication dès qu'un type est partagé par deux composants. C'est précisément le problème qui a déclenché cette décision |

## Conséquences

- **Positif** : une seule définition par concept, une modification se propage et casse la compilation là où c'est nécessaire
- **Positif** : les tests utilisent les mêmes types que le code de production
- **Négatif** : une indirection de plus pour retrouver la définition d'un type depuis un composant
- **Négatif** : un fichier d'index volumineux à parcourir

## Critères de vérification

Aucune interface décrivant un objet métier ne doit être déclarée hors de `src/types/`. Rouvrir cette décision si l'index devient difficile à naviguer, le découpage se ferait alors par domaine plutôt que par usage.

## Liens

- Code concerné : `src/types/`
- ADR liée : [ADR-004](./ADR-004-fixtures-centralisees.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
