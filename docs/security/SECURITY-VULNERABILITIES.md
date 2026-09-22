# Security Vulnerabilities - Changelog

Ce document trace toutes les vulnérabilités de sécurité découvertes et corrigées dans le projet StockHub Frontend.

---

## 🟡 Lot de septembre 2026 : 37 vulnérabilités npm résolues en un lot

**Date de découverte :** 2026-09-20
**Date de résolution :** 2026-09-20
**Sévérité :** HIGH (13) et MODERATE (24) au moment de la découverte (0 restante)
**Advisories majeurs :** `extract-zip` (traversée de chemin par lien symbolique via Puppeteer), `@sentry/node` via Lighthouse, `vitest`

### Description

`npm audit` sur `main` remontait **37 vulnérabilités (13 de sévérité haute et 24 modérées)**, accumulées à travers les dépendances directes et transitives d'outils de test et de build (Puppeteer, Lighthouse, Vitest, Jest-DOM).

### Détails techniques

#### Problème

Les vulnérabilités affectaient principalement l'outillage de dev et de test :

- **Puppeteer < 25** : dépendait de chaînes vulnérables (`extract-zip` permettant une traversée de chemin par lien symbolique, 5 alertes hautes).
- **Lighthouse < 13** : dépendances transitives `@sentry/node` vulnérables.
- **Vitest < 5** : dépendances transitives vulnérables (4 alertes hautes).
- **Dépendances transitives d'outils** : `brace-expansion`, `@humanfs/node`, `postcss-selector-parser`.

#### Impact sur StockHub Frontend

Toutes les vulnérabilités concernaient des outils de développement, de test E2E et de génération de rapports, et non le bundle runtime délivré aux navigateurs clients. Cependant, ces alertes faisaient échouer les vérifications automatiques de sécurité en CI (`security-audit.yml`) et masquaient d'éventuelles nouvelles vulnérabilités réelles.

### Résolution

#### Fix appliqué (PR #284)

1. **Mises à jour majeures imposées par la sécurité** :
   - `puppeteer` → `^25.11.0`
   - `lighthouse` → `^13.5.0`
   - `vitest` → `^5.0.1` (avec mise à jour du typage jest-dom vers `@testing-library/jest-dom/vitest`)
2. **Mises à jour des dépendances directes** :
   - `react` / `react-dom` → `19.3.0`
   - `vite` → `^8.3.0`
3. **Overrides pour les transitives sans correctif direct** :
   - `brace-expansion` → `^5.0.9`
   - `@humanfs/node` → `^0.16.8`
   - `postcss-selector-parser` → `^6.1.4`
4. **Mise à jour du socle Node.js** :
   - Workflows CI mis à jour vers Node.js 22.
   - Ajout de `engines.node >= 22.19.0` dans `package.json`.

**Commit :** PR #284 - `chore(deps): résorber les 37 vulnérabilités npm en un lot`

#### Vérification

```bash
# Audit de sécurité
$ npm audit
found 0 vulnerabilities ✅

# Suite de tests & Qualité
$ npm run test:run
558 tests passed (27 files) ✅

$ npm run type-check
0 error ✅

$ npm run lint
0 error, 0 warning ✅

$ npm run build
built in 4.80s ✅
```

### Prévention future

1. **Audit CI systématique** : Le workflow `.github/workflows/security-audit.yml` s'exécute sur chaque PR et chaque semaine pour détecter immédiatement toute régression.
2. **Contrôle des dépendances** : Les dépendances de dev et de production sont auditées avec `npm audit --audit-level=high` pour bloquer tout merge comportant une vulnérabilité haute ou critique.

---

## Template pour futures vulnérabilités

```markdown
## 🔴 CVE-YYYY-NN : [Titre vulnérabilité]

**Date de découverte :** YYYY-MM-DD
**Date de résolution :** YYYY-MM-DD
**Sévérité :** [CRITICAL/HIGH/MEDIUM/LOW]
**Advisory :** [Lien]

### Description

[Description courte du problème]

### Détails techniques

#### Problème

[Explication technique]

#### Exploitation

[Exemple d'exploitation]

#### Impact sur StockHub Frontend

[Impact spécifique au projet]

### Résolution

#### Fix appliqué

[Commandes et changements]

#### Vérification

[Tests de vérification]

### Prévention future

[Mesures pour éviter ce type de problème]

### Références

[Liens vers advisories, CVE, commits]
```

---

**Dernière mise à jour :** 2026-09-20
**Auteur :** Sandrine Cipolla
**Statut sécurité :** ✅ 0 vulnérabilité.
