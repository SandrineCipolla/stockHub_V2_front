# Architecture Decision Records (ADRs) — Frontend

Ce dossier contient les **Architecture Decision Records** du frontend StockHub V2.

Les décisions structurantes du backend vivent dans `stockhub_back/docs/adr/`, avec leur propre numérotation locale. Le [wiki du projet](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Architecture-Decision-Records) tient la table de correspondance entre les deux séquences (front et back ne partagent pas une numérotation commune). Les fichiers ci-dessous restent la source de vérité pour le texte complet des ADR front.

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
| [ADR-020](./ADR-020-fetch-natif-plutot-quaxios.md) | fetch natif plutôt qu'un client HTTP dédié (Axios / ky)         | 2026-09 | ✅ Accepté |

> Numérotation locale à ce repo : le prochain numéro est le plus grand numéro existant dans ce tableau, plus un (donc après ADR-020 actuellement). Elle ne correspond pas à celle de `stockhub_back` ni à un ordre global. ADR-003 et ADR-013 à ADR-019 n'existent pas dans ce repo : ce sont des décisions backend, à consulter dans `stockhub_back/docs/adr/`.

## Comment créer un nouvel ADR

1. Copier `TEMPLATE.md`
2. Lister ce dossier pour trouver le plus grand numéro existant, le nouveau numéro est ce numéro plus un
3. Nom de fichier : `ADR-NNN-titre-en-kebab-case.md`
4. Ajouter la ligne dans ce tableau
5. Mettre à jour la table de correspondance sur le wiki

## Modifier un ADR existant

Les ADR sont immuables une fois acceptés. Si une décision change, créer un nouvel ADR qui supplante l'ancien et mettre à jour son statut : `Supplanté par ADR-XXX`.
