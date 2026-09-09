# ADR-009: Vite comme build tool plutôt que Create React App / Webpack

**Date:** 2025-04
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Choix de l'outil de build pour le frontend React 19 + TypeScript. Create React App (CRA) était le standard historique mais est officiellement déprécié depuis 2023.

## Décision

Vite 6 avec le plugin `@vitejs/plugin-react`.

## Raisons

- CRA est déprécié — la documentation React officielle ne le recommande plus depuis 2023
- Vite offre un démarrage quasi instantané (HMR < 100ms vs plusieurs secondes avec Webpack) grâce aux ES modules natifs en développement
- La configuration TypeScript et les alias de chemins (`@/`) sont nativement supportés sans éjection
- Vite est recommandé par l'écosystème React (Vite, Remix, Next.js ont tous migré vers des bundlers modernes)

## Alternatives considérées

### Alternative 1: Create React App

- **Pourquoi rejetée :** déprécié officiellement, non maintenu

### Alternative 2: Webpack standalone

- **Pourquoi rejetée :** complexité de configuration injustifiée pour un projet solo

### Alternative 3: Parcel

- **Pourquoi rejetée :** moins adopté en entreprise, écosystème plus restreint

### Alternative 4: Turbopack (Next.js)

- **Pourquoi rejetée :** lié à Next.js, non applicable à une SPA Vite (cf. ADR-008)

## Conséquences

### Positives

- HMR quasi instantané, confort de développement élevé
- Build de production mesuré : 113,99 KB gzippé
- Lighthouse Performance : 99/100

### Négatives

- Écosystème de plugins plus jeune que Webpack sur certains cas de niche

## Réexamen

Rouvrir si le build de production ou le score Lighthouse se dégrade significativement avec la croissance du projet.

## Liens

- ADR lié: [ADR-008 (React 19)](./ADR-008-react-19.md)

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
