# ADR-004: Types TypeScript centralisés dans `src/types/`

**Date:** 2025-10
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Lors du refactoring des tests, plusieurs interfaces TypeScript étaient dupliquées entre composants, hooks et fichiers de tests.

## Contraintes et critères

**Critères :**

- Zéro duplication de types
- Compatibilité ascendante avec les tests existants

## Décision

Centraliser **tous** les types dans `src/types/` :

- `index.ts` — Types métier (Stock, StockItem, StockStatus, etc.)
- `components.ts` — Props des composants
- `error.ts` — FrontendError, LoadingState, AsyncFrontendState

Supprimer toutes les interfaces locales dans les composants et hooks.

## Alternatives considérées

### Alternative 1: Types colocalisés avec chaque composant

- **Avantages:** proximité code/type, pas d'indirection
- **Inconvénients:** duplication dès qu'un type est partagé entre 2 composants (déjà observé en pratique)
- **Pourquoi rejetée:** la duplication était le problème initial déclencheur de cet ADR

## Conséquences

### Positives

- Architecture types 100% DRY, zéro duplication
- Re-exports pour compatibilité avec les tests existants

### Négatives

- Un fichier `src/types/index.ts` volumineux à naviguer
- Indirection supplémentaire pour retrouver la définition d'un type depuis un composant

## Réexamen

Rouvrir si `src/types/index.ts` devient difficile à naviguer (découper par domaine plutôt que par usage).

## Liens

- Code concerné: `src/types/`

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
