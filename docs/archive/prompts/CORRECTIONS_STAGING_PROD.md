# Corrections Staging Vercel + Prod Azure — Front V2

> **Mode d'emploi** : Dépose ce fichier dans `stockHub_V2_front`.
> Dans Claude Code : **"Lis CORRECTIONS_STAGING_PROD.md et commence par la Correction 1"**
> Traite une correction à la fois, attends ma validation avant de passer à la suivante.

---

## CORRECTION 1 — Fix SPA routing dans `vercel.json` (branche staging)

**Durée estimée** : 5 min
**Impact** : staging Vercel fonctionnel — routes directes ne retournent plus 404

### Étapes

1. Assure-toi d'être sur la branche `staging` :

```bash
git checkout staging
```

2. Lis le contenu actuel de `vercel.json`

3. Ajoute la clé `rewrites` en conservant toutes les entrées existantes :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

4. Ajoute aussi `VITE_BASE_PATH` dans `.env.example` (absente — utilisée dans `vite.config.ts`) :

```
VITE_BASE_PATH=/
```

5. Supprime `VITE_REDIRECT_URI` de `.env.staging.example` si présente — variable obsolète non lue dans le code.

6. Vérifie TypeScript : `npx tsc --noEmit`

### Livrable

- `vercel.json` sur branche `staging` avec rewrite SPA
- `.env.example` avec `VITE_BASE_PATH`
- Commit : `fix(staging): add SPA rewrite to vercel.json and clean env vars`
- Push sur `staging`

---

## CORRECTION 2 — Workflow GitHub Actions pour prod Azure SWA

**Durée estimée** : 30 min
**Impact** : déploiement automatique sur Azure Static Web Apps V2 sur push `main`

### Contexte

- Ressource Azure SWA existante : `stockhub-front` (West Europe) — `brave-field-03611eb03.5.azurestaticapps.net`
- Secret connu : `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03`
- Workflow V1 de référence : `azure-static-web-apps-brave-field-03611eb03.yml` (dans repo V1 `stockhub_front`)

### Étapes

1. Reviens sur `main` :

```bash
git checkout main
```

2. Lis le workflow V1 de référence pour t'en inspirer. Il est dans `stockhub_front/.github/workflows/azure-static-web-apps-brave-field-03611eb03.yml` si accessible localement, sinon voici sa structure connue.

3. Crée `.github/workflows/azure-static-web-apps-deploy.yml` adapté pour V2 :

```yaml
name: Azure Static Web Apps — Deploy V2

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main
  workflow_dispatch:

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed') || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_API_SERVER_URL: ${{ secrets.VITE_API_SERVER_URL_PROD }}
          VITE_API_V1: /v1
          VITE_API_V2: /v2
          VITE_CLIENT_ID: ${{ secrets.VITE_CLIENT_ID }}
          VITE_TENANT_NAME: ${{ secrets.VITE_TENANT_NAME }}
          VITE_AUTHORITY_DOMAIN: ${{ secrets.VITE_AUTHORITY_DOMAIN }}
          VITE_SIGN_UP_SIGN_IN_POLICY: ${{ secrets.VITE_SIGN_UP_SIGN_IN_POLICY }}
          VITE_FORGOT_PASSWORD_POLICY: ${{ secrets.VITE_FORGOT_PASSWORD_POLICY }}
          VITE_EDIT_PROFILE_POLICY: ${{ secrets.VITE_EDIT_PROFILE_POLICY }}
          VITE_SCOPE_READ: ${{ secrets.VITE_SCOPE_READ }}
          VITE_SCOPE_WRITE: ${{ secrets.VITE_SCOPE_WRITE }}
          VITE_BASE_PATH: /
        run: npm run build

      - name: Run tests
        run: npm run test:ci

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03 }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          skip_app_build: true
          app_location: 'dist'
          api_location: ''
          output_location: ''

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03 }}
          action: 'close'
```

4. Crée `staticwebapp.config.json` à la racine pour le routing SPA sur Azure SWA :

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.{css,js,ico,png,svg,webp,woff,woff2}"]
  }
}
```

5. Vérifie que le fichier est inclus dans le build Vite — il doit être dans `public/` pour être copié dans `dist/` :

```bash
# Déplace staticwebapp.config.json dans public/
mv staticwebapp.config.json public/staticwebapp.config.json
```

### ⚠️ Secrets à ajouter dans GitHub (manuellement dans Settings > Secrets)

Claude Code ne peut pas modifier les secrets GitHub — tu devras ajouter ces secrets manuellement dans `stockHub_V2_front > Settings > Secrets and variables > Actions` :

| Secret                                                  | Valeur                        |
| ------------------------------------------------------- | ----------------------------- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03` | Token Azure SWA (même que V1) |
| `VITE_API_SERVER_URL_PROD`                              | URL Azure App Service back    |
| `VITE_CLIENT_ID`                                        | Client ID Azure B2C           |
| `VITE_TENANT_NAME`                                      | Tenant Azure B2C              |
| `VITE_AUTHORITY_DOMAIN`                                 | Authority domain Azure B2C    |
| `VITE_SIGN_UP_SIGN_IN_POLICY`                           | Policy B2C                    |
| `VITE_FORGOT_PASSWORD_POLICY`                           | Policy B2C                    |
| `VITE_EDIT_PROFILE_POLICY`                              | Policy B2C                    |
| `VITE_SCOPE_READ`                                       | Scope B2C read                |
| `VITE_SCOPE_WRITE`                                      | Scope B2C write               |

### Livrable

- `.github/workflows/azure-static-web-apps-deploy.yml`
- `public/staticwebapp.config.json`
- Commit : `feat(ci): add Azure SWA deployment workflow for V2 prod`
- **Note dans le commit** : "Secrets GitHub à configurer manuellement avant le premier déploiement"

---

## APRÈS LES CORRECTIONS

### Vérifications finales

```bash
# TypeScript OK
npx tsc --noEmit

# Tests OK
npm run test:ci

# Build OK
npm run build
```

### Check manuel dans le dashboard Vercel

Après le push sur `staging`, vérifie dans le dashboard Vercel que :

- La branche `staging` a bien un déploiement actif
- `VITE_API_SERVER_URL` pointe vers Render pour l'environnement Preview/staging
- Les variables B2C sont configurées pour staging

### Re-lier la ressource Azure SWA à V2 (à faire AVANT le premier déploiement)

**Stratégie choisie : réutiliser la ressource existante** (tier gratuit F1, pas de coût supplémentaire)

Séquence obligatoire dans le portail Azure (`portal.azure.com`) :

1. Ouvre la ressource `stockhub-front` (West Europe)
2. Va dans **Deployment > GitHub Actions** (ou "Source de déploiement")
3. **Déconnecte** le repo V1 `stockhub_front` — cela supprime le lien existant
4. Le token `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03` reste valide — il est lié à la ressource, pas au repo
5. Le workflow GitHub Actions du repo V2 utilisera ce même token pour déployer

**⚠️ Ne pas déclencher le workflow Azure avant d'avoir :**

1. Déconnecté V1 dans le portail Azure
2. Ajouté tous les secrets GitHub dans le repo V2
