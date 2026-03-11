# Session 2026-03-11 — Setup Staging Vercel & Audit Déploiement

## Objectif

Auditer et compléter la configuration du staging Vercel et préparer la prod Azure.

## Réalisé

### Audit staging (AUDIT_STAGING_VERCEL.md)

- Inventaire des workflows GitHub Actions → aucun workflow Vercel (intégration native)
- Découverte : la ressource Azure SWA `stockhub-front` existe encore (liée à V1)
- Découverte : `StockHub_Deploy` = ancienne approche Docker/Azure Pipelines, obsolète
- Problème critique identifié : `vercel.json` sans rewrite SPA → 404 sur routes directes

### Corrections staging (PR #102 — `feat-issue-93-staging-front`)

1. **Fix SPA routing** : ajout `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]` dans `vercel.json`
2. **`.env.example`** : créé avec toutes les variables VITE\_\* dont `VITE_BASE_PATH`
3. **`.env.staging.example`** : suppression de `VITE_REDIRECT_URI` (obsolète, non lue dans le code)
4. **Correction policy B2C** : `B2C_1_reset_password` → `B2C_1_passwordreset` (nom réel dans Azure B2C)
5. Cherry-pick des corrections sur la branche `staging` (celle que Vercel déploie)

### État Azure B2C

Policies existantes dans le tenant `stockhubb2c` :

- `B2C_1_signupsignin` ✅
- `B2C_1_passwordreset` ✅
- `B2C_1_edit_profile` ❌ inexistante (non bloquant pour le login)

Redirect URI staging configurée dans Azure B2C :

- `https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app/` ✅

### Documentation

- Créé `documentation/technical/DEPLOYMENT-ARCHITECTURE.md`
- Mis à jour `documentation/0-INDEX.md`

## En cours / À faire

- [ ] Merger PR #102
- [ ] Correction 2 : workflow GitHub Actions pour prod Azure SWA (nouvelle branche)
- [ ] Déconnecter repo V1 de la ressource Azure SWA avant premier déploiement V2
- [ ] Ajouter secrets GitHub dans repo V2 (token Azure SWA + variables VITE\_\*)

## Branches touchées

- `feat-issue-93-staging-front` (PR #102)
- `staging`
