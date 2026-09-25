# Audit global RNCP — État réel du code et issues ouvertes

# Date : mars 2026

## Objectif

Produire un état des lieux précis de ce qui reste à implémenter
côté code pour valider les critères RNCP 7, en croisant :

- Les issues ouvertes sur les 3 repos
- L'état réel du code
- Le référentiel RNCP (blocs 1 à 4)

---

## REPO 1 — stockhub_back

### 1.1 Issues ouvertes

- Lister TOUTES les issues ouvertes
- Pour chaque issue : numéro, titre, labels, assignée, milestone
- Classer par label ou thème

### 1.2 PRs ouvertes

- Lister toutes les PRs ouvertes
- Pour chaque PR : numéro, titre, branche source, statut CI

### 1.3 État code — points RNCP critiques

**C2.4 — Backend**

- Lire `src/` : tous les modules implémentés
- Routes existantes : lister les endpoints `/api/v2/`
- Tests : couverture actuelle (lancer `npm run test:coverage`
  ou lire le dernier rapport si disponible)
- OpenAPI/Swagger : `docs/openapi.yaml` existe-t-il et est-il complet ?

**C2.5 — Module IA**

- PR #134 est-elle mergée sur main ?
- Sinon : lister ce qu'elle apporte vs ce qui est sur main

**C3.1 — CI/CD**

- Lire `.github/workflows/` : quels workflows existent ?
- Sont-ils fonctionnels ? (lire les fichiers yaml)
- Y a-t-il un workflow complet test → build → deploy ?

**C3.2 — Tests**

- Lancer `npm run test:coverage` si possible
- Sinon lire les fichiers de config Jest/Vitest
- Coverage actuelle par fichier si disponible
- Nombre de fichiers sans tests

**C3.3 — Monitoring**

- Chercher dans `src/` : Application Insights,
  Winston, Morgan, ou tout logger structuré
- Y a-t-il des métriques exposées ?
- Y a-t-il un endpoint `/health` ou `/metrics` ?

**C3.4 — Déploiement**

- Lire `README.md` section déploiement
- Variables d'env staging vs prod documentées ?
- Script de déploiement ou pipeline CD existe ?

**Sécurité (OWASP)**

- Issue #84 (sessionStorage) : mergée ou ouverte ?
- Y a-t-il un fichier SECURITY.md ou section OWASP
  dans la documentation ?
- TruffleHog ou scan secrets configuré dans CI ?

---

## REPO 2 — stockHub_V2_front

### 2.1 Issues ouvertes

- Lister TOUTES les issues ouvertes
- Pour chaque issue : numéro, titre, labels

### 2.2 PRs ouvertes

- Lister toutes les PRs ouvertes

### 2.3 État code — points RNCP critiques

**C2.3 — Frontend (validé 85/100 mais vérifier)**

- Y a-t-il des issues ouvertes qui concernent
  des régressions ou corrections post-validation ?
- Lighthouse CI configuré dans GitHub Actions ?

**C2.5 — Module IA frontend**

- Issues #118 et #119 : mergées ou ouvertes ?
- Les composants ai/ sont-ils connectés au backend
  ou encore sur données mockées ?

**C3.2 — Tests frontend**

- Lancer `npm run test:coverage` si possible
- Coverage actuelle
- Nombre de composants sans tests

**C3.1 — CI/CD frontend**

- Lire `.github/workflows/`
- Pipeline test → build → deploy configuré ?
- Déploiement Azure SWA automatique ?

**Accessibilité RGAA**

- axe-core configuré dans les tests ou CI ?
- Dernier score Lighthouse accessibilité

**Sécurité**

- Issue #84 (sessionStorage/MSAL) :
  `authConfig.ts` — `cacheLocation` vaut quoi ?

---

## REPO 3 — stockhub_design_system

### 3.1 Issues ouvertes

- Lister les issues ouvertes

### 3.2 État Storybook/Chromatic

- Storybook déployé sur Chromatic ?
- Composants documentés : combien sur combien ?
- Y a-t-il des composants manquants
  pour le module IA (stepper, checkbox list) ?

---

## REPO 4 — GitHub Project board

### 4.1 Vue d'ensemble

Accéder à https://github.com/users/SandrineCipolla/projects/3/views/2

- Colonnes existantes et nombre d'items par colonne
- Items "In Progress" : lesquels, depuis combien de temps
- Items bloqués ou sans activité récente

---

## FORMAT DU RAPPORT

Produire `audit-results/rncp-code-audit-mars2026.md`

### Section 1 — Résumé exécutif

Tableau par critère RNCP :

| Critère          | Statut code | Issues liées | Priorité            |
| ---------------- | ----------- | ------------ | ------------------- |
| C2.3 Frontend    | ✅/⚠️/❌    | #xx, #xx     | Haute/Moyenne/Basse |
| C2.4 Backend     |             |              |                     |
| C2.5 Module IA   |             |              |                     |
| C3.1 CI/CD       |             |              |                     |
| C3.2 Tests       |             |              |                     |
| C3.3 Monitoring  |             |              |                     |
| C3.4 Déploiement |             |              |                     |
| Sécurité OWASP   |             |              |                     |

### Section 2 — Issues ouvertes classées par priorité RNCP

**🔴 Critique (bloque la validation)**

- Liste

**🟡 Important (affaiblit la validation)**

- Liste

**🟢 Bonus (enrichit sans être bloquant)**

- Liste

**📝 Documentaire (mémoire uniquement, pas de code)**

- Liste

### Section 3 — Ce qui peut être fermé / dépriorisé

Issues ouvertes qui ne concernent pas directement
la validation RNCP et peuvent attendre V3

### Section 4 — Séquence recommandée

Ordre d'implémentation optimal pour maximiser
la couverture RNCP dans le temps restant

### Section 5 — Estimation totale

```
Critique à faire          : ~Xj
Important à faire         : ~Xj
Module IA N2 (C2.5)       : ~Xj
Total dev restant estimé  : ~Xj
Journées disponibles      : ~20-25j
Verdict                   : confortable / tendu / critique
```
