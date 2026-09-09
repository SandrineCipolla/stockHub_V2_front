# Architecture Decision Records (ADRs) — Frontend

Ce dossier contient les **Architecture Decision Records** du frontend StockHub V2.

Les décisions structurantes du backend vivent dans `stockhub_back/docs/adr/`. Le [wiki du projet](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Architecture-Decision-Records) liste **toutes** les décisions (front + back) au même endroit, sous forme de résumé + lien vers la référence complète — c'est la vue d'ensemble à consulter en premier ; les fichiers ci-dessous sont la source de vérité pour le texte complet.

## Liste des ADRs

| #                                                  | Titre                                                           | Date    | Statut     |
| -------------------------------------------------- | --------------------------------------------------------------- | ------- | ---------- |
| [ADR-001](./ADR-001-separation-design-system.md)   | Séparation du Design System en repository indépendant           | 2025-10 | ✅ Accepté |
| [ADR-002](./ADR-002-web-components-lit.md)         | Web Components (Lit) plutôt que composants React purs           | 2025-10 | ✅ Accepté |
| [ADR-004](./ADR-004-types-centralises.md)          | Types TypeScript centralisés dans `src/types/`                  | 2025-10 | ✅ Accepté |
| [ADR-005](./ADR-005-fixtures-centralisees.md)      | Fixtures de test centralisées dans `test/fixtures/`             | 2025-10 | ✅ Accepté |
| [ADR-006](./ADR-006-deploiement-vercel.md)         | Déploiement frontend sur Vercel plutôt qu'Azure Static Web Apps | 2025    | ✅ Accepté |
| [ADR-007](./ADR-007-coexistence-api-v1-v2.md)      | Coexistence API V1 et V2 côté consommation frontend             | 2025    | ✅ Accepté |
| [ADR-008](./ADR-008-react-19.md)                   | Choix du framework frontend — React 19                          | 2025-04 | ✅ Accepté |
| [ADR-009](./ADR-009-vite-build-tool.md)            | Vite comme build tool plutôt que CRA / Webpack                  | 2025-04 | ✅ Accepté |
| [ADR-010](./ADR-010-css-moderne-container-has.md)  | CSS moderne : Container Queries et `:has()`                     | 2026-02 | ✅ Accepté |
| [ADR-011](./ADR-011-items-responsive-dual-view.md) | Dual-view responsive items : mobile cards + desktop table       | 2026-06 | ✅ Accepté |
| [ADR-012](./ADR-012-playwright-auth-reelle.md)     | Playwright avec auth interactive réelle pour les E2E frontend   | 2026-07 | ✅ Accepté |

> Numérotation alignée sur celle déjà utilisée par le wiki (ADR-003 et ADR-013 à ADR-019 sont des décisions backend, référencées mais non dupliquées ici — voir `stockhub_back/docs/adr/`).

## Comment créer un nouvel ADR

1. Copier `TEMPLATE.md`
2. Numéroter séquentiellement (prochain numéro libre : ADR-013 côté front)
3. Nom de fichier : `ADR-XXX-titre-en-kebab-case.md`
4. Ajouter la ligne dans ce tableau
5. Mettre à jour le résumé + lien sur le [wiki](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Architecture-Decision-Records)

## Modifier un ADR existant

Les ADR sont immuables une fois acceptés. Si une décision change, créer un nouvel ADR qui supplante l'ancien et mettre à jour son statut : `Supplanté par ADR-XXX`.
