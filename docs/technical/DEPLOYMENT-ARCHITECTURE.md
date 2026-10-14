# Architecture de Déploiement : StockHub V2

> Documentation de l'architecture de déploiement : production, `staging` et `feature` sur Azure Static Web Apps.

---

## Vue d'ensemble

| Environnement  | Hébergement                                    | Déclenchement                 | Backend                                                                              |
| -------------- | ---------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| **Production** | Azure Static Web Apps                          | push sur `main`               | Azure App Service (`stockhub-back-bqf8e6fbf6dzd6gs.westeurope-01.azurewebsites.net`) |
| **Staging**    | Azure Static Web Apps, environnement `staging` | push sur `main`               | Render.com (`stockhub-back.onrender.com`)                                            |
| **Feature**    | Azure Static Web Apps, environnement `feature` | manuel, une branche à la fois | Render.com (`stockhub-back.onrender.com`)                                            |

Les URL des trois environnements sont dans le tableau des environnements de [AGENTS.md](../../AGENTS.md). Décision et alternatives : [ADR-015](../adr/ADR-015-staging-feature-azure-static-web-apps.md).

---

## Staging et feature : Azure Static Web Apps

`staging` et `feature` sont des environnements nommés de la ressource de production. Ils partagent son jeton de déploiement, ses secrets `VITE_*` B2C et son quota gratuit.

### Workflow

`.github/workflows/azure-swa-test-envs-deploy.yml` :

- **`staging`** : se lance à chaque push sur `main`. C'est la cible des E2E hebdomadaires ([guide E2E](../17-E2E-TESTS-GUIDE.md))
- **`feature`** : se lance à la main sur la branche à tester, une à la fois. Le test suivant, ou un déploiement de `main` dans `feature`, la remplace

```bash
gh workflow run azure-swa-test-envs-deploy.yml --ref <branche> -f environment=feature
```

Le build appelle le backend Render, dont l'URL est écrite dans le workflow, et non celui de la production. Le déploiement de la production est un workflow à part (voir plus bas) : un échec de `staging` ne le bloque pas.

### Azure AD B2C et CORS

Chaque URL d'environnement est à enregistrer une fois, à la main :

- dans les redirect URIs de l'application B2C (type Single-page application), sans joker
- dans `ALLOWED_ORIGINS` du backend Render

Sans ces deux enregistrements, la connexion échoue (redirect URI inconnue) ou l'API répond une erreur CORS.

### Previews Vercel

Les previews Vercel par PR subsistent, sans backend ni connexion B2C : elles ne servent pas à tester. `vercel.json` reste en place (rewrite SPA, `deploymentEnabled.main: false`).

---

## Production : Azure Static Web Apps

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

**Fichier** : `.github/workflows/azure-static-web-apps-deploy.yml` _(à créer : Correction 2)_

Déclenché sur :

- `push` sur `main` → déploiement prod
- `pull_request` sur `main` → preview deployment Azure
- `pull_request` fermée → nettoyage

### SPA routing sur Azure SWA

Azure Static Web Apps ne renvoie pas les routes inconnues vers `index.html` sans règle explicite : sans elle, recharger ou ouvrir directement `/dashboard` affiche un 404 d'Azure. La règle `navigationFallback` est dans `public/staticwebapp.config.json`, copié dans `dist/` par Vite et publié avec le reste. Elle s'applique à la production et aux environnements nommés (`feature`, `staging`).

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
    └─→ CI GitHub Actions (quality + tests + build)

Merge dans main
    │
    ├─→ Azure SWA deploy (production, backend Azure)
    ├─→ Azure SWA deploy (staging, backend Render)
    ├─→ Release Please (PR de release)
    └─→ Deploy Metrics Dashboard (GitHub Pages)

Déclenchement manuel (workflow_dispatch)
    │
    └─→ Azure SWA deploy (feature, backend Render) : branche à tester
```

---

## Variables d'environnement : Référence complète

Voir `.env.example` à la racine du repo pour la liste complète des variables `VITE_*`.
