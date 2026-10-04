---
author: Sandrine Cipolla
status: PROPOSÉ
related: ./ADR-013-production-azure-previews-vercel.md
---

# ADR-015 - Environnements staging et feature sur Azure Static Web Apps, sans Vercel

**Date** : 2026-10-04

---

## Contexte

L'ADR-013 confie à Vercel les previews et un staging à URL fixe, relié au backend Render et à la base Aiven. Cet environnement ne fonctionne plus (relevé du 2026-09-25 dans #314) : la branche `staging` n'a pas bougé depuis mars, son URL répond 404 et les E2E hebdomadaires échouent depuis, faute de cible.

Le besoin est de tester une fonctionnalité en ligne avant de la merger, une à la fois, et de disposer d'une cible stable pour les E2E hebdomadaires. Les deux usages se gênent s'ils partagent un environnement : le lundi, les E2E testeraient la branche en cours de test.

Trois contraintes pèsent sur le choix :

- Les redirect URIs de l'application B2C s'enregistrent une par une, sans joker. Chaque URL d'environnement doit y figurer pour que la connexion aboutisse.
- Le mur d'authentification de Vercel sur les déploiements de preview impose un secret de contournement. Envoyé en en-tête global par Playwright, il part aussi vers le backend Render, dont le CORS le refuse (détail dans #314).
- Les previews Vercel par branche n'ont pas de backend, et leur URL n'est pas déclarée dans B2C.

Azure Static Web Apps publie des environnements nommés à URL stable, en plus de la production et dans la même ressource. Au 2026-10-04, le plan gratuit en autorise 3.

## Décision

Deux environnements nommés sont ajoutés à la ressource Azure Static Web Apps de la production :

- **`staging`** : miroir de `main`, mis à jour à chaque push sur `main`. Il sert de cible aux E2E hebdomadaires et à la vérification avant une démonstration.
- **`feature`** : déploiement manuel d'une branche pour la tester en ligne avant son merge, une branche à la fois. Le test suivant, ou un redéploiement de `main`, la remplace.

Les deux se construisent avec l'URL du backend de test (Render, base Aiven) et non celle de la production. La production reste celle de l'ADR-013 : Azure Static Web Apps, branche `main`, backend et base sur Azure. Vercel n'héberge plus d'environnement stable. Une fois acceptée, cette ADR supplante l'ADR-013.

Raisons :

- **Une URL par environnement, inscrite une seule fois dans B2C** et dans le CORS de Render.
- **Pas de mur d'authentification** : le secret de contournement et le conflit CORS disparaissent.
- **Un miroir de `main` stable** pour les E2E, séparé de l'environnement où une branche est en test.
- **Un seul hébergeur de frontend** pour la production et les tests.

## Alternatives

| Alternative                                                                                 | Pourquoi rejetée                                                                                                                                      |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Un seul emplacement `staging` sur Vercel                                                    | Garde deux hébergeurs et le mur d'authentification. Le même environnement sert de miroir de `main` et de banc d'essai, ce qui fausse les E2E du lundi |
| Un environnement par PR ou par branche, avec inscription B2C automatisée (Graph)            | Une inscription B2C par variante et un secret de CI capable de modifier l'application B2C, pour un besoin qui reste de tester une chose à la fois     |
| Previews Render par PR, pour tester aussi le backend                                        | URL dynamique à propager au frontend et au CORS, base Aiven partagée. Le besoin actuel porte sur le frontend                                          |
| E2E en CI contre `localhost`, sans environnement en ligne                                   | Ne couvre pas le test d'une fonctionnalité en ligne avant son merge. Faisabilité non évaluée                                                          |
| `staging` obligatoire avant la production (`main` -> `staging` -> validation -> production) | Change le flux de déploiement et ajoute une étape manuelle, sans filet de sécurité demandé pour l'instant                                             |

## Conséquences

- **Positif** : les E2E hebdomadaires ont une cible stable, sans contournement Vercel
- **Positif** : un seul hébergeur de frontend, sans coût supplémentaire dans la limite du plan gratuit
- **Positif** : tester une branche ne touche ni la production ni le miroir de `main`
- **Négatif** : les deux URL sont à enregistrer à la main dans B2C et dans `ALLOWED_ORIGINS` de Render, une fois chacune
- **Négatif** : `feature` ne teste que le frontend. Le backend de test suit `main`, donc le code backend ne se teste qu'après son merge
- **Négatif** : une seule branche à la fois dans `feature`
- **Négatif** : les deux environnements sont publics, avec des comptes et des données de test uniquement
- **Négatif** : le garde-fou qui refuse de lancer les E2E contre la production (#317) bloque `*.azurestaticapps.net` et doit accepter ces deux hôtes
- **Négatif** : la documentation de déploiement décrit encore le staging Vercel et est à réécrire
- **Négatif** : le premier appel au backend Render après une pause est lent, le plan gratuit éteint le service après 15 minutes sans trafic
- **À trancher** : le sort des previews Vercel par branche, qui subsistent sans servir à tester

## Critères de vérification

Avant de passer l'ADR à `ACCEPTÉ` :

- Un déploiement manuel de `feature` depuis une branche autre que `main` laisse la production inchangée
- Un push sur `main` met à jour `staging`, et la production appelle toujours le backend Azure alors que `staging` appelle celui de Render
- Les URL réelles des deux environnements sont inscrites dans B2C et la connexion aboutit sur chacune
- Le backend Render accepte les deux origines, la production Azure aucune des deux
- Les E2E hebdomadaires passent contre `staging`

Ensuite :

- Rouvrir la décision si tester plusieurs branches en parallèle ou du code backend avant son merge devient nécessaire

## Liens

- Issue GitHub : #314
- Garde-fou des E2E : `tests/e2e-frontend/production-guard.ts`, #317
- ADR supplantée une fois celle-ci acceptée : [ADR-013](./ADR-013-production-azure-previews-vercel.md)
- Documentation externe : [Environnements nommés d'Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/named-environments), [Quotas d'Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/quotas)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
