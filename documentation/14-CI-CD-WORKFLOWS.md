# 14. CI/CD - GitHub Actions Workflows

> Documentation des workflows d'intégration et de déploiement continus

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Workflows disponibles](#workflows-disponibles)
- [CI - Quality & Tests](#ci---quality--tests)
- [Deploy Metrics Dashboard](#deploy-metrics-dashboard)
- [Release Please](#release-please)
- [Configuration npm](#configuration-npm)
- [Bonnes pratiques](#bonnes-pratiques)
- [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

Le projet utilise **GitHub Actions** pour automatiser les processus de qualité, tests, et déploiement.

### Fichiers de configuration

```
.github/workflows/
├── ci.yml                    # CI automatique sur PR et push
├── deploy-metrics.yml        # Déploiement dashboard qualité
├── deploy-pages.yml          # (DÉSACTIVÉ) Ancien déploiement app
└── release-please.yml        # Gestion automatique des releases
```

### Philosophie

✅ **Validation automatique** : Chaque PR est testée avant merge
✅ **Feedback rapide** : Les erreurs sont détectées tôt
✅ **Déploiement continu** : Dashboard mis à jour automatiquement
✅ **Releases automatiques** : Versioning sémantique géré par robot

---

## Workflows disponibles

| Workflow                       | Déclenchement    | Statut       | Durée |
| ------------------------------ | ---------------- | ------------ | ----- |
| **CI - Quality & Tests**       | PR, push main    | ✅ Active    | ~2min |
| **Deploy Metrics Dashboard**   | Push main        | ✅ Active    | ~5min |
| **Release Please**             | Push main        | ✅ Active    | ~30s  |
| ~~Deploy App to GitHub Pages~~ | Manuel seulement | ⚠️ Désactivé | N/A   |

---

## CI - Quality & Tests

**Fichier** : `.github/workflows/ci.yml`

### Déclenchement

```yaml
on:
  pull_request:
    branches: ['main']
  push:
    branches: ['main']
  workflow_dispatch: # Déclenchement manuel
```

### Jobs exécutés en parallèle

#### 1. 🔍 Quality Checks (~1min)

```bash
✓ TypeScript type checking
✓ ESLint linting
✓ Knip (dead code detection)
✓ detect:as-const (warnings non-bloquants)
```

#### 2. 🧪 Tests (~1min 20s)

```bash
✓ 464 tests unitaires (Vitest)
✓ Upload coverage vers Codecov (optionnel)
```

#### 3. 🏗️ Build (~45s)

```bash
✓ Build de production (TypeScript + Vite)
✓ Vérification taille du bundle
✓ Validation que dist/ n'est pas vide
```

#### 4. 📋 Summary

```bash
✓ Résumé des résultats
✗ Fail si un job échoue
```

### Exemple de résultat

```
✅ CI - Quality & Tests (2m 15s)
  ✅ Quality Checks (1m 05s)
    ✓ TypeScript Check (15s)
    ✓ ESLint (12s)
    ✓ Knip (8s)
    ⚠️ Detect as const (5s) - 0 usage détecté

  ✅ Tests (1m 20s)
    ✓ 464 tests passed
    ✓ Coverage: 60.67%

  ✅ Build (48s)
    ✓ Bundle: 113.99 KB gzipped
    ✓ Assets generated
```

### Workaround npm optional dependencies

Le workflow utilise un workaround pour éviter le bug Rollup :

```yaml
- name: 📦 Install dependencies (workaround for npm optional deps bug)
  run: |
    rm -rf node_modules package-lock.json
    npm install --include=optional
```

**Pourquoi ?** : Bug npm avec `@rollup/rollup-linux-x64-gnu` dans les environnements CI Ubuntu.

---

## Deploy Metrics Dashboard

**Fichier** : `.github/workflows/deploy-metrics.yml`

### Déclenchement

```yaml
on:
  push:
    branches: ['main']
  workflow_dispatch:
```

### Processus de déploiement

1. **Build du projet**

   ```bash
   npm run build
   ```

2. **Démarrage serveur local**

   ```bash
   serve -s dist -l 4173 &
   ```

3. **Génération des audits** (parallèle)

   ```bash
   # Audits indépendants (parallèle, ~1min gain)
   audit-fps.mjs &
   audit-wcag.mjs &
   audit-datasets.mjs &
   audit-colorblind.mjs &
   wait

   # Audits dépendants du serveur (séquentiels)
   generate-lighthouse.mjs
   generate-eco.mjs
   generate-coverage.mjs
   audit-full.mjs
   ```

4. **Mise à jour liste statique**

   ```bash
   node scripts/update-metrics-files.mjs
   ```

5. **Déploiement GitHub Pages**
   - Upload `documentation/metrics/`
   - Déploiement sur `https://sandrinecipolla.github.io/stockHub_V2_front/`

### URL du dashboard

- **Production** : https://sandrinecipolla.github.io/stockHub_V2_front/
- **Local** : http://localhost:5173/documentation/metrics/

---

## Release Please

**Fichier** : `.github/workflows/release-please.yml`

### Fonctionnement

1. **Analyse des commits** depuis la dernière release
2. **Calcul du numéro de version** (semver)
3. **Création/Mise à jour PR de release**
4. **Merge PR** → Tag Git + GitHub Release automatiques

### Conventional Commits

| Type                       | Exemple                      | Bump              |
| -------------------------- | ---------------------------- | ----------------- |
| `feat:`                    | `feat(dashboard): add chart` | **MINOR** (1.2.0) |
| `fix:`                     | `fix(button): hover state`   | **PATCH** (1.2.1) |
| `feat!:`                   | `feat(api)!: change format`  | **MAJOR** (2.0.0) |
| `docs:`, `test:`, `chore:` | `docs: update readme`        | Aucun             |

### Exemple de workflow

```bash
# 1. Feature commitée
git commit -m "feat(ci): add automated CI workflow"
git push origin main

# 2. Release Please crée/met à jour une PR
# Titre: "chore(main): release 1.4.0"
# Contenu: CHANGELOG généré automatiquement

# 3. Review et merge de la PR
gh pr merge <pr-number>

# 4. Tag et release créés automatiquement
# Tag: v1.4.0
# Release: https://github.com/.../releases/tag/v1.4.0
```

---

## Configuration npm

### Scripts CI disponibles

```json
{
  "ci:quality": "type-check + lint + knip + detect:as-const",
  "ci:test": "vitest run",
  "ci:build": "tsc -b && vite build",
  "ci:check": "ci:quality + ci:test + ci:build",
  "ci:fix": "lint:fix + clean:fix + ci:check",
  "ci:fast": "type-check + lint + tests (skip build)",
  "ci:full": "ci:check + audit:full"
}
```

### Utilisation locale

```bash
# Avant de pusher
npm run ci:check

# Fix automatique + vérification
npm run ci:fix

# Pipeline rapide (sans build)
npm run ci:fast
```

---

## Bonnes pratiques

### ✅ À faire

1. **Toujours tester localement** avant de pusher

   ```bash
   npm run ci:check
   ```

2. **Utiliser Conventional Commits**

   ```bash
   git commit -m "feat(scope): description"
   ```

3. **Vérifier les checks CI** dans la PR avant merge

4. **Ne pas skip les hooks** (sauf urgence)

   ```bash
   # ❌ Éviter
   git push --no-verify
   ```

5. **Corriger les warnings** détectés par CI
   - Warnings `as const` → Remplacer par types explicites
   - Dead code (Knip) → Supprimer ou utiliser
   - Linting errors → Corriger

### ❌ À éviter

1. **Merger avec CI en échec**
2. **Ignorer les warnings CodeCov**
3. **Pusher sans tester localement**
4. **Modifier `.github/workflows/` sans tests**

---

## Troubleshooting

### ❌ Erreur : `Cannot find module @rollup/rollup-linux-x64-gnu`

**Cause** : Bug npm avec dépendances optionnelles de Rollup

**Solution** : Déjà implémentée dans tous les workflows

```yaml
- run: |
    rm -rf node_modules package-lock.json
    npm install --include=optional
```

### ❌ Tests échouent en CI mais passent en local

**Causes possibles** :

1. Différences d'environnement (Node version)
2. Dépendances non synchronisées
3. Tests flaky (timing, randomness)

**Solution** :

```bash
# 1. Vérifier version Node
node -v  # Doit être >= 20

# 2. Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# 3. Relancer tests
npm run test:run
```

### ❌ Workflow CI ne se déclenche pas

**Vérifications** :

1. ✅ La branche cible est bien `main`
2. ✅ Le workflow n'est pas désactivé sur GitHub
3. ✅ Les permissions GitHub Actions sont activées

**Commande de debug** :

```bash
gh workflow list  # Voir statut des workflows
gh run list --limit 5  # Voir dernières exécutions
```

### ⚠️ Warnings "as const" détectés

**Normal** : Ce sont des warnings, pas des erreurs bloquantes

**Si tu veux les corriger** :

```typescript
// ❌ Avant
const CONFIG = {
  MAX: 100,
} as const;

// ✅ Après
const CONFIG: Readonly<{
  MAX: number;
}> = {
  MAX: 100,
};
```

### ❌ Build réussit mais bundle trop gros

**Vérifier** :

```bash
npm run build
ls -lh dist/assets/*.js
```

**Limites configurées** :

- Chunk size warning: 500 KB (vite.config.ts)
- Bundle total gzipped: ~114 KB (acceptable)

**Si dépassé** : Analyser avec vite-bundle-visualizer

---

## Statut actuel

| Metric                     | Valeur         | Status |
| -------------------------- | -------------- | ------ |
| **Performance Lighthouse** | 95/100         | ✅     |
| **Accessibilité**          | 96/100         | ✅     |
| **Tests**                  | 464 passed     | ✅     |
| **Coverage**               | 60.67%         | ⚠️     |
| **Build time**             | ~5s            | ✅     |
| **Bundle size**            | 113.99 KB      | ✅     |
| **TypeScript errors**      | 0              | ✅     |
| **ESLint warnings**        | 0              | ✅     |
| **Knip dead code**         | 0              | ✅     |
| **`as const` usage**       | 0 (production) | ✅     |

---

## Liens utiles

- **GitHub Actions Docs** : https://docs.github.com/en/actions
- **Release Please** : https://github.com/googleapis/release-please
- **Conventional Commits** : https://www.conventionalcommits.org/
- **Codecov** : https://codecov.io/
- **Lighthouse CI** : https://github.com/GoogleChrome/lighthouse-ci

---

**📅 Dernière mise à jour** : 2025-12-05
**📝 Auteur** : Sandrine Cipolla
**🤖 Généré avec** : Claude Code
