---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-010-items-responsive-dual-view.md
---

# ADR-009 - CSS moderne : Container Queries et `:has()`

**Date** : 2026-02

---

## Contexte

L'application utilise TailwindCSS avec des breakpoints de viewport pour ses mises en page. Deux besoins que Tailwind seul ne couvre pas sont apparus.

D'abord l'adaptation au conteneur. `StockGrid` utilise des breakpoints de viewport, qui fonctionnent sur le tableau de bord actuel mais échoueraient si le composant était inséré dans une barre latérale ou une modale plus étroite que la fenêtre.

Ensuite la différenciation visuelle selon le contenu. Mettre en évidence les stocks en alerte pouvait passer par un état React et des classes conditionnelles, au prix d'un rendu supplémentaire pour une information purement visuelle.

## Décision

Adopter `@container` pour les grilles de composants réutilisables, et `:has()` pour la différenciation visuelle fondée sur le contenu. Les règles vivent dans `src/styles/index.css`.

Ce qui a emporté la décision : `@container` répond à la largeur du conteneur immédiat, ce qui rend le comportement du composant indépendant de son contexte d'insertion. `:has()` laisse le CSS détecter l'attribut `status` posé sur `<sh-stock-card>` et styler le conteneur parent, de façon déclarative et synchrone, sans JavaScript ni nouveau rendu.

## Hypothèses et preuves

| Affirmation                                                             | Nature | Vérification                                                                                    |
| ----------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `@container` et `:has()` couvrent plus de 95 % des navigateurs modernes | Preuve | caniuse.com au premier trimestre 2026, Chrome 105 et 121, Firefox 110 et 121, Safari 16 et 15.4 |

## Alternatives

| Alternative                            | Pourquoi rejetée                                                 |
| -------------------------------------- | ---------------------------------------------------------------- |
| Plugin `tailwindcss-container-queries` | Ajoute une dépendance pour ce que le CSS natif fait déjà         |
| État React et classes conditionnelles  | Rendu supplémentaire pour une information purement visuelle      |
| `ResizeObserver` en JavaScript         | Complexité injustifiée face à une fonctionnalité CSS équivalente |

## Conséquences

- **Positif** : `StockGrid` reste correct quel que soit son contexte d'insertion
- **Positif** : mise en évidence des alertes sans rendu React supplémentaire
- **Négatif** : dépendance à des fonctionnalités récentes, couvertes à plus de 95 % mais pas universellement
- **Négatif** : ces sélecteurs ne sont pas couverts par les tests jsdom, qui n'applique pas le CSS. La vérification passe par les tests E2E ou l'inspection manuelle

## Critères de vérification

Rouvrir cette décision si le socle de navigateurs visé descend sous la couverture actuelle de `@container` et `:has()`.

## Liens

- Code concerné : `src/styles/index.css`
- ADR liée : [ADR-010](./ADR-010-items-responsive-dual-view.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
