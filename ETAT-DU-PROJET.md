# StockHub V2 Frontend — État du projet

**Date de rédaction** : 16 juin 2026
**Dernière activité** : 16 juin 2026 (session active)
**Branche active** : `main`
**Version publiée** : v1.13.0 (Release Please — mergé le 15 juin)

---

## Session du 16 juin 2026 — Ce qui a été fait

### Tickets fermés

| #    | Titre                                   | PR      |
| ---- | --------------------------------------- | ------- |
| #165 | Items en cards sur mobile (StockDetail) | #179 ✅ |

### #165 — Items en cards sur mobile (PR #179)

Nouveau composant `src/components/items/ItemMobileCard.tsx` :

- Vue cards visible sur mobile (`md:hidden`), tableau conservé sur desktop (`hidden md:block`)
- Chaque card affiche : nom + badge statut, quantité (role-based), min, date relative, actions directes
- Gestion des rôles : OWNER (±/inline edit), VIEWER_CONTRIBUTOR (bouton Signaler), VIEWER (lecture seule)
- Bug découvert et corrigé : `autoFocus` sur deux inputs simultanés (mobile + desktop) causait un conflit de focus → `onBlur` immédiat → `editingQuantityId = null`. Fix : `autoFocus` retiré de la card mobile.
- Tests adaptés : `data-testid="qty-edit-span-{id}"` et `data-testid="qty-input-{id}"` pour cibler précisément le tableau desktop depuis les tests

---

---

## Session du 15 juin 2026

### Tickets fermés

| #    | Titre                           | PR       |
| ---- | ------------------------------- | -------- |
| #177 | Username "utilisateur" après F5 | ✅ mergé |

### Fix CI

`deploy-metrics.yml` utilisait Node 18, incompatible avec Vite 6.3.5 (exige ≥ 20.19). Passé à Node 20, pushé directement sur `main`.

---

## Sessions précédentes — 12–13 juin 2026

### Tickets fermés

| #    | Titre                                               | PR      |
| ---- | --------------------------------------------------- | ------- |
| #171 | Cloche notifications : compteur + tooltip par stock | #173 ✅ |
| #138 | Masquer cloche landing + corriger copyright year    | #174 ✅ |
| #16  | Normalisation accents dans la recherche             | #175 ✅ |
| #62  | Date relative sur les cartes stocks ("Il y a X j")  | #176 ✅ |
| #172 | Username "utilisateur" après F5                     | #177 ✅ |

### Nouveau fichier utilitaire

`src/utils/dateUtils.ts` — `formatRelativeDate()` partagée entre `StockCardWrapper` et `StockDetailPage`.

### Tickets créés

| #        | Repo  | Titre                                                           | Board      |
| -------- | ----- | --------------------------------------------------------------- | ---------- |
| #170     | Front | Rechercher un item par nom depuis le dashboard (bloqué backend) | Backlog    |
| DS#39    | DS    | Supprimer attributs `title` natifs sur boutons sh-header        | Backlog DS |
| Back#228 | Back  | Exposer `updatedAt` sur GET /api/v2/stocks                      | Backlog    |

### CI optimisé

Le workflow "Quality Audits" (Lighthouse, axe-core, bundle) saute les PRs Dependabot et Release Please.

---

## Où en est l'application

### Ce qui tourne en production

| Env        | URL                                    | Backend              |
| ---------- | -------------------------------------- | -------------------- |
| Production | Azure Static Web Apps (branche `main`) | Azure App Service F1 |
| Staging    | Vercel (branche `staging`)             | Render.com           |

> ⚠️ Le backend Azure F1 a un quota CPU de 60 min/jour. Démarrer avant de tester : `npm run azure:start` (repo backend).

### Fonctionnalités livrées (résumé par release)

**Sessions 15–16 juin 2026** _(à venir dans prochaine release)_

- Items d'un stock affichés en cards sur mobile (tableau conservé sur desktop) — #165
- Fix Node 18 → 20 dans le workflow deploy-metrics

**v1.13.0 — 15 juin 2026**

- Cloche notifications : compteur réel (critique + rupture + contributions) + tooltip par stock au survol
- Cloche masquée sur la landing page (non connecté)
- Copyright year dynamique dans le footer
- Recherche stocks avec normalisation des accents (fix filtrage ownedStocks/sharedStocks)
- Date relative sur les cartes stocks ("Il y a 5 j", "Hier", "14:30")
- Username après F5 : lu depuis localStorage en attendant MSAL

**v1.12.1 — mai 2026**

- Colonne "dernière mise à jour" dans le tableau des items
- Compteur réel de contributions en attente sur la cloche du header
- Layout responsive amélioré (mobile)
- Bannière "lecture seule" et carte cliquable pour le rôle VIEWER

---

## Architecture actuelle

```
React 19.1  ·  TypeScript 5.8.3 strict  ·  Vite 6.3.5
TailwindCSS 3.4.1  ·  Framer Motion  ·  Lucide React
React Router DOM 7.9.5  ·  MSAL (Azure AD B2C, sessionStorage)
Design System @stockhub/design-system v1.3.1 (18 Web Components Lit)
```

**Rôles utilisateur implémentés** : `OWNER` / `VIEWER_CONTRIBUTOR` / `VIEWER`

**Métriques qualité actuelles**

- Tests : **547 tests** (~60% coverage)
- Bundle : 113 KB gzipped
- Lighthouse Performance : **99/100**
- Lighthouse Accessibility : **96/100**

---

## Backlog — ce qui reste à faire

### Bugs ouverts

| #   | Titre                                                    | Priorité |
| --- | -------------------------------------------------------- | -------- |
| #30 | Comportement `optionalDependencies` Vercel à investiguer | P1       |

### Design System — à faire dans stockhub_design_system

| #     | Titre                                                                               | Priorité |
| ----- | ----------------------------------------------------------------------------------- | -------- |
| DS#39 | Supprimer attributs `title` natifs sur boutons sh-header (cloche, thème, connexion) | P2       |

### Backend — à faire dans stockhub_back

| #        | Titre                                      | Priorité |
| -------- | ------------------------------------------ | -------- |
| Back#228 | Exposer `updatedAt` sur GET /api/v2/stocks | P3       |

### P1 — Bloquants / Critiques

| #    | Titre                                                |
| ---- | ---------------------------------------------------- |
| #66  | Tests E2E complets Frontend + Backend                |
| #101 | Auth interactive Playwright pour tests E2E           |
| #51  | Accessibilité : améliorer score (4 issues critiques) |

### Features planifiées (par priorité d'intérêt)

| #    | Titre                                                         | Nature                   |
| ---- | ------------------------------------------------------------- | ------------------------ |
| #163 | Panneau de notifications avec alertes contextuelles           | Feature (front + back)   |
| #170 | Rechercher un item par nom depuis le dashboard                | Feature (bloqué backend) |
| #145 | Shopping list UI — générer, afficher, exporter                | Feature IA               |
| #144 | Input catégorie custom avec suggestions autocomplete          | UX                       |
| #61  | Modal de confirmation avant suppression d'un stock avec items | UX                       |

### Dette technique

| #   | Titre                                                | Priorité |
| --- | ---------------------------------------------------- | -------- |
| #59 | Corriger tests `useStocks` après intégration backend | P2       |
| #38 | Type safety : stockId + assertions de type           | P2       |
| #35 | Coverage composants AI et utils non testés           | P2       |
| #23 | Type safety restante après merge conflicts           | P2       |
| #64 | Simplifier `CreateStockData` pour coller au backend  | P3       |

### Documentation / RNCP

| #   | Titre                                        |
| --- | -------------------------------------------- |
| #90 | Veille technologique formelle (RNCP CE2.3.1) |
| #43 | Synchroniser RNCP-CHECKLIST.md               |
| #4  | RNCP Checklist suivi global                  |

---

## Avancement RNCP 7

**Certification cible** : mars 2027 (4 soutenances × 40 min)

| Bloc       | Sujet                       | État                                                                  |
| ---------- | --------------------------- | --------------------------------------------------------------------- |
| Bloc 1     | Planification projet        | ~30% — analyse ROI, PESTEL, veille formelle manquants                 |
| **Bloc 2** | **Développement solutions** | **✅ Frontend validé 85/100** — UML, docs sécurité, CI/CD à compléter |
| Bloc 3     | Mise en production          | ~10% — GitHub Actions, tests automatisés, monitoring à construire     |
| Bloc 4     | Management d'équipe         | 0% — simulation à préparer (RACI, fiches de poste, métriques)         |

---

## Pour la prochaine session — par où commencer

### 1. Feature #163 — Panneau notifications (2–3h)

L'infrastructure est posée (cloche avec compteur + tooltip). Étape suivante : un panneau/drawer qui s'ouvre au clic sur la cloche, listant les stocks critiques/en rupture + contributions en attente.

### 2. Bugs observés en staging (à confirmer en local)

Vus lors du test visuel de #165 sur la preview Vercel + Render — à vérifier s'ils se reproduisent en local :

- Suppression d'un stock sans modal de confirmation (→ #61 déjà en backlog)
- Bouton "Éditer" (stock) envoie une requête mais n'ouvre pas la modale
- Clic sur une carte stock ne navigue pas vers `StockDetailPage`

### 3. DS#39 (session dédiée DS)

Supprimer les `title` natifs sur les boutons `sh-header` dans `stockhub_design_system`. À grouper avec d'autres évolutions DS.

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
| DS repo                 | https://github.com/SandrineCipolla/stockhub_design_system                    |
| Backend repo            | https://github.com/SandrineCipolla/stockhub_back                             |
