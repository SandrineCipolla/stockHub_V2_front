# ADR-001: Séparation du Design System en repository indépendant

**Date:** 2025-10
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Le frontend V2 avait initialement des composants UI directement dans le repo. La démultiplication des composants et le besoin de les documenter de façon interactive ont posé la question de leur organisation.

## Contraintes et critères

**Contraintes :**

- Projet développé en solo (~1 jour/semaine) : pas de budget temps pour une infrastructure monorepo complexe.

**Critères :**

- Réutilisabilité future (mobile, autres projets)
- Qualité et documentation des composants vérifiables indépendamment du frontend

## Décision

Extraire les composants UI dans un repository séparé `stockhub_design_system`, publié comme package npm `@stockhub/design-system`.

## Alternatives considérées

### Alternative 1: Monorepo

- **Avantages:** un seul repo, pas de cycle de publication
- **Inconvénients:** tooling monorepo (workspaces, build orchestration) disproportionné pour un projet solo
- **Pourquoi rejetée:** trop complexe pour un projet solo

### Alternative 2: Dossier `packages/` dans le même repo

- **Avantages:** simplicité, pas de publication npm
- **Inconvénients:** pas de documentation Storybook indépendante, pas de validation qualité isolée
- **Pourquoi rejetée:** compromis envisageable si le projet devait être refait, mais pas retenu ici

## Conséquences

### Positives

- Documentation Storybook indépendante et déployée en continu (Chromatic)
- Réutilisabilité future (mobile, autres projets)
- Séparation nette des responsabilités
- Validation indépendante de la qualité des composants (Lighthouse 99/100 DS)

### Négatives

- Overhead de maintenance d'un troisième repository
- Nécessite un cycle de release pour propager les changements au frontend

## Réexamen

Rouvrir si le cycle de publication (bump de version + release + install côté front) devient un frein mesurable à la vélocité (ex: plusieurs jours d'attente répétés pour propager un changement de composant).

## Liens

- Repo: [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system)
- Package: `@stockhub/design-system`
- ADR lié: [ADR-002 (Web Components Lit)](./ADR-002-web-components-lit.md)

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
