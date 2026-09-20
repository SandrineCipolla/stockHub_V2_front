# StockHub V2 - Frontend

Application React de gestion de stocks intelligente avec intelligence artificielle.

Process de contribution (branches, commits, PR, workflow par ticket, gestion des issues GitHub) : voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Repositories du projet

### Frontend (ce repo)

- **Chemin local** : `C:\Users\sandr\Dev\RNCP7\StockHubV2\Front_End\stockHub_V2_front`
- **URL GitHub** : https://github.com/SandrineCipolla/stockHub_V2_front
- **Staging** : https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app/ (branche `staging`)
- **Production** : https://brave-field-03611eb03.5.azurestaticapps.net (Azure Static Web Apps, branche `main`)
- **Tech** : React, TypeScript, Vite, TailwindCSS (versions exactes dans `package.json`)

### Design System

- **Chemin local** : `C:\Users\sandr\Dev\RNCP7\stockhub_design_system`
- **URL GitHub** : https://github.com/SandrineCipolla/stockhub_design_system
- **Storybook** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **Package** : `@stockhub/design-system` (version exacte dans son `package.json`)

### Backend

- **Chemin local** : `C:\Users\sandr\Dev\Perso\Projets\stockhub\stockhub_back`
- **URL GitHub** : https://github.com/SandrineCipolla/stockhub_back
- **Staging** : https://stockhub-back.onrender.com/api (Render.com)
- **Production** : Azure App Service F1 (quota CPU 60 min/jour, démarrer via `npm run azure:start`, arrêter via `npm run azure:stop`)

### GitHub Project

- **URL** : https://github.com/users/SandrineCipolla/projects/3
- **Utilisation** : suivre et mettre à jour les tâches après chaque modification importante

## Environnements

| Env            | Frontend                               | Backend                   | Base de données             |
| -------------- | -------------------------------------- | ------------------------- | --------------------------- |
| **Local**      | `localhost:5173`                       | `localhost:3006` (Docker) | MySQL Docker port 3308      |
| **Staging**    | Vercel (branche `staging`)             | Render.com                | Aiven MySQL                 |
| **Production** | Azure Static Web Apps (branche `main`) | Azure App Service F1      | Azure MySQL Flexible Server |

### Branches vers déploiements

- `main` : production Azure automatiquement (frontend et backend)
- Feature/fix branches : Vercel preview automatique (URL temporaire par PR)
- Staging Vercel : branche à pointer manuellement dans les settings Vercel

### Piège `.env.local` (dev local)

Vite charge `.env.local` en priorité sur `.env`, quel que soit le mode. Un `.env.local` oublié après un test contre le staging fait continuer `npm run dev` à pointer vers ce backend distant, même avec un backend local qui tourne : symptômes possibles, échecs silencieux, lenteurs (cold-start Render gratuit), 401 inexpliqués, alors que `curl localhost:3006/...` répond correctement.

Premier réflexe en cas de comportement inattendu en dev local : `ls .env.local`, puis vérifier `VITE_API_SERVER_URL` dedans. Les variables d'env ne sont lues qu'au démarrage du serveur Vite, un changement nécessite un redémarrage complet (`npm run dev`), le hot-reload ne suffit pas.

## Standards de développement

### Stack technique

Voir `package.json` pour les versions exactes : React, TypeScript (mode strict), Vite, TailwindCSS, Lucide React, React Router DOM, Framer Motion, `@stockhub/design-system` (Web Components Lit).

### Architecture du code

```
src/
  components/       # Composants React réutilisables
  contexts/          # Contextes React (ThemeContext, etc.)
  data/              # Données statiques et mock
  hooks/             # Hooks personnalisés
  pages/             # Pages web (routing)
  types/             # Types TypeScript
  utils/             # Fonctions utilitaires
  App.tsx            # Composant principal
  main.tsx           # Point d'entrée
  index.css          # Styles globaux (TailwindCSS)
```

### Qualité du code

TypeScript strict (0 erreur tolérée), ESLint 0 warning, Prettier, Knip pour la détection de code mort. Métriques à jour (couverture, Lighthouse) : badges du README et `documentation/9-DASHBOARD-QUALITY.md`, pas de chiffre figé ici.

### Patterns de mise à jour d'état (hooks)

#### Optimistic update avec rollback

Pour les opérations destructives (delete), mettre à jour l'état avant l'appel API et restaurer si erreur :

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

Le backend V2 retourne uniquement `id, label, description, category`. Pour les champs non retournés (`quantity`, `value`, `status`), fusionner `updateData` sur l'état local existant et recalculer `status` côté client. Ne pas utiliser directement la réponse API pour ces champs.

### Accessibilité (RGAA)

Navigation clavier complète, contrastes conformes, attributs ARIA appropriés, structure HTML sémantique, focus visible. Audit complet : [documentation/6-ACCESSIBILITY.md](documentation/6-ACCESSIBILITY.md).

## Intégration avec le Design System

Installé via GitHub dans `package.json` (`@stockhub/design-system`), importé une fois dans `main.tsx` ou `App.tsx` (`import '@stockhub/design-system'`), puis utilisé comme balise custom en JSX :

```typescript
<sh-button variant="primary" iconBefore="Plus">Ajouter</sh-button>
<sh-card hover clickable>
  <h3>Mon contenu</h3>
</sh-card>
```

Liste des composants disponibles et leur usage : Storybook (lien ci-dessus) ou le README du repo `stockhub_design_system`, pas dupliquée ici.

## Gestion des issues GitHub et workflow par ticket

Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Naming conventions

### Composants React

`PascalCase` (ex : `StockCard`, `DashboardPage`), un composant par fichier, nom de fichier identique au composant.

### Fonctions et variables

`camelCase` (ex : `fetchStockData`, `isLoading`). Constantes globales en `UPPER_SNAKE_CASE` (ex : `API_BASE_URL`).

### Types TypeScript

`PascalCase` (ex : `RiskLevel`, `StockStatus`). Interfaces en `PascalCase`, préfixe `I` seulement si nécessaire pour lever une ambiguïté.

## Intégration avec le Backend

Authentification via Azure AD B2C (MSAL). Configuration détaillée des variables d'environnement : `.env.example`.

**MSAL** :

- Initialisation : `src/main.tsx`
- Token capture : `src/App.tsx` (event listener `LOGIN_SUCCESS`)
- Config : `src/config/authConfig.ts`
- Token management : `src/services/api/ConfigManager.ts`

**Flux d'authentification** : App load → MSAL init → login redirect vers Azure AD B2C → callback avec token → stockage localStorage → appels API avec Bearer token dans les headers.

**Client API** : `src/services/api/stocksAPI.ts`. Endpoints et méthodes HTTP exactes : voir ce fichier directement (source de vérité), pas la liste ici pour éviter la désynchronisation.

**Format de données** (`src/types/stock.ts`) :

```typescript
interface Stock {
  id: number | string;
  label: string;
  quantity: number;
  unit?: StockUnit;
  value: number;
  status: StockStatus;
  lastUpdate: string;
  category?: string;
  sku?: string;
  description?: string;
  supplier?: string;
  minThreshold?: number;
  maxThreshold?: number;
}
```

Documentation complète de l'intégration : `stockhub_back/docs/technical/frontend-v2-integration.md`.

## Releases automatiques (Release Please)

Configuration : `.github/workflows/release-please.yml`. Documentation complète : `documentation/technical/RELEASE-AUTOMATION.md`. Chaque merge dans `main` déclenche l'analyse des commits, la mise à jour d'une PR de release (CHANGELOG, version bump semver), et à son merge, tag + GitHub Release automatiques.

## Ressources externes

React, TypeScript, TailwindCSS, Vite, Vitest, Testing Library, Lucide Icons : voir leurs sites officiels. RGAA et ARIA : voir les références W3C/gouvernementales.

---

**Rappel critique** :

- Utiliser les Web Components du Design System, ne pas les recréer
- Écrire des tests pour chaque nouvelle fonctionnalité
- Respecter les standards d'accessibilité RGAA
- Process de contribution complet : [CONTRIBUTING.md](CONTRIBUTING.md)
