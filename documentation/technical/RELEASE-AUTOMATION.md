# 🚀 Automatisation des Releases - StockHub V2

> **Guide complet pour l'automatisation des releases avec Release Please**
> Date : 18 Novembre 2025

---

## 🎯 Qu'est-ce que Release Please ?

**Release Please** est un outil de Google qui automatise la création de releases GitHub basées sur les [Conventional Commits](https://www.conventionalcommits.org/).

**Avantages** :

- ✅ CHANGELOG.md généré automatiquement
- ✅ Versioning sémantique automatique (semver)
- ✅ Tags Git créés automatiquement
- ✅ GitHub Releases créées avec notes
- ✅ Pull Requests de release pour review
- ✅ Zéro configuration manuelle

---

## 🔧 Configuration

### Fichiers Créés

**1. `.github/workflows/release-please.yml`**

- GitHub Action qui s'exécute à chaque push sur `main`
- Analyse les commits depuis la dernière release
- Crée/met à jour une PR de release

**2. `.release-please-manifest.json`**

- Fichier de tracking des versions
- Contient la version actuelle : `"1.1.0"`

**3. `release-please-config.json`**

- Configuration du changelog (sections avec emojis)
- Type de release (`node` pour npm packages)
- Comportement versioning

---

## 📋 Comment Ça Fonctionne ?

### Étape 1 : Développement Normal

Tu développes normalement avec des **Conventional Commits** :

```bash
git commit -m "feat(dashboard): add new metric card"
git commit -m "fix(search): correct debounce timing"
git commit -m "docs: update README with new features"
```

**Types de commits reconnus** :

- `feat:` → Augmente version MINOR (1.1.0 → 1.2.0)
- `fix:` → Augmente version PATCH (1.1.0 → 1.1.1)
- `feat!:` ou `BREAKING CHANGE:` → Augmente version MAJOR (1.1.0 → 2.0.0)
- `docs:`, `test:`, `chore:`, `style:`, `refactor:` → Pas de bump version (sauf si accumulés)

---

### Étape 2 : Push sur Main

```bash
git push origin main
```

**GitHub Action s'exécute automatiquement** :

1. Analyse tous les commits depuis dernière release
2. Détermine le nouveau numéro de version
3. Génère le CHANGELOG
4. Crée/met à jour une **PR de release**

---

### Étape 3 : Review de la Release PR

Une PR automatique est créée avec :

- ✅ Titre : `chore(main): release 1.2.0`
- ✅ CHANGELOG.md mis à jour
- ✅ package.json version bumpée
- ✅ .release-please-manifest.json mis à jour

**Tu peux** :

- Review le CHANGELOG
- Modifier si nécessaire
- Approuver la PR

---

### Étape 4 : Merge de la Release PR

Quand tu merges la PR :

1. ✅ Tag Git créé automatiquement (`v1.2.0`)
2. ✅ GitHub Release créée avec release notes
3. ✅ CHANGELOG.md commité sur main
4. ✅ Tout est prêt !

---

## 🎨 Exemple de CHANGELOG Généré

```markdown
# Changelog

## [1.2.0](https://github.com/SandrineCipolla/stockHub_V2_front/compare/v1.1.0...v1.2.0) (2025-11-18)

### ✨ Features

- **dashboard:** add new metric card ([abc1234](https://github.com/SandrineCipolla/stockHub_V2_front/commit/abc1234))
- **types:** add TypeScript definitions for web components ([def5678](https://github.com/SandrineCipolla/stockHub_V2_front/commit/def5678))

### 🐛 Bug Fixes

- **search:** correct debounce timing ([ghi9012](https://github.com/SandrineCipolla/stockHub_V2_front/commit/ghi9012))

### 📚 Documentation

- update README with new features ([jkl3456](https://github.com/SandrineCipolla/stockHub_V2_front/commit/jkl3456))
```

---

## 📊 Sections du CHANGELOG

**Configuration actuelle** (avec emojis) :

| Type       | Section                  | Emoji | Bump Version |
| ---------- | ------------------------ | ----- | ------------ |
| `feat`     | Features                 | ✨    | MINOR        |
| `fix`      | Bug Fixes                | 🐛    | PATCH        |
| `perf`     | Performance Improvements | ⚡    | PATCH        |
| `refactor` | Code Refactoring         | ♻️    | -            |
| `docs`     | Documentation            | 📚    | -            |
| `test`     | Tests                    | 🧪    | -            |
| `style`    | Styles                   | 💄    | -            |
| `chore`    | Chores                   | 🔧    | -            |
| `build`    | Build System             | 🏗️    | -            |
| `ci`       | CI/CD                    | 👷    | -            |

---

## 🎯 Bonnes Pratiques

### ✅ Conventional Commits

**Format** : `<type>(<scope>): <description>`

**Exemples corrects** :

```bash
feat(dashboard): add stock prediction cards
fix(types): correct event type definitions
docs(readme): update installation instructions
test(wrappers): add ButtonWrapper tests
chore(deps): update dependencies
```

**Scope optionnel mais recommandé** :

- `dashboard`, `analytics`, `stocks` (pages)
- `types`, `components`, `hooks`, `utils` (code)
- `ci`, `deps`, `config` (infrastructure)

---

### ⚠️ Breaking Changes

**Pour un changement cassant** :

**Option A** : Ajouter `!` après le type

```bash
git commit -m "feat(api)!: change endpoint response format"
```

**Option B** : Ajouter `BREAKING CHANGE:` dans le body

```bash
git commit -m "feat(api): update user endpoint

BREAKING CHANGE: Response format changed from array to object"
```

**Résultat** : Version MAJOR bump (1.1.0 → 2.0.0)

---

### 🔄 Workflow Quotidien

**1. Développer une feature**

```bash
git checkout -b feat/my-feature
# ... développement ...
git commit -m "feat(scope): add new feature"
git push
```

**2. Créer PR et merger dans main**

```bash
gh pr create --title "feat: Add new feature"
# Review + merge
```

**3. Release Please crée automatiquement une PR de release**

- Pas besoin d'action manuelle
- La PR se met à jour à chaque nouveau commit sur main

**4. Quand prêt pour release, merger la PR de release**

```bash
# Review de la Release PR
# Merge → tag + GitHub Release automatiques
```

---

## 🛠️ Commandes Utiles

### Voir les releases GitHub

```bash
gh release list
```

### Voir les tags Git

```bash
git tag -l
```

### Forcer une nouvelle release (si besoin)

```bash
# Créer un commit vide avec type
git commit --allow-empty -m "chore: trigger release"
git push origin main
```

### Voir les PRs de release

```bash
gh pr list --label "autorelease: pending"
```

---

## 🐛 Troubleshooting

### La PR de release ne se crée pas

**Causes possibles** :

1. Aucun commit avec `feat:` ou `fix:` depuis dernière release
2. GitHub Action désactivée
3. Permissions insuffisantes

**Solution** :

```bash
# Vérifier les GitHub Actions
gh workflow view "Release Please"

# Vérifier les permissions dans .github/workflows/release-please.yml
# Doit avoir: contents: write, pull-requests: write
```

---

### Modifier une release après coup

**Si la Release PR n'est pas encore mergée** :

- Modifier les commits sur main
- La PR se mettra à jour automatiquement

**Si la release est déjà créée** :

- Éditer manuellement la GitHub Release
- Ou créer une nouvelle release patch avec les corrections

---

## 📚 Références

**Documentation officielle** :

- [Release Please](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

**Workflows similaires** :

- React : Uses Release Please
- Angular : Uses Conventional Commits
- Vue.js : Uses Conventional Commits

---

## ✅ Checklist Post-Configuration

- [x] `.github/workflows/release-please.yml` créé
- [x] `.release-please-manifest.json` créé avec version actuelle
- [x] `release-please-config.json` configuré
- [x] Documentation créée
- [ ] Merger cette PR sur main
- [ ] Vérifier que GitHub Action s'exécute
- [ ] Attendre première Release PR automatique

---

**Date création** : 18 Novembre 2025
**Auteure** : Sandrine Cipolla
**Version** : v1.1.0
**Statut** : ✅ Configuration terminée
