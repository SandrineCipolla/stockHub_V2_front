# 🤖 Stratégie d'Automatisation des Métriques - StockHub V2

## 📋 Problématiques Identifiées

### 1. **Génération des Audits**

- ❌ Audits non synchronisés (Lighthouse généré, mais pas FPS, Datasets, etc.)
- ❌ Génération manuelle fastidieuse
- ❌ Risque d'oubli de certains audits

### 2. **Fichiers Obsolètes**

- ❌ 60+ fichiers JSON dans `documentation/metrics/data/`
- ❌ Anciens fichiers non nettoyés
- ❌ Confusion sur quel fichier est le "dernier"

### 3. **Dashboard Statique**

- ❌ Liste statique `staticFileList` à mettre à jour manuellement
- ❌ Pas de chargement automatique du dernier fichier

---

## ✅ Solutions Proposées

### Solution 1 : GitHub Actions (CI/CD Automatisé)

**Déclencheurs** :

1. **À chaque Push sur `main`** : Audit complet
2. **Pull Request** : Audit Lighthouse uniquement (rapide)
3. **Cron quotidien** : Audit complet (chaque nuit)

**Workflow GitHub Actions** :

```yaml
name: Generate Metrics

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Tous les jours à 2h du matin
    - cron: '0 2 * * *'

jobs:
  generate-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build production
        run: npm run build

      - name: Start preview server
        run: npm run preview &

      - name: Wait for server
        run: sleep 5

      - name: Generate all audits
        run: npm run audit:full

      - name: Clean old metrics (keep last 3)
        run: node scripts/clean-old-metrics.mjs

      - name: Update dashboard file list
        run: node scripts/update-metrics-files.mjs

      - name: Commit new metrics
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add documentation/metrics/
          git commit -m "chore(metrics): update quality metrics [skip ci]" || echo "No changes"
          git push
```

**Avantages** :

- ✅ Automatique à chaque merge dans `main`
- ✅ Historique complet des métriques
- ✅ Audit quotidien pour détecter régressions
- ✅ Pas besoin d'intervention manuelle

---

### Solution 2 : Pre-commit/Pre-push Hooks (Husky)

**Hook Pre-push** (ajout dans `.husky/pre-push`) :

```bash
#!/bin/sh

# Générer métriques avant push (optionnel)
if [ "$SKIP_METRICS" != "1" ]; then
  echo "🔍 Génération des métriques..."
  npm run build
  npm run preview &
  PREVIEW_PID=$!
  sleep 5
  npm run audit:full
  kill $PREVIEW_PID

  # Nettoyage automatique
  node scripts/clean-old-metrics.mjs

  # Ajouter au commit si modifié
  git add documentation/metrics/data/
fi
```

**Pour skip** :

```bash
SKIP_METRICS=1 git push
```

**Avantages** :

- ✅ Métriques toujours à jour avant push
- ✅ Détection précoce des régressions
- ❌ Augmente le temps de push (+30s)

---

### Solution 3 : Script de Nettoyage Automatique

**Créer** : `scripts/clean-old-metrics.mjs`

```javascript
import fs from 'fs';
import path from 'path';

const DATA_DIR = './documentation/metrics/data';
const KEEP_LAST_N = 3; // Garder les 3 derniers fichiers

const prefixes = [
  'lighthouse',
  'lighthouse-raw',
  'risk-levels-audit',
  'daltonisme',
  'fps',
  'a11y',
  'datasets',
  'audit-complet',
];

function cleanOldFiles() {
  const files = fs.readdirSync(DATA_DIR);

  prefixes.forEach(prefix => {
    const pattern = new RegExp(`^${prefix}-\\d+\\.json$`);
    const matchingFiles = files
      .filter(f => pattern.test(f))
      .map(f => ({
        name: f,
        timestamp: parseInt(f.match(/\\d+/)[0]),
        path: path.join(DATA_DIR, f),
      }))
      .sort((a, b) => b.timestamp - a.timestamp); // Plus récent en premier

    // Garder les N derniers, supprimer le reste
    const toDelete = matchingFiles.slice(KEEP_LAST_N);

    toDelete.forEach(file => {
      console.log(`🗑️  Suppression: ${file.name}`);
      fs.unlinkSync(file.path);
    });

    console.log(
      `✅ ${prefix}: ${matchingFiles.length - toDelete.length} fichiers conservés, ${toDelete.length} supprimés`
    );
  });
}

cleanOldFiles();
console.log('\\n✨ Nettoyage terminé !');
```

**Utilisation** :

```bash
npm run clean:metrics
```

**Package.json** :

```json
{
  "scripts": {
    "clean:metrics": "node scripts/clean-old-metrics.mjs"
  }
}
```

---

### Solution 4 : Dashboard Dynamique Auto-reload

**Modifier** : `documentation/metrics/index.html`

Remplacer le système de `staticFileList` par un chargement purement dynamique :

```javascript
async function findLatestJSON(prefix) {
  const pattern = prefixMapping[prefix];
  if (!pattern) return null;

  try {
    // Essayer de lister le dossier
    const resp = await fetch('./data/');
    if (resp.ok) {
      const text = await resp.text();
      const matches = [...text.matchAll(/href="([^"]+\\.json)"/g)]
        .map(m => m[1])
        .filter(name => pattern.test(name));

      if (matches.length > 0) {
        matches.sort().reverse();
        console.log(`📂 Fichier le plus récent pour ${prefix}: ${matches[0]}`);
        return './data/' + matches[0];
      }
    }
  } catch (e) {
    console.error(`❌ Erreur chargement ${prefix}:`, e);
  }

  // Si échec, chercher directement le fichier le plus récent
  // En production (GitHub Pages), utiliser un manifest.json
  try {
    const manifestResp = await fetch('./data/manifest.json');
    if (manifestResp.ok) {
      const manifest = await manifestResp.json();
      return manifest[prefix] ? `./data/${manifest[prefix]}` : null;
    }
  } catch (e) {
    // Pas de manifest, fallback sur staticFileList obsolète
    console.warn(`⚠️ Pas de manifest.json, chargement potentiellement obsolète`);
  }

  return null;
}
```

**Créer** : `scripts/generate-manifest.mjs`

```javascript
import fs from 'fs';
import path from 'path';

const DATA_DIR = './documentation/metrics/data';
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

const prefixes = {
  lighthouse: /^lighthouse-\\d+\\.json$/,
  'lighthouse-raw': /^lighthouse-raw-\\d+\\.json$/,
  'risk-levels': /^risk-levels-audit-\\d+\\.json$/,
  daltonisme: /^daltonisme-\\d+\\.json$/,
  fps: /^fps-\\d+\\.json$/,
  a11y: /^a11y-\\d+\\.json$/,
  datasets: /^datasets-\\d+\\.json$/,
  'audit-complet': /^audit-complet-\\d+\\.json$/,
};

function generateManifest() {
  const files = fs.readdirSync(DATA_DIR);
  const manifest = {};

  Object.entries(prefixes).forEach(([key, pattern]) => {
    const matchingFiles = files
      .filter(f => pattern.test(f))
      .sort()
      .reverse(); // Plus récent en premier

    if (matchingFiles.length > 0) {
      manifest[key] = matchingFiles[0];
      console.log(`✅ ${key}: ${matchingFiles[0]}`);
    } else {
      console.warn(`⚠️ ${key}: Aucun fichier trouvé`);
    }
  });

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\\n📄 Manifest créé: ${MANIFEST_PATH}`);
}

generateManifest();
```

**Package.json** :

```json
{
  "scripts": {
    "metrics:manifest": "node scripts/generate-manifest.mjs",
    "metrics:dashboard": "npm run generate:all && npm run clean:metrics && npm run metrics:manifest"
  }
}
```

---

## 🎯 Stratégie Recommandée

### Phase 1 : Immédiat (Cette semaine)

1. ✅ **Créer le script de nettoyage** (`clean-old-metrics.mjs`)
2. ✅ **Créer le manifest generator** (`generate-manifest.mjs`)
3. ✅ **Modifier le dashboard** pour utiliser `manifest.json`
4. ✅ **Ajouter les scripts npm** :
   ```json
   {
     "clean:metrics": "node scripts/clean-old-metrics.mjs",
     "metrics:manifest": "node scripts/generate-manifest.mjs",
     "metrics:update": "npm run clean:metrics && npm run metrics:manifest"
   }
   ```

### Phase 2 : Court terme (Prochaine PR)

5. ✅ **Créer GitHub Action** (workflow ci-dessus)
6. ✅ **Tester en prod** sur GitHub Pages
7. ✅ **Documenter** le processus

### Phase 3 : Moyen terme (Optionnel)

8. ⚠️ **Husky pre-push hook** (si souhaité, mais ralentit le push)
9. ⚠️ **Dashboard temps réel** avec WebSocket (avancé)

---

## 📝 Workflow Idéal

### Développeur

1. Développe une feature
2. Commit les changements
3. Push vers GitHub

### GitHub Actions (Automatique)

4. Build production
5. Génère **tous** les audits (Lighthouse, FPS, A11y, etc.)
6. Nettoie les anciens fichiers (garde les 3 derniers)
7. Génère `manifest.json`
8. Commit et push les nouveaux métriques

### Dashboard (Automatique)

9. Charge `manifest.json`
10. Affiche les **dernières** métriques
11. Pas de maintenance manuelle nécessaire

---

## 🔧 Commandes Utiles

```bash
# Générer tous les audits
npm run audit:full

# Nettoyer les anciens fichiers
npm run clean:metrics

# Créer le manifest
npm run metrics:manifest

# Tout faire d'un coup
npm run metrics:dashboard

# Générer + Nettoyer + Manifest + Servir
npm run metrics:update && npm run metrics:serve
```

---

## ⚡ Fréquence Recommandée

| Event              | Fréquence       | Audits                         |
| ------------------ | --------------- | ------------------------------ |
| **Push main**      | À chaque merge  | Lighthouse uniquement (rapide) |
| **Cron quotidien** | 1x/jour (2h AM) | Tous les audits                |
| **Release**        | À chaque tag    | Tous + archivage               |
| **PR**             | Optionnel       | Lighthouse (commentaire auto)  |

---

## 🚀 Bénéfices

- ✅ **Zéro maintenance** manuelle
- ✅ Dashboard toujours à jour
- ✅ Historique complet des performances
- ✅ Détection automatique des régressions
- ✅ Nettoyage automatique (pas d'accumulation)
- ✅ Manifest garantit le bon fichier chargé

---

**Prochaine étape** : Implémenter Phase 1 (scripts de nettoyage + manifest) dans cette PR ?
