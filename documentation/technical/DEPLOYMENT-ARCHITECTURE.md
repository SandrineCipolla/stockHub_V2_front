# Architecture de Déploiement — StockHub V2

> Documentation de l'architecture de déploiement staging (Vercel) et production (Azure).

---

## Vue d'ensemble

| Environnement  | Hébergement           | Branche   | Backend                                                                              |
| -------------- | --------------------- | --------- | ------------------------------------------------------------------------------------ |
| **Production** | Azure Static Web Apps | `main`    | Azure App Service (`stockhub-back-bqf8e6fbf6dzd6gs.westeurope-01.azurewebsites.net`) |
| **Staging**    | Vercel                | `staging` | Render.com (`stockhub-back.onrender.com`)                                            |

---

## Staging — Vercel

### Configuration

- **Intégration** : GitHub native (pas de workflow GitHub Actions)
- **Branche déployée** : `staging`
- **URL fixe** : `https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app/`
- **Preview deployments** : activés automatiquement sur chaque PR

### Fichiers de configuration

- `vercel.json` — commandes build + rewrite SPA
- `.env.staging.example` — variables de référence pour le dashboard Vercel
- `.env.staging` — valeurs réelles (gitignorées, configurées dans Vercel dashboard)

### `vercel.json`

```json
{
  "installCommand": "npm ci --no-optional && npm install --no-save @rollup/rollup-linux-x64-gnu || npm ci",
  "buildCommand": "npm run build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> Le rewrite SPA est obligatoire pour `BrowserRouter` — sans lui, toute URL directe retourne 404.

### Variables d'environnement (Vercel dashboard)

| Variable                      | Valeur staging                                                     |
| ----------------------------- | ------------------------------------------------------------------ |
| `VITE_API_SERVER_URL`         | `https://stockhub-back.onrender.com/api`                           |
| `VITE_API_V1`                 | `/v1`                                                              |
| `VITE_API_V2`                 | `/v2`                                                              |
| `VITE_CLIENT_ID`              | `0dc4acfb-ecde-4f9b-81eb-9af050fb52d9`                             |
| `VITE_TENANT_NAME`            | `stockhubb2c`                                                      |
| `VITE_AUTHORITY_DOMAIN`       | `stockhubb2c.b2clogin.com`                                         |
| `VITE_SIGN_UP_SIGN_IN_POLICY` | `B2C_1_signupsignin`                                               |
| `VITE_FORGOT_PASSWORD_POLICY` | `B2C_1_passwordreset`                                              |
| `VITE_EDIT_PROFILE_POLICY`    | `B2C_1_edit_profile` (policy à créer dans Azure B2C si nécessaire) |
| `VITE_SCOPE_READ`             | `https://stockhubb2c.onmicrosoft.com/dc30ef57-.../FilesRead`       |
| `VITE_SCOPE_WRITE`            | `https://stockhubb2c.onmicrosoft.com/dc30ef57-.../FilesWrite`      |

### Azure AD B2C — Redirect URIs autorisées (Single-page application)

- `https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app/` ✅ configuré

---

## Production — Azure Static Web Apps

### Ressource existante

- **Nom** : `stockhub-front`
- **Region** : West Europe
- **URL** : `https://brave-field-03611eb03.5.azurestaticapps.net`
- **Tier** : Free (F1)

> La ressource était liée au repo V1 (`stockhub_front`). Avant le premier déploiement V2 :
>
> 1. Déconnecter le repo V1 dans Azure Portal (Deployment → GitHub Actions)
> 2. Ajouter le secret `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03` dans les secrets GitHub du repo V2

### Workflow GitHub Actions

**Fichier** : `.github/workflows/azure-static-web-apps-deploy.yml` _(à créer — Correction 2)_

Déclenché sur :

- `push` sur `main` → déploiement prod
- `pull_request` sur `main` → preview deployment Azure
- `pull_request` fermée → nettoyage

### SPA routing sur Azure SWA

Azure Static Web Apps gère automatiquement le fallback sur `index.html` — **aucune configuration supplémentaire requise** (contrairement à Vercel).

### Secrets GitHub requis (à configurer manuellement)

| Secret                                                  | Description                   |
| ------------------------------------------------------- | ----------------------------- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03` | Token Azure SWA (même que V1) |
| `VITE_API_SERVER_URL_PROD`                              | URL Azure App Service backend |
| `VITE_CLIENT_ID`                                        | Client ID Azure B2C           |
| `VITE_TENANT_NAME`                                      | Tenant Azure B2C              |
| `VITE_AUTHORITY_DOMAIN`                                 | Authority domain B2C          |
| `VITE_SIGN_UP_SIGN_IN_POLICY`                           | Policy sign-up/sign-in        |
| `VITE_FORGOT_PASSWORD_POLICY`                           | Policy reset password         |
| `VITE_EDIT_PROFILE_POLICY`                              | Policy edit profile           |
| `VITE_SCOPE_READ`                                       | Scope lecture B2C             |
| `VITE_SCOPE_WRITE`                                      | Scope écriture B2C            |

---

## Flux de déploiement

```
PR ouverte
    │
    ├─→ CI GitHub Actions (quality + tests + build)
    ├─→ Vercel Preview deployment (URL de preview par PR)
    │
    ▼
Merge dans main
    │
    ├─→ Azure SWA deploy (prod)
    ├─→ Release Please (PR de release)
    └─→ Deploy Metrics Dashboard (GitHub Pages)

Push sur staging
    │
    └─→ Vercel staging deployment
        (https://stock-hub-v2-front-git-staging-...)
```

---

## Variables d'environnement — Référence complète

Voir `.env.example` à la racine du repo pour la liste complète des variables `VITE_*`.

---

**Dernière mise à jour** : 2026-03-11
