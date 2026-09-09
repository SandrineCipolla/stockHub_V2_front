# ADR-008: Choix du framework frontend — React 19

**Date:** 2025-04
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Choix du framework principal pour StockHub V2, avec deux contraintes réelles : employabilité (projet RNCP visant une insertion professionnelle) et stratégie cross-platform (app mobile envisagée en V3).

## Contraintes et critères

**Contraintes :**

- Projet solo, ~1 jour/semaine de développement
- Objectif d'insertion professionnelle (technologie représentative du marché)

**Critères :**

- Employabilité / représentativité marché
- Compatibilité future avec une V3 mobile
- Interopérabilité avec le Design System en Web Components

## Décision

React 19 + TypeScript 5.8 + Vite 6.

## Raisons

- **Employabilité** : React représente 44,7 % d'utilisation professionnelle (Stack Overflow Developer Survey 2025) et domine les offres d'emploi et d'alternance en France. Pour un projet de certification visant l'insertion professionnelle, choisir une technologie représentative du marché est une décision d'architecture à part entière.
- **Stratégie cross-platform** : React Native partage les mêmes paradigmes (composants, hooks, TypeScript). Une V3 mobile pourrait réutiliser la logique métier sans repartir de zéro. Le Design System en Web Components (ADR-002) reste framework-agnostique et compatible avec React Native Web si nécessaire.
- **React 19 spécifiquement** : les nouvelles primitives (Actions, `useOptimistic`) simplifient la gestion des états asynchrones. Meilleure interopérabilité native avec les Web Components — critique pour l'intégration du Design System Lit.

## Hypothèses et preuves

| Affirmation                                        | Type      | Vérification                                       |
| -------------------------------------------------- | --------- | -------------------------------------------------- |
| React domine le marché de l'emploi front en France | Preuve    | Stack Overflow Developer Survey 2025               |
| Une V3 mobile sera développée                      | Hypothèse | non engagée à ce stade, oriente seulement le choix |

## Alternatives considérées

### Alternative 1: Vue 3, Svelte, Angular

- **Pourquoi rejetées :** identifiées mais non évaluées en profondeur — le rapport coût/bénéfice ne justifiait pas une investigation poussée étant donné les contraintes de temps (développement solo) et la clarté des critères de choix (employabilité, cross-platform).

### Alternative 2: Next.js

- **Inconvénients :** StockHub est une SPA entièrement authentifiée derrière Azure B2C. Le SSR de Next.js n'apporte aucune valeur sur des pages privées.
- **Pourquoi rejetée :** complexité de déploiement inutile pour une application 100 % authentifiée.

## Conséquences

### Positives

- Technologie représentative du marché de l'emploi
- Compatible avec une extension mobile future

### Négatives

- Pas de bénéfice SEO/SSR (non nécessaire ici, appli authentifiée)

## Réexamen

Rouvrir si le projet devait exposer des pages publiques nécessitant du SEO (SSR deviendrait pertinent), ou si React perdait sa position dominante sur le marché de l'emploi front en France.

## Liens

- ADR lié: [ADR-009 (Vite)](./ADR-009-vite-build-tool.md)

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
