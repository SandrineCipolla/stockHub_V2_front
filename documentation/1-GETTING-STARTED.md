# 🚀 Getting Started - StockHub V2 Frontend

> **Guide de démarrage rapide** pour développer sur StockHub V2
> De l'installation à la première contribution

**Version Frontend** : v1.1.0
**Design System** : v1.3.1
**Date** : 18 Novembre 2025

---

## 📋 Prérequis

### Environnement Requis

- **Node.js** : >= 18.0.0
- **npm** : >= 9.0.0
- **Git** : Pour cloner le repository
- **IDE recommandé** : VS Code avec extensions (TypeScript, ESLint, Prettier)

### Vérifier votre environnement

```bash
node --version    # v18.0.0 ou supérieur
npm --version     # v9.0.0 ou supérieur
git --version     # n'importe quelle version récente
```

---

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/SandrineCipolla/stockHub_V2_front.git
cd stockHub_V2_front
```

### 2. Installer les dépendances

```bash
npm install
```

Cela installe :

- React 19.1.0 + TypeScript 5.8.3
- Vite 6.3.5 (build tool)
- Design System `@stockhub/design-system@v1.3.1`
- Dépendances de test (Vitest, Testing Library)

**Durée estimée** : 2-3 minutes

---

## 🏃 Lancer le projet

### Mode développement

```bash
npm run dev
```

**Accès** : http://localhost:5173

L'application se recharge automatiquement à chaque modification de fichier.

### Build de production

```bash
npm run build
```

Le build optimisé est généré dans `/dist` (~113 KB gzipped).

### Prévisualiser le build

```bash
npm run preview
```

Teste le build de production localement.

---

## 🧪 Tests

### Lancer tous les tests

```bash
npm run test:run
```

**Résultat attendu** : 464 tests passent (33 skipped, 497 total)

### Mode watch (développement)

```bash
npm run test
```

Les tests se relancent automatiquement quand vous modifiez un fichier.

### Coverage

```bash
npm run test:coverage
```

**Couverture actuelle** : 60.67% global, composants 90-98%

---

## 📂 Structure du Projet

```
stockHub_V2_front/
├── src/
│   ├── components/         # Composants React
│   │   ├── common/         # Wrappers Design System (7 wrappers)
│   │   └── dashboard/      # Composants spécifiques
│   ├── pages/              # Pages (Dashboard, Analytics, Stocks)
│   ├── contexts/           # Contextes React (Theme, etc.)
│   ├── hooks/              # Hooks personnalisés
│   ├── types/              # Types TypeScript
│   ├── utils/              # Fonctions utilitaires
│   ├── data/               # Données mock
│   ├── App.tsx             # Composant principal
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux (TailwindCSS)
│
├── documentation/          # 📚 Documentation (vous êtes ici)
│   ├── 0-INDEX.md          # Index principal
│   ├── 1-GETTING-STARTED.md # Ce guide
│   ├── 2-WEB-COMPONENTS-GUIDE.md
│   ├── sessions/           # Sessions développement
│   ├── technical/          # Docs techniques
│   └── ...
│
├── public/                 # Fichiers statiques
├── README.md               # Vue d'ensemble projet
├── package.json            # Dépendances et scripts
├── vite.config.ts          # Configuration Vite
├── tsconfig.json           # Configuration TypeScript
└── vitest.config.ts        # Configuration tests
```

---

## 🎨 Design System

StockHub V2 utilise un **Design System externe** (repository séparé).

### Informations Design System

- **Repository** : https://github.com/SandrineCipolla/stockhub_design_system
- **Storybook** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **Package** : `@stockhub/design-system@v1.3.1`
- **Composants** : 18 Web Components (Lit Element)

### Utilisation dans React

```tsx
// Import automatique via package
import '@stockhub/design-system';

// Utilisation directe
<sh-button variant="primary" iconBefore="Plus">
  Ajouter
</sh-button>;

// OU via wrapper React
import { ButtonWrapper } from '@/components/common/ButtonWrapper';

<ButtonWrapper variant="primary" iconBefore="Plus" onClick={handleClick}>
  Ajouter
</ButtonWrapper>;
```

**Documentation complète** : [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md)

---

## ✅ Vérifications Qualité

### Pipeline complet (recommandé avant push)

```bash
npm run ci:check
```

Exécute :

- ✅ TypeScript (type-check)
- ✅ ESLint (linting)
- ✅ Knip (code mort)
- ✅ Tests (464 tests)
- ✅ Build production

**Durée** : ~30 secondes

### Vérifications individuelles

```bash
npm run type-check      # TypeScript uniquement
npm run lint            # ESLint uniquement
npm run clean:deadcode  # Knip uniquement
npm run test:run        # Tests uniquement
```

---

## 🔄 Git Hooks (Husky)

Le projet utilise **Husky** pour automatiser les vérifications :

### Pre-commit (rapide ~10s)

Automatique à chaque `git commit` :

- ✅ Prettier (formatage auto)
- ✅ ESLint sur fichiers modifiés
- ✅ TypeScript type-check

### Pre-push (complet ~20s)

Automatique à chaque `git push` :

- ✅ Tous les tests (464 tests)
- ✅ Knip (détection code mort)
- ✅ Build production

**Bypass** (urgence uniquement) :

```bash
git commit --no-verify -m "message"
git push --no-verify
```

---

## 🛠️ Scripts Utiles

### Développement

```bash
npm run dev              # Serveur dev (http://localhost:5173)
npm run format           # Formater tout le code (Prettier)
npm run lint:fix         # Corriger erreurs ESLint auto
```

### Tests & Qualité

```bash
npm run test             # Tests en mode watch
npm run test:ui          # Interface UI pour tests (Vitest)
npm run coverage         # Rapport de couverture
npm run ci:quality       # Vérifications qualité (TypeScript + ESLint + Knip)
```

### Build & Déploiement

```bash
npm run build            # Build de production
npm run preview          # Prévisualiser le build
npm run build:with-sitemap  # Build + sitemap.xml
```

### Audits

```bash
npm run audit:full       # Audit complet
npm run audit:a11y       # Accessibilité
npm run audit:fps        # Performance FPS
npm run audit:risk-levels # Contraste couleurs
```

---

## 📖 Conventions de Code

### TypeScript

- **Mode strict** activé
- **0 erreur** tolérée
- Typage explicite préféré

```typescript
// ✅ Bon
const stocks: StockItem[] = getStocks();

// ❌ Éviter
const stocks = getStocks(); // Type implicite
```

### Composants React

```typescript
// Nommage: PascalCase
export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  // ...
};
```

### Commits

**Format** : `type(scope): message`

**Types** : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemples** :

```bash
git commit -m "feat(dashboard): add search functionality"
git commit -m "fix(stock-card): correct hover animation"
git commit -m "test(wrappers): add ButtonWrapper tests"
```

---

## 🎯 Première Contribution

### 1. Créer une branche

```bash
git checkout -b feat/ma-feature
# OU
git checkout -b fix/mon-bugfix
```

### 2. Développer

- Modifier le code
- Écrire les tests
- Vérifier avec `npm run ci:check`

### 3. Commiter

```bash
git add .
git commit -m "feat(scope): description"
```

Les hooks pre-commit vérifient automatiquement le code.

### 4. Pousser

```bash
git push -u origin feat/ma-feature
```

Les hooks pre-push lancent les tests.

### 5. Pull Request

Créer une PR sur GitHub avec :

- Description claire
- Screenshots si UI
- Tests qui passent

---

## 🐛 Problèmes Courants

### Les Web Components ne s'affichent pas

```bash
# Vérifier l'import du Design System
# main.tsx doit contenir:
import '@stockhub/design-system';
```

**Solution** : Voir [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)

### Tests échouent

```bash
# Vérifier la version Node
node --version  # Doit être >= 18

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Build échoue

```bash
# Nettoyer le cache
npm run clean
npm run build
```

---

## 📚 Documentation Complète

### Par ordre de lecture recommandé

1. **[0-INDEX.md](0-INDEX.md)** - Index principal (structure complète)
2. **[1-GETTING-STARTED.md](1-GETTING-STARTED.md)** - Ce guide
3. **[2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)** - Utilisation web components
4. **[3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md)** - Harmonisation Frontend ↔ DS
5. **[4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)** - Résolution problèmes
6. **[5-TESTING-GUIDE.md](5-TESTING-GUIDE.md)** - Guide tests
7. **[7-SESSIONS.md](7-SESSIONS.md)** - Sessions développement (9 sessions)
8. **[8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)** - Suivi RNCP

### Documentation Technique

- [V2/ARCHITECTURE.md](V2/ARCHITECTURE.md) - Architecture complète
- [V2/TYPESCRIPT.md](V2/TYPESCRIPT.md) - Conventions TypeScript
- [technical/AI-FEATURES.md](technical/AI-FEATURES.md) - Intelligence artificielle
- [technical/ANIMATIONS.md](technical/ANIMATIONS.md) - Système d'animations

---

## 🆘 Besoin d'Aide ?

### Documentation

- **Web Components** : [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)
- **Tests** : [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md)
- **Debug** : [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)

### Resources Externes

- **Storybook DS** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **React Docs** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/docs/
- **Vite** : https://vitejs.dev/

### Issues GitHub

Créer une issue : https://github.com/SandrineCipolla/stockHub_V2_front/issues

---

## 🎉 Prêt à Développer !

Vous êtes maintenant prêt à contribuer au projet StockHub V2.

**Commandes essentielles à retenir** :

```bash
npm run dev          # Lancer le serveur
npm run test         # Lancer les tests
npm run ci:check     # Vérifier avant push
```

**Prochaine étape** : Consulter [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md) pour utiliser le Design System.

---

**Auteure** : Sandrine Cipolla
**Projet** : StockHub V2 - RNCP 7
**Dernière mise à jour** : 18 Novembre 2025
