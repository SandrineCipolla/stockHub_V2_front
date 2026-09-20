---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-007-react-19.md
---

# ADR-008 - Vite comme build tool plutôt que Create React App ou Webpack

**Date** : 2025-04

---

## Contexte

Choix de l'outil de build pour le frontend React et TypeScript ([ADR-007](./ADR-007-react-19.md)). Create React App était le standard historique de l'écosystème, mais il est officiellement déprécié depuis 2023 et la documentation React ne le recommande plus.

## Décision

Vite, avec `@vitejs/plugin-react`.

Ce qui a emporté la décision : un serveur de développement à démarrage quasi instantané, grâce aux modules ES natifs, là où un build Webpack demande plusieurs secondes à chaque rechargement. La configuration TypeScript et les alias de chemins sont pris en charge sans éjection, et l'outil est activement maintenu.

## Alternatives

| Alternative                 | Pourquoi rejetée                                                    |
| --------------------------- | ------------------------------------------------------------------- |
| Create React App            | Déprécié officiellement, sans maintenance                           |
| Webpack configuré à la main | Coût de configuration et d'entretien injustifié pour un projet solo |
| Parcel                      | Moins adopté en entreprise, écosystème plus restreint               |
| Turbopack                   | Lié à Next.js, écarté avec lui ([ADR-007](./ADR-007-react-19.md))   |

## Conséquences

- **Positif** : rechargement à chaud quasi instantané, confort de développement élevé
- **Positif** : au moment de la mesure, build de production à 113,99 KB gzippé et score Lighthouse Performance de 99 sur 100. Les valeurs courantes sont dans `documentation/9-DASHBOARD-QUALITY.md`
- **Négatif** : écosystème de plugins plus jeune que celui de Webpack sur les cas de niche
- **Négatif** : les variables d'environnement suivent la convention Vite, avec un `.env.local` prioritaire sur `.env`, source d'un piège récurrent en développement local documenté dans [CLAUDE.md](../../CLAUDE.md)

## Critères de vérification

Rouvrir cette décision si la taille du build ou le score Lighthouse se dégradent nettement avec la croissance du projet.

## Liens

- Configuration : `vite.config.ts`
- ADR liée : [ADR-007](./ADR-007-react-19.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
