# StockHub V2 🏭

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](/)
[![Deployment](https://img.shields.io/badge/Deployment-Active-brightgreen)](/)
[![Accessibility](https://img.shields.io/badge/Accessibility-RGAA-blue)](/)
[![SEO Score](https://img.shields.io/badge/Lighthouse_SEO-100-green)](/)

> **Plateforme moderne de gestion de stocks intelligente** - Interface web responsive et accessible pour la gestion complète des inventaires avec design system intégré.

## 🚀 Aperçu

StockHub V2 est une application web moderne de gestion de stocks développée avec React et TypeScript. Elle offre une interface utilisateur intuitive, un design system cohérent et des fonctionnalités avancées d'intelligence artificielle pour l'analyse des stocks.

## 🔗 **[Voir la démo live](https://brave-field-03611eb03.5.azurestaticapps.net)** | 📁 **[Repository GitHub](https://github.com/SandrineCipolla/stockHub_V2_front)** | 📖 **[Storybook Design System](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)**

---

## 🎉 Nouveautés Majeures (Mars 2026)

### 🔮 Prédictions & Historique Backend (Mars 2026)

- **`predictionsAPI.ts`** : client API pour `GET /items/:id/prediction` (daysUntilEmpty, trend, avgDailyConsumption) et `GET /items/:id/history` (entrées CONSUMPTION / RESTOCK / ADJUSTMENT)
- **`usePredictions(stockId, itemId)`** : hook réutilisable suivant le pattern `useAsyncAction`
- **StockDetailPage** : charge automatiquement les prédictions backend pour les items à risque (critical / low / out-of-stock) — remplace la simulation 10%/j par `avgDailyConsumption` réel
- **Fallback gracieux** : si le backend est indisponible, la simulation est conservée et un message discret "Données insuffisantes — estimation approximative" est affiché
- **`computePredictions`** : accepte un `predictionMap` par itemId ; utilise `recommendedRestock` réel du backend
- **`generateAISuggestions`** : accepte un `consumptionMap` optionnel — remplace la simulation 5%/j par les données réelles quand disponibles

### 🌐 Landing Page & SEO/GEO (Mars 2026)

- **LandingPage** : Page publique avec hero, features, démo IA, tech stack et CTA — accessible sans authentification
- **SEO** : JSON-LD `SoftwareApplication`, OG tags, canonical, meta description optimisée
- **GEO** : fichier `llms.txt` pour les crawlers IA (convention LLMs.txt)
- **Sitemap** : URLs corrigées vers la production Azure
- **Score Lighthouse SEO** : 100/100

### 📦 Gestion des Items (Mars 2026)

- **StockDetailPage** : Vue détaillée d'un stock avec table paginée (20 items/page) et filter chips par statut (Tous, Rupture, Critique, Stock bas, OK)
- **ItemFormModal** : Modale create/edit pour les items (label, description, stock minimum, quantité initiale)
- **Edition inline** : Modification de quantité directement dans la table (clic sur la valeur → input éditable)
- **Logique de statut items** :
  - `quantity > minimumStock` → OK
  - `quantity === minimumStock` → Stock bas (à la limite)
  - `0 < quantity < minimumStock` → Critique
  - `quantity === 0` → Rupture
- **Prédictions IA repliables** : Section "Alertes intelligentes" accordéon, repliée par défaut
- **StockFormModal** : Modale create/edit pour les stocks avec validation backend (catégorie, description, label min 3 caractères)

---

## 🎉 Nouveautés Majeures (Oct-Nov 2025)

### ✨ Design System Externe (Novembre 2025)

- 🎨 **18 Web Components Lit** déployés dans un [repository séparé](https://github.com/SandrineCipolla/stockhub_design_system)
- 📖 **Storybook en ligne** avec documentation interactive complète
- 📦 **Package npm** `@stockhub/design-system` v1.3.1 publié

### 🤖 IA Business Intelligence (Octobre 2025)

- 💡 **SmartSuggestions** : Recommandations intelligentes basées sur l'historique
- 📊 **Prédictions ML** : Alertes de rupture de stock avec niveau de confiance
- 🎯 **Niveau de risque** : Critical, Low, Optimal avec codes couleur

### 🎭 Mode Loisirs/Créatif (Octobre 2025)

- 📏 **7 unités flexibles** : %, ml, m, tubes, portions, pelotes, feuilles
- 🎨 **Gestion containers** : Tubes de peinture avec sessions d'utilisation
- 🧵 **Contexte créatif** : Adapté pour couture, peinture, cuisine, cellier

### ✨ Animations & UX (Octobre 2025)

- 🎬 **Framer Motion** : Animations fluides 60 FPS garantis
- 🌊 **Transitions** : Entrance, hover, exit animations
- ♿ **Reduced Motion** : Support `prefers-reduced-motion`

### 🛡️ Qualité & Sécurité (Décembre 2025)

- 🔒 **0 vulnérabilité npm** (corrigé 09/12/2025)
- ✅ **526 tests** (coverage composants 90-98%)
- ♿ **Accessibilité Lighthouse 94/100** (en cours d'amélioration, fixes DS en cours)
- ⚡ **Lighthouse 93/100** performance, **100/100** SEO

> 📊 **[État complet du projet Décembre 2025](./documentation/planning/ETAT-DECEMBRE-2025.md)** - Vision d'ensemble et roadmap

---

### ✨ Fonctionnalités principales

- 📊 **Dashboard interactif** avec métriques en temps réel et animations fluides (60 FPS)
- 🎨 **Design System externe** - 18 Web Components Lit avec Storybook déployé
- 🤖 **IA Business Intelligence** - SmartSuggestions et prédictions de rupture de stock
- 🎭 **Mode Loisirs/Créatif** - 7 unités flexibles (%, ml, m, tubes, portions, etc.)
- 🌙 **Mode sombre/clair** avec transition fluide
- 📱 **Design responsive** Mobile First
- ♿ **Accessibilité Lighthouse 94/100** (corrections DS en cours)
- 🎯 **TypeScript strict** pour la robustesse (0 erreur)
- 🔍 **Recherche avancée** et filtres
- 📈 **Visualisations** et rapports
- ✨ **Animations Framer Motion** pour une UX fluide

## 🛠️ Stack Technique

### Core Technologies

- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 6.4.1
- **Styling**: TailwindCSS 3.4.1
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.517.0
- **Routing**: React Router DOM 7.9.5
- **Design System**: [@stockhub/design-system](https://github.com/SandrineCipolla/stockhub_design_system) v1.3.2 (18 Web Components Lit)

### Development Tools

- **Linting**: ESLint 9.25.0 + TypeScript ESLint 8.30.1
- **Formatting**: Prettier 3.6.2 avec auto-formatting
- **Testing**: Vitest 3.2.4 + Testing Library
- **Git Hooks**: Husky 9.1.7 + lint-staged 16.2.6
- **Dead Code**: Knip 5.66.2 pour détection code inutilisé
- **PostCSS**: Autoprefixer 10.4.21 + PostCSS Import 16.1.1
- **Dev Server**: Vite avec Hot Module Replacement
- **Build Tools**: TSX 4.20.3 pour les scripts
- **SEO**: Vite Plugin Sitemap 0.8.2

### Design System Externe

**Repository séparé** : [@stockhub/design-system](https://github.com/SandrineCipolla/stockhub_design_system) v1.3.2

- **18 Web Components Lit** (5 atoms, 7 molecules, 6 organisms)
- **Storybook déployé** : [Documentation interactive](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)
- **Tokens CSS** : Variables standardisées (colors, spacing, typography)
- **Theming** : Support mode sombre/clair
- **Accessibility** : ARIA, navigation clavier, WCAG AA conforme

> 📚 **[Guide d'intégration Web Components](./documentation/2-WEB-COMPONENTS-GUIDE.md)** - Patterns React + Web Components

## 🚀 Installation & Démarrage

### Prérequis

```bash
Node.js >= 18.0.0
npm >= 8.0.0 ou yarn >= 1.22.0
```

### Installation

1. **Cloner le repository**

```bash
git clone https://github.com/SandrineCipolla/stockHub_V2_front.git
cd stockHub_V2_front
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
```

3. **Configurer l'environnement**

```bash
cp .env.example .env.local
# Éditer les variables d'environnement
```

### Démarrage en développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à `http://localhost:5173`

### Build de production

```bash
npm run build
# ou
yarn build
```

### Prévisualisation de production

```bash
npm run preview
# ou
yarn preview
```

## 📁 Structure du Projet

```
stockHub_V2_front/
├── public/                 # Assets statiques
│   ├── vite.svg
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── llms.txt            # GEO — crawlers IA
│   └── og-image.png        # Image Open Graph
├── src/                    # Code source
│   ├── components/        # Composants réutilisables
│   ├── contexts/
│   ├── data/             # Données statiques
│   ├── hooks/            # Hooks personnalisés
│   ├── pages/            # Pages web
│   ├── types/            # Types TypeScript
│   ├── utils/            # Utilitaires
│   ├── App.tsx           # Composant principal
│   ├── main.tsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── scripts/              # Scripts utilitaires
│   └── generate-sitemap.ts
├── eslint.config.js      # Configuration ESLint
├── index.html
├── tailwind.config.js    # Configuration TailwindCSS
├── tsconfig.json         # Configuration TypeScript
├── vite.config.ts        # Configuration Vite
└── package.json          # Dépendances et scripts
```

## 🔧 Scripts Disponibles

### Développement

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Démarre le serveur de développement |
| `npm run preview` | Prévisualise le build de production |

### Build & Deploy

| Script                       | Description                             |
| ---------------------------- | --------------------------------------- |
| `npm run build`              | Build de production (TypeScript + Vite) |
| `npm run build:with-sitemap` | Build avec génération du sitemap        |
| `npm run generate-sitemap`   | Génère le sitemap XML automatiquement   |

### Quality & Tests

| Script                   | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm run lint`           | Lance ESLint sur le code                   |
| `npm run lint:fix`       | Corrige automatiquement les erreurs ESLint |
| `npm run format`         | Formate le code avec Prettier              |
| `npm run format:check`   | Vérifie le formatage sans modifier         |
| `npm run type-check`     | Vérification TypeScript sans compilation   |
| `npm run test`           | Lance les tests en mode watch              |
| `npm run test:run`       | Exécute tous les tests une fois            |
| `npm run test:coverage`  | Tests avec rapport de couverture           |
| `npm run clean:deadcode` | Détecte le code mort avec Knip             |
| `npm run clean:fix`      | Supprime automatiquement le code mort      |

### CI/CD

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run ci:quality` | Vérifications qualité (TypeScript, ESLint, Knip) |
| `npm run ci:test`    | Exécute les tests pour CI                        |
| `npm run ci:build`   | Build de production pour CI                      |
| `npm run ci:check`   | Pipeline complet (quality + tests + build)       |

### Audits & Métriques

| Script                      | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `npm run audit:full`        | Audit complet (Lighthouse, FPS, A11y, Datasets, WCAG) |
| `npm run audit:fps`         | Audit performance FPS (animations)                    |
| `npm run audit:a11y`        | Audit accessibilité (Reduced Motion)                  |
| `npm run audit:datasets`    | Audit scalabilité (datasets)                          |
| `npm run audit:daltonisme`  | Tests daltonisme et accessibilité visuelle            |
| `npm run audit:risk-levels` | Tests contrastes WCAG Risk Levels                     |

**Dashboard Qualité** : Consultez [documentation/metrics/](./documentation/metrics/) pour visualiser toutes les métriques de manière interactive.

- 📊 **Local** : http://localhost:5173/documentation/metrics/
- 🌐 **En ligne** : https://sandrinecipolla.github.io/stockHub_V2_front/

## 🪝 Git Hooks (Husky)

Le projet utilise Husky pour automatiser les vérifications de qualité à chaque commit et push.

### Pre-commit (Rapide ~10s)

Exécuté automatiquement à chaque `git commit`:

- ✅ **lint-staged**: Formatage Prettier + ESLint sur fichiers modifiés uniquement
- ✅ **TypeScript**: Vérification des types
- 🎯 **Objectif**: Code formaté et sans erreurs TypeScript

### Pre-push (Complet ~20s)

Exécuté automatiquement à chaque `git push`:

- ✅ **Tests**: Tous les tests unitaires (422+ tests)
- ✅ **Knip**: Détection du code mort
- ✅ **Build**: Vérification que le build passe
- 🎯 **Objectif**: Code testé, propre et buildable

### Bypass des hooks (si nécessaire)

```bash
# Skip pre-commit
git commit --no-verify -m "message"

# Skip pre-push
git push --no-verify
```

> ⚠️ **Note**: Utiliser `--no-verify` uniquement en cas d'urgence. Les hooks garantissent la qualité du code.

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Installation Vercel CLI**

```bash
npm i -g vercel
```

2. **Déploiement**

```bash
vercel --prod
```

### Netlify

1. **Build**

```bash
npm run build
```

2. **Déployer le dossier `dist/`**

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t stockhub-v2 .
docker run -p 80:80 stockhub-v2
```

## 🎨 Design System

### 18 Web Components Disponibles

**Atoms (5)** :

- `<sh-badge>` - Badges colorés
- `<sh-icon>` - Icônes Lucide
- `<sh-input>` - Champs de saisie
- `<sh-logo>` - Logo StockHub
- `<sh-text>` - Texte typographique

**Molecules (7)** :

- `<sh-button>` - Boutons avec variantes (primary, secondary, ghost)
- `<sh-card>` - Cartes conteneurs avec hover effects
- `<sh-metric-card>` - Cartes métriques dashboard
- `<sh-quantity-input>` - Input numérique +/-
- `<sh-search-input>` - Barre de recherche
- `<sh-stat-card>` - Cartes statistiques
- `<sh-status-badge>` - Badges de statut stock

**Organisms (6)** :

- `<sh-header>` - En-tête application
- `<sh-footer>` - Pied de page
- `<sh-page-header>` - En-tête de page
- `<sh-ia-alert-banner>` - Bannière alertes IA
- `<sh-stock-card>` - Carte produit
- `<sh-stock-prediction-card>` - Prédictions ML

> 📖 **[Documentation Storybook complète](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)** avec exemples interactifs

## ♿ Accessibilité

L'application est **100% conforme WCAG 2.1 Level AA** (auditée novembre 2025) :

- ✅ Navigation clavier complète et focus visible
- ✅ Contrastes validés (ratio 3.19:1 à 8.76:1)
- ✅ Attributs ARIA appropriés sur tous les composants
- ✅ Structure HTML sémantique
- ✅ Tests daltonisme (protanopie, deutéranopie, tritanopie, achromatopsie)
- ✅ Support `prefers-reduced-motion` pour les animations
- ✅ Screen readers testés (NVDA, JAWS)

> 📋 **[Rapport audit accessibilité complet](./documentation/6-ACCESSIBILITY.md)**

## 🧪 Tests & Qualité

### Métriques de Qualité

#### Tests Unitaires

- **Tests**: 422+ tests passing (22 skipped pour E2E futures)
- **Coverage Composants**: 90-98%
- **Coverage Wrappers**: 234 tests wrappers Web Components
- **Framework**: Vitest 3.2.4 + Testing Library
- **Temps d'exécution**: ~11s

#### Code Quality

- **TypeScript**: Mode strict, 0 erreur
- **ESLint**: 0 warning
- **Prettier**: Formatage automatique
- **Knip**: Détection code mort activée

#### Performance

- **Lighthouse Performance**: 99/100
- **Lighthouse Accessibility**: 96/100
- **Lighthouse SEO**: Score > 90/100
- **Bundle Size**: 113.99 KB gzipped
- **Build Time**: ~5s

### Commandes d'audit

```bash
# Tests avec couverture
npm run test:coverage

# Lighthouse CLI
npm i -g lighthouse
lighthouse http://localhost:5173 --output html

# Analyse de bundle
npm run build -- --analyze

# Détection code mort
npm run clean:deadcode
```

## 🌱 Éco-conception

- **Optimisation images**: Formats modernes, lazy loading
- **CSS optimisé**: Purge du CSS inutile
- **JavaScript**: Tree shaking et code splitting
- **Score EcoIndex**: Objectif grade B ou supérieur

## 👥 Équipe

- **Sandrine Cipolla** - Développeuse Full Stack

## 📚 Documentation

### Documentation Interne

- **[📊 État du Projet Décembre 2025](./documentation/planning/ETAT-DECEMBRE-2025.md)** ⭐ - **Vue d'ensemble complète** (accomplissements, métriques, roadmap)
- **[Index Documentation](./documentation/0-INDEX.md)** - Table des matières complète
- **[Guide Web Components](./documentation/2-WEB-COMPONENTS-GUIDE.md)** - Intégration du Design System
- **[Dashboard Qualité](./documentation/9-DASHBOARD-QUALITY.md)** - Documentation dashboard interactif
- **[Accessibilité](./documentation/6-ACCESSIBILITY.md)** - Audit WCAG AA complet
- **[CLAUDE.md](./CLAUDE.md)** - Instructions de développement et conventions

### Documentation Externe

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)
- [Guide Accessibilité RGAA](https://accessibilite.numerique.gouv.fr/)

---

<div align="center">

**Développé avec ❤️ par [Sandrine Cipolla](https://github.com/SandrineCipolla)**

</div>
