# Audit RNCP — État réel du code et issues ouvertes

**Date** : 26 mars 2026
**Analysé par** : Claude Code (claude-sonnet-4-6)
**Repos analysés** : stockhub_back · stockHub_V2_front · stockhub_design_system

---

## Section 1 — Résumé exécutif

| Critère          | Statut code                                                        | Issues liées                   | Priorité |
| ---------------- | ------------------------------------------------------------------ | ------------------------------ | -------- |
| C2.3 Frontend    | ✅ Validé (99 perf, 94 a11y, 84.5% stmts / 69.9% fonctions)        | #51, #35, #59                  | Moyenne  |
| C2.4 Backend     | ✅ Validé (DDD/CQRS, OpenAPI, CI)                                  | #83, #131                      | Moyenne  |
| C2.5 Module IA   | ⚠️ Partiel (déterministe OK, LLM non connecté)                     | #118, #119, back#124, back#134 | Haute    |
| C3.1 CI/CD       | ✅ Validé (6 pipelines front, 3 back, CD auto)                     | —                              | Basse    |
| C3.2 Tests       | ⚠️ Partiel (84.5% front, LandingPage 0%, E2E non implémentés)      | #35, #66, #101, back#43        | Haute    |
| C3.3 Monitoring  | ⚠️ Partiel (logger structuré présent, pas de /health ni metrics)   | back#133                       | Moyenne  |
| C3.4 Déploiement | ✅ Validé (Azure SWA prod + Vercel preview + Render staging)       | —                              | Basse    |
| Sécurité OWASP   | ⚠️ Partiel (TruffleHog non-bloquant, dépendances vulnérables back) | #84, back#83                   | Haute    |

---

## Section 2 — Issues ouvertes classées par priorité RNCP

### 🔴 Critique (bloque ou fragilise la validation)

| #         | Repo     | Titre                                                                   | Critère RNCP |
| --------- | -------- | ----------------------------------------------------------------------- | ------------ |
| back#134  | Backend  | PR : feat/123-item-history-prediction-service (non mergée)              | C2.5         |
| back#124  | Backend  | AIService — suggestions textuelles via LLM (OpenRouter)                 | C2.5         |
| back#123  | Backend  | Module prédictions déterministes — ItemHistory + StockPredictionService | C2.5         |
| front#118 | Frontend | brancher mlSimulation.ts et aiPredictions.ts sur endpoints backend      | C2.5         |
| front#119 | Frontend | distinguer et afficher LLM vs déterministes dans Dashboard/Analytics    | C2.5         |
| front#66  | Frontend | Tests E2E complets Frontend + Backend                                   | C3.2         |
| front#101 | Frontend | Implémenter authentification interactive Playwright pour E2E            | C3.2         |
| back#43   | Backend  | E2E tests scénario CRUD complet                                         | C3.2         |
| back#83   | Backend  | Mettre à jour dépendances dev vulnérables                               | Sécurité     |

### 🟡 Important (affaiblit la validation)

| #                 | Repo     | Titre                                                                | Critère RNCP |
| ----------------- | -------- | -------------------------------------------------------------------- | ------------ |
| front#35          | Frontend | test: add coverage for untested utils and AI components              | C3.2         |
| front#59          | Frontend | fix useStocks tests after backend integration                        | C3.2         |
| front#51          | Frontend | fix(a11y): Improve accessibility score from 86 to 95+                | C2.3         |
| front#84          | Frontend | sessionStorage MSAL — cacheLocation = 'sessionStorage' (non corrigé) | Sécurité     |
| back#131          | Backend  | docs: audit et réconciliation des ADRs dans le wiki                  | C2.4         |
| back#125          | Backend  | configurer le compte démo dédié pour le seed de démonstration        | C3.4         |
| ds#33             | DS       | label-content-name-mismatch sur bouton notifications sh-header       | C2.3         |
| ds#34             | DS       | button-name sur boutons internes sh-button (Shadow DOM)              | C2.3         |
| front#LandingPage | Frontend | LandingPage.tsx : 0% coverage (pas de tests)                         | C3.2         |

### 🟢 Bonus (enrichit sans être bloquant)

| #         | Repo     | Titre                                                   | Critère RNCP |
| --------- | -------- | ------------------------------------------------------- | ------------ |
| back#135  | Backend  | cron job pour recalcul quotidien des prédictions IA     | C2.5         |
| back#133  | Backend  | suivi péremption avancé — openedAt et ProductType       | C2.5         |
| front#61  | Frontend | modal de confirmation avant suppression stock           | C2.3 UX      |
| front#122 | Frontend | catégories personnalisées de stocks                     | C2.3 UX      |
| front#121 | Frontend | aperçus visuels dans cards fonctionnalités landing page | C2.3         |
| front#62  | Frontend | format lastUpdate date avec relative time               | C2.3 UX      |
| ds#27     | DS       | contraste bouton ghost en light mode (WCAG AA)          | C2.3         |
| ds#26     | DS       | créer composant sh-feature-card                         | DS           |

### 📝 Documentaire (mémoire / wiki uniquement)

| #        | Repo     | Titre                                                  |
| -------- | -------- | ------------------------------------------------------ |
| front#90 | Frontend | Veille technologique : documenter sources RNCP Ce2.3.1 |
| front#43 | Frontend | docs: synchroniser 8-RNCP-CHECKLIST.md                 |
| front#25 | Frontend | docs: harmoniser structure documentation               |
| front#4  | Frontend | RNCP Checklist Suivi (tracker)                         |

---

## Section 3 — Ce qui peut être fermé / dépriorisé (V3)

Ces issues ne bloquent pas la validation RNCP et peuvent être reportées ou fermées :

| #        | Repo     | Titre                                         | Raison                                              |
| -------- | -------- | --------------------------------------------- | --------------------------------------------------- |
| back#79  | Backend  | discussion: architecture Stock quantity/value | Discussion ouverte, décision déjà prise en pratique |
| back#65  | Backend  | authorization Phase 4 (audit log, analytics)  | P4 — hors scope V2                                  |
| back#64  | Backend  | authorization Phase 3 (SSE/WebSockets)        | P4 — hors scope V2                                  |
| back#63  | Backend  | authorization Phase 2 (workflow suggestions)  | P3 — hors scope V2                                  |
| back#36  | Backend  | refactoring CQRS normalization                | Tech-debt non bloquant                              |
| back#126 | Backend  | spike scan code-barres                        | Feature V3                                          |
| front#49 | Frontend | automatiser génération métriques qualité      | Nice-to-have, déjà outillé                          |
| front#30 | Frontend | investigate Vercel optionalDependencies       | Non reproductible en prod                           |
| front#23 | Frontend | tech-debt: type safety après merge conflicts  | Résolu partiellement                                |
| front#16 | Frontend | feat: normalize accents dans search           | UX mineur                                           |
| front#64 | Frontend | refactor: simplify CreateStockData type       | Tech-debt cosmétique                                |
| ds#24    | DS       | Upgrade Node 22 + Storybook v10               | Déjà fait (Storybook v10 en PR #30 mergée)          |
| ds#20    | DS       | audit/éliminer hardcoded values               | P3 design-token                                     |
| ds#17    | DS       | improve button md padding                     | UI mineur                                           |
| ds#15    | DS       | setup unit testing infrastructure DS          | P2 mais long                                        |
| ds#13    | DS       | responsive design audit                       | P3                                                  |

---

## Section 4 — Séquence recommandée

### Sprint 1 — Module IA (priorité absolue, ~5j)

```
1. [back] Merger PR #134 (ItemHistory + StockPredictionService)
2. [back] Implémenter AIService LLM OpenRouter (#124)
3. [front] Brancher mlSimulation.ts + aiPredictions.ts sur endpoints backend (#118)
4. [front] Distinguer affichage LLM vs déterministe Dashboard/Analytics (#119)
5. [back] Cron job recalcul quotidien (#135) — si temps disponible
```

### Sprint 2 — Tests et couverture (priorité haute, ~3j)

```
6. [front] Ajouter tests LandingPage.tsx (coverage 0% → 80%+)
7. [front] Couvrir utils et AI components (#35) — aiPredictions, unitFormatter
8. [front] Fix useStocks tests après intégration backend (#59)
9. [back] E2E tests CRUD (#43) + Playwright E2E front (#66/#101)
```

### Sprint 3 — Sécurité et accessibilité (priorité haute, ~2j)

```
10. [back] Mettre à jour dépendances vulnérables (#83)
11. [front] Investiguer issue #84 (sessionStorage MSAL — peut-être déjà OK, à requalifier)
12. [front] Passer TruffleHog en continue-on-error: false (sécurité bloquante)
13. [ds] Fix sh-header label-content-name-mismatch (#33) → a11y 94 → 96+
14. [ds] Fix sh-button button-name Shadow DOM (#34)
```

### Sprint 4 — Compte démo + Documentation (priorité moyenne, ~2j)

```
14. [back] Configurer compte démo + seed (#125)
15. [back] Réconcilier ADRs dans le wiki (#131)
16. [front] Veille technologique documentée (#90)
```

### Sprint 5 — Module IA avancé (si temps, ~8-10j)

```
17. Pages "Que faire ?" (SuggestionsPage) + SuggestionCard + TutoDetailModal
18. Bibliothèque projets (ProjectsLibraryPage + ProjectCard + ProjectFormModal)
19. Page détail projet + StepperChecklist
20. ShoppingListPage + ShoppingListItem + export CSV
```

---

## Section 5 — Estimation totale

```
Critique — Module IA (back#134+#124 + front#118+#119)  : ~5j
Critique — Tests (LandingPage + utils + useStocks + E2E) : ~4j
Critique — Sécurité + a11y (#84 + back#83 + DS #33+#34) : ~2j
Important — Démo + Docs (#125 + #131 + #90)             : ~2j
Important — Module IA N2 (pages "Que faire ?", projets) : ~8-10j
Bonus — Confirmation modal, catégories, relative dates  : ~1j
----------------------------------------------------------
Total dev restant estimé                                 : ~22-24j
Journées disponibles (estimation)                        : ~20-25j
Verdict                                                  : TENDU — prioriser IA + tests, sacrifier E2E complets si besoin
```

---

## Annexe — État détaillé par repo

### REPO 1 — stockhub_back

**Issues ouvertes : 15**

| #    | Titre                                            | Labels                     | Priorité |
| ---- | ------------------------------------------------ | -------------------------- | -------- |
| #135 | cron job recalcul quotidien prédictions IA       | —                          | —        |
| #133 | suivi péremption avancé (openedAt + ProductType) | enhancement, ai            | —        |
| #131 | audit et réconciliation ADRs wiki                | documentation              | —        |
| #126 | spike scan code-barres                           | documentation, enhancement | —        |
| #125 | compte démo + seed de démonstration              | enhancement, demo, staging | —        |
| #124 | AIService — suggestions LLM OpenRouter           | enhancement, back, ai      | 🔴       |
| #123 | module prédictions déterministes (ItemHistory)   | enhancement, back, ai      | 🔴       |
| #83  | mettre à jour dépendances dev vulnérables        | back, tech, P1             | 🔴       |
| #79  | discussion architecture Stock quantity/value     | question, back, P2         | 📝       |
| #65  | authorization Phase 4 (audit log, analytics)     | enhancement, back, P4      | 🟢       |
| #64  | authorization Phase 3 (SSE/WebSockets)           | enhancement, back, P4      | 🟢       |
| #63  | authorization Phase 2 (workflow suggestions)     | enhancement, back, P3      | 🟢       |
| #44  | couche d'autorisation principale                 | enhancement, back, P2      | 📝       |
| #43  | E2E tests CRUD complet                           | enhancement, back, P1      | 🔴       |
| #36  | refactoring CQRS normalization                   | back, P2                   | 🟢       |

**PRs ouvertes : 2**

- #134 `feat/123-item-history-prediction-service` — **non mergée** (PR critique C2.5)
- #132 `release-please 2.6.1` — à merger après #134

**État code C2.4 :**

- Architecture : DDD/CQRS ✅, routes v2 `/api/v2/stocks` + `/api/v2/users` ✅
- OpenAPI : `docs/openapi.yaml` v2.5.1, ~26 endpoints documentés ✅
- Logger : `typescript-logging` (structuré) ✅
- Monitoring : logger structuré ✅, pas de `/health` ni `/metrics` exposé ⚠️
- CI : `main_stockhub-back.yml` → test:unit → build → test:e2e → deploy Render/Azure ✅
- Security : `security-audit.yml` ✅

---

### REPO 2 — stockHub_V2_front

**Issues ouvertes : 23**

| #    | Titre                                              | Labels                       | Priorité RNCP |
| ---- | -------------------------------------------------- | ---------------------------- | ------------- |
| #122 | catégories personnalisées                          | enhancement, front           | 🟢            |
| #121 | aperçus visuels landing page                       | enhancement, front           | 🟢            |
| #119 | distinguer LLM vs déterministe Dashboard/Analytics | front, ai                    | 🔴            |
| #118 | brancher mlSimulation sur endpoints backend        | front, ai                    | 🔴            |
| #101 | Playwright E2E + authentification interactive      | front, back, P1              | 🔴            |
| #90  | Veille technologique RNCP Ce2.3.1                  | documentation, rncp, P2      | 📝            |
| #66  | Tests E2E complets Frontend + Backend              | front, test, P1              | 🔴            |
| #64  | refactor: simplify CreateStockData                 | refactor, front, P3          | 🟢            |
| #62  | format lastUpdate date relative time               | enhancement, front, P3       | 🟢            |
| #61  | modal confirmation avant suppression stock         | enhancement, front, P2       | 🟢            |
| #59  | fix useStocks tests après intégration backend      | front, tech-debt, test, P2   | 🟡            |
| #51  | fix(a11y): accessibility 86→95+ (4 issues)         | front, P1                    | 🟡            |
| #49  | automatiser génération métriques qualité           | front, P3                    | 🟢            |
| #43  | docs: synchroniser 8-RNCP-CHECKLIST.md             | documentation, front, P3     | 📝            |
| #38  | tech-debt: type safety issues                      | front, tech-debt, P2         | 📝            |
| #35  | test: coverage utils et AI components              | front, tech-debt, test, P2   | 🟡            |
| #30  | investigate Vercel optionalDependencies            | bug, front, P1/P3            | 🟢            |
| #28  | setup Playwright E2E + migrer tests skippés        | enhancement, front, test, P3 | 🔴            |
| #25  | docs: harmoniser documentation                     | documentation, front, P3     | 📝            |
| #23  | tech-debt: type safety après merge conflicts       | front, tech-debt, P2         | 🟢            |
| #16  | normalize accents search filter                    | improvement, front, P3       | 🟢            |
| #4   | RNCP Checklist Suivi (tracker)                     | rncp, front, P2              | 📝            |
| ⚠️   | LandingPage.tsx — 0% de couverture (pas de tests)  | —                            | 🟡            |

**PRs ouvertes : 2**

- #128 `release-please 1.9.1` — ✅ CI passes, à merger
- #126 `dependabot bump picomatch` — ✅ CI passes, à merger

**État code C2.3 :**

- Coverage : 84.53% statements ✅ (cible 80% dépassée) — mais functions 69.85% ⚠️
  - LandingPage.tsx : **0%** — tests à créer
  - utils/unitFormatter.ts : 61% — en dessous du seuil
  - utils/aiPredictions.ts : 73%
- Tests : ~485 tests (vitest) ✅
- Lighthouse Performance : 99/100 ✅
- Lighthouse Accessibilité : 94/100 ⚠️ (cible 95+, DS bugs #33 #34 bloquants)
- Lighthouse SEO : > 90 ✅
- CI : 6 workflows ✅ (quality+tests, lighthouse+axe, azure deploy, release-please, TruffleHog, deploy-metrics)
- axe-core : ✅ dans CI
- TruffleHog : ✅ dans CI (mode `--only-verified`, `continue-on-error: true` — non-bloquant ⚠️)
- axe-core : ✅ dans CI (`continue-on-error: true` — non-bloquant ⚠️)
- Déploiement : Azure SWA (main) + Vercel preview (PRs) ✅
- **Note** : CLAUDE.md indique v1.3.0, package.json réel est v1.9.0 — à synchroniser

**Sécurité #84 :**

- `src/config/authConfig.ts` : `cacheLocation: 'sessionStorage'`
- sessionStorage est plus sécurisé que localStorage (pas persisté entre onglets)
- L'issue #84 est peut-être à requalifier — vérifier si elle concerne autre chose (ex: memory cache MSAL)
- Issue ouverte, à investiguer avant de clore ou corriger

**Module IA (#118, #119) :**

- `aiPredictions.ts`, `mlSimulation.ts` : données **mockées** — non connectés au backend
- `AIAlertBannerWrapper` sur le Dashboard : fonctionne sur données mockées
- `StockDetailPage` : prédictions déterministes visuelles ✅, LLM non câblé
- `analytics.tsx` : graphiques ML déterministes ✅, LLM non câblé

---

### REPO 3 — stockhub_design_system

**Issues ouvertes : 10**

| #   | Titre                                                   | Labels                     | Priorité RNCP |
| --- | ------------------------------------------------------- | -------------------------- | ------------- |
| #34 | button-name sur boutons internes sh-button (Shadow DOM) | bug                        | 🟡            |
| #33 | label-content-name-mismatch sh-header notifications     | bug                        | 🟡            |
| #27 | contraste bouton ghost light mode (WCAG AA)             | bug                        | 🟡            |
| #26 | créer sh-feature-card (icône + titre + description)     | feature, design-system, P3 | 🟢            |
| #24 | Upgrade Node 22 + Storybook v10                         | —                          | 📝 déjà fait  |
| #20 | audit/éliminer hardcoded values (design tokens)         | enhancement, P3            | 🟢            |
| #17 | improve button md padding                               | improvement, P3            | 🟢            |
| #16 | tests unitaires core components                         | enhancement, P2            | 🟢            |
| #15 | setup unit testing infrastructure @open-wc              | enhancement, P2            | 🟢            |
| #13 | responsive design audit général                         | improvement, P2            | 🟢            |

**État DS :**

- Version : v1.3.2 ✅ (aria-label fix mergé, Storybook v10 ✅)
- Composants : 18 Web Components documentés ✅
- Storybook : déployé sur Chromatic ✅
- Release Please : configuré sur `master` ✅
- Composants manquants pour module IA : stepper/checklist, checkbox list éditable

---

### REPO 4 — GitHub Project Board

- URL : https://github.com/users/SandrineCipolla/projects/3
- Issues urgentes en cours : #118, #119 (IA frontend), back#134 (IA backend)
- Recommandation : mettre #118, #119, back#134, back#124 en "In Progress" immédiatement
