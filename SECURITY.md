# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

Only the latest released 1.x version receives security fixes. The current version is in [package.json](package.json).

## Reporting a Vulnerability

If you discover a security vulnerability in StockHub Frontend, report it privately through the repository's **Security** tab, using [Report a vulnerability](https://github.com/SandrineCipolla/stockHub_V2_front/security/advisories/new).

**Please do not open public issues for security vulnerabilities.**

### What to include in your report

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix, if any

### Response timeline

- **Initial response:** within 48 hours
- **Status update:** within 7 days
- **Fix timeline:** depends on severity, critical issues prioritized

## Security Measures

### Automated security checks

`security-audit.yml` runs `npm audit --audit-level=high`, so HIGH and CRITICAL vulnerabilities block the build. MODERATE and LOW are reported as information only.

It runs on every pull request targeting `main`, on every push to `main`, every Monday at 05:00 UTC, and on manual dispatch.

![Security Audit](https://github.com/SandrineCipolla/stockHub_V2_front/actions/workflows/security-audit.yml/badge.svg)

Dependency updates are proposed automatically by Dependabot.

### Authentication and client security

- **Authentication:** Azure AD B2C via MSAL (`@azure/msal-browser` / `@azure/msal-react`) with PKCE flow
- **API security:** HTTPS only, Bearer tokens sent to backend APIs, no secret tokens stored in client repository
- **Content & Privacy:** GDPR compliant cookie consent, see [CookieBanner](src/components/common/CookieBanner.tsx)

## Security Best Practices

When contributing to this project:

1. Never commit sensitive data such as API keys, passwords or client secrets
2. Follow TypeScript strict mode and the ESLint security rules
3. Sanitize and validate all user inputs before rendering
4. Keep dependencies up to date

## Vulnerability History

Every vulnerability found and fixed is recorded in [docs/security/SECURITY-VULNERABILITIES.md](docs/security/SECURITY-VULNERABILITIES.md).

---

**Maintainer:** Sandrine Cipolla
**Project:** StockHub Frontend (RNCP project)
