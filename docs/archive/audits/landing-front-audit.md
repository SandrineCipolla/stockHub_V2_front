# Audit Landing Page — Frontend StockHub V2

Date : 2026-03-24

---

## 1. Routing actuel

### Architecture

Le routing est entièrement géré dans `src/App.tsx`. Il n'existe pas de fichier `router.tsx` séparé.

**Schéma actuel :**

```
App
└── ThemeProvider
    └── ProtectedComponent   ← guard MSAL ici
        ├── [non authentifié] → LoginScreen (inline, pas une route)
        └── [authentifié] → BrowserRouter
            ├── /            → Dashboard
            ├── /analytics   → Analytics
            ├── /privacy     → Privacy
            ├── /stocks/:id  → StockDetailPage
            └── *            → redirect /
```

### Route `/` actuellement

`/` affiche le **Dashboard** — mais seulement si l'utilisateur est authentifié. Si non authentifié, l'utilisateur voit `LoginScreen` (un écran minimaliste inline avec un bouton "Se connecter" qui déclenche `loginRedirect` vers Azure AD B2C).

**Il n'y a pas de route publique existante.** La route `/privacy` est déclarée dans `ProtectedComponent`, donc elle est aussi protégée alors qu'elle devrait être publique.

### Guard d'authentification

`useIsAuthenticated()` de MSAL est appelé dans `ProtectedComponent`. Si `false`, `LoginScreen` est rendu à la place du `BrowserRouter` entier. Ce n'est pas un guard de route — c'est un guard de rendu.

### Ce qu'il faudra modifier pour rendre `/` public

1. **Déplacer le `BrowserRouter`** en dehors de `ProtectedComponent` (le remonter dans `App`)
2. **Créer une route publique** `/` → `LandingPage` (nouvelle page)
3. **Renommer la route dashboard** : `/` → `/dashboard` (ou `/app`)
4. **Créer un composant `RequireAuth`** (guard de route React Router) qui wrap les routes protégées
5. **Mettre `/privacy` en public** (elle l'est conceptuellement déjà)

Structure cible :

```
BrowserRouter
├── /              → LandingPage          (public)
├── /privacy       → Privacy              (public)
└── RequireAuth
    ├── /dashboard → Dashboard
    ├── /analytics → Analytics
    └── /stocks/:id → StockDetailPage
```

---

## 2. Fonctionnalités réelles connectées au backend

### Pages existantes

| Page            | Fichier               | Rôle                                                            |
| --------------- | --------------------- | --------------------------------------------------------------- |
| Dashboard       | `Dashboard.tsx`       | Liste des stocks, métriques, alertes IA, recherche, CRUD stocks |
| Analytics       | `Analytics.tsx`       | Prédictions ML de rupture, filtres par niveau de risque         |
| StockDetailPage | `StockDetailPage.tsx` | Détail stock, table items paginée, CRUD items, prédictions IA   |
| Privacy         | `Privacy.tsx`         | Page statique RGPD (devrait être publique)                      |

### Fonctionnalités effectivement connectées au backend

| Fonctionnalité                 | Endpoint utilisé                          | Connecté  |
| ------------------------------ | ----------------------------------------- | --------- |
| Lister les stocks              | `GET /api/v2/stocks`                      | ✅        |
| Créer un stock                 | `POST /api/v2/stocks`                     | ✅        |
| Modifier un stock              | `PUT /api/v2/stocks/:id`                  | ✅        |
| Supprimer un stock             | `DELETE /api/v2/stocks/:id`               | ✅        |
| Détail d'un stock (avec items) | `GET /api/v2/stocks/:id`                  | ✅        |
| Lister les items d'un stock    | `GET /api/v2/stocks/:id/items`            | ✅        |
| Créer un item                  | `POST /api/v2/stocks/:id/items`           | ✅        |
| Modifier un item               | `PUT /api/v2/stocks/:id/items/:itemId`    | ✅        |
| Supprimer un item              | `DELETE /api/v2/stocks/:id/items/:itemId` | ✅        |
| Export CSV                     | (frontend only, `useDataExport`)          | ✅        |
| Prédictions IA / alertes       | (calcul frontend simulé)                  | ⚠️ simulé |

### Fonctionnalités à présenter sur la landing (formulées en bénéfice utilisateur)

1. **Tous vos stocks en un coup d'œil** — Le tableau de bord affiche vos stocks avec métriques clés (total articles, valeur, alertes) actualisées en temps réel.
2. **Anticipez les ruptures avant qu'elles arrivent** — L'analyse prédictive calcule automatiquement les délais de rupture pour chaque article à risque.
3. **Gérez chaque article avec précision** — Suivez les quantités article par article, avec statut visuel (OK / Stock bas / Critique / Rupture) et modification inline.
4. **Recevez des recommandations automatiques** — Des alertes intelligentes vous suggèrent les réapprovisionnements prioritaires, classés par niveau de risque.
5. **Organisez par catégories** — Alimentation, hygiène, matériel créatif… chaque domaine dans son stock dédié.
6. **Exportez vos données** — Téléchargez votre inventaire en CSV pour l'intégrer dans vos outils existants.

---

## 3. Design System disponible

### Thème par défaut

**Dark mode** (`:root` dans `design-tokens.css`). Les tokens light existent mais ne sont pas le défaut.

Couleur primaire : **purple** — `--color-primary-500: #8b5cf6`
Surfaces dark : `--color-surface-primary: #1e293b` (slate-800)

### Web Components utilisés dans l'app (8/18)

| Composant                    | Utilisé dans                                 |
| ---------------------------- | -------------------------------------------- |
| `<sh-header>`                | HeaderWrapper → toutes les pages             |
| `<sh-footer>`                | FooterWrapper → toutes les pages             |
| `<sh-metric-card>`           | Dashboard, StockDetailPage                   |
| `<sh-search-input>`          | Dashboard                                    |
| `<sh-stat-card>`             | Analytics                                    |
| `<sh-stock-card>`            | StockGrid (Dashboard)                        |
| `<sh-ia-alert-banner>`       | AIAlertBannerWrapper (Dashboard)             |
| `<sh-stock-prediction-card>` | StockPrediction (Analytics, StockDetailPage) |

### Web Components disponibles mais non encore utilisés (utilisables pour la landing)

- `<sh-badge>` — badges colorés
- `<sh-icon>` — icônes Lucide
- `<sh-input>` — champs de saisie
- `<sh-logo>` — **logo StockHub** ← à utiliser pour la landing
- `<sh-text>` — typographie
- `<sh-button>` — boutons avec variants
- `<sh-card>` — cartes conteneurs
- `<sh-page-header>` — en-tête de page
- `<sh-status-badge>` — badges de statut
- `<sh-stock-item-card>` — carte item inventaire

### Composants React réutilisables existants

- `ButtonWrapper` (`src/components/common/ButtonWrapper.tsx`) — wraps `sh-button`
- `CardWrapper` (`src/components/common/CardWrapper.tsx`) — wraps `sh-card`
- `SearchInputWrapper` (`src/components/common/SearchInputWrapper.tsx`)
- `HeaderWrapper` / `FooterWrapper` — wraps `sh-header` / `sh-footer`
- `NavSection` — barre de navigation avec liens

### Tokens CSS clés pour la landing

```css
--color-primary-500: #8b5cf6 /* purple principal */ --color-surface-primary: #1e293b
  /* fond dark principal */ --color-surface-secondary: #334155 /* fond cards */
  --color-text-primary: #f8fafc /* texte principal */ --color-text-secondary: #cbd5e1
  /* texte secondaire */ --color-success-500: #22c55e /* vert OK */ --color-danger-500: #ef4444
  /* rouge critique */ --color-warning-500: #f59e0b /* orange avertissement */;
```

---

## 4. Assets et contenus existants

### Logo

- **Pas de logo StockHub SVG dans le repo** (`public/` contient seulement `vite.svg`, `robots.txt`, `sitemap.xml`)
- Le Design System expose `<sh-logo>` — à utiliser directement
- L'icône de favori est `vite.svg` → à remplacer

### Screenshots / Illustrations

Aucun screenshot de l'application dans le repo.

### Tagline / Baseline

- **README** : "Plateforme moderne de gestion de stocks intelligente"
- **Meta description** (`index.html`) : "Gérez vos stocks efficacement avec StockHub. Solution intelligente de gestion d'inventaire avec tableau de bord en temps réel, analytics avancés et alertes automatiques."
- **Open Graph title** : "StockHub V2 - Gestion intelligente de stocks familiale"
- **OG image** référencée (`og-image.png`) mais le fichier n'existe pas dans `public/`

---

## 5. Tests et accessibilité

### Pattern de tests des pages

- Dossier : `src/pages/__tests__/*.test.tsx`
- Wrapper systématique avec `MemoryRouter` de React Router
- Mocks des hooks via `vi.mock('@/hooks/...')`
- Fixtures centralisées dans `src/test/fixtures/` (stocks, hooks, users)
- Pas de test colocalisé — tous dans `__tests__/`

Pour la `LandingPage`, le pattern attendu :

```
src/pages/__tests__/LandingPage.test.tsx
```

Rendu avec `MemoryRouter`, sans mock de hooks (page statique), test des éléments visibles (titre, CTA, sections Features).

### Lighthouse CI

Aucun fichier `lighthouserc.*` trouvé dans le repo. Les scores sont mentionnés dans le README (99 perf, 96 a11y, 90+ SEO) mais les audits sont manuels (scripts dans `audits/`).

### Points d'attention accessibilité

- Le `skip link` ("Aller au contenu principal") est actuellement dans `ProtectedComponent` — il faudra le déplacer au niveau du `BrowserRouter` pour qu'il fonctionne sur la landing
- La landing devra respecter les mêmes standards RGAA (contrastes 4.5:1, ARIA, navigation clavier)
- Le `<CookieBanner>` est aussi dans `ProtectedComponent` → à déplacer au niveau applicatif

---

## Fichiers à créer / modifier

### Créer

| Fichier                                    | Description                     |
| ------------------------------------------ | ------------------------------- |
| `src/pages/LandingPage.tsx`                | Page landing publique           |
| `src/pages/__tests__/LandingPage.test.tsx` | Tests de la landing             |
| `public/og-image.png`                      | Image OG (absente actuellement) |

### Modifier

| Fichier       | Modification                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `src/App.tsx` | Remonter `BrowserRouter`, créer `RequireAuth`, ajouter route `/` → LandingPage, renommer dashboard en `/dashboard` |
| `index.html`  | Mettre à jour `<link rel="icon">` (remplacer `vite.svg`)                                                           |

---

## Points d'attention

1. **Renommer `/` en `/dashboard`** impactera les redirections existantes (`Navigate to="/"`) et les tests — à traiter en priorité
2. **`<sh-logo>`** : vérifier que le composant est bien exporté par le Design System v1.3.1 avant utilisation
3. **OG image absente** : créer `public/og-image.png` ou retirer la meta pour éviter une 404
4. **CookieBanner** : à rendre accessible sur la landing (RGPD)
5. **Pas de données à fetcher** sur la landing (page statique) → pas d'authentification nécessaire, pas de hook réseau
