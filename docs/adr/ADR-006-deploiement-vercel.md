# ADR-006: Déploiement frontend sur Vercel plutôt qu'Azure Static Web Apps

**Date:** 2025 (automne)
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Le backend est sur Azure, mais le frontend nécessite une plateforme adaptée aux SPA React.

## Contraintes et critères

**Contraintes :**

- Budget nul ou quasi nul (projet RNCP)

**Critères :**

- Coût
- Preview URLs par PR (revue visuelle avant merge)
- Intégration native avec Vite/React

## Décision

Déployer le frontend sur **Vercel** (plan gratuit) et le backend sur **Azure App Service**.

## Raisons

- Vercel offre des preview URLs automatiques par PR
- Intégration Vite/React native
- Coût : 0€ (plan hobby)
- Azure reste réservé au backend et à MySQL (~15-20€/mois), pas de bénéfice à tout mettre sur un seul cloud ici puisque front et back sont déjà deux applications déployées séparément (cf. séparation front/back)

## Alternatives considérées

### Alternative 1: Azure Static Web Apps

- **Avantages:** cohérence cloud provider avec le backend
- **Inconvénients:** moins mature sur les preview deployments par PR, DX moins fluide pour Vite au moment du choix
- **Pourquoi rejetée:** le bénéfice de cohérence cloud ne compensait pas la perte de DX pour un frontend statique sans lien de dépendance réseau fort avec le backend (contrairement à la base de données, cf. ADR-006 backend)

## Conséquences

### Positives

- Preview URL automatique sur chaque PR, revue visuelle facilitée
- Coût nul

### Négatives

- Deux clouds différents à gérer (Vercel + Azure) : deux portails, deux facturations, logs non centralisés

## Réexamen

Rouvrir si le projet devait unifier son infrastructure sous un seul provider (ex: si Azure Static Web Apps devient significativement meilleur, ou si la gestion de deux clouds devient un frein réel).

## Liens

- Démo live: https://stock-hub-v2-front.vercel.app/

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
