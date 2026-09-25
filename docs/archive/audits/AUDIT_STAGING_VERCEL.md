# Audit Staging — Vercel + Front V2

> **Mode d'emploi** : Dépose ce fichier dans `stockHub_V2_front`.
> Dans Claude Code : **"Lis AUDIT_STAGING_VERCEL.md et exécute le diagnostic"**
> Mode diagnostic uniquement — ne modifie rien.

---

## CONTEXTE

Le front V2 est déployé sur Vercel avec `VITE_API_SERVER_URL` configuré différemment
par environnement (prod vs preview). On veut vérifier que le staging est correctement
en place et fonctionnel.

**Setup attendu** :

- Production → back Azure App Service (`stockhub-back-bqf8e6fbf6dzd6gs.westeurope-01.azurewebsites.net`)
- Preview/Staging → back Render.com (`stockhub-back.onrender.com` ou équivalent)

---

## DIAGNOSTIC 1 — Workflow GitHub Actions lié à Vercel

```bash
# Lister les workflows
ls .github/workflows/

# Afficher le contenu de chaque workflow
cat .github/workflows/*.yml
```

**Questions à répondre** :

- Y a-t-il un workflow de déploiement Vercel configuré ?
- Est-ce que Vercel est branché via l'intégration GitHub native (pas de workflow) ?
- Y a-t-il un workflow distinct pour staging vs production ?

---

## DIAGNOSTIC 2 — Configuration Vercel dans le repo

```bash
# Vérifier si un fichier vercel.json existe
cat vercel.json 2>/dev/null || echo "Pas de vercel.json"

# Vérifier si un fichier .vercelignore existe
cat .vercelignore 2>/dev/null || echo "Pas de .vercelignore"

# Vérifier le build output dans vite.config.ts
cat vite.config.ts
```

**Questions à répondre** :

- Y a-t-il un `vercel.json` avec des rewrites/redirects (nécessaire pour React Router) ?
- Le build Vite génère-t-il bien dans `dist/` ?

---

## DIAGNOSTIC 3 — Variables d'environnement dans le code

```bash
# Toutes les variables VITE_ utilisées dans le code
grep -rn "import.meta.env.VITE_" src/ --include="*.ts" --include="*.tsx" | grep -v test | sort | uniq

# Vérifier le .env.example pour voir les variables attendues
cat .env.example 2>/dev/null || echo "Pas de .env.example"
```

**Questions à répondre** :

- Liste complète des variables `VITE_*` utilisées dans le code
- Ces variables sont-elles toutes dans `.env.example` ?

---

## DIAGNOSTIC 4 — Branches et stratégie de déploiement

```bash
# Branches existantes
git branch -a

# Existe-t-il une branche staging dédiée ?
git branch -a | grep -i "staging\|preview\|preprod"

# Vérifier si main est la seule branche de prod
git log --oneline -5
```

**Questions à répondre** :

- Quelle branche déclenche le déploiement prod Vercel ? (`main` ?)
- Les PRs créent-elles des preview deployments automatiquement ?
- Y a-t-il une branche `staging` dédiée ?

---

## DIAGNOSTIC 5 — React Router et SPA routing

```bash
# Vérifier si le routing SPA est géré pour Vercel
cat vercel.json 2>/dev/null | grep -i "rewrite\|fallback\|destination"

# Vérifier le fichier public/_redirects (Netlify style, pas Vercel)
cat public/_redirects 2>/dev/null || echo "Pas de _redirects"

# Vérifier App.tsx pour le type de router utilisé
grep -n "BrowserRouter\|HashRouter\|createBrowserRouter\|RouterProvider" src/App.tsx src/main.tsx 2>/dev/null
```

**Questions à répondre** :

- Le routing SPA est-il correctement configuré pour Vercel ?
  (Sans `vercel.json` avec rewrite `/*` → `/index.html`, les routes directes donnent 404)

---

## FORMAT DE SORTIE ATTENDU

Génère un fichier `AUDIT_STAGING_RESULTS.md` avec :

```markdown
# Audit Staging Vercel — Front V2

Date : [date]

## Setup actuel

- Intégration Vercel : GitHub native / Workflow GitHub Actions
- Branche prod : [branche]
- Preview deployments : ✅ actifs / ❌ non configurés
- vercel.json : ✅ présent / ❌ absent

## Variables VITE_* utilisées

| Variable            | Présente dans .env.example | Configurée dans Vercel |
| ------------------- | -------------------------- | ---------------------- |
| VITE_API_SERVER_URL | ✅ / ❌                    | ✅ prod + preview / ❌ |
| ...                 |                            |                        |

## Problèmes identifiés

1. 🔴 [bloquant]
2. 🟡 [important]
3. 🟢 [amélioration]

## État global

- [ ] Preview deployments fonctionnels sur PRs
- [ ] VITE_API_SERVER_URL → Render en preview
- [ ] VITE_API_SERVER_URL → Azure en prod
- [ ] SPA routing configuré (vercel.json ou équivalent)
- [ ] Toutes les variables VITE_* configurées dans Vercel

## Conclusion

[Staging opérationnel ✅ / Manque X pour être complet]
```
