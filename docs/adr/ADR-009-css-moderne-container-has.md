# ADR-009 - CSS moderne : Container Queries et `:has()`

**Date** : février 2026
**Statut** : Accepté

---

## Contexte

TailwindCSS applique ses breakpoints en fonction de la largeur du viewport (`@media`). Un composant réutilisable inséré dans des conteneurs de largeurs différentes, une grille large sur une page et une colonne étroite sur une autre, reçoit pourtant le même breakpoint et s'affiche mal dans l'un des deux cas.

Par ailleurs, certaines différenciations visuelles dépendent du contenu présent dans un composant. Les traiter en JavaScript imposait un état React et un re-render pour une information purement visuelle.

## Décision

Utiliser deux fonctionnalités CSS modernes :

- `@container` pour les grilles de composants réutilisables, de sorte que le composant réagisse à la largeur de son conteneur immédiat plutôt qu'à celle du viewport
- `:has()` pour la différenciation visuelle basée sur la présence d'un contenu, sans passer par l'état React

Compatibilité vérifiée au moment du choix : plus de 95 % des navigateurs modernes (caniuse.com, premier trimestre 2026).

## Conséquences

- **Positif** : un composant s'adapte correctement quel que soit son contexte d'insertion
- **Positif** : moins de re-renders React pour des besoins purement visuels
- **Négatif** : la règle CSS devient moins évidente à lire pour qui ne connaît pas `:has()`
- **Négatif** : ces sélecteurs ne sont pas couverts par les tests jsdom, qui n'applique pas le CSS. La vérification passe par les tests E2E ou l'inspection manuelle

## Liens

- Décision liée : [ADR-010](./ADR-010-items-responsive-dual-view.md)
