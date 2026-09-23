# ✅ Checklist Interactive RNCP 7 - Expert en Architecture et Développement Logiciel

## Projet StockHub - Validation V1/V2

_📝 Instructions : Cochez les cases ☑️ au fur et à mesure de vos réalisations et ajoutez vos notes personnelles._

> **Rafraîchi le 23/09/2026** — passe de vérification contre l'état réel du
> projet (wiki `Qualite-et-Metriques`, `CICD-et-Deploiement`,
> `Gestion-Issues-et-Planning`, ADR des 3 repos, Second Brain Obsidian).
> Ce fichier avait dérivé : plusieurs items marqués "à faire" étaient déjà
> faits (CI/CD, tests, RGPD, éco-conception...). Un item non coché ici
> signifie vérifié absent, pas "pas encore vérifié" — sauf mention contraire.

---

## **🎯 STATUT GLOBAL DU PROJET**

### 📊 **Avancement Global**

- [ ] **Bloc 1** - Planification projet (C1.2 veille fait ; C1.1/C1.3/C1.4 partiels)
- [x] **Bloc 2** - Développement solutions (Frontend V2 85/100, Backend DDD/CQRS avec 20 ADR — les deux solides)
- [ ] **Bloc 3** - Mise en production (CI/CD + monitoring déjà opérationnels, tests sécurité OWASP et blue/green restent à faire)
- [ ] **Bloc 4** - Management équipe (0/4 actions - contexte solo, simulation non démarrée)
- [x] **Compétences transversales** - Anglais (veille EN via `veille-widget` + daily.dev) & Numérique responsable (EcoIndex Grade A) — acquis

**🎯 Objectif certification : 80% minimum par bloc**

### 🎤 **Format des soutenances**

**Pour chaque bloc :** Dossier écrit + 20min présentation + 20min entretien avec jury (2 professionnels minimum)
**Total :** 4 soutenances × 40min = **160 minutes d'évaluation**

---

## **BLOC 1 : PLANIFIER ET ORGANISER**

### **C1.1 - Étude de faisabilité** _(Ce1.1.1 à Ce1.1.3)_

#### ✅ **Déjà fait**

- [x] Analyse métier (problématique gestion stocks familiale)
- [x] Public cible défini (usage familial)
- [x] Stack technique choisie et justifiée (20 ADR back, 12 ADR front)

#### 📋 **À faire** _(vérifié absent le 23/09/2026)_

- [ ] **Analyse financière ROI**
  - [ ] Estimation coûts développement
  - [ ] Budget hébergement/maintenance
  - [ ] Étude comparative concurrentielle
  - 📝 _Notes personnelles :_
  - ***

- [ ] **Matrice des risques**
  - [ ] Identification risques techniques
  - [ ] Plans de mitigation
  - [ ] Estimation impact/probabilité
  - 📝 _Notes personnelles :_
  - ***

- [ ] **Analyse PESTEL du secteur**
  - [ ] Facteurs politiques, économiques, sociaux
  - [ ] Tendances technologiques
  - [ ] Contraintes légales, environnementales
  - 📝 _Notes personnelles :_
  - ***

### **C1.2 - Plan de veille technologique** _(Ce1.2.1 à Ce1.2.3)_ ✅ **FAIT**

#### ✅ **Complété le 23/09/2026**

- [x] Stack moderne utilisée (React 19, TypeScript 5.8)
- [x] Innovation IA prévue et livrée (OpenRouter + Mistral, [ADR-013](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-013-llm-provider-local-vs-cloud.md)/[015](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-015-openrouter-mistral-ai-service.md))
- [x] **Documentation veille formelle** — section [Veille technologique](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Architecture-Decision-Records#veille-technologique) publiée dans le wiki (issue [#90](https://github.com/SandrineCipolla/stockHub_V2_front/issues/90), fermée)
  - [x] Sources listées : `veille-widget` (Tavily, 9 topics EN/FR, pipeline automatisé), daily.dev (flux perso), GitHub Dependabot
  - [x] Outils monitoring définis : cron GitHub Actions quotidien + hebdo, archivage wiki daté
- [x] **Analyse comparative frameworks** — benchmark technique complet (Azure AD B2C vs Auth0 vs Clerk, grille pondérée + radar) dans le Second Brain (`stockhub-veille.md`), pas encore une ADR formelle
  - 📝 _Migration Auth non engagée — à trancher si le sujet ressort en soutenance_
- [x] **Veille anglophone documentée** — 6 des 10 topics `veille-widget` sont en anglais, daily.dev en anglais ; récap **hebdomadaire** en français (mieux que la synthèse mensuelle demandée)

### **C1.3 - Cahier des charges fonctionnel** _(Ce1.3.1 à Ce1.3.4)_

#### ✅ **Bien avancé — mis à jour 23/09/2026**

- [x] Cas d'usage définis
- [x] Accessibilité RGAA implémentée (WCAG AA 94/100, 100% conforme sur les critères testés)
- [x] Architecture technique documentée (12 ADR front, 20 ADR back, page wiki `Architecture-Globale`)
- [x] **Conformité réglementaire détaillée** — RGPD traité en profondeur : `CookieBanner`, page `/privacy`, tableau des traitements, base légale par donnée (voir wiki `Qualite-et-Metriques` § Conformité RGPD, PR #83)
- [x] **Éco-conception mesurée** — EcoIndex **Grade A** (objectif était Grade C+, largement dépassé)

#### 📋 **À compléter**

- [ ] **Spécifications performance**
  - [x] Lighthouse Performance 99/100, SEO 100/100 (objectif >90 dépassé)
  - [ ] Accessibilité 94/100, objectif interne >95 — encore en cours
  - [ ] SLA temps de réponse backend (<2s) — pas de mesure formalisée trouvée
  - 📝 _Notes personnelles :_
  - ***

### **C1.4 - Plan projet détaillé** _(Ce1.4.1 à Ce1.4.4)_

#### ✅ **Existe déjà — pas "à faire entièrement"**

- [x] **Outil de gestion projet** — GitHub Projects avec board, labels de priorité P0–P4, champ "Estimation" (XS à XL), voir wiki `Gestion-Issues-et-Planning`
- [x] Backlog priorisé (règle de complétude d'issue documentée : scope, type, priorité, estimation, milestone)

#### 📋 **À faire**

- [ ] **Méthodologie Agile formalisée**
  - [ ] Sprints de 2 semaines explicites (le board fonctionne en continu, pas en sprints formels)
  - [ ] Cérémonies Scrum (daily, retro, review) — non applicable en solo sans adaptation
  - 📝 _Notes personnelles :_
  - ***

- [ ] **Indicateurs de performance**
  - [x] Code coverage suivi : 74.97% global, 90-100% sur composants critiques (objectif 80% atteint sur le périmètre critique)
  - [ ] Velocity équipe, burndown charts — non pertinents en solo sans adaptation pour la soutenance
  - 📝 _Notes personnelles :_
  - ***

---

## **BLOC 2 : CONCEVOIR ET DÉVELOPPER**

### **C2.1 - Architecture logicielle** _(Ce2.1.1 à Ce2.1.6)_

#### ✅ **Acquis V2**

- [x] Design system complet avec tokens
- [x] Accessibilité RGAA conforme
- [x] Éco-conception (tree shaking, lazy loading, bundle 113.99 KB gzippé)
- [x] Architecture DDD backend validée (wiki `Qualite-et-Metriques` § Backend)
- [x] Schéma d'architecture globale — page wiki `Architecture-Globale` existe (vérifier son niveau de détail avant la soutenance)

#### 📋 **À ajouter** _(vérifié absent le 23/09/2026)_

- [ ] **Diagrammes UML complets**
  - [ ] Diagramme de classes (entités métier)
  - [ ] Diagramme de séquence (flux utilisateur)
  - [ ] Diagramme de composants (architecture)
  - 📝 _Les ADR documentent les décisions mais pas de diagrammes UML formels trouvés_
  - ***

- [ ] **Documentation sécurité formelle OWASP**
  - [ ] Analyse menaces OWASP Top 10 explicite
  - [ ] Matrice risques/contre-mesures
  - 📝 _Sécurité pratiquée (0 route non protégée, npm audit en CI, Dependabot) mais pas de document d'analyse de menaces dédié_
  - ***

### **C2.2 - Développement continu** _(Ce2.2.1 à Ce2.2.6)_

#### ✅ **Fait — CI/CD opérationnel sur les 3 repos**

- [x] Git avec bonnes pratiques (GitHub Flow, [ADR-018](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-018-github-flow.md))
- [x] ESLint + TypeScript strict (0 erreur, 0 warning)
- [x] Sécurité HTTPS + Azure AD
- [x] **GitHub Actions configuré** — pipeline `quality → test → build → lighthouse-ci` sur le front, `continuous-integration → security-audit → e2e-tests → build-and-deploy` sur le back (wiki `CICD-et-Deploiement`)
- [x] **Tests automatisés intégrés** — 464 tests Vitest (front), 304 tests Jest (back)
- [x] **Shift-left security** — `security-audit` bloque le merge si vuln high/critical (`npm audit --audit-level=high`), Dependabot actif depuis juin 2026

#### 📋 **Reste à faire**

- [ ] **Métriques qualité automatisées type SonarCloud**
  - [ ] SonarCloud non intégré — TypeScript strict + ESLint + Knip (code mort) utilisés à la place
  - [ ] Coverage 80% : atteint sur composants critiques (90-100%), pas encore sur le global (74.97%)
  - [ ] Complexité cyclomatique surveillée — pas d'outil dédié trouvé
  - 📝 _À décider : ouvrir SonarCloud ou documenter l'outillage actuel comme équivalent assumé_
  - ***

- [ ] **Analyse sécurité CodeQL**
  - [ ] Pas de job CodeQL trouvé dans les workflows — `npm audit` couvre les dépendances, pas l'analyse statique du code applicatif
  - 📝 _Notes personnelles :_
  - ***

### **C2.3 - Développement frontend** _(Ce2.3.1 à Ce2.3.4)_ ✨

#### ✅ **EXCELLENCE - Validation encadrante 85/100**

- [x] React, TypeScript en mode strict et Vite, versions dans `package.json`
- [x] Design System avec tokens CSS cohérents
- [x] Responsive Mobile First
- [x] Accessibilité RGAA (WAVE: 0 erreur, 94/100 Lighthouse Accessibilité — en amélioration continue)
- [x] Performance exceptionnelle (Lighthouse 99/100)
- [x] Éco-conception (EcoIndex A - 88.42)
- [x] Documentation GitHub niveau professionnel
- [x] Optimisations modernes (tree shaking, lazy loading)
- [x] **Tests unitaires sécurisants** — Vitest + React Testing Library, 464 tests, 90-100% sur composants/hooks/pages critiques ([Ce2.3.4](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Qualite-et-Metriques) justifié explicitement dans le wiki)

#### 📋 **Reste à vérifier / faire**

- [ ] **Créativité visuelle renforcée**
  - [ ] Différenciation cartes stocks par statut (couleurs, icônes) — pas de preuve trouvée que c'est livré
  - [ ] Micro-animations métriques dashboard — idem
  - 📝 _Améliorations visuelles faites le : ***/***/_____

- [x] **IA plus concrète et visible côté front** — vérifié le 23/09/2026, livré à 3 endroits
  - [x] Le backend expose des suggestions IA réelles (`GET /api/v2/stocks/{stockId}/suggestions`, [ADR-015](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-015-openrouter-mistral-ai-service.md))
  - [x] Dashboard — widget résumé, top 5 suggestions ([Dashboard.tsx:350](../src/pages/Dashboard.tsx))
  - [x] Détail d'un stock — bannière complète ([StockDetailPage.tsx:371](../src/pages/StockDetailPage.tsx))
  - [x] Carte stock — badge de comptage `iaCount` (`StockCardWrapper.tsx`)
  - [x] Distinction visuelle LLM vs déterministe (badges "IA"/"Calcul", footer "Propulsé par IA • Mistral via OpenRouter") — [AIAlertBannerWrapper.tsx](../src/components/ai/AIAlertBannerWrapper.tsx)
  - 📝 _Rien à faire ici, item clos_

### **C2.4 - Développement backend** _(Ce2.4.1 à Ce2.4.4)_

#### ✅ **Fait — au-delà des bonnes bases V1**

- [x] Architecture DDD
- [x] API REST `/api/v2/stocks` ([ADR-016](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-016-rest-api-style.md))
- [x] MySQL + migrations Prisma
- [x] Authentification Azure AD
- [x] **Tests unitaires TDD** — 304 tests Jest, entités/Value Objects couverts ([ADR-004](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-004-tests-value-objects-entities.md))
- [x] **Documentation API OpenAPI** — Swagger UI actif (`SWAGGER_ENABLED=true`, endpoints visibles et testables, cf. [ADR-015](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-015-openrouter-mistral-ai-service.md))
- [x] **Requêtes optimisées** — Index SQL optimisés (wiki `Qualite-et-Metriques` § Backend)

#### 📋 **Décision assumée, pas un gap**

- [ ] **Cache Redis** — délibérément **non retenu** : le cache des suggestions IA vit dans la table `stock_predictions` (MySQL déjà en place), voir [ADR-015](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-015-openrouter-mistral-ai-service.md) alternative 4 ("le vrai coût à éviter est l'appel LLM, pas la lecture DB"). Ne pas présenter comme une dette — c'est une ADR argumentée.

### **C2.5 - IA et données massives** _(Ce2.5.1 à Ce2.5.4)_

#### ✅ **Fait — reformulé par rapport à l'ambition initiale**

- [x] **Intégration LLM** — OpenRouter + Mistral plutôt qu'OpenAI direct ([ADR-013](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-013-llm-provider-local-vs-cloud.md)), suggestions d'achat via `StockSuggestionsController`
- [x] **Modèle prédictif** — algorithmes déterministes (`avgDailyConsumption`, `daysUntilEmpty`, `detectTrend`) plutôt que ML/régression linéaire, choix argumenté par un spike ([ADR-014](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-014-stock-prediction-deterministic.md)) — 170 tests unitaires
- [x] **Alertes proactives** — prédictions de rupture exposées via l'API

#### 📋 **Reste à faire**

- [ ] **Analytics et métriques**
  - [x] Vercel Analytics activé (perf, visites — wiki `CICD-et-Deploiement` § Monitoring)
  - [ ] Dashboard analytics avancé / collecte comportementale anonymisée — pas trouvé
  - 📝 _Notes personnelles :_
  - ***

---

## **BLOC 3 : MISE EN PRODUCTION**

### **C3.1 - Intégration continue** _(Ce3.1.1 à Ce3.1.4)_

#### ✅ **Fait**

- [x] **GitHub Actions opérationnel** sur les 3 repos (voir C2.2)
- [x] Pull requests utilisées comme flux principal (GitHub Flow, [ADR-018](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-018-github-flow.md))

#### 📋 **À vérifier / faire**

- [ ] **Branch protection rules** — pas vérifié explicitement (`gh api repos/.../branches/main/protection`) cette session
- [ ] **Conformité RGPD automatisée** — RGPD est conçu dans l'app (voir C1.3) mais pas de tests automatisés dédiés (audit logs, anonymisation) trouvés en CI
  - 📝 _Notes personnelles :_
  - ***

### **C3.2 - Tests automatisés** _(Ce3.2.1 à Ce3.2.4)_

#### ✅ **Fait — suite de tests réelle et large**

- [x] **Tests unitaires** — 464 tests Vitest (front), 304 tests Jest (back)
- [x] **Tests End-to-End** — Playwright sur front ([ADR-011](https://github.com/SandrineCipolla/stockHub_V2_front/blob/main/docs/adr/ADR-011-playwright-auth-reelle.md), auth Azure B2C réelle, 5/5 verts) et sur back (job `e2e-tests`, cron hebdo)

#### 📋 **À faire**

- [ ] **Tests d'intégration** explicitement isolés — pas de job CI dédié distinct des tests unitaires/E2E trouvé
- [ ] **Tests sécurité OWASP** — `npm audit` couvre les dépendances connues, mais pas de tests actifs d'injection SQL ou XSS trouvés
  - 📝 _Outils sécurité utilisés :_
  - ***

### **C3.3 - Surveillance continue** _(Ce3.3.1 à Ce3.3.4)_

#### ✅ **Fait**

- [x] **Azure Application Insights** — actif en production (logs, traces, erreurs), utilisé concrètement lors de l'incident [prod-migration-drift](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/troubleshooting/prod-migration-drift.md) pour diagnostiquer une 500 en prod
- [x] **Logs structurés côté front** — `logger.ts`, pattern `noop` prod-safe, niveaux debug/info/warn/error documentés (wiki `Qualite-et-Metriques`)

#### 📋 **À faire / décision assumée**

- [ ] **Sentry** — non utilisé, Application Insights joue ce rôle côté back. Décision à documenter plutôt qu'un gap si le sujet ressort en soutenance.
- [ ] **Alertes automatiques configurées** — App Insights collecte, mais pas de règle d'alerte (seuil, notification) confirmée
- [ ] **Logs structurés backend en JSON** — non confirmé (le format exact des logs Application Insights côté backend reste à vérifier)
  - 📝 _Notes personnelles :_
  - ***

### **C3.4 - Déploiement continu** _(Ce3.4.1 à Ce3.4.4)_

#### ✅ **Fait**

- [x] **Azure App Service configuré** — prod backend (zip deploy), Vercel prod/staging front
- [x] **Environnements dev/staging/prod** — table complète dans wiki `CICD-et-Deploiement` et page dédiée `Environnements`
- [x] **Variables environnement sécurisées** — secrets GitHub Actions par environnement
- [x] **SSL automatique** — géré nativement par Vercel/Azure

#### 📋 **À faire**

- [ ] **Blue/Green deployment** — non implémenté ; `build-and-deploy` sérialise les déploiements sur `main` (évite les 409 Azure) mais ce n'est pas du blue/green ni un rollback automatique
- [ ] **Feedback utilisateurs intégré** — pas de système de feedback in-app trouvé
- [ ] **A/B testing** — non applicable à ce stade
  - 📝 _Notes personnelles :_
  - ***

---

## **BLOC 4 : MANAGEMENT D'ÉQUIPE** _(Adaptation projet individuel)_

> **Non démarré** — confirmé lors de cette passe. Contexte solo sur toute la durée du projet, aucune simulation de rôles/RACI trouvée dans les 3 repos ni dans le Second Brain. Pas de changement par rapport à la version précédente de ce fichier.

### **C4.1 - Définition besoins compétences** _(Ce4.1.1 à Ce4.1.4)_

#### 📋 **Simulation contexte équipe**

- [ ] **Rôles théoriques définis**
  - [ ] Dev Frontend React/TypeScript
  - [ ] Dev Backend Node.js/Express
  - [ ] DevOps Azure/Docker
  - [ ] UX/UI Designer
  - 📝 _Organigramme équipe simulée :_
  - ***

- [ ] **Matrice RACI créée**
  - [ ] Responsabilités par rôle
  - [ ] Interactions entre équipes
  - [ ] Points de synchronisation
  - 📝 _RACI principal défini le :_
  - ***

### **C4.2 - Constitution équipe** _(Ce4.2.1 à Ce4.2.3)_

#### 📋 **Fiches de poste détaillées**

- [ ] **Job descriptions par rôle**
  - [ ] Compétences techniques requises
  - [ ] Soft skills nécessaires
  - [ ] Niveau d'expérience attendu
  - 📝 \_Fiches créées pour ___/4 rôles_

- [ ] **Plan formation interne**
  - [ ] Montée en compétences React 19
  - [ ] Formation sécurité OWASP
  - [ ] Sensibilisation accessibilité
  - 📝 _Plan formation défini le :_
  - ***

### **C4.3 à C4.6 - Management opérationnel**

#### 📋 **Organisation agile**

- [ ] **Métriques performance équipe**
  - [ ] Velocity par sprint
  - [ ] Quality metrics (bugs/features)
  - [ ] Satisfaction équipe
  - 📝 _KPI équipe suivis :_
  - ***

- [ ] **Feedback et développement**
  - [ ] One-on-ones simulés
  - [ ] Plans développement personnel
  - [ ] Formation continue
  - 📝 _Processus feedback défini :_
  - ***

---

## **COMPÉTENCES TRANSVERSALES**

### **🌍 Anglais technique**

#### ✅ **Acquis — mis à jour 23/09/2026**

- [x] Documentation technique en anglais
- [x] Stack internationale utilisée
- [x] **Veille technologique anglophone** — 6/10 topics `veille-widget` en anglais + daily.dev, compte-rendu en français **hebdomadaire** (dépasse l'exigence mensuelle), impact tracé sur les choix techniques (voir section wiki Veille technologique)

#### 📋 **À renforcer**

- [ ] **Communication professionnelle**
  - [ ] Issues GitHub en anglais — actuellement en français
  - [ ] Documentation API bilingue — Swagger existe mais langue non vérifiée
  - [ ] Présentation technique en anglais — à préparer pour l'entretien jury
  - 📝 _Niveau anglais évalué :_
  - ***

### **🌱 Numérique responsable**

#### ✅ **Fait — objectif dépassé**

- [x] Optimisations performance Vite
- [x] Tree shaking et lazy loading
- [x] Bundle size optimisé (113.99 KB gzippé)
- [x] **Test EcoIndex** — Grade **A** (88.42), objectif Grade C+ largement dépassé
- [x] **Core Web Vitals** — couverts par Lighthouse 99/100 Performance

#### 📋 **Reste à faire**

- [ ] **Carbon footprint estimé** — pas de métrique carbone dédiée au-delà d'EcoIndex
  - 📝 _Notes personnelles :_
  - ***

---

## **📅 PLANNING DE RÉALISATION - MARS 2027**

> ⚠️ Section non ré-auditée intégralement cette session (dates de phases
> passées, contenu partiellement obsolète). Les items ci-dessus (Blocs 1-3,
> transversales) sont la source à jour. À reprendre dans une session dédiée
> si ce planning doit encore servir de référence pour la suite.

_Point de départ : Octobre 2025_

### **🎯 PHASE 1 : AMÉLIORATION & FEEDBACK** _(Oct 2025 - Déc 2025 - 3 mois)_

- [x] **✅ Retours encadrante Frontend V2 - 85/100 reçus**
  - [x] **Points forts identifiés** : Interface pro, design system mature, performance excellente
  - [ ] **Améliorations créativité** : Différenciation visuelle cartes stocks par statut — non confirmé livré
  - [ ] **Micro-animations** : Ajouter animations sur métriques dashboard — non confirmé livré
  - [x] **Tests unitaires** : Vitest + React Testing Library — fait (464 tests)
  - [x] **IA plus concrète** : backend (ADR-013/014/015) + front (Dashboard, StockDetailPage, StockCardWrapper) — vérifié 23/09/2026

- [ ] **Retours encadrant Backend V1**
  - 📝 _Non vérifié cette session_

- [ ] **Gestion projet - Retours encadrants**
  - 📝 _Non vérifié cette session_

---

### **📋 PHASE 2 : MIGRATION & INTÉGRATION** _(Jan 2026 - Mai 2026 - 5 mois)_

- [x] **Migration Frontend V1→V2** — connexion API backend, gestion d'état React : confirmée par les 12 ADR front et l'usage réel de `/api/v2`
- [x] **Tests automatisés complets** — Vitest + Playwright sur l'app, coverage >80% sur le périmètre critique
- [x] **Pipeline CI/CD** — GitHub Actions opérationnel sur les 3 repos, déploiement automatique Azure/Vercel

---

### **🚀 PHASE 3 : INNOVATION & PRODUCTION** _(Juin 2026 - Déc 2026 - 7 mois)_

- [ ] **Architecture documentée** — ADR complets (20 back, 12 front) et pages wiki, mais **pas de diagrammes UML formels** (voir C2.1)
- [x] **Monitoring & Observabilité** — Azure Application Insights actif, utilisé en conditions réelles (incident migration Prisma)
- [x] **Intégration IA** — OpenRouter/Mistral en production, prédictions déterministes livrées (choix différent de l'ambition initiale "OpenAI API", argumenté par ADR)

---

### **🔧 PHASE 4 : CERTIFICATION RNCP** _(Jan - Mars 2027 - 3 mois)_

- [ ] **Dossiers de certification**
  - [x] Veille technologique documentée (C1.2, fait le 23/09/2026)
  - [ ] 4 dossiers écrits structurés — à rédiger
  - [ ] Analyse comparative et ROI — voir C1.1, pas fait
- [ ] **Préparations soutenances** — à venir
- [ ] **Finalisation projet** — à venir

📝 _Notes Phase 4 - Certification :_

---

### **🎤 SOUTENANCES RNCP** _(Mars 2027)_

- [ ] **Soutenance Bloc 1** : ___/03/2027 _(Planification projet)_
- [ ] **Soutenance Bloc 2** : ___/03/2027 _(Solutions techniques)_
- [ ] **Soutenance Bloc 3** : ___/03/2027 _(Mise en production)_
- [ ] **Soutenance Bloc 4** : ___/03/2027 _(Management équipe)_

---

## **🎯 OBJECTIFS DE VALIDATION**

### **📊 Métriques cibles — valeurs réelles au 23/09/2026**

Les valeurs à jour se lisent dans [9-DASHBOARD-QUALITY.md](9-DASHBOARD-QUALITY.md), les badges du README, et le wiki `Qualite-et-Metriques`.

- [x] **Performance** : Lighthouse 99/100 (objectif >90 dépassé)
- [ ] **Tests** : 74.97% coverage global (objectif 80% — atteint sur composants critiques à 90-100%, pas encore global)
- [x] **Sécurité** : 0 vulnérabilité npm critique, `security-audit` bloquant en CI
- [x] **Accessibilité** : RGAA, WCAG AA 94/100 (amélioration continue vers 95+)
- [x] **Éco-conception** : EcoIndex Grade A (objectif dépassé)

### **📋 Livrables certification**

- [ ] **Dossier Bloc 1** : Planification + veille _(veille C1.2 fait ; ROI/risques/PESTEL restent)_
- [x] **Dossier Bloc 2** : Solution technique _(✅ Frontend V2 85/100, Backend DDD/CQRS 20 ADR)_
- [ ] **Dossier Bloc 3** : Mise en production _(CI/CD + monitoring opérationnels ; UML, OWASP formel, blue/green restent)_
- [ ] **Dossier Bloc 4** : Management équipe _(non démarré — contexte solo)_

---

## **📝 NOTES PERSONNELLES & IDÉES**

### **💡 Idées d'amélioration**

---

---

---

### **🚧 Difficultés rencontrées**

---

---

---

### **🎉 Réussites & apprentissages**

---

---

---

### **📞 Contacts utiles**

- **Formateur/Tuteur** : ________________
- **Jury certification** : ________________
- **Experts techniques** : ________________

---

**🎯 Objectif final : Validation RNCP 7 avec excellence ! (4 × 40min de soutenance)**

_📅 Dernière mise à jour : 23/09/2026_
