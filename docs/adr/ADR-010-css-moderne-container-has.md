# ADR-010: CSS moderne — Container Queries et :has()

**Date:** 2026-02
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

StockHub V2 utilise TailwindCSS avec des breakpoints viewport (`@media`) pour les layouts responsives. Deux fonctionnalités CSS modernes — `@container` et `:has()` — offrent des capacités complémentaires non disponibles via Tailwind seul.

## Décision

Adopter `@container` pour les grilles de composants réutilisables et `:has()` pour la différenciation visuelle basée sur le contenu, dans `src/styles/index.css`.

## Raisons

**`@container` plutôt que `@media` pour `StockGrid`** : `StockGrid` utilise des breakpoints viewport Tailwind (`lg:grid-cols-2`, `xl:grid-cols-3`). Ces breakpoints fonctionnent sur le Dashboard actuel, mais échoueraient si le composant était embarqué dans une sidebar ou une modal plus étroite que le viewport. `@container` répond à la largeur du **conteneur immédiat**, garantissant un comportement cohérent dans n'importe quel contexte d'insertion.

**`:has()` pour la mise en évidence des stocks en alerte** : React pourrait gérer la mise en évidence via un state et des classes conditionnelles, mais cela implique un re-render. `:has()` permet au CSS de détecter l'attribut `[status]` posé sur `<sh-stock-card>` (Web Component) et d'appliquer un style au conteneur parent, de façon déclarative et synchrone — zéro JavaScript, zéro re-render.

## Hypothèses et preuves

| Affirmation                                                     | Type   | Vérification                                                                 |
| --------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| `@container` et `:has()` couvrent 95%+ des navigateurs modernes | Preuve | caniuse.com, Q1 2026 — Chrome 105+/121+, Firefox 110+/121+, Safari 16+/15.4+ |

## Alternatives considérées

### Alternative 1: Plugin `tailwindcss-container-queries`

- **Pourquoi rejetée :** ajoute une dépendance pour ce qui peut être fait en CSS natif

### Alternative 2: State React + className conditionnels pour `:has()`

- **Pourquoi rejetée :** re-render inutile pour une information purement visuelle

### Alternative 3: `ResizeObserver` + JS pour `@container`

- **Pourquoi rejetée :** complexité injustifiée face à une fonctionnalité CSS native équivalente

## Conséquences

### Positives

- `StockGrid` reste correct quel que soit son contexte d'insertion
- Mise en évidence des alertes sans re-render React

### Négatives

- Dépendance à des fonctionnalités CSS relativement récentes (support garanti à 95%+ mais pas 100%)

## Réexamen

Rouvrir si le support navigateur cible de StockHub descend sous la couverture actuelle de `@container`/`:has()`.

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
