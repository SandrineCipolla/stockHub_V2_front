# ADR-008 - Vite comme build tool plutôt que Create React App ou Webpack

**Date** : avril 2025
**Statut** : Accepté

---

## Contexte

Create React App, l'outil de démarrage historique de l'écosystème React, est officiellement déprécié depuis 2023 et n'est plus maintenu. Un build tool devait être choisi pour le projet.

## Décision

Vite, avec `@vitejs/plugin-react`.

Motifs du choix :

- Serveur de développement à démarrage quasi instantané, rechargement à chaud rapide
- Configuration minimale pour un projet React et TypeScript standard
- Outil activement maintenu, contrairement à CRA

## Alternatives

| Alternative                 | Raison du rejet                                           |
| --------------------------- | --------------------------------------------------------- |
| Create React App            | Déprécié, plus de maintenance                             |
| Webpack configuré à la main | Coût de configuration et de maintenance sans bénéfice ici |

## Conséquences

- **Positif** : build de production mesuré à 113,99 KB gzippé, score Lighthouse Performance de 99/100 au moment de la mesure
- **Négatif** : les variables d'environnement suivent la convention Vite (`VITE_`, chargement `.env.local` prioritaire), source d'un piège récurrent en développement local documenté dans [CLAUDE.md](../../CLAUDE.md)

## Liens

- Configuration : `vite.config.ts`
- Décision liée : [ADR-007](./ADR-007-react-19.md)
