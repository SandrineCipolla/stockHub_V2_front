# Politique de sécurité

## Versions supportées

| Version | Supportée          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

Seule la dernière version 1.x publiée reçoit les correctifs de sécurité. La version courante est indiquée dans [package.json](package.json).

## Signaler une vulnérabilité

Si vous découvrez une vulnérabilité dans StockHub Frontend, signalez-la en privé depuis l'onglet **Security** du dépôt, via [Report a vulnerability](https://github.com/SandrineCipolla/stockHub_V2_front/security/advisories/new).

**Merci de ne pas ouvrir d'issue publique pour une vulnérabilité de sécurité.**

### Ce que doit contenir le signalement

- Description de la vulnérabilité
- Étapes pour la reproduire
- Impact potentiel
- Correctif suggéré, le cas échéant

### Traitement des signalements

Ce projet est maintenu par une seule personne, sur son temps disponible. Les signalements sont examinés dès que possible, les vulnérabilités critiques et hautes étant prioritaires sur le reste.

Aucun délai de réponse n'est garanti. Vous serez tenu informé de l'avancement dans le fil de l'advisory.

## Mesures de sécurité

### Contrôles automatiques

`security-audit.yml` exécute `npm audit --audit-level=high` : les vulnérabilités HIGH et CRITICAL bloquent le build. Les vulnérabilités MODERATE et LOW sont remontées à titre informatif.

Le workflow s'exécute sur chaque pull request vers `main`, sur chaque push sur `main`, chaque lundi à 5h00 UTC, et sur déclenchement manuel.

![Security Audit](https://github.com/SandrineCipolla/stockHub_V2_front/actions/workflows/security-audit.yml/badge.svg)

Les mises à jour de dépendances sont proposées automatiquement par Dependabot.

### Authentification et sécurité côté client

- **Authentification** : Azure AD B2C via MSAL (`@azure/msal-browser` / `@azure/msal-react`), flux PKCE
- **Sécurité des API** : HTTPS uniquement, jetons Bearer envoyés aux API backend, aucun secret stocké dans le dépôt client
- **Contenu et vie privée** : consentement aux cookies conforme RGPD, voir [CookieBanner](src/components/common/CookieBanner.tsx)

## Bonnes pratiques

Pour toute contribution à ce projet :

1. Ne jamais committer de données sensibles : clés d'API, mots de passe, secrets client
2. Respecter le mode strict de TypeScript et les règles de sécurité ESLint
3. Nettoyer et valider toutes les entrées utilisateur avant affichage
4. Maintenir les dépendances à jour

## Historique des vulnérabilités

Chaque vulnérabilité découverte et corrigée est consignée dans [docs/security/SECURITY-VULNERABILITIES.md](docs/security/SECURITY-VULNERABILITIES.md).

---

**Mainteneuse** : Sandrine Cipolla
**Projet** : StockHub Frontend (projet RNCP)
