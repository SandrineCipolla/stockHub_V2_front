# StockHub V2 - Frontend

Application React moderne de gestion de stocks intelligente avec intelligence artificielle.

## Repositories du projet

### Frontend (ce repo)

- **Chemin local**: `C:\Users\sandr\Dev\RNCP7\StockHubV2\Front_End\stockhub_V2_front`
- **URL GitHub**: https://github.com/SandrineCipolla/stockHub_V2_front
- **Démo live**: https://stock-hub-v2-front.vercel.app/
- **Description**: Application React StockHub V2 avec UI responsive et accessible
- **Tech**: React 19.1.0, TypeScript 5.8.3, Vite 6.3.5, TailwindCSS 3.4.1, Lucide React 0.517.0
- **Version**: v1.3.0

### Design System

- **Chemin local**: `C:\Users\sandr\Dev\RNCP7\stockhub_design_system`
- **URL GitHub**: https://github.com/SandrineCipolla/stockhub_design_system
- **Storybook**: https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **Package**: `@stockhub/design-system` v1.3.1
- **Composants**: 18 Web Components (5 atoms, 7 molecules, 6 organisms)

### Backend

- **Chemin local**: `C:\Users\sandr\Dev\Perso\Projets\stockhub\stockhub_back`
- **URL GitHub**: [À configurer si nécessaire]
- **Description**: API StockHub avec prédictions ML

### GitHub Project

- **URL**: https://github.com/users/SandrineCipolla/projects/3
- **Utilisation**: Suivre et mettre à jour les tâches après chaque modification importante

## Conventions de code

### Scripts de vérification disponibles (Frontend)

Avant de committer, **TOUJOURS** exécuter:

```bash
npm run ci:quality       # TypeScript + ESLint + Knip + détection as const
npm run lint             # ESLint seul
npm run lint:fix         # Correction automatique ESLint
npm run format           # Prettier (auto-formatting)
npm run format:check     # Vérifier formatage sans modifier
npm run type-check       # Vérification TypeScript sans build
npm run clean:deadcode   # Détection code mort (Knip)
npm run clean:fix        # Suppression auto du code mort
```

### Scripts de tests

```bash
npm run test             # Tests en mode watch
npm run test:run         # Tous les tests une fois
npm run test:coverage    # Tests avec rapport de couverture
npm run test:ui          # Interface UI pour tests (Vitest)
```

### Scripts de build & déploiement

```bash
npm run dev              # Serveur de développement (http://localhost:5173)
npm run build            # Build de production (TypeScript + Vite)
npm run preview          # Prévisualisation du build
npm run generate-sitemap # Générer sitemap.xml
npm run build:with-sitemap # Build + sitemap
```

### Scripts d'audit (accessibilité & performance)

```bash
npm run audit:full       # Audit complet
npm run audit:fps        # Performance FPS
npm run audit:a11y       # Reduced motion
npm run audit:datasets   # Animations datasets
npm run audit:daltonisme # Tests daltonisme
npm run audit:risk-levels # Contraste couleurs risk levels
```

### Scripts CI/CD

```bash
npm run ci:check         # Pipeline complet (quality + tests + build)
npm run ci:quality       # Vérifications qualité (TypeScript, ESLint, Knip)
npm run ci:test          # Tests pour CI
npm run ci:build         # Build pour CI
npm run ci:fast          # Pipeline rapide (type-check + lint + tests)
npm run ci:full          # CI + audits complets
npm run ci:fix           # Auto-fix + CI check
```

## Git Hooks (Husky)

### Pre-commit (Rapide ~10s)

Exécuté automatiquement à chaque `git commit`:

- ✅ **lint-staged**: Formatage Prettier + ESLint sur fichiers modifiés
- ✅ **TypeScript**: Vérification des types

### Pre-push (Complet ~20s)

Exécuté automatiquement à chaque `git push`:

- ✅ **Tests**: Tous les tests unitaires (464 tests)
- ✅ **Knip**: Détection du code mort
- ✅ **Build**: Vérification que le build passe

### Bypass des hooks (si urgence)

```bash
git commit --no-verify -m "message"  # Skip pre-commit
git push --no-verify                 # Skip pre-push
```

## Standards de développement

### Stack technique

- **React 19.1.0** + **TypeScript 5.8.3** (mode strict)
- **Vite 6.3.5** (build tool)
- **TailwindCSS 3.4.1** (styling)
- **Lucide React 0.517.0** (icônes)
- **React Router DOM 7.9.5** (routing)
- **Framer Motion 12.23.24** (animations)
- **Design System**: `@stockhub/design-system` (Web Components Lit)

### Architecture du code

```
src/
  components/       # Composants React réutilisables
  contexts/         # Contextes React (ThemeContext, etc.)
  data/             # Données statiques et mock
  hooks/            # Hooks personnalisés
  pages/            # Pages web (routing)
  types/            # Types TypeScript
  utils/            # Fonctions utilitaires
  App.tsx           # Composant principal
  main.tsx          # Point d'entrée
  index.css         # Styles globaux (TailwindCSS)
```

### Qualité du code

- **TypeScript**: Mode strict, 0 erreur tolérée
- **ESLint**: 0 warning
- **Prettier**: Formatage automatique
- **Knip**: Détection code mort activée
- **Tests**: 464 tests (60.67% coverage)
- **Lighthouse Performance**: 99/100
- **Lighthouse Accessibility**: 96/100
- **Lighthouse SEO**: > 90/100

### Patterns de mise à jour d'état (hooks)

#### Optimistic update avec rollback

Pour les opérations destructives (delete), mettre à jour l'état **avant** l'appel API et restaurer si erreur :

```typescript
const previousStocks = [...stocks];
setStocks(stocks.filter(s => s.id !== id)); // UI mise à jour immédiatement
try {
  await StocksAPI.deleteStock(id);
} catch {
  setStocks(previousStocks); // Rollback automatique
  throw createFrontendError('network', '...');
}
```

#### Fusion locale pour update (limitation backend V2)

Le backend V2 retourne uniquement `id, label, description, category`. Pour les champs non retournés (`quantity`, `value`, `status`), fusionner `updateData` sur l'état local existant et recalculer `status` côté client. Ne **pas** utiliser directement la réponse API pour ces champs.

### Accessibilité (RGAA)

- ✅ Navigation clavier complète
- ✅ Contrastes conformes (ratio 4.5:1 minimum)
- ✅ Attributs ARIA appropriés
- ✅ Structure HTML sémantique
- ✅ Focus visible et cohérent

## Intégration avec le Design System

### Installation

Le Design System est installé via GitHub:

```json
"dependencies": {
  "@stockhub/design-system": "github:SandrineCipolla/stockhub_design_system#v1.3.1"
}
```

### Import des Web Components

```typescript
// Dans main.tsx ou App.tsx
import '@stockhub/design-system';

// Utilisation dans JSX (React)
<sh-button variant="primary" iconBefore="Plus">Ajouter</sh-button>
<sh-card hover clickable>
  <h3>Mon contenu</h3>
</sh-card>
<sh-stock-prediction-card
  stockName="Café Arabica"
  riskLevel="critical"
  confidence={92}
  daysUntilRupture={2}
/>
```

### Composants disponibles (18 Web Components)

**Atoms (5)**:

- `<sh-badge>` - Badges colorés
- `<sh-icon>` - Icônes Lucide
- `<sh-input>` - Champs de saisie
- `<sh-logo>` - Logo StockHub
- `<sh-text>` - Texte typographique

**Molecules (7)**:

- `<sh-button>` - Boutons avec variants
- `<sh-card>` - Cartes conteneurs
- `<sh-metric-card>` - Cartes métriques
- `<sh-quantity-input>` - Input numérique +/-
- `<sh-search-input>` - Barre de recherche
- `<sh-stat-card>` - Cartes statistiques
- `<sh-status-badge>` - Badges de statut stock

**Organisms (6)**:

- `<sh-header>` - En-tête application
- `<sh-footer>` - Pied de page
- `<sh-page-header>` - En-tête de page
- `<sh-ia-alert-banner>` - Bannière alertes IA
- `<sh-stock-card>` - Carte produit
- `<sh-stock-item-card>` - Carte item inventaire
- `<sh-stock-prediction-card>` - Prédictions ML

**Documentation complète**: Voir Storybook → https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/

## Gestion des Issues GitHub

### ⚠️ Règle absolue pour la création d'issues

Quand tu crées une issue via `gh issue create`, **respecte strictement ce format** et rien d'autre.
Les templates sont dans `.github/ISSUE_TEMPLATE/` — utilise-les comme référence.

**Format User Story** (à utiliser pour toute nouvelle fonctionnalité) :

```
**En tant que** [persona]
**Je souhaite** [action souhaitée]
**Afin de** [bénéfice attendu]

---

**Critères d'acceptation**

Étant donné que [contexte]
Lorsque [action]
Alors :
- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3
```

**Ce qui est INTERDIT dans le body d'une issue :**
- ❌ Les détails d'implémentation (composants à modifier, lignes de code, etc.)
- ❌ Les étapes techniques de développement
- ❌ Les commandes à exécuter
- ❌ Les TODO techniques

**Ces informations vont dans la PR**, pas dans l'issue.

### Commande gh à utiliser

```bash
# Toujours utiliser --template ou spécifier les labels
gh issue create \
  --title "[US-XXX] Titre court orienté utilisateur" \
  --label "user-story" \
  --body "**En tant que** ...
**Je souhaite** ...
**Afin de** ...

---

**Critères d'acceptation**

Étant donné que ...
Lorsque ...
Alors :
- [ ] Critère 1
- [ ] Critère 2"
```

### Où mettre les notes techniques ?

| Information | Où |
|---|---|
| Valeur utilisateur, critères d'acceptation | Issue GitHub |
| Idées en cours de dev, questions | Commentaire sur l'issue |
| Choix d'implémentation, composants modifiés | Description de la PR |
| Décisions d'architecture importantes | `docs/adr/` (Architecture Decision Records) |

## Workflow de développement

### Avant de commencer une feature

1. Vérifier le GitHub Project pour les tâches assignées (si vous en avez un)
2. Créer une branche depuis `main`
3. S'assurer que les dépendances sont à jour: `npm install`

### Pendant le développement

1. Lancer le serveur dev: `npm run dev` → http://localhost:5173
2. Respecter la structure de dossiers et l'architecture
3. Utiliser les Web Components du Design System (ne pas les recréer)
4. Écrire des tests unitaires pour les nouveaux composants
5. Vérifier l'accessibilité (navigation clavier, ARIA)

### Après chaque session de développement

**IMPORTANT**: Mettre à jour la documentation suivante:

1. **README.md**: Si nouvelles fonctionnalités ou changements majeurs
2. **Tests**: Ajouter/modifier tests pour nouvelles features
3. **GitHub Project**: Mettre à jour le statut des tâches (si applicable)
4. **CHANGELOG** (si existant): Noter les changements

### Avant de pusher

```bash
npm run ci:quality       # Vérifications qualité
npm run test:run         # Lancer tous les tests
npm run build            # S'assurer que le build fonctionne
# OU
npm run ci:check         # Pipeline complet (recommandé)
```

## Conventions de Branches & Releases

### Branches — format strict

```
type/issue-number-short-description
```

| Type | Usage |
| --- | --- |
| `feat/` | Nouvelle fonctionnalité |
| `fix/` | Correction de bug |
| `chore/` | Tâche technique sans valeur métier |
| `docs/` | Documentation uniquement |
| `test/` | Tests uniquement |
| `refactor/` | Refactoring sans changement de comportement |

**Exemples corrects** : `feat/118-update-item-command`, `fix/84-msal-cache-security`, `docs/101-openapi-endpoints`
**Jamais** : `feature/...`, `feat-issue-93-...` — le format `type/number-description` est la seule convention.

### Commits — Conventional Commits

```
type(scope): message concis — closes #numero
```

- Message en minuscules, verbe à l'infinitif
- Inclure `closes #numero` si le commit clôt une issue
- Pas de mention d'outils ou d'IA dans le message

**Exemples** : `feat(items): add item edit modal — closes #110`, `fix(auth): correct msal cache storage — closes #84`

### PRs

- Titre : `type(scope): description — closes #numero`
- Body : composants modifiés, test plan, `Closes #numero`
- Vérifier que le CI passe avant de merger

## Workflow par ticket

Suivre cet ordre pour chaque issue, sans exception :

### 1. Avant de commencer

```bash
git checkout main
git pull origin main
git checkout -b type/numero-description   # ex: feat/118-update-item-command
```

### 2. Développement

- Travailler sur la branche dédiée
- Commits fréquents, ciblés, au format Conventional Commits
- Respecter la checklist avant commit (ci-dessous)

### 3. Ouvrir la PR

- Titre : `type(scope): description — closes #numero`
- Body : composants modifiés, test plan, `Closes #numero`
- Vérifier que le CI passe avant de merger

### 4. Après le merge

Mettre à jour dans cet ordre :

| Action | Quand |
| --- | --- |
| **Wiki** — `Frontend-Guide` : nouvelles pages, composants | Nouvelle fonctionnalité visible |
| **Wiki** — `Architecture-Globale` ou `ADR` | Décision architecturale |
| **Wiki** — `CICD-et-Deploiement` | Changement d'infra ou pipeline |
| **GitHub Project** — issue → Done | Systématiquement après merge |

**Comment mettre à jour le wiki** :
```bash
git clone https://github.com/SandrineCipolla/stockHub_V2_front.wiki.git /tmp/wiki
# modifier les fichiers .md
cd /tmp/wiki && git add . && git commit -m "docs: ..." && git push
```

---

### 🚀 Releases Automatiques (Release Please)

**Configuration** : `.github/workflows/release-please.yml`
**Documentation** : `documentation/technical/RELEASE-AUTOMATION.md`

#### Comment Ça Fonctionne

**1. Développement normal avec Conventional Commits**

```bash
git commit -m "feat(dashboard): add new metric"
git commit -m "fix(search): correct timing"
```

**2. Merge dans `main` déclenche Release Please**

- Analyse automatique des commits depuis dernière release
- Calcul du nouveau numéro de version (semver)
- Création/mise à jour d'une **PR de release**

**3. La PR de release contient** :

- ✅ CHANGELOG.md généré avec emojis
- ✅ package.json version bumpée
- ✅ Commits groupés par type (Features, Bug Fixes, etc.)

**4. Merge de la PR de release** :

- ✅ Tag Git créé automatiquement (ex: v1.2.0)
- ✅ GitHub Release créée avec notes
- ✅ Tout est documenté automatiquement

#### Versioning Sémantique

| Type de Commit                 | Exemple                      | Version Bump                    |
| ------------------------------ | ---------------------------- | ------------------------------- |
| `feat:`                        | `feat(dashboard): add chart` | 1.1.0 → **1.2.0** (MINOR)       |
| `fix:`                         | `fix(button): hover state`   | 1.1.0 → **1.1.1** (PATCH)       |
| `feat!:` ou `BREAKING CHANGE:` | `feat(api)!: change format`  | 1.1.0 → **2.0.0** (MAJOR)       |
| `docs:`, `test:`, `chore:`     | `docs: update readme`        | Pas de bump (sauf si accumulés) |

#### Workflow Release

**Automatique** - Pas besoin d'action manuelle pour créer releases :

1. ✅ Merge PR feature dans `main`
2. ✅ Release Please crée/met à jour automatiquement une PR de release
3. ✅ Review la PR de release (optionnel)
4. ✅ Merge la PR de release → Tag + GitHub Release créés

**Manuel** - Si besoin de forcer une release :

```bash
git commit --allow-empty -m "chore: trigger release"
git push origin main
```

#### Commandes Utiles

```bash
# Voir releases
gh release list

# Voir tags
git tag -l

# Voir PR de release en attente
gh pr list --label "autorelease: pending"
```

---

## Naming conventions

### Composants React

- Nommage: `PascalCase` (ex: `StockCard`, `DashboardPage`)
- Fichiers: `ComponentName.tsx`
- Un composant par fichier

### Fonctions & variables

- Nommage: `camelCase` (ex: `fetchStockData`, `isLoading`)
- Constantes globales: `UPPER_SNAKE_CASE` (ex: `API_BASE_URL`)

### Types TypeScript

- Interfaces: `PascalCase` avec préfixe `I` si nécessaire (ex: `IStockItem`, `User`)
- Types: `PascalCase` (ex: `RiskLevel`, `StockStatus`)

### Commits (Convention stricte)

- **Format**: `type(scope): message`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Exemples**:
  - `feat(dashboard): add stock prediction cards`
  - `fix(stock-card): correct hover animation`
  - `test(utils): add unit tests for date formatting`
  - `refactor(contexts): optimize theme context performance`
  - `chore: bump version to 1.1.0`

## Intégration avec le Backend

### Configuration

Le Frontend V2 est connecté au Backend via **Azure AD B2C** pour l'authentification.

**Variables d'environnement** (`.env`):

```env
# API Backend
VITE_API_SERVER_URL=http://localhost:3006/api
VITE_API_V1=/v1
VITE_API_V2=/v2

# Azure AD B2C
VITE_REDIRECT_URI=http://localhost:5173/
VITE_CLIENT_ID=0dc4acfb-ecde-4f9b-81eb-9af050fb52d9
VITE_TENANT_NAME=stockhubb2c
VITE_AUTHORITY_DOMAIN=stockhubb2c.b2clogin.com
VITE_SIGN_UP_SIGN_IN_POLICY=B2C_1_signupsignin
VITE_FORGOT_PASSWORD_POLICY=B2C_1_reset_password
VITE_EDIT_PROFILE_POLICY=B2C_1_edit_profile

# Scopes
VITE_SCOPE_READ=https://stockhubb2c.onmicrosoft.com/dc30ef57-cdc1-4a3e-aac5-9647506a72ef/FilesRead
VITE_SCOPE_WRITE=https://stockhubb2c.onmicrosoft.com/dc30ef57-cdc1-4a3e-aac5-9647506a72ef/FilesWrite
```

### API Endpoints

**Base URL**: `http://localhost:3006/api/v2`
**Authentication**: Bearer token (Azure AD B2C)
**Token Storage**: localStorage (`authToken`)

**Stocks endpoints**:

- `GET /api/v2/stocks` - Liste de tous les stocks
- `GET /api/v2/stocks/:id` - Détails d'un stock
- `POST /api/v2/stocks` - Créer un nouveau stock
- `PUT /api/v2/stocks/:id` - Mettre à jour un stock
- `DELETE /api/v2/stocks/:id` - Supprimer un stock

**API Client**: `src/services/api/stocksAPI.ts`

```typescript
import { StocksAPI } from '@/services/api/stocksAPI';

// Récupérer tous les stocks
const stocks = await StocksAPI.fetchStocksList();

// Récupérer un stock par ID
const stock = await StocksAPI.fetchStockById('123');

// Créer un nouveau stock
const newStock = await StocksAPI.createStock({
  label: 'Café Arabica',
  quantity: 50,
  value: 25.5,
  category: 'Boissons',
});

// Mettre à jour un stock
const updatedStock = await StocksAPI.updateStock({
  id: '123',
  quantity: 60,
});

// Supprimer un stock
await StocksAPI.deleteStock('123');
```

### Architecture Authentification

**MSAL (Microsoft Authentication Library)**:

- Initialisation: `src/main.tsx`
- Token capture: `src/App.tsx` (event listener `LOGIN_SUCCESS`)
- Config: `src/config/authConfig.ts`
- Token management: `src/services/api/ConfigManager.ts`

**Flux d'authentification**:

1. App load → MSAL init
2. Login redirect → Azure AD B2C
3. Callback with token → Stockage dans localStorage
4. API calls → Bearer token dans headers

### Format de données

**Type Stock** (`src/types/stock.ts`):

```typescript
interface Stock {
  id: number | string;
  label: string;
  quantity: number;
  unit?: StockUnit; // 'piece' | 'percentage' | 'ml' | 'g' | 'meter' | 'liter' | 'kg'
  value: number;
  status: StockStatus; // 'optimal' | 'low' | 'critical' | 'outOfStock' | 'overstocked'
  lastUpdate: string;
  category?: string;
  sku?: string;
  description?: string;
  supplier?: string;
  minThreshold?: number;
  maxThreshold?: number;
}
```

**Documentation complète**: Voir `stockhub_back/docs/technical/frontend-v2-integration.md`

## Notes importantes

- **Version actuelle**: v1.3.0
- **Auteur**: Sandrine Cipolla
- **License**: MIT
- **Node version**: >= 18.0.0
- **Tests**: 464 tests (60.67% coverage)
- **Bundle size**: 113.99 KB gzipped
- **Build time**: ~5s

## Ressources & Liens utiles

### Documentation

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/
- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/react
- **Lucide Icons**: https://lucide.dev/icons/

### Accessibilité

- **RGAA**: https://accessibilite.numerique.gouv.fr/
- **ARIA**: https://www.w3.org/WAI/ARIA/apg/

### Documentation interne

- Voir `documentation/WEB_COMPONENTS_GUIDE.md` pour l'intégration du Design System

## 🚨 Checklist avant chaque commit

1. ✅ `npm run format` - Code formaté
2. ✅ `npm run lint` - Aucune erreur ESLint
3. ✅ `npm run type-check` - Aucune erreur TypeScript
4. ✅ `npm run clean:deadcode` - Pas de code mort
5. ✅ `npm run test:run` - Tous les tests passent
6. ✅ Tests manuels dans le navigateur
7. ✅ Vérifier accessibilité (navigation clavier)

---

**🎯 Rappel CRITIQUE**:

- Toujours vérifier le GitHub Project et mettre à jour les tâches (si applicable)
- Utiliser les Web Components du Design System (ne pas les recréer)
- Écrire des tests pour chaque nouvelle fonctionnalité
- Respecter les standards d'accessibilité RGAA
- Exécuter `npm run ci:check` avant chaque push important
