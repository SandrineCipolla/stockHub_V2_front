---
author: Sandrine Cipolla
status: ACCEPTÉ
related:
---

# ADR-011 - Playwright avec authentification interactive réelle pour les E2E frontend

**Date** : 2026-07
**Issues** : #101, #66

---

## Contexte

Le backend dispose déjà de tests E2E qui s'authentifient par le flux ROPC contre la policy `B2C_1_ROPC`. Ils sont rapides, mais non interactifs : ils valident l'API REST et ne traversent jamais l'écran de login réellement affiché à l'utilisateur.

Valider le parcours frontend complet, du clic sur « Se connecter » jusqu'au tableau de bord en passant par la redirection Azure AD B2C et la saisie des identifiants, demandait donc une autre approche.

## Décision

Playwright, authentifié par un login interactif réel contre la policy `B2C_1_signupsignin`, celle que l'application utilise en production. La session est capturée une fois par un projet `setup`, puis réutilisée par `storageState`.

Ce qui a emporté la décision : un mock d'authentification ne valide pas le vrai risque. La policy `signupsignin` aurait pu imposer un facteur supplémentaire bloquant l'automatisation, et seul un passage réel permet de le savoir, ce qu'un run de CI a confirmé. Le compte de test déjà provisionné pour le backend est réutilisé, le provisionnement programmatique d'un compte dédié ayant échoué à plusieurs reprises de ce côté.

## Contrainte découverte : `sessionStorage` et `storageState`

MSAL est configuré avec `cacheLocation: 'sessionStorage'`, voir `src/config/authConfig.ts`. Or `storageState()` ne capture que les cookies et le `localStorage`, jamais le `sessionStorage` : chaque test repartait sans session.

Contournement retenu : sérialisation manuelle du `sessionStorage` après le login dans `auth.setup.ts`, puis réinjection via `context.addInitScript()` dans un fixture partagé, avant l'exécution du code applicatif. Le détail est dans le [guide des tests E2E](../17-E2E-TESTS-GUIDE.md). Le piège se généralise à tout projet combinant MSAL et Playwright.

## Décision opérationnelle : une CI séparée

Le workflow `e2e-frontend.yml` est déclenché manuellement ou chaque lundi, volontairement pas à chaque push ni à chaque PR. La CI principale ne doit pas dépendre d'un login réseau réel contre Azure B2C, avec sa latence, sa fragilité et ses identifiants réels.

## Alternatives

| Alternative                          | Pourquoi rejetée                                                                                                                  |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Mock complet de l'authentification   | Ne teste aucun des risques réels, ni le facteur supplémentaire, ni un changement de policy, ni une régression de l'écran de login |
| ROPC côté frontend, comme le backend | Non représentatif. ROPC est conçu pour des clients de confiance, pas pour simuler un utilisateur qui clique                       |

## Conséquences

- **Positif** : couvre un risque que ni les tests unitaires ni les E2E backend ne peuvent atteindre, le parcours de login tel que l'utilisateur le vit
- **Positif** : réutilise le compte de test et les secrets GitHub déjà en place
- **Positif, constaté le 24 juillet 2026** : le premier test de workflow réel a révélé un incident de production sans rapport avec le test, `GET` et `POST /api/v2/stocks` renvoyaient 500 pour tout le monde, six migrations Prisma n'ayant jamais été appliquées en production. Un mock ne l'aurait pas vu
- **Négatif** : dépendance à un compte personnel plutôt qu'à un compte de test dédié, accepté faute d'alternative viable
- **Négatif** : tests plus lents et plus fragiles qu'un mock, à cause du réseau réel vers `b2clogin.com`, ce que la CI séparée compense

## Critères de vérification

Rouvrir cette décision si un compte de test B2C dédié devient provisionnable de façon fiable, ce qui supprimerait la dépendance au compte personnel, ou si la fragilité réseau du passage E2E devient un frein répété.

## Liens

- Guide : [Guide des tests E2E](../17-E2E-TESTS-GUIDE.md)
- Code concerné : `tests/e2e-frontend/`, `playwright.config.ts`

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
