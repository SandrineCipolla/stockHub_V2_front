# ADR-011 - Playwright avec authentification interactive réelle pour les E2E frontend

**Date** : juillet 2026
**Statut** : Accepté
**Issues** : #101, #66

---

## Contexte

Les tests E2E du backend s'authentifient via le flux ROPC (Resource Owner Password Credentials). Ils valident l'API, mais ne traversent jamais l'écran de login réellement affiché à l'utilisateur. Une régression sur la page d'authentification, la redirection ou la capture du token passait donc inaperçue.

## Décision

Tests E2E frontend avec Playwright, authentifiés par un login interactif réel contre la policy Azure AD B2C `B2C_1_signupsignin`, celle utilisée en production. La session est capturée une fois puis réutilisée via `storageState`.

## Alternatives

| Alternative                | Raison du rejet                                                        |
| -------------------------- | ---------------------------------------------------------------------- |
| Authentification mockée    | Ne teste ni la policy B2C, ni la redirection, ni la capture du token   |
| Flux ROPC comme le backend | Contourne l'écran de login, donc exactement ce qu'on cherche à couvrir |

## Contrainte découverte : `sessionStorage` et `storageState`

MSAL est configuré avec `cacheLocation: 'sessionStorage'` (`src/config/authConfig.ts`). Or `storageState()` de Playwright ne capture que les cookies et le `localStorage`, jamais le `sessionStorage` : chaque test repartait sans session.

Contournement retenu : sérialisation manuelle du `sessionStorage` après le login, puis réinjection via `context.addInitScript()` (`tests/e2e-frontend/fixtures.ts`). Le piège est généralisable à tout projet combinant MSAL et Playwright.

## Conséquences

- **Positif** : le 24 juillet 2026, le premier test de workflow réel a révélé un incident de production indépendant du test lui-même, des migrations Prisma jamais appliquées en production. Un mock complet ne l'aurait pas vu
- **Négatif** : les tests dépendent de la disponibilité d'Azure AD B2C et d'un compte de test réel
- **Négatif** : la capture de session doit être rejouée quand le token expire

## Liens

- Code concerné : `tests/e2e-frontend/`, `playwright.config.ts`
- Guide : [docs/E2E_TESTS_GUIDE.md](../E2E_TESTS_GUIDE.md)
