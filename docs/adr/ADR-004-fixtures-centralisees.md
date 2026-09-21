---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-003-types-centralises.md
---

# ADR-004 - Fixtures de test centralisées

**Date** : 2025-10

---

## Contexte

Chaque fichier de test construisait ses propres données mock à la main. Un changement de forme sur un objet métier obligeait à corriger la même structure dans une dizaine de fichiers, et les mocks divergeaient entre tests, certains portant encore des champs disparus.

## Décision

Centraliser les données de test dans `src/test/fixtures/`, sous forme de factories typées, et ne plus construire d'objet mock métier directement dans un fichier de test.

Les factories disponibles et leur signature sont dans le dossier, elles ne sont pas recopiées ici : `createMockStock` et ses voisines vivent dans `src/test/fixtures/stock.ts`, les autres domaines ont leur propre fichier.

## Conséquences

- **Positif** : un changement de forme se répercute en un seul endroit, et le typage garantit que les fixtures suivent les types de production ([ADR-003](./ADR-003-types-centralises.md))
- **Positif** : les tests raccourcissent, la donnée n'encombre plus l'assertion
- **Négatif** : une indirection à la lecture, il faut ouvrir la factory pour connaître les valeurs par défaut
- **Négatif** : une factory générique peut masquer un cas limite qu'un mock écrit sur place aurait forcé à expliciter

## Critères de vérification

Rouvrir cette décision si des régressions apparaissent sur des cas limites que les valeurs par défaut des factories masquaient.

## Liens

- Code concerné : `src/test/fixtures/`
- Guide de tests : [Guide de tests](../../docs/5-TESTING-GUIDE.md)
- ADR liée : [ADR-003](./ADR-003-types-centralises.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
