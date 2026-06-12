# StockHub V2 Frontend — État du projet

**Date de rédaction** : 12 juin 2026
**Dernière activité** : 5 avril 2026 (mise en standby depuis ~2 mois)
**Branche active** : `feat/157-item-last-updated` (commits déjà mergés dans main)
**Version publiée** : v1.12.0 · package.json : 1.11.0 (Release Please à merger)

---

## Où en est l'application

### Ce qui tourne en production

L'application est **déployée et fonctionnelle** sur deux environnements :

| Env        | URL                                    | Backend              |
| ---------- | -------------------------------------- | -------------------- |
| Production | Azure Static Web Apps (branche `main`) | Azure App Service F1 |
| Staging    | Vercel (branche `staging`)             | Render.com           |

> ⚠️ Le backend Azure F1 a un quota CPU de 60 min/jour. Démarrer avant de tester : `npm run azure:start` (repo backend).

### Fonctionnalités livrées (résumé par release)

**v1.12.0 — 5 avril 2026** _(dernière release)_

- Colonne "dernière mise à jour" dans le tableau des items (affiche l'heure si aujourd'hui)
- Compteur réel de contributions en attente sur la cloche du header
- Layout responsive amélioré (mobile)
- Bannière "lecture seule" et carte cliquable pour le rôle VIEWER
- Fix : refresh automatique du stock après approbation/rejet d'une contribution

**v1.11.0 — 5 avril 2026**

- Dashboard groupé par rôle : "Mes stocks" / "Partagés avec moi"
- Sections repliables sur le dashboard

**v1.10.0 — 31 mars 2026**

- Fix status kebab-case + affichage prédictions
- Fix badge statut stock (utilisait maintenant les données backend agrégées)
- Fix authentification : refresh sur `/stocks/:id` ne redirige plus vers dashboard

**v1.9.0 — 25 mars 2026**

- Optimisation SEO/GEO landing page
- Fix aria-label non conformes WCAG 2.5.3

**v1.8.0 — 16 mars 2026**

- Couverture de tests étendue (useItems, useStockDetail, itemsAPI)

**v1.7.0 — v1.6.0 (mars 2026)**

- Collaboration complète : gestion collaborateurs, workflow contribution (suggérer → approuver/rejeter)
- Prédictions IA branchées sur les vrais endpoints backend
- Distinction suggestions LLM vs déterministes

---

## Architecture actuelle

```
React 19.1  ·  TypeScript 5.8.3 strict  ·  Vite 6.3.5
TailwindCSS 3.4.1  ·  Framer Motion  ·  Lucide React
React Router DOM 7.9.5  ·  MSAL (Azure AD B2C)
Design System @stockhub/design-system v1.3.1 (18 Web Components Lit)
```

**Rôles utilisateur implémentés** : `OWNER` / `VIEWER_CONTRIBUTOR` / `VIEWER`

**Métriques qualité actuelles**

- Lighthouse Performance : **99/100**
- Lighthouse Accessibility : **96/100**
- EcoIndex : **A (88.42)**
- Tests : **~464 tests** (~60% coverage)
- Bundle : 113 KB gzipped

---

## Backlog — ce qui reste à faire

### Bugs ouverts

| #    | Titre                                                                             | Priorité |
| ---- | --------------------------------------------------------------------------------- | -------- |
| #138 | Masquer la cloche et corriger copyright pour utilisateurs non connectés (landing) | —        |
| #30  | Comportement `optionalDependencies` Vercel à investiguer                          | P1       |

### P1 — Bloquants / Critiques

| #    | Titre                                                            |
| ---- | ---------------------------------------------------------------- |
| #66  | Tests E2E complets Frontend + Backend                            |
| #101 | Auth interactive Playwright pour tests E2E                       |
| #51  | Accessibilité : améliorer score de 86 à 95+ (4 issues critiques) |

### Features planifiées (par priorité d'intérêt)

| #    | Titre                                                            | Nature                 |
| ---- | ---------------------------------------------------------------- | ---------------------- |
| #165 | Afficher les items d'un stock en cards sur mobile                | UX mobile              |
| #163 | Panneau de notifications avec alertes contextuelles              | Feature (front + back) |
| #145 | Shopping list UI — générer, afficher, exporter                   | Feature IA             |
| #144 | Input catégorie custom avec suggestions autocomplete             | UX                     |
| #143 | Gestion et filtrage des tags libres sur les articles             | Feature                |
| #142 | Afficher et éditer la note libre d'un article                    | Feature                |
| #141 | Bibliothèque projets sauvegardés (liste + détail + étapes)       | Feature IA             |
| #140 | Page liste d'approvisionnement — générée, éditable, partageable  | Feature IA             |
| #139 | Page "Que faire avec ce que j'ai ?" + SuggestionCard + TutoModal | Feature IA             |
| #122 | Permettre à l'utilisateur de créer ses propres catégories        | UX                     |
| #121 | Aperçus visuels dans les cartes fonctionnalités de la landing    | UX                     |
| #16  | Normalisation des accents dans la recherche                      | Quick win              |
| #61  | Modal de confirmation avant suppression d'un stock avec items    | UX                     |
| #62  | Affichage "il y a X temps" pour lastUpdate                       | Quick win              |

### Dette technique

| #   | Titre                                                | Priorité |
| --- | ---------------------------------------------------- | -------- |
| #59 | Corriger tests `useStocks` après intégration backend | P2       |
| #38 | Type safety : stockId + assertions de type           | P2       |
| #35 | Coverage composants AI et utils non testés           | P2       |
| #23 | Type safety restante après merge conflicts           | P2       |
| #64 | Simplifier `CreateStockData` pour coller au backend  | P3       |

### Documentation / RNCP

| #   | Titre                                             |
| --- | ------------------------------------------------- |
| #90 | Veille technologique formelle (RNCP CE2.3.1)      |
| #43 | Synchroniser RNCP-CHECKLIST.md                    |
| #4  | RNCP Checklist suivi global                       |
| #25 | Harmoniser structure docs avec design system repo |

---

## Avancement RNCP 7

**Certification cible** : mars 2027 (4 soutenances × 40 min)

| Bloc       | Sujet                       | État                                                                  |
| ---------- | --------------------------- | --------------------------------------------------------------------- |
| Bloc 1     | Planification projet        | ~30% — analyse ROI, PESTEL, veille formelle manquants                 |
| **Bloc 2** | **Développement solutions** | **✅ Frontend validé 85/100** — UML, docs sécurité, CI/CD à compléter |
| Bloc 3     | Mise en production          | ~10% — GitHub Actions, tests automatisés, monitoring à construire     |
| Bloc 4     | Management d'équipe         | 0% — simulation à préparer (RACI, fiches de poste, métriques)         |

**Phase RNCP actuelle** : Phase 2 "Migration & Intégration" (Jan–Mai 2026) — légèrement en retard.
Les livrables en attente pour cette phase : tests automatisés >80% coverage, pipeline CI/CD complet.

---

## Prochaines étapes recommandées pour reprendre

### Court terme (reprendre l'élan)

1. **Merger la PR Release Please** — package.json est encore à 1.11.0 alors que la dernière release est v1.12.0
2. **Quick wins** — #138 (cloche landing), #16 (accents recherche), #62 (date relative) : chacun < 1h
3. **Bug P1** — #30 (Vercel optionalDependencies) à investiguer avant prochaine mise en prod

### Moyen terme (valeur fonctionnelle)

4. **#165** — Cards items sur mobile (suite logique du responsive v1.12.0)
5. **#163** — Panneau notifications (infrastructure déjà posée avec la cloche)
6. **#145/#140** — Shopping list (feature à forte valeur, roadmap Phase 3)

### RNCP (certification)

7. **#90** — Veille technologique : démarrer le fichier `VEILLE-TECHNOLOGIQUE.md`
8. **#66/#101** — Tests E2E Playwright : indispensables pour Bloc 3
9. **Diagrammes UML** : classes, séquence, composants (manquants pour Bloc 2 complet)

---

## Liens rapides

| Ressource               | URL                                                                          |
| ----------------------- | ---------------------------------------------------------------------------- |
| GitHub repo             | https://github.com/SandrineCipolla/stockHub_V2_front                         |
| GitHub Project          | https://github.com/users/SandrineCipolla/projects/3                          |
| Production              | https://brave-field-03611eb03.5.azurestaticapps.net                          |
| Staging                 | https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app/ |
| Storybook Design System | https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/                   |
| Backend staging         | https://stockhub-back.onrender.com/api                                       |
