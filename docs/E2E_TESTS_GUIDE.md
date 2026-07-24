# Guide des tests E2E Frontend (Playwright)

Tests end-to-end du **vrai parcours utilisateur** : login Azure AD B2C
interactif (redirection réelle, formulaire réel), puis actions dans l'app
(création/suppression de stock, etc.), avec le vrai backend derrière.

---

## 1. Installation (une fois par poste)

### Prérequis

- Node.js 20+ et le repo déjà cloné avec `npm install` fait
- Accès aux identifiants du compte de test Azure B2C (voir [section 4](#4-compte-de-test))

### Étapes

```bash
# 1. Installer le navigateur Chromium utilisé par Playwright (~200 Mo,
#    une seule fois — @playwright/test est déjà dans package.json)
npx playwright install chromium

# 2. Créer le fichier d'env local à partir du modèle
cp .env.e2e.example .env.e2e

# 3. Ouvrir .env.e2e et renseigner AZURE_TEST_USERNAME / AZURE_TEST_PASSWORD
#    (voir section 4 pour savoir où trouver ces identifiants)
```

`.env.e2e` est gitignored — jamais commité.

---

## 2. Utilisation en local (pas à pas)

**Par défaut, cible l'app déployée** (`https://stock-hub-v2-front.vercel.app`)
— c'est le chemin recommandé, ça marche sans rien démarrer d'autre :

```bash
npx dotenv-cli -e .env.e2e -- npx playwright test --ui
```

`dotenv-cli` n'est pas une dépendance du projet — `npx` le télécharge à la
volée au premier lancement (pas d'installation permanente nécessaire).
`--ui` ouvre l'interface graphique Playwright (recommandé pour un premier
lancement — navigateur visible, replay pas à pas). Pour un lancement
silencieux type CI : `npx playwright test` à la place.

Sans `dotenv-cli`, exporter les variables manuellement :

```bash
# PowerShell
$env:AZURE_TEST_USERNAME="..."; $env:AZURE_TEST_PASSWORD="..."; npx playwright test --ui

# bash
AZURE_TEST_USERNAME=... AZURE_TEST_PASSWORD=... npx playwright test --ui
```

### Ce qui se passe au lancement

1. Le projet Playwright `setup` (`tests/e2e-frontend/helpers/auth.setup.ts`)
   se lance en premier : ouvre un vrai navigateur, clique "Se connecter",
   passe par le vrai formulaire `b2clogin.com`, revient sur l'app. Prend
   ~10s (redirections réseau réelles).
2. Le projet `authenticated` (tous les fichiers `*.e2e.test.ts`) réutilise
   ensuite la session déjà ouverte — pas de re-login entre les tests.
3. Un rapport HTML est généré dans `playwright-report/` — l'ouvrir avec
   `npx playwright show-report` en cas d'échec pour voir les captures
   d'écran et la trace.
4. En mode `--ui`, cocher **`authenticated`** dans le filtre "Projects" en
   plus de `setup` (décoché par défaut au premier lancement) — sinon seul
   le test de login apparaît dans la liste.

### ⚠️ Cibler `localhost:5173` (`npm run dev`) ne suffit pas seul

```bash
E2E_BASE_URL=http://localhost:5173 npx dotenv-cli -e .env.e2e -- npx playwright test --ui
```

`npm run dev` sert le frontend, mais son `.env` local pointe
`VITE_API_SERVER_URL` vers un **backend local** (`http://localhost:3006`,
`stockhub_back` + Docker MySQL) qui n'est pas démarré par défaut. Sans lui,
toutes les actions authentifiées échouent avec un écran "Une erreur est
survenue" (le backend distant refuse aussi l'origine `localhost` par CORS
— `ALLOWED_ORIGINS` côté `stockhub_back`). Ne cibler `localhost:5173` que
si le backend local tourne aussi (voir `stockhub_back/README.md`) —
sinon utiliser l'app déployée (option par défaut ci-dessus).

Pas besoin de `npm run dev` dans ce cas — c'est ce que fait la CI.

### Débogage d'un test qui échoue

```bash
# Mode UI interactif (recommandé pour développer un nouveau test)
npx playwright test --ui

# Rejouer une trace après un échec (le chemin exact est affiché dans le
# terminal après un test raté)
npx playwright show-trace test-results/.../trace.zip
```

---

## 3. Écrire un nouveau test

Tout nouveau fichier `tests/e2e-frontend/**/*.e2e.test.ts` qui a besoin
d'une session authentifiée doit importer `test`/`expect` depuis
`../fixtures` (ou `./fixtures` selon la profondeur), **pas** directement
`@playwright/test` — voir [section 5](#5-piège-storagestate-ne-capture-pas-le-sessionstorage)
pour comprendre pourquoi.

```typescript
// tests/e2e-frontend/workflows/mon-nouveau-test.e2e.test.ts
import { test, expect } from '../fixtures';

test.describe('Mon workflow', () => {
  test('fait quelque chose', async ({ page }) => {
    await page.goto('/dashboard'); // déjà authentifié
    // ...
  });
});
```

Exemple réel à suivre : `tests/e2e-frontend/workflows/stock-creation.e2e.test.ts`
(création + suppression d'un stock, auto-nettoyant pour ne pas laisser de
données de test dans le compte réel).

**Sélecteurs** : préférer `getByRole` (accessible name via `aria-label`)
plutôt que des sélecteurs CSS fragiles. Les composants du design system
(`sh-button`, `sh-stock-card`, etc.) exposent un shadow DOM **ouvert** —
Playwright le traverse nativement, aucun piercing manuel n'est nécessaire.
Il n'y a **aucun `data-testid`** dans l'app à ce jour.

⚠️ **`getByRole('dialog')` seul est ambigu** : la bannière de consentement
cookies (`CookieBanner.tsx`) porte aussi `role="dialog"` et est visible par
défaut sur une session fraîche. Toujours scoper par nom accessible —
`page.getByRole('dialog', { name: 'Nouveau stock' })` — plutôt que de
matcher tous les dialogs de la page.

⚠️ **`getByLabel` matche le texte brut du `<label>`, pas l'accessible name
du champ associé** : un `<label>Nom <span aria-hidden="true">*</span></label>`
a pour texte réel "Nom \*" (avec l'astérisque) côté `getByLabel`, alors que
l'accessible name calculée pour le `<input>` associé exclut bien le `*`.
`page.getByLabel('Nom', { exact: true })` ne matche donc jamais sur un
champ requis marqué de cette façon — bloque 30s sans message d'erreur
clair. Préférer un sélecteur par `id` (`page.locator('#item-label')`)
pour les champs de formulaire de cette app.

---

## 4. Compte de test

Même compte que les tests E2E backend ROPC :
`sandrine.cipolla@gmail.com`, identifiants documentés dans
`stockhub_back/docs/technical/azure-ad-setup-detailed.md`. Un compte B2C
dédié n'a pas pu être provisionné par API (voir
`stockhub_back/docs/troubleshooting/e2e-azure-ropc-issues.md`), donc ce
compte réel est réutilisé pour les deux approches.

Secrets GitHub Actions (repo `stockHub_V2_front`, à ajouter avec
`gh secret set` si absents) : `AZURE_TEST_USERNAME`, `AZURE_TEST_PASSWORD`.

---

## 5. Piège : `storageState` ne capture pas le sessionStorage

MSAL est configuré en `cacheLocation: 'sessionStorage'`
(`src/config/authConfig.ts`) — choix volontaire côté app pour limiter la
persistance du token. Or `storageState()` de Playwright ne sauvegarde que
les **cookies et le localStorage**, jamais le sessionStorage. Sans
contournement, chaque test du projet `authenticated` repart avec un
sessionStorage vide → MSAL ne voit plus de session → redirection vers la
LandingPage au lieu du dashboard.

Solution : `auth.setup.ts` sérialise le sessionStorage dans
`playwright/.auth/session-storage.json`, et `fixtures.ts` le réinjecte via
`context.addInitScript()` avant que le code de l'app ne s'exécute.

## Structure du projet

```
tests/e2e-frontend/
  helpers/
    auth.setup.ts               # login réel, génère playwright/.auth/*.json
    stock-actions.ts             # createStock / deleteStock (réutilisés par les 3 workflows)
    item-actions.ts              # addItem
  fixtures.ts                    # réinjecte le sessionStorage MSAL (§5)
  auth-smoke.e2e.test.ts         # vérifie que la session réutilisée est valide
  workflows/
    stock-creation.e2e.test.ts   # création + suppression de stock
    item-management.e2e.test.ts  # ajout d'item + statut Critique/OK
    quantity-update.e2e.test.ts  # boutons +/- de quantité
```

`playwright/.auth/` n'est jamais commité (voir `.gitignore`).

## Pourquoi deux approches E2E différentes (backend vs frontend) ?

- **Backend** (`stockhub_back/tests/e2e`) : authentification **ROPC**
  (`acquireTokenByUsernamePassword` via `@azure/msal-node`, policy
  `B2C_1_ROPC`). Non-interactif, rapide, mais ne teste que l'API REST — pas
  l'écran de login réel affiché à l'utilisateur.
- **Frontend** (ce guide) : authentification **interactive** via Playwright,
  policy `B2C_1_signupsignin` (celle réellement utilisée par l'app). Simule
  le vrai parcours utilisateur : clic "Se connecter" → redirection Azure AD
  B2C → saisie identifiants → retour sur l'app.

## CI

Workflow séparé `.github/workflows/e2e-frontend.yml`, déclenché
manuellement (`workflow_dispatch`) ou chaque lundi 6h UTC — **pas** sur
chaque push/PR, pour ne pas rendre la CI principale dépendante d'un vrai
login réseau contre Azure AD B2C. Cible l'app déployée
(`https://stock-hub-v2-front.vercel.app`), nécessite les secrets repo
`AZURE_TEST_USERNAME` et `AZURE_TEST_PASSWORD`.

Déclenchement manuel : `gh workflow run e2e-frontend.yml --ref main`.

## Scope actuel

- ✅ Authentification interactive + test de fumée (#101)
- ✅ Workflow création + suppression de stock (#66, workflow 1 et 4)
- ✅ Workflow gestion d'items (#66, workflow 2)
- ✅ Workflow mise à jour de quantité (#66, workflow 3)

Les 4 workflows Must-Have de #66 sont couverts, **5/5 tests verts en CI**.
Contexte complet des workflows visés : `documentation/ISSUE_E2E_FULL_UI_BACKEND.md`.
