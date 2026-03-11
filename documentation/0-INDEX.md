# 📚 StockHub V2 - Index de Documentation

> **Documentation complète du projet StockHub V2**
> RNCP 7 - Développeur Web Full Stack
> Développé par: Sandrine Cipolla

---

## 📖 Documentation Principale (Ordre Recommandé)

### Guides Essentiels

| #      | Fichier                                                                  | Description                                            |
| ------ | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| **0**  | [0-INDEX.md](0-INDEX.md)                                                 | 📍 Vous êtes ici - Index principal                     |
| **1**  | [1-GETTING-STARTED.md](1-GETTING-STARTED.md)                             | 🚀 **Démarrage rapide** - Installation, premiers pas   |
| **2**  | [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)                   | 🎨 Guide utilisation web components React              |
| **3**  | [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md)             | 🔗 **Harmonisation Frontend ↔ Design System**          |
| **4**  | [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)                             | 🐛 Résolution problèmes web components                 |
| **5**  | [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md)                                 | 🧪 Guide tests & métriques performance                 |
| **6**  | [6-ACCESSIBILITY.md](6-ACCESSIBILITY.md)                                 | ♿ Accessibilité WCAG AA (audit complet)               |
| **7**  | [7-SESSIONS.md](7-SESSIONS.md)                                           | 📅 Index sessions développement (11 sessions)          |
| **8**  | [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)                               | 🎓 Suivi compétences & livrables RNCP                  |
| **9**  | [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md)                         | 📊 **Dashboard Qualité** - Documentation complète      |
| **10** | [10-AUDIT-RNCP-DASHBOARD.md](10-AUDIT-RNCP-DASHBOARD.md)                 | 🎯 **Audit RNCP Dashboard** - Section avec tabs        |
| **11** | [11-LIGHTHOUSE-DYNAMIC-AUDITS.md](11-LIGHTHOUSE-DYNAMIC-AUDITS.md)       | 🔦 **Lighthouse** - Extraction dynamique audits        |
| **12** | [12-PERFORMANCE-ANALYSIS.md](12-PERFORMANCE-ANALYSIS.md)                 | ⚡ **Performance** - Analyse & optimisations           |
| **13** | [13-METRICS-AUTOMATION-STRATEGY.md](13-METRICS-AUTOMATION-STRATEGY.md)   | 🤖 **Métriques Auto** - Stratégie automatisation       |
| **14** | [14-CI-CD-WORKFLOWS.md](14-CI-CD-WORKFLOWS.md)                           | 🔄 **CI/CD** - Workflows GitHub Actions                |
| **15** | [15-APP-QUALITY-METRICS.md](15-APP-QUALITY-METRICS.md)                   | 🎯 **Métriques App** - État qualité & accessibilité    |
| **16** | [technical/16-CI-TROUBLESHOOTING.md](technical/16-CI-TROUBLESHOOTING.md) | 🛠️ **CI/CD Troubleshooting** - Résolution problèmes CI |

### Quick Links

- **🚀 Nouveau sur le projet ?** → [1-GETTING-STARTED.md](1-GETTING-STARTED.md)
- **🎨 Utiliser le Design System ?** → [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)
- **🐛 Problème technique ?** → [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)
- **🎓 RNCP ?** → [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)

---

## 🎨 Design System (Externe)

> **Repository séparé** : [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system)
> **Package NPM** : `@stockhub/design-system@v1.3.1`
> **Storybook** : [Documentation interactive](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)

### Documentation Design System

**Dans ce repository (Frontend)** :

- [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md) ⭐ **Guide harmonisation complète**
- [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md) ⭐ **Utilisation web components React**
- [V2/DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md) - Architecture wrappers React
- [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md) - Résolution problèmes courants

**Dans le repository Design System** :

- [README](https://github.com/SandrineCipolla/stockhub_design_system#readme) - Vue d'ensemble
- [Storybook interactif](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/) - Documentation + playground
- [CHANGELOG](https://github.com/SandrineCipolla/stockhub_design_system/blob/main/CHANGELOG.md) - Historique versions

### Composants Disponibles

**18 Web Components** répartis en 3 catégories (Atoms, Molecules, Organisms)

**Liste complète** : Voir [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md#composants-disponibles)
**Documentation interactive** : [Storybook](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)

**Version actuelle** : v1.3.1 (stable)

---

## 📂 Documentation Technique

### Architecture & Structure

- [V2/ARCHITECTURE.md](V2/ARCHITECTURE.md) - Architecture technique complète
- [V2/TYPESCRIPT.md](V2/TYPESCRIPT.md) - Conventions et bonnes pratiques TypeScript
- [V2/DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md) - Architecture wrappers React
- [V2/AI-AGENT.md](V2/AI-AGENT.md) - Agent IA conversationnel

### Intelligence Artificielle

- [technical/AI-FEATURES.md](technical/AI-FEATURES.md) ⭐ **COMMENT** - Documentation technique algorithmes ML
- [technical/AI-DECISIONS.md](technical/AI-DECISIONS.md) ⭐ **POURQUOI** - Justifications décisions (RNCP)
- [features/MODE-LOISIRS-CREATIF.md](features/MODE-LOISIRS-CREATIF.md) - Mode loisirs créatifs

**Note** : `AI-FEATURES.md` = technique, `AI-DECISIONS.md` = décisionnel

### Développement Frontend

- [technical/ANIMATIONS.md](technical/ANIMATIONS.md) - Système animations et transitions (Framer Motion)
- [technical/BUILD-OPTIMIZATIONS.md](technical/BUILD-OPTIMIZATIONS.md) - Optimisations build & performance
- [technical/LOGGER-GUIDE.md](technical/LOGGER-GUIDE.md) - Système de logging
- [technical/MAINTENANCE-AUTO.md](technical/MAINTENANCE-AUTO.md) - Scripts et automatisation
- [technical/RELEASE-AUTOMATION.md](technical/RELEASE-AUTOMATION.md) - Automatisation releases (Release Please)
- [technical/DEPLOYMENT-ARCHITECTURE.md](technical/DEPLOYMENT-ARCHITECTURE.md) ⭐ **Déploiement** - Architecture staging Vercel + prod Azure
- [technical/SCRIPTS-AUDIT.md](technical/SCRIPTS-AUDIT.md) - Scripts audit (FPS, a11y, daltonisme)
- [technical/TYPE-SAFETY-AUDIT-2025-11-18.md](technical/TYPE-SAFETY-AUDIT-2025-11-18.md) - Audit TypeScript & sécurité des types
- [technical/16-CI-TROUBLESHOOTING.md](technical/16-CI-TROUBLESHOOTING.md) ⭐ **CI/CD Troubleshooting** - Résolution problèmes CI
  | **17** | [technical/DEPLOYMENT-ARCHITECTURE.md](technical/DEPLOYMENT-ARCHITECTURE.md) | 🚀 **Déploiement** - Architecture staging Vercel + prod Azure |

---

## 📅 Planning & Roadmaps

### Plannings Actifs (Novembre 2025)

- [planning/planning_ameliorations_v2.md](planning/planning_ameliorations_v2.md) ⭐ **Planning principal** (Octobre → Novembre)
- [planning/PLANNING-NOVEMBRE-2025-UPDATE.md](planning/PLANNING-NOVEMBRE-2025-UPDATE.md) - Travail réel 13-18/11
- [planning/PLANNING-FINALISATION-NOVEMBRE-2025.md](planning/PLANNING-FINALISATION-NOVEMBRE-2025.md) - Priorités immédiates

### Roadmaps & Stratégies

- [planning/ROADMAP-ARCHITECTURE-EVOLUTION.md](planning/ROADMAP-ARCHITECTURE-EVOLUTION.md) - Évolution architecture
- [planning/STORYBOOK-ARCHITECTURE-STRATEGY.md](planning/STORYBOOK-ARCHITECTURE-STRATEGY.md) - Stratégie Storybook (historique)

---

## 📅 Sessions de Développement

### Index Sessions

- [7-SESSIONS.md](7-SESSIONS.md) ⭐ **Index chronologique complet** (11 sessions documentées)

### Sessions Récentes (Décembre 2025)

- [sessions/2025-12-08-COPILOT-FEEDBACK-CI-OPTIMIZATION.md](sessions/2025-12-08-COPILOT-FEEDBACK-CI-OPTIMIZATION.md) ⭐ **NEW** - Retours Copilot + Optimisation CI (-41% temps)
- [sessions/2025-11-26-LIGHTHOUSE-DYNAMIC-AUDITS.md](sessions/2025-11-26-LIGHTHOUSE-DYNAMIC-AUDITS.md) - Lighthouse extraction dynamique audits échoués
- [sessions/2025-11-26-AUDIT-RNCP-TAB-NAVIGATION.md](sessions/2025-11-26-AUDIT-RNCP-TAB-NAVIGATION.md) - Audit RNCP avec tabs navigation + downloads JSON
- [sessions/2025-11-25-DASHBOARD-DATASETS-SCALABILITY.md](sessions/2025-11-25-DASHBOARD-DATASETS-SCALABILITY.md) - Tests datasets scalabilité
- [sessions/2025-11-25-DASHBOARD-A11Y-REDUCED-MOTION.md](sessions/2025-11-25-DASHBOARD-A11Y-REDUCED-MOTION.md) - Section Reduced Motion éducative
- [sessions/2025-11-24-DASHBOARD-UX-IMPROVEMENTS.md](sessions/2025-11-24-DASHBOARD-UX-IMPROVEMENTS.md) - Améliorations UX dashboard
- [sessions/2025-11-24-DASHBOARD-BADGES.md](sessions/2025-11-24-DASHBOARD-BADGES.md) - Badges de statut dashboard (8 badges)
- [sessions/2025-11-20-22-DASHBOARD-INTERACTIF.md](sessions/2025-11-20-22-DASHBOARD-INTERACTIF.md) - Dashboard qualité interactif (PRs #44-46)
- [sessions/2025-11-18-SEARCH-WRAPPER-TESTS.md](sessions/2025-11-18-SEARCH-WRAPPER-TESTS.md) - Tests SearchInputWrapper (464 tests, 7/7 wrappers ✅)
- [sessions/2025-11-13-ANALYTICS-MIGRATION.md](sessions/2025-11-13-ANALYTICS-MIGRATION.md) - Migration Analytics (100% Design System)
- [sessions/2025-11-12-TESTS-UNITAIRES.md](sessions/2025-11-12-TESTS-UNITAIRES.md) - Correction tests (stratégie Shadow DOM)
- [sessions/2025-02-08-CLEANUP.md](sessions/2025-02-08-CLEANUP.md) - Cleanup & optimisation
- [sessions/2025-01-22-FIXES-COPILOT.md](sessions/2025-01-22-FIXES-COPILOT.md) - Corrections Copilot
- [sessions/RECAP-03-NOVEMBRE.md](sessions/RECAP-03-NOVEMBRE.md) - Migration MetricCard & bug critique

---

## 🎓 RNCP Certification ⭐

### Documentation Essentielle RNCP

- [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md) ⭐ **IMPORTANT** - Suivi compétences et livrables
- [technical/AI-DECISIONS.md](technical/AI-DECISIONS.md) ⭐ - Décisions architecturales (C2.5)
- [7-SESSIONS.md](7-SESSIONS.md) ⭐ - Index chronologique sessions (9 sessions)

### Accomplissements Récents (Novembre 2025)

✅ **Complété** :

- Design System externe créé (18 Web Components, Storybook)
- Tests wrappers 100% (Issue #24) - 7/7 wrappers testés, 464 tests
- Audit accessibilité WCAG AA (Issue #10) - 100% conforme
- Migration Analytics (Issue #9) - 100% Design System
- Bug recherche résolu (Issue #33) - SearchInputWrapper créé

📊 **Métriques** :

- Tests : 464 passent (33 skipped, 497 total)
- Coverage : 60.67% global, composants 90-98%
- Performance Lighthouse : 99/100
- Accessibilité Lighthouse : 96/100

### Améliorations & Issues

- [Améliorations Futures](../AMELIORATIONS-FUTURES.md) - Améliorations planifiées
- [GitHub Issues](https://github.com/SandrineCipolla/stockHub_V2_front/issues) - Suivi actif des tâches

---

## 🔄 Migration & Legacy

- [migration/ANALYSE-CONNEXION-V1.md](migration/ANALYSE-CONNEXION-V1.md) - Migration depuis V1

---

## 📊 Métriques & Performance

- [metrics/README.md](metrics/README.md) - Métriques et KPIs
- [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md) - Guide tests et performance
- [6-ACCESSIBILITY.md](6-ACCESSIBILITY.md) - Audit accessibilité complet

---

## 🗄️ Archives

Documentation archivée (historique du projet pour RNCP) :

### Sessions Archivées

- [archive/recaps/RECAP-29-OCTOBRE.md](archive/recaps/RECAP-29-OCTOBRE.md) - Session 29 Oct
- [archive/recaps/RECAP-21-OCTOBRE.md](archive/recaps/RECAP-21-OCTOBRE.md) - Session 21 Oct
- [archive/recaps/RECAP-14-OCTOBRE.md](archive/recaps/RECAP-14-OCTOBRE.md) - Session 14 Oct

### Design System (Archivé - Docs obsolètes)

- [archive/design-system/DESIGN-SYSTEM-INTEGRATION.md](archive/design-system/DESIGN-SYSTEM-INTEGRATION.md)
- [archive/design-system/DESIGN-SYSTEM-LEARNINGS.md](archive/design-system/DESIGN-SYSTEM-LEARNINGS.md)
- [archive/design-system/DESIGN-SYSTEM-IMPROVEMENTS.md](archive/design-system/DESIGN-SYSTEM-IMPROVEMENTS.md)
- [archive/design-system/DESIGN-SYSTEM-FEEDBACK.md](archive/design-system/DESIGN-SYSTEM-FEEDBACK.md)
- [archive/STOCKHUB-V2-INTEGRATION.md](archive/STOCKHUB-V2-INTEGRATION.md) - ⚠️ Remplacé par [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md)

### Planning (Archivé)

- [archive/planning/PLANNING-PROCHAINES-SESSIONS.md](archive/planning/PLANNING-PROCHAINES-SESSIONS.md)

### Status Docs (Archivé)

- [archive/status/ETAT-IA-BUSINESS-INTELLIGENCE.md](archive/status/ETAT-IA-BUSINESS-INTELLIGENCE.md) - 100% complété

### PR Analyses (Archivé)

- [archive/pr-analyses/](archive/pr-analyses/) - Analyses PR anciennes

---

## 📊 Structure de la Documentation

```
documentation/
├── 0-INDEX.md (ce fichier)             # 📍 Point d'entrée
├── 1-GETTING-STARTED.md                # 🚀 Démarrage rapide
├── 2-WEB-COMPONENTS-GUIDE.md          # 🎨 Guide web components
├── 3-FRONTEND-DS-INTEGRATION.md       # 🔗 Harmonisation Frontend ↔ DS
├── 4-TROUBLESHOOTING.md               # 🐛 Debug
├── 5-TESTING-GUIDE.md                 # 🧪 Tests
├── 6-ACCESSIBILITY.md                 # ♿ Accessibilité
├── 7-SESSIONS.md                      # 📅 Index sessions
├── 8-RNCP-CHECKLIST.md                # 🎓 RNCP
├── 9-DASHBOARD-QUALITY.md             # 📊 Dashboard Qualité
├── 10-AUDIT-RNCP-DASHBOARD.md         # 🎯 Audit RNCP Dashboard
├── 11-LIGHTHOUSE-DYNAMIC-AUDITS.md    # 🔦 Lighthouse extraction dynamique
├── 12-PERFORMANCE-ANALYSIS.md         # ⚡ Analyse performance
├── 13-METRICS-AUTOMATION-STRATEGY.md  # 🤖 Automatisation métriques
├── 14-CI-CD-WORKFLOWS.md              # 🔄 CI/CD workflows
├── 15-APP-QUALITY-METRICS.md          # 🎯 Métriques App
│
├── sessions/                           # Sessions développement
│   ├── 2025-12-08-COPILOT-FEEDBACK-CI-OPTIMIZATION.md
│   ├── 2025-11-26-LIGHTHOUSE-DYNAMIC-AUDITS.md
│   ├── 2025-11-26-AUDIT-RNCP-TAB-NAVIGATION.md
│   ├── 2025-11-25-DASHBOARD-DATASETS-SCALABILITY.md
│   ├── 2025-11-25-DASHBOARD-A11Y-REDUCED-MOTION.md
│   ├── 2025-11-24-DASHBOARD-UX-IMPROVEMENTS.md
│   ├── 2025-11-24-DASHBOARD-BADGES.md
│   ├── 2025-11-20-22-DASHBOARD-INTERACTIF.md
│   ├── 2025-11-18-SEARCH-WRAPPER-TESTS.md
│   ├── 2025-11-13-ANALYTICS-MIGRATION.md
│   ├── 2025-11-12-TESTS-UNITAIRES.md
│   ├── 2025-02-08-CLEANUP.md
│   ├── 2025-01-22-FIXES-COPILOT.md
│   └── RECAP-03-NOVEMBRE.md
│
├── technical/                          # Documentation technique
│   ├── AI-DECISIONS.md
│   ├── AI-FEATURES.md
│   ├── ANIMATIONS.md
│   ├── BUILD-OPTIMIZATIONS.md
│   ├── LOGGER-GUIDE.md
│   ├── MAINTENANCE-AUTO.md
│   └── SCRIPTS-AUDIT.md
│
├── V2/                                 # Architecture V2
│   ├── ARCHITECTURE.md
│   ├── TYPESCRIPT.md
│   ├── AI-AGENT.md
│   └── DESIGN-SYSTEM-WRAPPERS.md
│
├── planning/                           # Plannings & roadmaps
│   ├── planning_ameliorations_v2.md
│   ├── PLANNING-NOVEMBRE-2025-UPDATE.md
│   ├── PLANNING-FINALISATION-NOVEMBRE-2025.md
│   ├── ROADMAP-ARCHITECTURE-EVOLUTION.md
│   └── STORYBOOK-ARCHITECTURE-STRATEGY.md
│
├── features/                           # Documentation fonctionnalités
│   └── MODE-LOISIRS-CREATIF.md
│
├── metrics/                            # Métriques
│   └── README.md
│
├── migration/                          # Migration
│   └── ANALYSE-CONNEXION-V1.md
│
└── archive/                            # Archives (historique RNCP)
    ├── recaps/                         # Sessions anciennes
    ├── design-system/                  # Docs DS archivées
    ├── planning/                       # Planning ancien
    ├── status/                         # Status docs complétés
    ├── pr-analyses/                    # Analyses PR archivées
    └── STOCKHUB-V2-INTEGRATION.md     # Intégration DS (obsolète)
```

---

## 🔍 Recherche Rapide

### Par Besoin

| Besoin                       | Document                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| **Installer le projet**      | [1-GETTING-STARTED.md](1-GETTING-STARTED.md)                 |
| **Utiliser web components**  | [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)       |
| **Comprendre Frontend ↔ DS** | [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md) |
| **Problème technique**       | [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)                 |
| **Écrire des tests**         | [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md)                     |
| **Accessibilité**            | [6-ACCESSIBILITY.md](6-ACCESSIBILITY.md)                     |
| **Sessions développement**   | [7-SESSIONS.md](7-SESSIONS.md)                               |
| **Suivi RNCP**               | [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)                   |

### Par Sujet

**Architecture**

- Frontend : [V2/ARCHITECTURE.md](V2/ARCHITECTURE.md)
- TypeScript : [V2/TYPESCRIPT.md](V2/TYPESCRIPT.md)
- Wrappers : [V2/DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md)

**Design System**

- Harmonisation : [3-FRONTEND-DS-INTEGRATION.md](3-FRONTEND-DS-INTEGRATION.md)
- Guide utilisation : [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)
- Storybook externe : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/

**Intelligence Artificielle**

- Technique : [technical/AI-FEATURES.md](technical/AI-FEATURES.md)
- Décisions : [technical/AI-DECISIONS.md](technical/AI-DECISIONS.md)
- Mode créatif : [features/MODE-LOISIRS-CREATIF.md](features/MODE-LOISIRS-CREATIF.md)

**Tests & Qualité**

- Guide tests : [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md)
- Accessibilité : [6-ACCESSIBILITY.md](6-ACCESSIBILITY.md)
- Métriques : [metrics/README.md](metrics/README.md)

**RNCP**

- Checklist : [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)
- Sessions : [7-SESSIONS.md](7-SESSIONS.md)
- Décisions : [technical/AI-DECISIONS.md](technical/AI-DECISIONS.md)

---

## 📝 Conventions de Documentation

1. **Numérotation** : Fichiers principaux numérotés 0-8 (ordre lecture recommandé)
2. **Tous les docs en Markdown** (.md)
3. **Structure claire** avec sommaire
4. **Exemples de code** avec syntax highlighting
5. **Références croisées** entre documents
6. **Archivage** plutôt que suppression (historique RNCP)
7. **Organisation thématique** (sessions/, technical/, planning/, etc.)

---

## 🆘 Besoin d'Aide ?

### Documentation

- **📚 Démarrage** : [1-GETTING-STARTED.md](1-GETTING-STARTED.md)
- **🎨 Web Components** : [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)
- **🐛 Problème technique** : [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)
- **🎓 RNCP** : [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)

### Resources Externes

- **Storybook DS** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **Repository DS** : https://github.com/SandrineCipolla/stockhub_design_system
- **Démo Live** : https://stock-hub-v2-front.vercel.app/
- **React Docs** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/docs/

### Issues GitHub

Créer une issue : https://github.com/SandrineCipolla/stockHub_V2_front/issues

---

**Dernière mise à jour** : 11 Mars 2026
**Version Documentation** : 2.6 (Deployment Architecture staging Vercel + prod Azure)
**Projet** : StockHub V2 - RNCP 7
