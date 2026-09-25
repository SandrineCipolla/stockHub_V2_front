---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-005-deploiement-vercel.md
---

# ADR-013 - Production sur Azure Static Web Apps, Vercel pour les previews et le staging

**Date** : 2026-09-25

---

## Contexte

L'ADR-005 annonçait un déploiement du frontend sur Vercel. Cette décision n'a jamais été appliquée : la production du frontend tourne sur Azure Static Web Apps depuis la V1, et l'ADR-005 le reconnaissait déjà dans ses conséquences comme « un état de fait, pas une cible ». Cette ADR décrit la répartition réelle et la raison de chaque hébergeur.

Au démarrage de la V2, seul le frontend était en développement. Il fallait montrer l'interface aux encadrants sans toucher à la production V1 et sans backend V2 déployé.

## Décision

- **Production** : Azure Static Web Apps, branche `main`, workflow `.github/workflows/azure-static-web-apps-deploy.yml`. C'est l'hébergement de la V1, conservé pour la V2. Le backend et la base de production sont aussi sur Azure.
- **Previews et staging** : Vercel. Chaque branche poussée obtient une URL de preview, ce qui a permis de montrer l'interface V2 aux encadrants avant l'existence d'un backend V2 déployé. La branche `staging` a une URL fixe, qui sert d'environnement de test relié au backend Render et à la base Aiven.
- **Pas de production sur Vercel** : `vercel.json` désactive le déploiement de `main` (`git.deploymentEnabled`, #315). Une seule URL de production existe, celle d'Azure.

## Alternatives

| Alternative                    | Pourquoi rejetée                                                                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tout sur Vercel (ADR-005)      | Aurait demandé de migrer une production V1 qui fonctionnait. Une deuxième production Vercel a existé par défaut et ouvrait un accès non documenté au backend de production (CORS, redirect URI B2C) |
| Tout sur Azure Static Web Apps | Au démarrage de la V2, la ressource Azure Static Web Apps servait la V1 en production. Vercel donnait un hébergement séparé et immédiat pour montrer l'interface V2 en cours de développement       |

## Conséquences

- **Positif** : la production reste sur le même cloud que le backend et la base
- **Positif** : une URL par branche pour montrer ou tester une fonctionnalité avant merge
- **Négatif** : deux hébergeurs, deux portails, deux jeux de variables d'environnement à garder cohérents
- **Négatif** : une URL de preview par branche doit être déclarée dans les redirect URIs B2C pour permettre la connexion. Seule l'URL fixe de `staging` l'est, le test d'une branche passe donc par `staging` (#314)

## Critères de vérification

- Aucune URL Vercel ne figure dans `ALLOWED_ORIGINS` du backend de production, et la seule URL Vercel des redirect URIs B2C est celle de `staging`
- Un merge dans `main` ne produit aucun déploiement de production sur Vercel
- Rouvrir la décision si la gestion de deux hébergeurs devient un frein réel, par exemple des variables d'environnement qui divergent entre Azure et Vercel

## Liens

- ADR supplantée : [ADR-005](./ADR-005-deploiement-vercel.md)
- Architecture de déploiement : [docs/technical/DEPLOYMENT-ARCHITECTURE.md](../technical/DEPLOYMENT-ARCHITECTURE.md)
- Issues : #314 (staging), #315 (désactivation de la production Vercel)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
