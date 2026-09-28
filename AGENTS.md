# AGENTS.md - StockHub V2 Frontend

Application React de gestion de stocks intelligente avec intelligence artificielle.

Process de contribution (branches, commits, PR, workflow par ticket, gestion des issues GitHub) : voir [CONTRIBUTING.md](CONTRIBUTING.md).

Règles pour tout agent IA travaillant sur ce repo (Claude Code, Cursor, etc.). `CLAUDE.md` importe ce fichier.

<!-- commun:debut repositories v1 -->
<!-- Bloc commun aux trois repos StockHub : le modifier à l'identique dans les trois, en incrémentant la version. Vérifié par check-docs. -->

## Repositories du projet StockHub

| Repo          | GitHub                                                    | Branche principale | Chemin local (poste de Sandrine)                                  |
| ------------- | --------------------------------------------------------- | ------------------ | ----------------------------------------------------------------- |
| Frontend      | https://github.com/SandrineCipolla/stockHub_V2_front      | `main`             | `C:\Users\sandr\Dev\RNCP7\StockHubV2\Front_End\stockHub_V2_front` |
| Backend       | https://github.com/SandrineCipolla/stockhub_back          | `main`             | `C:\Users\sandr\Dev\Perso\Projets\stockhub\stockhub_back`         |
| Design System | https://github.com/SandrineCipolla/stockhub_design_system | `master`           | `C:\Users\sandr\Dev\RNCP7\stockhub_design_system`                 |

### Environnements

| Env        | Frontend                                                                                                 | Backend                                                                                             | Base de données             |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| Local      | `localhost:5173`                                                                                         | `localhost:3006` (Docker)                                                                           | MySQL Docker, port 3308     |
| Staging    | Vercel, branche `staging` : https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app/ | Render.com, suit `main` : https://stockhub-back.onrender.com/api                                    | Aiven MySQL                 |
| Production | Azure Static Web Apps, branche `main` : https://brave-field-03611eb03.5.azurestaticapps.net              | Azure App Service, plan F1 : https://stockhub-back-bqf8e6fbf6dzd6gs.westeurope-01.azurewebsites.net | Azure MySQL Flexible Server |

- Répartition des hébergeurs : [ADR-013 du frontend](https://github.com/SandrineCipolla/stockHub_V2_front/blob/main/docs/adr/ADR-013-production-azure-previews-vercel.md). Le staging est en réparation (frontend #314).
- Le plan F1 d'Azure App Service a un quota CPU journalier : `npm run azure:start` avant de tester en production, `npm run azure:stop` après (repo backend).
- Design System : Storybook sur https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/, package `@stockhub/design-system` installé depuis GitHub (version dans le `package.json` du frontend).

### Suivi

- GitHub Project commun aux trois repos : https://github.com/users/SandrineCipolla/projects/3, à mettre à jour après chaque modification importante.
- Wiki transverse : https://github.com/SandrineCipolla/stockHub_V2_front/wiki

<!-- commun:fin repositories -->

## Branches et déploiements

- `main` : production Azure, automatiquement (frontend et backend)
- `staging` : environnement de test à URL fixe. Pour tester une branche, la pousser sur `staging` (`git push -f origin <branche>:staging`), sans changer la branche dans les réglages Vercel. Voir l'ADR-013 et #314.
- Les previews Vercel par branche s'ouvrent, mais la connexion B2C y échoue : leurs URL ne sont pas déclarées dans les redirect URIs.

## Piège `.env.local` (dev local)

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

TypeScript strict (0 erreur tolérée), ESLint 0 warning, Prettier, Knip pour la détection de code mort. Métriques à jour (couverture, Lighthouse) : badges du README et `docs/9-DASHBOARD-QUALITY.md`, pas de chiffre figé ici.

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

#### Fusion locale pour update

`PUT /stocks/:id` ne modifie que `label`, `description` et `category`, et sa réponse ne contient ni quantité agrégée ni statut. Pour `quantity`, `value` et `status`, fusionner `updateData` sur l'état local existant et recalculer `status` côté client (`src/hooks/useStocks.ts`). Les lectures, elles, renvoient le statut et la quantité agrégés : voir `mapBackendStockToFrontend` dans `src/services/api/stocksAPI.ts`.

### Accessibilité (RGAA)

Navigation clavier complète, contrastes conformes, attributs ARIA appropriés, structure HTML sémantique, focus visible. Audit complet : [docs/6-ACCESSIBILITY.md](docs/6-ACCESSIBILITY.md).

## Intégration avec le Design System

Installé via GitHub dans `package.json` (`@stockhub/design-system`) et chargé dans `src/main.tsx`. Les web components sont utilisés à travers des wrappers React qui appellent `React.createElement('sh-…')`, jamais directement en JSX : pattern, événements, propriétés booléennes et ajout d'un composant dans [docs/2-WEB-COMPONENTS-GUIDE.md](docs/2-WEB-COMPONENTS-GUIDE.md).

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

Contrat de l'API : `docs/openapi.yaml` du repo backend (Swagger sur `/api-docs`). Correspondance avec les types du front : `src/services/api/stocksAPI.ts`.

## Releases automatiques (Release Please)

Configuration : `.github/workflows/release-please.yml`. Documentation complète : `docs/technical/RELEASE-AUTOMATION.md`. Chaque merge dans `main` déclenche l'analyse des commits, la mise à jour d'une PR de release (CHANGELOG, version bump semver), et à son merge, tag + GitHub Release automatiques.

## Ressources externes

React, TypeScript, TailwindCSS, Vite, Vitest, Testing Library, Lucide Icons : voir leurs sites officiels. RGAA et ARIA : voir les références W3C/gouvernementales.

---

**Rappel critique** :

- Utiliser les Web Components du Design System, ne pas les recréer
- Écrire des tests pour chaque nouvelle fonctionnalité
- Respecter les standards d'accessibilité RGAA
- Process de contribution complet : [CONTRIBUTING.md](CONTRIBUTING.md)
