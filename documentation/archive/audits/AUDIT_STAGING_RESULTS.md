# Audit Staging Vercel — Front V2

Date : 2026-03-11

---

## Cible d'architecture

| Environnement  | Hébergement           | Branche   | Backend           |
| -------------- | --------------------- | --------- | ----------------- |
| **Production** | Azure Static Web Apps | `main`    | Azure App Service |
| **Staging**    | Vercel                | `staging` | Render.com        |

---

## Setup actuel

### Vercel (staging)

- **Intégration** : GitHub native (pas de workflow dans `.github/workflows/`)
- **Branche configurée** : `staging` ✅ (existe sur origin)
- **`.env.staging.example`** : ✅ présent sur la branche `staging` → pointe vers `https://stockhub-back.onrender.com/api`
- **Preview deployments** : ✅ actifs via intégration GitHub native sur les PRs
- **`vercel.json`** : ✅ présent — mais **incomplet** (pas de rewrite SPA)

### Azure (production)

- **Ressource existante** : ✅ `stockhub-front` (West Europe) → `brave-field-03611eb03.5.azurestaticapps.net`
- **Repo lié actuellement** : `github.com/SandrineCipolla/stockhub_front` (V1) sur branche `main`
- **Workflow V1 récupérable** : `stockhub_front/.github/workflows/azure-static-web-apps-brave-field-03611eb03.yml`
- **Secret connu** : `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03`
- **SPA routing** : Azure Static Web Apps gère automatiquement le fallback sur `index.html` (pas de config supplémentaire requise)

### StockHub_Deploy (`C:\Users\sandr\Dev\Perso\Projets\StockHub_Deploy`)

- Ancienne approche Docker Compose + Azure Pipelines (SSH vers serveur distant) — **obsolète**, ne pas réutiliser

---

## Variables VITE_* utilisées

| Variable                      | Présente dans .env.example   | Notes                                                 |
| ----------------------------- | ---------------------------- | ----------------------------------------------------- |
| `VITE_API_SERVER_URL`         | ✅                           | Clé principale : Azure en prod, Render en staging     |
| `VITE_API_V1`                 | ✅                           |                                                       |
| `VITE_API_V2`                 | ✅                           |                                                       |
| `VITE_CLIENT_ID`              | ✅                           |                                                       |
| `VITE_TENANT_NAME`            | ✅                           |                                                       |
| `VITE_AUTHORITY_DOMAIN`       | ✅                           |                                                       |
| `VITE_SIGN_UP_SIGN_IN_POLICY` | ✅                           |                                                       |
| `VITE_FORGOT_PASSWORD_POLICY` | ✅                           |                                                       |
| `VITE_EDIT_PROFILE_POLICY`    | ✅                           |                                                       |
| `VITE_SCOPE_READ`             | ✅                           |                                                       |
| `VITE_SCOPE_WRITE`            | ✅                           |                                                       |
| `VITE_BASE_PATH`              | ❌ absente                   | Utilisée dans `vite.config.ts`, valeur par défaut `/` |
| `VITE_REDIRECT_URI`           | ✅ dans .env.staging.example | Non utilisée dans le code source (obsolète)           |

---

## Problèmes identifiés

### 🔴 Bloquant

1. **SPA routing manquant dans `vercel.json` (staging)**
   - `BrowserRouter` utilisé → toute URL directe autre que `/` retourne 404 sur Vercel
   - Azure SWA gère ça automatiquement, mais Vercel non
   - Fix dans `vercel.json` sur la branche `staging` :
     ```json
     {
       "installCommand": "...",
       "buildCommand": "npm run build",
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```

2. **Prod Azure non connectée à V2**
   - La ressource Azure SWA existe mais pointe encore sur le repo V1 (`stockhub_front`)
   - Il faut re-lier la ressource au repo V2 **ou** créer une nouvelle ressource SWA pour V2
   - Le workflow GitHub Actions de déploiement est absent du repo V2

### 🟡 Important

3. **Secret Azure à reconfigurer pour V2**
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_FIELD_03611EB03` connu (utilisé en V1)
   - À ajouter dans les secrets GitHub du repo V2 (`stockHub_V2_front`)
   - Le token est lié à la ressource Azure SWA — valide si on réutilise la même ressource

4. **`VITE_BASE_PATH` absente de `.env.example`**
   - Utilisée dans `vite.config.ts` mais non documentée

### 🟢 Amélioration

5. **`VITE_REDIRECT_URI` obsolète**
   - Présente dans `.env.staging.example` mais non lue dans le code source
   - À supprimer pour éviter la confusion

---

## Plan d'action

### Pour activer le staging Vercel (rapide)

1. Ajouter le rewrite SPA dans `vercel.json` sur la branche `staging`
2. Vérifier dans le dashboard Vercel que `VITE_API_SERVER_URL` → `https://stockhub-back.onrender.com/api` pour la branche `staging`
3. Vérifier que les variables B2C sont bien configurées dans Vercel (Redirect URI staging)

### Pour activer la prod Azure

1. Choisir : re-lier la ressource SWA existante à `stockHub_V2_front` **ou** créer une nouvelle ressource
2. Adapter le workflow V1 pour V2 (build Vite avec les bonnes variables, secret API token)
3. Ajouter le secret `AZURE_STATIC_WEB_APPS_API_TOKEN_*` dans les secrets GitHub du repo V2
4. Configurer les variables VITE_* pour la prod dans Azure SWA (portal ou workflow)

---

## État global

- [ ] Rewrite SPA dans `vercel.json` → branche `staging` ❌
- [ ] `VITE_API_SERVER_URL` → Render configuré dans Vercel dashboard ⚠️ à vérifier
- [ ] `VITE_API_SERVER_URL` → Azure configuré pour prod ⚠️ à faire
- [ ] Workflow GitHub Actions pour déploiement Azure prod ❌ absent du repo V2
- [ ] Ressource Azure SWA liée au repo V2 ❌ encore sur V1
- [ ] Preview deployments Vercel sur PRs ✅ (mais SPA cassé)

## Conclusion

**Staging Vercel** : Infrastructure en place (branche `staging`, `.env.staging.example`, variables documentées) — manque uniquement le rewrite SPA dans `vercel.json`.

**Prod Azure** : La ressource existe et le workflow V1 est réutilisable — il faut re-lier la ressource à V2 et adapter le workflow.

**StockHub_Deploy** : Ancienne approche Docker/Azure Pipelines, à ignorer.
