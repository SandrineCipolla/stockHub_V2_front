---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-009-css-moderne-container-has.md
---

# ADR-010 - Dual-view responsive pour les items de stock

**Date** : 2026-06-15
**Issue** : #165

---

## Contexte

La page `StockDetailPage` affichait les items d'un stock dans un tableau HTML. Sur mobile, ce tableau était tronqué et illisible malgré `overflow-x-auto`. Les utilisateurs ne pouvaient ni lire les données ni atteindre les boutons d'action, modifier et supprimer, qui n'apparaissaient qu'au survol donc jamais sur écran tactile.

## Décision

Rendre deux vues simultanément dans le DOM et alterner leur visibilité en CSS : des cartes sur mobile, le tableau existant sur desktop, via les classes Tailwind `md:hidden` et `hidden md:block`.

Le rendu des deux vues se trouve dans `src/pages/StockDetailPage.tsx`, et le composant de carte mobile dans `src/components/items/ItemMobileCard.tsx`. Ce composant est autonome et reçoit les mêmes props et callbacks que les lignes du tableau.

Ce qui a emporté la décision : aucune logique ni aucun état ne change, la pagination et les callbacks restent les mêmes, et le tableau desktop est préservé à l'identique.

## Contrainte découverte : conflit `autoFocus` entre les deux vues

Les deux vues partagent l'état `editingQuantityId`. À l'ouverture de l'éditeur inline, l'input desktop prenait le focus grâce à `autoFocus`, puis l'input mobile le lui volait, ce qui déclenchait le `onBlur` du desktop, lequel remettait `editingQuantityId` à `null` et fermait l'éditeur aussitôt.

Correctif : `autoFocus` retiré de la vue mobile uniquement. Le desktop le conserve pour le confort clavier. Sur mobile, toucher la valeur ouvre l'input sans focus automatique, ce qui est acceptable sur tactile.

## Impact sur les tests

jsdom n'applique pas le CSS, les deux vues sont donc visibles en même temps pendant les tests. Deux conséquences concrètes : les requêtes par texte doivent utiliser `getAllByText` plutôt que `getByText`, et les requêtes par rôle doivent être délimitées par les `data-testid` posés sur la seule vue desktop.

## Alternatives

| Alternative                                  | Pourquoi rejetée                                                      |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `overflow-x-scroll` seul                     | Expérience dégradée, navigation difficile                             |
| Tableau réorganisé en colonnes empilées      | Casse la sémantique `table`, `thead`, `tbody`                         |
| Composant `<sh-stock-card>` du Design System | Props insuffisantes, ni rôles ni édition inline                       |
| État local dans la carte mobile              | Désynchronisation avec la vue desktop sur la ligne en cours d'édition |

## Conséquences

- **Positif** : aucun changement de logique ni d'état, le tableau desktop ne régresse pas
- **Négatif** : deux fois plus d'éléments dans le DOM, impact négligeable avec 20 items par page au maximum
- **Négatif** : les tests doivent tenir compte de la double présence, ce qui alourdit les requêtes

## Critères de vérification

Rouvrir cette décision si un troisième point de rupture devient nécessaire, une tablette par exemple. Le motif peut être étendu, mais le coût en DOM et en tests croît à chaque vue ajoutée.

## Liens

- Code concerné : `src/pages/StockDetailPage.tsx`, `src/components/items/ItemMobileCard.tsx`
- ADR liée : [ADR-009](./ADR-009-css-moderne-container-has.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
