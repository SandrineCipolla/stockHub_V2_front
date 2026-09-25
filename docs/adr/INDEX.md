# Architecture Decision Records (ADR) - Frontend

Ce dossier contient les Architecture Decision Records du frontend StockHub V2. Les fichiers de ce dossier sont la source de vérité : le wiki présente une vue transverse aux trois repos, il ne remplace pas ces fichiers.

## Numérotation

Chaque repo numérote ses ADR localement, à partir de 001, sans trou. Le numéro d'une ADR front ne correspond à rien dans `stockhub_back` ni dans `stockhub_design_system` : l'ADR-007 du front (React 19) et l'ADR-007 du back (standards qualité) sont deux décisions sans rapport.

Une référence croisée entre repos se fait par lien explicite vers le fichier de l'autre repo, jamais par numéro seul. La table de correspondance entre les trois séquences vit sur le [wiki](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Architecture-Decision-Records).

## Liste des ADR

| #                                                        | Titre                                                                        | Date       | Statut                |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------- | --------------------- |
| [ADR-001](./ADR-001-separation-design-system.md)         | Séparation du Design System en repository indépendant                        | 2025-10    | Accepté               |
| [ADR-002](./ADR-002-web-components-lit.md)               | Web Components (Lit) plutôt que composants React purs                        | 2025-10    | Accepté               |
| [ADR-003](./ADR-003-types-centralises.md)                | Types TypeScript centralisés dans `src/types/`                               | 2025-10    | Accepté               |
| [ADR-004](./ADR-004-fixtures-centralisees.md)            | Fixtures de test centralisées                                                | 2025-10    | Accepté               |
| [ADR-005](./ADR-005-deploiement-vercel.md)               | Déploiement frontend sur Vercel plutôt qu'Azure Static Web Apps              | 2025       | Supplanté par ADR-013 |
| [ADR-006](./ADR-006-coexistence-api-v1-v2.md)            | Coexistence des API V1 et V2 côté consommation frontend                      | 2025       | Accepté               |
| [ADR-007](./ADR-007-react-19.md)                         | Choix du framework frontend : React 19                                       | 2025-04    | Accepté               |
| [ADR-008](./ADR-008-vite-build-tool.md)                  | Vite comme build tool plutôt que Create React App ou Webpack                 | 2025-04    | Accepté               |
| [ADR-009](./ADR-009-css-moderne-container-has.md)        | CSS moderne : Container Queries et `:has()`                                  | 2026-02    | Accepté               |
| [ADR-010](./ADR-010-items-responsive-dual-view.md)       | Dual-view responsive pour les items de stock                                 | 2026-06-15 | Accepté               |
| [ADR-011](./ADR-011-playwright-auth-reelle.md)           | Playwright avec authentification interactive réelle pour les E2E frontend    | 2026-07    | Accepté               |
| [ADR-012](./ADR-012-fetch-natif-plutot-quaxios.md)       | fetch natif plutôt qu'un client HTTP dédié (Axios / ky)                      | 2026-09-09 | Accepté               |
| [ADR-013](./ADR-013-production-azure-previews-vercel.md) | Production sur Azure Static Web Apps, Vercel pour les previews et le staging | 2026-09-25 | Accepté               |

## Créer une nouvelle ADR

1. Copier `TEMPLATE.md`, commun aux trois repos
2. Prendre le numéro qui suit le plus grand de ce tableau
3. Nommer le fichier `ADR-NNN-titre-en-kebab-case.md`
4. Ajouter la ligne dans le tableau ci-dessus
5. Mettre à jour la table de correspondance du wiki

## Modifier une ADR existante

Les ADR sont immuables une fois acceptées. Si une décision change, créer une nouvelle ADR qui supplante l'ancienne et passer le `status` de son frontmatter à `SUPPLANTÉ PAR ADR-NNN`.
