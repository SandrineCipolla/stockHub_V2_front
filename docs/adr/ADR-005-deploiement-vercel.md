---
author: Sandrine Cipolla
status: ACCEPTÉ
related:
---

# ADR-005 - Déploiement frontend sur Vercel plutôt qu'Azure Static Web Apps

**Date** : automne 2025

---

## Contexte

Le backend tourne sur Azure. Héberger le frontend au même endroit aurait été le choix par défaut, mais le frontend est une SPA React buildée par Vite, avec un besoin fort de prévisualisation par pull request.

Contrainte de fond : budget nul ou quasi nul, le projet servant de support à une certification.

Critères retenus pour trancher : coût, disponibilité d'URL de prévisualisation par PR, et intégration native avec Vite.

## Décision

Déployer le frontend sur **Vercel**, plan gratuit, et laisser le backend sur **Azure App Service**.

Ce qui a emporté la décision : une URL de preview par pull request, sans configuration, et un build détecté sans paramétrage. Front et back sont déjà deux applications déployées séparément, la cohérence de fournisseur cloud n'apporte donc rien ici, contrairement à la base de données qui reste collée au backend.

## Alternatives

| Alternative           | Pourquoi rejetée                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Azure Static Web Apps | Cohérence de fournisseur avec le backend, mais moins mature sur les déploiements de preview par PR et expérience de développement moins fluide avec Vite au moment du choix |

## Conséquences

- **Positif** : chaque PR est consultable sur une URL réelle avant merge
- **Positif** : coût nul sur le plan gratuit
- **Négatif** : deux clouds à gérer, deux portails, deux facturations, des journaux non centralisés
- **À surveiller** : la production tourne aujourd'hui sur Azure Static Web Apps, Vercel sert le staging et les previews. Cette répartition est un état de fait, pas une cible

## Critères de vérification

Rouvrir cette décision si la gestion de deux fournisseurs devient un frein réel, ou si Azure Static Web Apps rattrape son retard sur les previews par PR.

## Liens

- Environnements : section Environnements de [CLAUDE.md](../../CLAUDE.md)
- ADR liée (backend) : [ADR-006 MySQL sur Azure](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-006-mysql-azure-cloud.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
