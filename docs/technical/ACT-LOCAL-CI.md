# Act - Test GitHub Actions Localement

Guide d'utilisation de **Act** pour tester les workflows GitHub Actions en local avant de pusher.

---

## 📋 Qu'est-ce qu'Act ?

**Act** permet d'exécuter vos workflows GitHub Actions **localement** dans des containers Docker, exactement comme ils s'exécuteraient sur GitHub.

**Avantages** :

- ✅ Tester workflows avant push
- ✅ Détecter problèmes spécifiques à Linux/Ubuntu
- ✅ Économiser temps et push inutiles
- ✅ Débugger workflows plus facilement

**Prérequis** :

- Docker Desktop installé et **démarré**
- Act installé (via `winget install nektos.act`)

---

## 🚀 Installation

### Windows

```bash
# Via winget (recommandé)
winget install nektos.act

# Via chocolatey
choco install act-cli
```

### Vérification

```bash
act --version
# act version 0.2.82

docker --version
# Docker version 28.5.1

docker ps
# Doit afficher les containers (pas d'erreur)
```

---

## 📝 Commandes de Base

### Lister les workflows disponibles

```bash
act -l
```

**Output attendu** :

```
Stage  Job            ID                 Job name
0      quality-check  quality-check      🔍 Quality Checks
0      test           test               🧪 Tests
0      build          build              🏗️ Build
1      summary        summary            📋 CI Summary
```

### Tester un job spécifique

```bash
# Quality checks seulement
act -j quality-check

# Tests seulement
act -j test

# Build seulement
act -j build
```

### Tester le workflow complet

```bash
# Simule un push (tous les jobs)
act push

# Simule une pull request
act pull_request
```

### Mode dry-run (voir sans exécuter)

```bash
act -n
# ou
act --dryrun
```

### Mode verbose (debug)

```bash
act -v -j quality-check
# ou
act --verbose -j test
```

---

## ⚙️ Configuration (.actrc)

Le fichier `.actrc` à la racine du projet configure Act automatiquement.

**Contenu actuel** :

```ini
# Use medium-sized image
-P ubuntu-latest=catthehacker/ubuntu:act-latest

# Bind working directory
--bind

# Container architecture
--container-architecture linux/amd64
```

**Options utiles** :

```bash
# Réutiliser containers (plus rapide, mais peut causer des problèmes)
--reuse

# Verbose par défaut
-v

# Secrets locaux
-s GITHUB_TOKEN=<your_token>
```

---

## 🔍 Cas d'Usage

### 1. Avant un push important

```bash
# Tester que tout passe
act push
```

Si tout ✅ → Push en confiance
Si ❌ → Fix local avant push

### 2. Débugger un workflow qui échoue en CI

```bash
# Tester le job qui échoue
act -v -j build

# Regarder les logs détaillés
```

### 3. Tester après modification .github/workflows/ci.yml

```bash
# Vérifier syntaxe + exécution
act -j quality-check
```

### 4. Vérifier problème spécifique Linux

```bash
# Act utilise Ubuntu comme GitHub Actions
act -j build

# Détectera les problèmes comme:
# - Rollup optional dependencies
# - Path differences (/ vs \)
# - Case sensitivity
```

---

## 🐛 Problèmes Courants

### ⚠️ Windows : Conflit node_modules (CRITIQUE)

**Erreur sur Windows** :

```
npm error code EIO
npm error syscall unlink
npm error path .../node_modules/@rollup/rollup-win32-x64-msvc/rollup.win32-x64-msvc.node
npm error errno -5
npm error EIO: i/o error, unlink
```

**Cause** :

- Act monte ton dossier Windows dans le container Linux
- Les packages natifs Windows (`.node`) sont verrouillés par ton système
- Le container Linux ne peut pas les supprimer pour installer versions Linux

**Solutions** :

**Option 1 : --bind=false (RECOMMANDÉ)** ⭐

```bash
# Act clone le repo dans le container au lieu de monter
act --bind=false -j quality-check

# Plus lent (pas de mount direct) mais évite tous conflits
```

Décommenter dans `.actrc` :

```ini
--bind=false
```

**Option 2 : Clean node_modules avant Act**

```bash
# Supprimer node_modules Windows
rm -rf node_modules

# Lancer Act
act -j quality-check

# Réinstaller pour dev local après
npm install
```

**Option 3 : WSL2 (avancé)**

```bash
# Cloner repo dans WSL2
cd /home/user/projects
git clone ...

# Lancer Act depuis WSL2
act -j quality-check
# Pas de conflit Windows/Linux
```

**Recommandation** : Utiliser `--bind=false` pour simplicité

---

### Docker Desktop pas démarré

**Erreur** :

```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine..."
```

**Solution** : Démarrer Docker Desktop

### Secrets manquants

**Erreur** :

```
Error: secret CODECOV_TOKEN not found
```

**Solution** :

```bash
# Option 1: Ignorer secrets optionnels
act -j test  # fail_ci_if_error: false les gère

# Option 2: Fournir secrets locaux
act -s CODECOV_TOKEN=dummy-token -j test

# Option 3: Créer .secrets (ne pas commit!)
echo "CODECOV_TOKEN=dummy" >> .secrets
act --secret-file .secrets -j test
```

### Container trop gros

**Problème** : L'image par défaut est très grosse (~20GB)

**Solution** : Utiliser image optimisée (déjà configuré dans `.actrc`)

```bash
-P ubuntu-latest=catthehacker/ubuntu:act-latest  # ~2GB
```

### Permission denied

**Erreur** :

```
npm ERR! EACCES: permission denied
```

**Solution** : Utiliser `--bind` (déjà configuré dans `.actrc`)

```bash
act --bind -j test
```

---

## 📊 Workflow Exemple

### Workflow quotidien

```bash
# 1. Développement normal
# ... modifications code ...

# 2. Tests locaux (hooks pre-commit/pre-push)
git commit -m "feat: nouvelle feature"
# ✅ Hooks passent

# 3. Test workflow Act AVANT push (si gros changement)
act -j quality-check
act -j test
# ✅ Tout passe en local

# 4. Push
git push
# ✅ CI passe du premier coup
```

### Workflow debugging CI

```bash
# Workflow échoue sur GitHub

# 1. Pull les derniers changements
git pull

# 2. Tester localement avec Act
act -v -j build
# Voir logs détaillés

# 3. Identifier problème
# Ex: Rollup optional dependency missing

# 4. Fix local
# ... modifications ...

# 5. Re-tester avec Act
act -j build
# ✅ Passe maintenant

# 6. Push fix
git push
# ✅ CI passe
```

---

## 🎯 Limites d'Act

### Ce qu'Act peut faire

- ✅ Exécuter workflows localement
- ✅ Tester syntaxe workflow
- ✅ Détecter problèmes Linux/Ubuntu
- ✅ Tester jobs individuels
- ✅ Débugger avec logs verbeux

### Ce qu'Act ne peut PAS faire

- ❌ Simuler EXACTEMENT GitHub Actions (différences mineures)
- ❌ Accéder aux vrais secrets GitHub (sécurité)
- ❌ Déclencher webhooks externes
- ❌ Remplacer complètement la CI (validation finale)

**Règle d'or** : Act = Pré-validation locale, pas remplacement CI

---

## 📚 Commandes Utiles

### Lister tout

```bash
# Workflows disponibles
act -l

# Jobs du workflow "push"
act -l push

# Events disponibles
act -l -e push -e pull_request
```

### Tester jobs spécifiques

```bash
# Un seul job
act -j quality-check

# Plusieurs jobs (séquentiellement)
act -j quality-check -j test

# Tous les jobs
act push
```

### Debug

```bash
# Verbose
act -v -j test

# Très verbose
act -vv -j test

# Dry-run (voir plan sans exécuter)
act -n

# Graph du workflow
act -g
```

### Cleanup

```bash
# Supprimer containers Act
docker ps -a | grep act | awk '{print $1}' | xargs docker rm

# Supprimer images Act
docker images | grep act | awk '{print $3}' | xargs docker rmi
```

---

## 🔧 Configuration Avancée

### .actrc avec tous les paramètres

```ini
# Image Ubuntu optimisée
-P ubuntu-latest=catthehacker/ubuntu:act-latest

# Bind working directory
--bind

# Architecture
--container-architecture linux/amd64

# Réutiliser containers (attention: peut causer side-effects)
# --reuse

# Verbose par défaut
# -v

# Secrets file
# --secret-file .secrets

# Environment variables
# --env-file .env.local
```

### Variables d'environnement

```bash
# Dans workflow
act -j build --env LIGHTHOUSE_PAUSE_MS=500

# Via fichier
echo "LIGHTHOUSE_PAUSE_MS=500" >> .env.act
act --env-file .env.act -j build
```

### Secrets

```bash
# Inline
act -s CODECOV_TOKEN=dummy -j test

# Via fichier .secrets (ne pas commit!)
echo "CODECOV_TOKEN=dummy" >> .secrets
echo ".secrets" >> .gitignore
act --secret-file .secrets -j test
```

---

## 📖 Ressources

- **Documentation officielle** : https://github.com/nektos/act
- **Images disponibles** : https://github.com/catthehacker/docker_images
- **Troubleshooting** : https://github.com/nektos/act/issues

---

## 🎓 Intégration RNCP

### Compétences démontrées

- **C2.5** : Mettre en place un environnement de tests d'intégration et développer les tests
- **C3.4** : Optimiser les performances d'un site web
- **C5.2** : Déployer une application web (CI/CD)

### Documentation technique

Cette approche démontre :

- Maîtrise des outils CI/CD
- Tests locaux avant déploiement
- Optimisation workflow développement
- Prévention problèmes production

---

**Auteur** : Sandrine Cipolla
