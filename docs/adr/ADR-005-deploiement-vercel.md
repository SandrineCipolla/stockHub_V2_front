# ADR-005 - Déploiement frontend sur Vercel plutôt qu'Azure Static Web Apps

**Date** : automne 2025
**Statut** : Accepté

---

## Contexte

Le backend est hébergé sur Azure. Héberger le frontend sur la même plateforme aurait été le choix par défaut, mais le frontend est une SPA React buildée par Vite, avec un besoin fort de prévisualisation par pull request pendant le développement.

## Décision

Déployer le frontend sur **Vercel** (plan gratuit) et garder le backend sur **Azure App Service**.

Motifs du choix :

- URL de preview automatique pour chaque pull request, sans configuration
- Intégration native de Vite et React, build détecté sans paramétrage
- Coût nul sur le plan gratuit, contrainte réelle pour un projet personnel

## Alternatives

| Alternative                 | Raison du rejet                                                       |
| --------------------------- | --------------------------------------------------------------------- |
| Azure Static Web Apps       | Expérience de développement moins fluide pour Vite au moment du choix |
| Hébergement statique simple | Pas de preview par PR, pipeline à construire entièrement              |

## Conséquences

- **Positif** : chaque PR est testable sur une URL réelle avant merge
- **Négatif** : l'infrastructure du projet est répartie sur deux fournisseurs, avec deux consoles et deux jeux de variables d'environnement
- **À surveiller** : la production tourne aujourd'hui sur Azure Static Web Apps, Vercel sert le staging et les previews. Cette répartition est un état de fait, pas une cible

## Liens

- Environnements : `documentation/0-INDEX.md`, section Environnements de [CLAUDE.md](../../CLAUDE.md)
