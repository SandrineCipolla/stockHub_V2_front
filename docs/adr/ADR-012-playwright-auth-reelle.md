# ADR-012: Playwright avec auth interactive réelle (plutôt que mockée) pour les E2E frontend

**Date:** 2026-07
**Statut:** Accepté
**Issues:** #101, #66

---

## Contexte

Le backend dispose déjà de tests E2E via ROPC (`acquireTokenByUsernamePassword`, `@azure/msal-node`, policy `B2C_1_ROPC`) — rapides mais non-interactifs : ils testent l'API REST, jamais l'écran de login réellement affiché à l'utilisateur. Pour valider le parcours frontend complet (clic "Se connecter" → redirection Azure AD B2C → saisie identifiants → retour sur l'app → dashboard), il fallait une approche différente.

## Décision

Playwright avec authentification **interactive réelle** contre la policy `B2C_1_signupsignin` (celle utilisée en production par l'app), et non un mock d'auth ou un contournement ROPC côté frontend. Session capturée une fois via un projet `setup` puis réutilisée par `storageState` pour les tests suivants.

## Raisons

- Un mock d'authentification ne valide rien du vrai risque : la policy `signupsignin` aurait pu avoir un MFA/code de vérification bloquant l'automatisation — seul un run réel le confirme ou l'infirme (confirmé absent après un run CI réussi)
- Réutilise le compte de test déjà provisionné pour le backend plutôt que d'investir dans un nouveau compte B2C dédié — la création programmatique avait déjà échoué à plusieurs reprises côté backend (voir `stockhub_back/docs/troubleshooting/e2e-azure-ropc-issues.md`)

## Piège découvert en cours de route

MSAL est configuré en `cacheLocation: 'sessionStorage'` (`src/config/authConfig.ts`). `storageState()` de Playwright ne capture que cookies + localStorage, jamais le sessionStorage — sans contournement, chaque test réutilisant la session perdait l'auth. Fix : sérialisation manuelle du sessionStorage après login (`auth.setup.ts`), réinjection via `context.addInitScript()` dans un fixture partagé (`tests/e2e-frontend/fixtures.ts`) avant l'exécution du code de l'app. Documenté en détail dans `docs/E2E_TESTS_GUIDE.md` — piège généralisable à tout projet MSAL + Playwright.

## Alternatives considérées

### Alternative 1: Mock complet de l'auth (MSAL stubbé)

- **Pourquoi rejetée :** ne teste jamais le vrai risque (MFA, changement de policy B2C, régression de l'écran de login)

### Alternative 2: ROPC côté frontend comme le backend

- **Pourquoi rejetée :** non représentatif — ROPC est conçu pour des clients de confiance (API), pas pour simuler un utilisateur cliquant dans une UI

## Conséquences

### Positives

- Couvre un risque que les tests unitaires (mockés) et les tests E2E backend (ROPC) ne peuvent pas couvrir : le vrai parcours de login tel que vécu par l'utilisateur
- Réutilise l'infrastructure existante (compte de test, secrets GitHub déjà configurés côté backend)
- **Bénéfice concret confirmé (24/07/2026)** : le premier test de workflow réel (#66, création de stock) a révélé un incident de production totalement indépendant du test lui-même — `GET`/`POST /api/v2/stocks` renvoyaient 500 pour tout le monde à cause de 6 migrations Prisma jamais appliquées à la prod. Un mock complet ne l'aurait jamais vu.

### Négatives

- Dépendance à un compte réel personnel plutôt qu'un compte de test dédié — accepté par défaut faute d'alternative viable (échecs de provisioning programmatique)
- Tests plus lents et plus fragiles qu'un mock (réseau réel vers `b2clogin.com`) — compensé par l'exécution hors du flux CI principal

## Décision opérationnelle : CI séparée

Workflow séparé (`e2e-frontend.yml`), déclenché manuellement ou chaque lundi — volontairement **pas** sur chaque push/PR, pour ne pas rendre la CI principale dépendante d'un login réseau réel contre Azure B2C (latence, flakiness potentielle, credentials réels en jeu).

## Réexamen

Rouvrir si un compte de test B2C dédié devient provisionnable de façon fiable (supprimerait la dépendance au compte personnel), ou si la fragilité réseau du run E2E devient un frein répété.

## Liens

- Guide: `docs/E2E_TESTS_GUIDE.md`
- Code: `tests/e2e-frontend/`

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
