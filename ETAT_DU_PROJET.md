# StockHub V2 Frontend - État du projet

> **Date de rédaction** : 22 septembre 2026  
> **Dernière activité** : 22 septembre 2026  
> **Branche active** : `main`  
> **Version** : v1.17.1

Tableau de bord de l'état courant du frontend et point de reprise. La documentation complète est indexée dans [docs/0-INDEX.md](docs/0-INDEX.md), le suivi des tickets sur le [GitHub Project](https://github.com/users/SandrineCipolla/projects/3).

---

## Directives d'archivage des sessions

Un bloc de session bascule dans [docs/sessions/](docs/sessions/) dès qu'il dépasse un mois d'ancienneté ou lorsque ce document compte plus de 3 sessions actives. Ce tableau de bord ne conserve que les 2 à 3 sessions les plus récentes pour garantir une lecture rapide et synthétique.

---

## Vue d'ensemble

| Champ             | Valeur                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| **Stack**         | React, TypeScript strict, Vite, TailwindCSS, Framer Motion (versions dans `package.json`) |
| **Design System** | `@stockhub/design-system` (Web Components Lit, version dans `package.json`)               |
| **Auth**          | Azure AD B2C (MSAL React)                                                                 |
| **Tests**         | 558 tests unitaires et de composants, 5 tests E2E Playwright                              |
| **Qualité**       | ESLint 0 warning (`--max-warnings 0`), 0 vulnérabilité npm                                |
| **Prod**          | Azure Static Web Apps (branche `main`)                                                    |
| **Staging**       | Vercel (branche `staging`)                                                                |
| **Soutenance**    | RNCP7, mars 2027                                                                          |

---

## Sessions récentes

### 22 septembre 2026

| Ticket | Action                                                                     | PR   |
| ------ | -------------------------------------------------------------------------- | ---- |
| #281   | Consolidation des guides de métriques de qualité et archivage des doublons | #295 |
| #283   | Rafraîchissement et allègement d'ETAT_DU_PROJET.md, alignement ISO back    | #297 |

Nettoyage et harmonisation de la documentation. Les guides de métriques 10, 11, 12 et 13 ont été déplacés dans `docs/archive/metrics/` et centralisés dans `docs/15-APP-QUALITY-METRICS.md`. Le tableau de bord a été allégé avec archivage des sessions de juin et juillet 2026 dans `docs/sessions/`.

### 21 septembre 2026

| Ticket | Action                                                                  | PR   |
| ------ | ----------------------------------------------------------------------- | ---- |
| #287   | ESLint ramené à zéro avertissement et imposé en CI (`--max-warnings 0`) | #294 |
| #279   | Unification de la documentation sous le dossier unique `docs/`          | #292 |
| #278   | Suppression des versions et métriques figées dans les guides            | #291 |
| #280   | Rangement `.claude` et archivage des documents de travail               | #290 |

Toute la documentation est désormais regroupée dans `docs/`. ESLint est appliqué de manière stricte sans aucun warning toléré en CI. Les règles de rédaction des revues de PR ont été ajoutées dans `CONTRIBUTING.md`.

### 20 septembre 2026

| Ticket | Action                                                                     | PR   |
| ------ | -------------------------------------------------------------------------- | ---- |
| -      | Release v1.17.1                                                            | #285 |
| #263   | Rapatriement des ADR d'architecture front depuis le wiki vers l'ADR-012    | #286 |
| #275   | Vérification des liens Markdown et du guide de rédaction dans `ci:quality` | #276 |
| -      | Résorption des 37 vulnérabilités npm en un lot unique                      | #284 |
| #273   | Alignement et nettoyage documentaire multi-repos ISO                       | #274 |

Mise en place de `scripts/check-docs.mjs` pour contrôler automatiquement les liens morts et le respect du guide de rédaction lors des checks CI. Résolution de l'ensemble des vulnérabilités npm.

---

## Ce qui est livré et fonctionnel

- **Authentification et autorisations** : Login/logout Azure AD B2C, gestion des rôles OWNER, VIEWER_CONTRIBUTOR, VIEWER par stock.
- **Gestion des stocks** : Création, édition, suppression (avec modale de confirmation #61), affichage dynamique des statuts.
- **Gestion des items** : Ajout, édition inline, note libre (#142), vue cards responsive sur mobile (#165), page détail d'item (`/stocks/:stockId/items/:itemId` #181).
- **Notifications et alertes** : Compteur global dans le header (#183), panneau latéral de notifications (#163) avec filtres par niveau d'alerte.
- **Tests et qualité** : 558 tests unitaires et de composants, 5 tests E2E Playwright couvrant les 4 workflows Must-Have (#66, #101), lancés contre le staging.

---

## Qualité et outillage

- TypeScript strict (0 erreur).
- ESLint 0 warning (`--max-warnings 0`).
- Pre-commit (linting et type-check) et pre-push (tests et knip code mort) via Husky.
- Validation automatique des liens doc et de la qualité rédactionnelle via `npm run check:docs`.
- Workflows E2E Playwright réguliers en CI contre l'environnement de staging.

---

## Où en est l'application

Le projet est dans la phase d'harmonisation et de consolidation RNCP 7.
L'état réel de chaque ticket est suivi sur le [GitHub Project](https://github.com/users/SandrineCipolla/projects/3) et dans les [issues ouvertes](https://github.com/SandrineCipolla/stockHub_V2_front/issues).

---

## Pour reprendre rapidement

```bash
npm install
npm run dev
npm run test:run
npm run check:docs
```

Le déploiement est décrit dans le [README.md](README.md), les URL de chaque environnement dans [CLAUDE.md](CLAUDE.md).
