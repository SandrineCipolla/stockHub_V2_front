# 📚 StockHub V2 - Index de Documentation

> **Documentation complète du projet StockHub V2**
> Expert en Architecture et Développement Logiciel (formation Ada Tech School, certification INGETIS)
> Développé par: Sandrine Cipolla

---

## 📖 Documentation Principale (Ordre Recommandé)

### Guides Essentiels

| #      | Fichier                                                                  | Description                                                                |
| ------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **0**  | [0-INDEX.md](0-INDEX.md)                                                 | 📍 Vous êtes ici - Index principal                                         |
| **1**  | [1-GETTING-STARTED.md](1-GETTING-STARTED.md)                             | 🚀 **Démarrage rapide** - Installation, premiers pas                       |
| **2**  | [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)                   | 🎨 Web components du Design System dans React, évolution du Design System  |
| **4**  | [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)                             | 🐛 Résolution problèmes web components                                     |
| **5**  | [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md)                                 | 🧪 Pyramide de tests, audits performance et accessibilité                  |
| **6**  | [6-ACCESSIBILITY.md](6-ACCESSIBILITY.md)                                 | ♿ Accessibilité WCAG AA (audit complet)                                   |
| **7**  | [7-SESSIONS.md](7-SESSIONS.md)                                           | 📅 Index sessions développement                                            |
| **8**  | [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)                               | 🎓 Suivi compétences & livrables RNCP                                      |
| **9**  | [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md)                         | 📊 **Dashboard Qualité** - Manuel technique UI (`docs/metrics/index.html`) |
| **14** | [14-CI-CD-WORKFLOWS.md](14-CI-CD-WORKFLOWS.md)                           | 🔄 **CI/CD** - Workflows GitHub Actions                                    |
| **15** | [15-APP-QUALITY-METRICS.md](15-APP-QUALITY-METRICS.md)                   | 🎯 **Source de Vérité Unique (SSOT)** - Métriques & Qualité                |
| **16** | [technical/16-CI-TROUBLESHOOTING.md](technical/16-CI-TROUBLESHOOTING.md) | 🛠️ **CI/CD Troubleshooting** - Résolution problèmes CI                     |
| **-**  | [archive/metrics/](archive/metrics/)                                     | 📦 **Archives Métriques RNCP** (Guides 10, 11, 12, 13 archivés)            |

### Fichiers racine

- [../CONTRIBUTING.md](../CONTRIBUTING.md) : process de contribution (branches, commits, PR, issues)
- [../SECURITY.md](../SECURITY.md) : politique de sécurité (versions supportées, signalement)
- [../AGENTS.md](../AGENTS.md) : contexte projet pour les agents IA (`CLAUDE.md` l'importe)
- [../README.md](../README.md) : présentation du projet
- [../ETAT_DU_PROJET.md](../ETAT_DU_PROJET.md) : tableau de bord de l'état courant et point de reprise
- [../docs/adr/INDEX.md](../docs/adr/INDEX.md) : Architecture Decision Records (ADR)
- [../docs/17-E2E-TESTS-GUIDE.md](../docs/17-E2E-TESTS-GUIDE.md) : guide d'exécution des tests E2E Playwright

### Quick Links

- **🚀 Nouveau sur le projet ?** → [1-GETTING-STARTED.md](1-GETTING-STARTED.md)
- **🎨 Utiliser le Design System ?** → [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)
- **🐛 Problème technique ?** → [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)
- **🎓 RNCP ?** → [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)

---

## 🎨 Design System (Externe)

> **Repository séparé** : [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system)
> **Package NPM** : `@stockhub/design-system` (version définie dans [`package.json`](../package.json))
> **Storybook** : [Documentation interactive](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)

### Documentation Design System

**Dans ce repository (Frontend)** :

- [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md) ⭐ **Web components dans React, ajout d'un composant au Design System**
- [V2/DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md) - Architecture wrappers React
- [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md) - Résolution problèmes courants

**Dans le repository Design System** :

- [README](https://github.com/SandrineCipolla/stockhub_design_system#readme) - Vue d'ensemble
- [Storybook interactif](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/) - Documentation + playground
- [CHANGELOG](https://github.com/SandrineCipolla/stockhub_design_system/blob/main/CHANGELOG.md) - Historique versions

### Composants Disponibles

Les composants sont répartis en trois catégories, atoms, molecules et organisms. Leur nombre et leur liste évoluent avec le Design System, le Storybook fait foi.

**Liste complète et documentation interactive** : [Storybook](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)

**Version actuelle** : Gérée via [`package.json`](../package.json)

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

### Sécurité

- [../SECURITY.md](../SECURITY.md) - Politique de sécurité (versions supportées, signalement)
- [security/SECURITY-VULNERABILITIES.md](security/SECURITY-VULNERABILITIES.md) - Journal des vulnérabilités découvertes et corrigées

---

## 📅 Planning & Roadmaps

Le suivi courant est sur le [GitHub Project](https://github.com/users/SandrineCipolla/projects/3) et dans les issues. Les plannings et roadmaps de 2025 sont archivés dans [archive/planning/](archive/planning/).

---

## 📅 Sessions de Développement

### Index Sessions

- [7-SESSIONS.md](7-SESSIONS.md) ⭐ **Index chronologique complet**
- [sessions/](sessions/) : un fichier par session

---

## 🎓 RNCP Certification ⭐

### Documentation Essentielle RNCP

- [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md) ⭐ **IMPORTANT** - Suivi compétences et livrables
- [technical/AI-DECISIONS.md](technical/AI-DECISIONS.md) ⭐ - Décisions architecturales (C2.5)
- [7-SESSIONS.md](7-SESSIONS.md) ⭐ - Index chronologique sessions

### Accomplissements de novembre 2025

✅ **Complété** :

- Design System externe créé, avec son Storybook
- Tests des wrappers terminés (issue #24), 7 wrappers sur 7 couverts
- Audit accessibilité WCAG AA (Issue #10) - 100% conforme
- Migration Analytics (Issue #9) - 100% Design System
- Bug recherche résolu (Issue #33) - SearchInputWrapper créé

📊 **Métriques** : elles ne sont pas recopiées ici, elles seraient fausses au premier changement. Voir les badges du README et [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md).

### Améliorations & Issues

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

### Prompts et audits des sessions Claude Code

- [archive/prompts/INDEX.md](archive/prompts/INDEX.md) : prompts d'audit et de correction écrits entre février et mars 2026, tous déjà exécutés
- [archive/audits/INDEX.md](archive/audits/INDEX.md) : résultats de ces audits, diagnostics et investigations, datés

### Sessions Archivées

- [archive/recaps/RECAP-29-OCTOBRE.md](archive/recaps/RECAP-29-OCTOBRE.md) - Session 29 Oct
- [archive/recaps/RECAP-21-OCTOBRE.md](archive/recaps/RECAP-21-OCTOBRE.md) - Session 21 Oct
- [archive/recaps/RECAP-14-OCTOBRE.md](archive/recaps/RECAP-14-OCTOBRE.md) - Session 14 Oct

### Design System (Archivé - Docs obsolètes)

- [archive/design-system/DESIGN-SYSTEM-INTEGRATION.md](archive/design-system/DESIGN-SYSTEM-INTEGRATION.md)
- [archive/design-system/DESIGN-SYSTEM-LEARNINGS.md](archive/design-system/DESIGN-SYSTEM-LEARNINGS.md)
- [archive/design-system/DESIGN-SYSTEM-IMPROVEMENTS.md](archive/design-system/DESIGN-SYSTEM-IMPROVEMENTS.md)
- [archive/design-system/DESIGN-SYSTEM-FEEDBACK.md](archive/design-system/DESIGN-SYSTEM-FEEDBACK.md)
- [archive/STOCKHUB-V2-INTEGRATION.md](archive/STOCKHUB-V2-INTEGRATION.md) - ⚠️ Remplacé par [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)

### Planning (Archivé)

- [archive/planning/PLANNING-PROCHAINES-SESSIONS.md](archive/planning/PLANNING-PROCHAINES-SESSIONS.md)

### Status Docs (Archivé)

- [archive/status/ETAT-IA-BUSINESS-INTELLIGENCE.md](archive/status/ETAT-IA-BUSINESS-INTELLIGENCE.md) - 100% complété

### PR Analyses (Archivé)

- [archive/pr-analyses/](archive/pr-analyses/) - Analyses PR anciennes

---

## 📊 Structure de la Documentation

```
docs/
├── 0-INDEX.md (ce fichier)             # 📍 Point d'entrée
├── 1-GETTING-STARTED.md                # 🚀 Démarrage rapide
├── 2-WEB-COMPONENTS-GUIDE.md          # 🎨 Guide web components
├── 4-TROUBLESHOOTING.md               # 🐛 Debug
├── 5-TESTING-GUIDE.md                 # 🧪 Pyramide de tests & audits
├── 6-ACCESSIBILITY.md                 # ♿ Accessibilité
├── 7-SESSIONS.md                      # 📅 Index sessions
├── 8-RNCP-CHECKLIST.md                # 🎓 RNCP
├── 9-DASHBOARD-QUALITY.md             # 📊 Manuel technique UI Dashboard
├── 14-CI-CD-WORKFLOWS.md              # 🔄 CI/CD workflows
├── 15-APP-QUALITY-METRICS.md          # 🎯 Source de Vérité Unique (SSOT)
│
├── archive/
│   └── metrics/                       # 📦 Guides métriques archivés (10, 11, 12, 13)
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
    ├── planning/                       # Plannings et roadmaps 2025
    ├── status/                         # Status docs complétés
    ├── pr-analyses/                    # Analyses PR archivées
    └── STOCKHUB-V2-INTEGRATION.md     # Intégration DS (obsolète)
```

---

## 🔍 Recherche Rapide

### Par Besoin

| Besoin                      | Document                                                   |
| --------------------------- | ---------------------------------------------------------- |
| **Installer le projet**     | [1-GETTING-STARTED.md](1-GETTING-STARTED.md)               |
| **Utiliser web components** | [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md)     |
| **Problème technique**      | [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md)               |
| **Écrire des tests**        | [5-TESTING-GUIDE.md](5-TESTING-GUIDE.md#pyramide-de-tests) |
| **Accessibilité**           | [6-ACCESSIBILITY.md](6-ACCESSIBILITY.md)                   |
| **Sessions développement**  | [7-SESSIONS.md](7-SESSIONS.md)                             |
| **Suivi RNCP**              | [8-RNCP-CHECKLIST.md](8-RNCP-CHECKLIST.md)                 |

### Par Sujet

**Architecture**

- Frontend : [V2/ARCHITECTURE.md](V2/ARCHITECTURE.md)
- TypeScript : [V2/TYPESCRIPT.md](V2/TYPESCRIPT.md)
- Wrappers : [V2/DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md)

**Design System**

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

1. **Numérotation** : guides principaux numérotés dans l'ordre de lecture recommandé
2. **Tous les docs en Markdown** (.md)
3. **Structure claire** avec sommaire
4. **Exemples de code** avec syntax highlighting
5. **Références croisées** entre documents
6. **Archivage** plutôt que suppression (historique RNCP)
7. **Organisation thématique** (sessions/, technical/, archive/, etc.)

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
- **Démo Live** : https://brave-field-03611eb03.5.azurestaticapps.net/
- **React Docs** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/docs/

### Issues GitHub

Créer une issue : https://github.com/SandrineCipolla/stockHub_V2_front/issues

---

**Projet** : StockHub V2 - RNCP 7
