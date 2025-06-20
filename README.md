# StockHub V2 🏭

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](/)
[![Deployment](https://img.shields.io/badge/Deployment-Active-brightgreen)](/)
[![Accessibility](https://img.shields.io/badge/Accessibility-RGAA-blue)](/)
[![SEO Score](https://img.shields.io/badge/Lighthouse_SEO-90+-green)](/)

> **Plateforme moderne de gestion de stocks intelligente** - Interface web responsive et accessible pour la gestion complète des inventaires avec design system intégré.

## 🚀 Aperçu

StockHub V2 est une application web moderne de gestion de stocks développée avec React et TypeScript. Elle offre une interface utilisateur intuitive, un design system cohérent et des fonctionnalités avancées d'intelligence artificielle pour l'analyse des stocks.

## 🔗 **[Voir la démo live](https://stock-hub-v2-front.vercel.app/)** | 📁 **[Repository GitHub](https://github.com/SandrineCipolla/stockHub_V2_front)**


### ✨ Fonctionnalités principales

- 📊 **Dashboard interactif** avec métriques en temps réel
- 🎨 **Design System** complet avec tokens standardisés
- 🌙 **Mode sombre/clair** avec transition fluide
- 📱 **Design responsive** Mobile First
- ♿ **Accessibilité RGAA** conforme
- 🎯 **TypeScript strict** pour la robustesse
- 🔍 **Recherche avancée** et filtres
- 📈 **Visualisations** et rapports
- 🤖 **IA intégrée** pour l'optimisation des stocks

## 🛠️ Stack Technique

### Core Technologies
- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Styling**: TailwindCSS 3.4.1
- **Icons**: Lucide React 0.517.0
- **Routing**: React Router DOM 7.6.2
- **Design System**: Custom Design System Package

### Development Tools
- **Linting**: ESLint 9.25.0 + TypeScript ESLint 8.30.1
- **PostCSS**: Autoprefixer 10.4.21 + PostCSS Import 16.1.1
- **Dev Server**: Vite avec Hot Module Replacement
- **Build Tools**: TSX 4.20.3 pour les scripts
- **SEO**: Vite Plugin Sitemap 0.8.2

### Design System
- **Tokens**: Variables CSS personnalisées
- **Components**: Composants modulaires réutilisables
- **Theming**: Support thème sombre/clair
- **Accessibility**: Attributs ARIA et navigation clavier

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
│   └── sitemap.xml
│   └── robots.txt
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

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Génère le sitemap et build de production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Lance ESLint |
| `npm run type-check` | Vérification TypeScript sans compilation |
| `npm run generate-sitemap` | Génère le sitemap XML automatiquement |

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

### Tokens de Design

```css
:root {
  /* Couleurs */
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  --color-primary-700: #6D28D9;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 0.75rem;
  --spacing-lg: 1rem;
  
  /* Typographie */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}
```

### Composants

- **Button**: Variantes primary, secondary, ghost
- **Card**: Composant conteneur avec hover effects
- **Badge**: États success, warning, danger
- **Input**: Champs de saisie avec validation
- **Modal**: Overlays et dialogues

## ♿ Accessibilité

L'application respecte les standards RGAA :

- ✅ Navigation clavier complète
- ✅ Contrastes conformes (ratio 4.5:1 minimum)
- ✅ Attributs ARIA appropriés
- ✅ Structure HTML sémantique
- ✅ Focus visible et cohérent

## 🧪 Tests & Qualité

### Audits

- **Lighthouse SEO**: Score > 90/100
- **Accessibilité WAVE**: Conforme RGAA
- **Performance**: Core Web Vitals optimisés
- **TypeScript**: Mode strict activé

### Commandes d'audit

```bash
# Lighthouse CLI
npm i -g lighthouse
lighthouse http://localhost:5173 --output html

# Analyse de bundle
npm run build -- --analyze
```

## 🌱 Éco-conception

- **Optimisation images**: Formats modernes, lazy loading
- **CSS optimisé**: Purge du CSS inutile
- **JavaScript**: Tree shaking et code splitting
- **Score EcoIndex**: Objectif grade B ou supérieur


## 👥 Équipe

- **Sandrine Cipolla** - Développeuse Full Stack

## 🔗 Liens Utiles

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)
- [Guide Accessibilité RGAA](https://accessibilite.numerique.gouv.fr/)

---

<div align="center">

**Développé avec ❤️ par [Sandrine Cipolla](https://github.com/SandrineCipolla)**

</div>