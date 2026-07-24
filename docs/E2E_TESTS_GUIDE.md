# Guide des tests E2E Frontend

## Pourquoi deux approches E2E différentes (backend vs frontend) ?

- **Backend** (`stockhub_back/tests/e2e`) : authentification **ROPC**
  (`acquireTokenByUsernamePassword` via `@azure/msal-node`, policy
  `B2C_1_ROPC`). Non-interactif, rapide, mais ne teste que l'API REST — pas
  l'écran de login réel affiché à l'utilisateur.
- **Frontend** (ce guide) : authentification **interactive** via Playwright,
  policy `B2C_1_signupsignin` (celle réellement utilisée par l'app). Simule
  le vrai parcours utilisateur : clic "Se connecter" → redirection Azure AD
  B2C → saisie identifiants → retour sur l'app.

## Pattern storageState

L'authentification interactive est coûteuse (redirections réseau réelles
vers `b2clogin.com`). Elle n'est donc faite **qu'une fois** par run, dans un
projet Playwright dédié (`setup`), qui sauvegarde l'état de session dans
`playwright/.auth/user.json`. Les tests suivants (projet `authenticated`)
réutilisent ce fichier via `storageState`, sans repasser par le login.

```
tests/e2e-frontend/
  helpers/
    auth.setup.ts       # login réel, génère playwright/.auth/user.json
  fixtures.ts            # réinjecte le sessionStorage MSAL (voir piège ci-dessous)
  auth-smoke.e2e.test.ts  # vérifie que la session réutilisée est valide
```

`playwright/.auth/user.json` n'est jamais committé (voir `.gitignore`).

### ⚠️ Piège : `storageState` ne capture pas le sessionStorage

MSAL est configuré en `cacheLocation: 'sessionStorage'`
(`src/config/authConfig.ts`) — choix volontaire côté app pour limiter la
persistance du token. Or `storageState()` de Playwright ne sauvegarde que
les **cookies et le localStorage**, jamais le sessionStorage. Sans
contournement, chaque test du projet `authenticated` repart avec un
sessionStorage vide → MSAL ne voit plus de session → redirection vers la
LandingPage au lieu du dashboard.

Solution : `auth.setup.ts` sérialise le sessionStorage dans
`playwright/.auth/session-storage.json`, et `fixtures.ts` le réinjecte via
`context.addInitScript()` avant que le code de l'app ne s'exécute. Tous les
tests du projet `authenticated` doivent importer `test`/`expect` depuis
`./fixtures` (pas directement `@playwright/test`) pour bénéficier de cette
réinjection.

## Compte de test

Même compte que les tests E2E backend : `sandrine.cipolla@gmail.com`. Un
compte B2C dédié n'a pas pu être provisionné par API (voir
`stockhub_back/docs/troubleshooting/e2e-azure-ropc-issues.md`), donc ce
compte réel est réutilisé pour les deux approches.

## Lancer en local

```bash
cp .env.e2e.example .env.e2e
# renseigner AZURE_TEST_USERNAME / AZURE_TEST_PASSWORD dans .env.e2e

npm run dev            # terminal 1 — sert l'app sur http://localhost:5173
npx dotenv -e .env.e2e -- npm run test:e2e   # terminal 2
```

Sans `dotenv-cli`, exporter les variables manuellement avant `npm run
test:e2e` (`E2E_BASE_URL`, `AZURE_TEST_USERNAME`, `AZURE_TEST_PASSWORD`).

## CI

Workflow séparé `.github/workflows/e2e-frontend.yml`, déclenché
manuellement (`workflow_dispatch`) ou chaque lundi 6h UTC — **pas** sur
chaque push/PR, pour ne pas rendre la CI principale dépendante d'un vrai
login réseau contre Azure AD B2C. Nécessite les secrets repo
`AZURE_TEST_USERNAME` et `AZURE_TEST_PASSWORD`.

## Scope actuel

Ce socle (issue #101) ne couvre que l'authentification + un test de fumée.
Les tests de workflow complet (création/édition de stocks et d'items,
vérifications de la base de données) sont traités dans l'issue #66 — voir
`documentation/ISSUE_E2E_FULL_UI_BACKEND.md`.
