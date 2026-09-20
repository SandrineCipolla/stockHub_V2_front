# ADR-004 - Fixtures de test centralisées

**Date** : octobre 2025
**Statut** : Accepté

---

## Contexte

Chaque fichier de test construisait ses propres données mock à la main. Un changement de forme sur un objet métier obligeait à corriger la même structure dans une dizaine de fichiers, et les objets mock divergeaient entre tests, certains portant des champs obsolètes.

## Décision

Centraliser les données de test dans `src/test/fixtures/`, sous forme de factories typées (`createMockStock` et équivalents), et interdire la construction d'objets mock métier directement dans les fichiers de test.

Le dossier contient `stock.ts`, `user.ts`, `notification.ts`, `navigation.ts`, `localStorage.ts`, `hooks.ts` et un sous-dossier `helpers/`.

## Conséquences

- **Positif** : un changement de forme se répercute en un seul endroit, et le typage garantit que les fixtures suivent les types de production ([ADR-003](./ADR-003-types-centralises.md))
- **Positif** : les tests deviennent plus courts et lisibles, la donnée n'encombre plus l'assertion
- **Négatif** : une indirection de plus à la lecture d'un test, il faut ouvrir la factory pour connaître les valeurs par défaut

## Liens

- Code concerné : `src/test/fixtures/`
- Guide de tests : `documentation/5-TESTING-GUIDE.md`
- Décision liée : [ADR-003](./ADR-003-types-centralises.md)
