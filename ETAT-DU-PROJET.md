# StockHub V2 Frontend — État du projet

**Date de rédaction** : 24 juillet 2026
**Dernière activité** : 24 juillet 2026
**Branche active** : `main`
**Version publiée** : v1.16.0

---

## Session du 24 juillet 2026 — Ce qui a été fait

### Tickets fermés

| #    | Titre                                               | PR                                                |
| ---- | --------------------------------------------------- | ------------------------------------------------- |
| #101 | Auth interactive Playwright pour tests E2E Frontend | #228, #229, #230, #232 ✅                         |
| #66  | Tests E2E Complets Frontend + Backend               | #231, #234, #235, #238, #239 ✅ — 5/5 tests verts |

### #101 — Socle Playwright pour l'auth interactive Azure AD B2C

Ajout de `@playwright/test` (Chromium), `playwright.config.ts` (projet `setup` → `authenticated` via `storageState`), `tests/e2e-frontend/helpers/auth.setup.ts` (login réel contre `b2clogin.com`, policy `signupsignin`), test de fumée, workflow CI dédié `e2e-frontend.yml` (`workflow_dispatch` + cron lundi 6h UTC — volontairement hors du pipeline principal). Réutilise le compte de test et les secrets déjà en place côté backend (`AZURE_TEST_USERNAME`/`AZURE_TEST_PASSWORD`), pas de nouveau provisioning.

**3 bugs révélés par les runs CI réels, corrigés en itérant** (PR #229, #230, #232) :

- CodeQL (high) : vérification d'hostname par sous-chaîne (`url.hostname.includes('b2clogin.com')`), contournable par un domaine attaquant contenant cette sous-chaîne → comparaison stricte sur le hostname exact
- `ENOENT` sur `playwright/.auth/` : `writeFileSync` ne crée pas les dossiers parents (contrairement à `storageState()`) — dossier gitignored, inexistant sur un checkout CI propre → `mkdirSync(..., { recursive: true })`
- **Piège MSAL le plus significatif** : `cacheLocation: 'sessionStorage'` (`src/config/authConfig.ts`) — `storageState()` de Playwright ne capture jamais le sessionStorage, seulement cookies + localStorage. Sans contournement, chaque test perdait la session. Fix : sérialisation manuelle post-login + réinjection via `context.addInitScript()` (`tests/e2e-frontend/fixtures.ts`). Documenté dans `docs/E2E_TESTS_GUIDE.md` et l'ADR-012 du wiki — piège généralisable à tout projet MSAL + Playwright.

**Risque principal levé** : le login réel passe sans MFA/code de vérification bloquant sur la policy `signupsignin` — condition nécessaire pour que l'automatisation soit viable, non déterminable à l'avance sans un run réel.

### #66 — Premier workflow E2E (création + suppression de stock)

`tests/e2e-frontend/workflows/stock-creation.e2e.test.ts` : ouvre le formulaire, crée un stock réel via l'UI (déclenche `POST /stocks`), vérifie son apparition, le supprime via le bouton du web component (accessible name portée par `sh-button`, sans piercing manuel du shadow DOM) pour ne pas laisser de données de test dans le compte réel. Sélecteurs vérifiés dans le code réel — ceux esquissés dans l'issue #66 (`data-testid`, notification de succès) n'existent pas dans l'app. **3/3 tests verts en CI** (PR #235), confirmé sur un run complet en 12s.

**3 bugs trouvés en itérant sur les runs CI réels** (PR #232, #234, #235) :

- `getByRole('dialog')` sans nom matchait 2 éléments — la bannière de consentement cookies porte aussi `role="dialog"`, visible par défaut sur une session fraîche. Fix : scoper par nom accessible (`{ name: 'Nouveau stock' }`).
- `workers: 1` ajouté par précaution (fausse piste sur le coup, gardée quand même — hygiène raisonnable vu le compte réel partagé).
- **Le vrai bug, le plus coûteux à trouver** : `sh-stock-card[name="..."]` ne matchait jamais, alors que le stock était bien créé et visible (confirmé par le snapshot d'accessibilité Playwright). Cause : Lit expose `name` comme propriété JS posée par React sur l'élément, jamais reflétée en attribut HTML — un sélecteur CSS `[name=...]` est structurellement incapable de la cibler. Fix : `getByRole('article', { name: \`Carte de stock ${label}\` })`.

**Incident découvert au passage, sans rapport avec le test** : en creusant pourquoi le stock ne se créait pas, `GET`/`POST /api/v2/stocks` renvoyaient carrément 500 en production **pour tout le monde** — 6 migrations Prisma jamais appliquées à la prod depuis fin mars (colonne `items.note` de #158 manquante en base). Diagnostiqué via Application Insights (`az monitor app-insights query`, pas les logs Kudu qui ne montrent que l'historique de déploiement). Cause process : `prisma migrate deploy` n'existe que dans le job E2E CI (DB éphémère), jamais dans le déploiement réel vers prod/staging. Corrigé manuellement avec accord explicite avant de toucher à la prod (migrations additives, aucune perte de données). Détail complet et gap de process documentés côté backend : `stockhub_back/docs/troubleshooting/prod-migration-drift.md`.

### #66 — Workflows 2 et 3 (gestion d'items, mise à jour de quantité) — clôture

`tests/e2e-frontend/workflows/item-management.e2e.test.ts` et `quantity-update.e2e.test.ts` : ajoutés sur le modèle validé de `stock-creation.e2e.test.ts`, avec `tests/e2e-frontend/helpers/stock-actions.ts` (`createStock`/`deleteStock`) et `item-actions.ts` (`addItem`) factorisés pour éviter la duplication entre les 3 tests. **Item-management** crée un item sous le seuil minimum et vérifie le statut "Critique" + le compteur de filtre. **Quantity-update** utilise les boutons `+`/`-` (appel API direct, pas l'input d'édition inline) et vérifie la persistance de la valeur affichée.

**Bug trouvé au premier run CI** (PR #239) : `getByLabel('Nom', { exact: true })` bloquait 30s sur le formulaire d'ajout d'item, alors que le champ était bien présent et focus. Cause : le `<label>` contient "Nom" + un `<span aria-hidden="true">*</span>` pour l'astérisque requis — le texte réel matché par `getByLabel` inclut ce `*` (contrairement à l'accessible name du textbox associé, calculée différemment). Fix : sélecteurs par `id` (`#item-label`, `#item-quantity`, `#item-minimum-stock`), même pattern que le formulaire de stock.

**5/5 tests E2E verts en CI** (~33s), les 4 workflows Must-Have de #66 sont couverts. Issue #66 fermée.

**Traçabilité créée après coup** (à la demande explicite, pour ne pas laisser ces incidents uniquement dans la doc) : [stockhub_back#254](https://github.com/SandrineCipolla/stockhub_back/issues/254) (incident migration, fermée avec le correctif en commentaire), [stockHub_V2_front#237](https://github.com/SandrineCipolla/stockHub_V2_front/issues/237) (bug locator Lit, fermée avec référence à #235), [stockhub_back#255](https://github.com/SandrineCipolla/stockhub_back/issues/255) (User Story de suivi — automatiser `prisma migrate deploy` vers la prod, gap de process non résolu, reste ouvert).

**Reste hors scope** : quelques stocks de test orphelins (`E2E Stock ...`) accumulés dans le compte réel pendant les runs qui échouaient avant l'étape de nettoyage — à supprimer manuellement via le dashboard (préfixe facilement identifiable). Incohérence de label P1/P2 sur l'issue #66 jamais tranchée (issue fermée entre-temps, non-bloquant).

### Documentation mise à jour dans la foulée

- `docs/E2E_TESTS_GUIDE.md` (repo Front) : transformé en guide pas-à-pas installation/utilisation (prérequis, lancement local et contre l'app déployée, débogage `--ui`/`show-trace`, comment écrire un nouveau test)
- Wiki (`stockHub_V2_front.wiki`) : ADR-012 (Playwright + auth interactive réelle plutôt que mockée), section CI/CD dédiée au workflow `e2e-frontend.yml`, section Qualité & Métriques avec le tableau de statut des workflows E2E

### Variante — labels de priorité incohérents entre le corps de l'issue et le label GitHub

- **#30** (Vercel `optionalDependencies`) : le corps de l'issue indiquait lui-même "Priorité : P3 (non-urgent, solution temporaire fonctionnelle)" alors que le label GitHub était P1. Label P1 retiré, P3 conservé.
- **#66** : même incohérence repérée (corps "P2", label "P1") mais **non tranchée** cette session — signalé, pas traité, à trancher séparément si besoin.

---

## Session du 23 juillet 2026 — Ce qui a été fait

### Tickets fermés

| #    | Titre                                         | PR      |
| ---- | --------------------------------------------- | ------- |
| #142 | Afficher et éditer la note libre d'un article | #212 ✅ |

### #142 — Affichage/édition de la note (PR #212)

- `ItemFormModal.tsx` : nouveau champ textarea Note (1000 caractères max, trim avant envoi), pré-rempli en mode édition
- `ItemDetailPage.tsx` : section Note toujours visible (placeholder "Aucune note" si vide) + bouton "Modifier" ajouté sur la page (absent avant, l'édition ne passait que par la liste du stock)
- `types/stock.ts`, `itemsAPI.ts` : champ `note` propagé
- Dépend du backend `stockhub_back` #158 (PR #246)

### Variante — piège `.env.local` (cause réelle des échecs "aléatoires" en dev local)

Un `.env.local` oublié sur la machine (créé pour un test antérieur contre le staging Render.com) pointait `VITE_API_SERVER_URL` vers le backend distant. Vite charge `.env.local` en priorité sur `.env`, dans tous les modes (dev inclus) — donc `npm run dev` parlait au staging même avec un backend local qui tournait, causant des échecs silencieux et des lenteurs prises à tort pour un bug applicatif. Documenté dans `.env.example` et `CLAUDE.md` (section Environnements) pour éviter de reproduire la confusion.

### Variante — fix hors ticket : course de tokens MSAL concurrents

**Diagnostic** : `useNotificationCount` (utilisé sur `ItemDetailPage`/`StockDetailPage`) déclenche 2 acquisitions de token en parallèle dans un même `Promise.all` ; ajouter `useCollaborators` sur `ItemDetailPage` (pour #142) a introduit un 3ᵉ appel concurrent au montage. Plusieurs `acquireTokenSilent`/`loginRedirect` simultanés peuvent faire lever `interaction_in_progress` à MSAL et bloquer toute reconnexion (nécessite de vider le storage navigateur pour s'en sortir). Fix : `ConfigManager.getToken()` mutualise les appels concurrents via une promesse partagée ; `LandingPage.handleLogin` nettoie les verrous d'interaction périmés avant `loginRedirect` ; effets séquencés sur `ItemDetailPage` (fetch de l'item puis des collaborateurs, plus en parallèle). Ce fix est réel et mergé, mais **pas** la cause du blocage total observé pendant la session de test — c'était le piège `.env.local` ci-dessus.

### Variante — fixes CI dependabot (4 PR qui échouaient en boucle)

- **#219/#216** (`@azure/msal-browser`/`msal-react`) : peer dependency stricte entre les deux packages, bumpés dans des PR séparées par dependabot → `ERESOLVE` systématique. Fix : groupe `azure-msal` ajouté à `dependabot.yml` (PR #222 ✅), #219/#216 fermées manuellement.
- **#224** : `knip` signalait `lint-staged` comme dépendance inutilisée (faux positif — utilisé via CLI dans les hooks husky, invisible à l'analyse statique). Bloquait le pre-push de **toutes** les branches du repo, y compris sur `main`. Fix : ajout à `ignoreDependencies` (PR #224 ✅).
- **#218** (`typescript` 6.0.3) : `baseUrl` déprécié en TS 6 (retiré en TS 7, inutile avec `moduleResolution: "bundler"`) ; `global` n'est plus fourni par les types `@types/node` récents, remplacé par `globalThis` dans 5 fichiers de test (PR #218 ✅).
- **#217** (`eslint-plugin-react-hooks` 7.1.1) : 2 nouvelles règles strictes. `refs` (accès à `ref.current` pendant le rendu) corrigée proprement dans 3 fichiers (`useLayoutEffect` pour le pattern "ref toujours à jour", exception ciblée et justifiée pour un cas via `React.createElement`). `set-state-in-effect` (flague le pattern "fetch au montage + `setLoading(true)`", valide et utilisé dans 7 hooks/pages) passée en `warn` — la corriger nécessiterait de re-architecturer le data-fetching de l'app, hors scope d'un bump de dépendance (PR #217 ✅).
- **#215** (`eslint` 10.7.0) : résolue en cascade sans intervention, une fois #217 mergée (peer dependency d'`eslint-plugin-react-hooks@7.1.1` compatible avec eslint 10).

---

## Session du 21 juillet 2026 — Ce qui a été fait

Clôture de la coordination avec le Design System suite à son breaking change (#42, préfixe `sh-` sur 7 événements, v2.0.0). 4 PR en attente depuis mi-juin mergées ensemble, dans l'ordre :

| #    | Titre                                                                     | PR      |
| ---- | ------------------------------------------------------------------------- | ------- |
| #189 | Fix expiry token / verrou `interaction_in_progress`                       | #191 ✅ |
| —    | Dependabot `js-yaml`                                                      | #185 ✅ |
| —    | Upgrade `@stockhub/design-system` v1.3.3 → v2.0.3 (adaptation événements) | #193 ✅ |
| —    | Release Please v1.15.0                                                    | #187 ✅ |

### #193 — Migration DS v2.0.3 (breaking change événements)

- 4 fichiers adaptés : `ContributionFormModal.tsx`, `CollaboratorsModal.tsx`, `PendingContributionsSection.tsx`, `web-components.d.ts` — tous les `addEventListener`/types d'événements renommés avec le préfixe `sh-` (ex. `contribution-submit` → `sh-contribution-submit`)
- **Vérifié en conditions réelles**, pas seulement build/lint : session de test manuel avec vrai backend staging (Render/Aiven) et vraie session Azure AD B2C connectée — changement de rôle collaborateur bout-en-bout confirmé fonctionnel
- Le Front est maintenant sur la dernière version publiée du DS

### #191 — Fix auth token expiry

- Mergé tel que décrit dans la session du 18 juin (voir ci-dessous) — diagnostic confirmé : les 401 récurrents venaient du cache JWKS backend (résolu par restart conteneur), le fix frontend reste une protection complémentaire pour un token MSAL réellement expiré

**À noter** : issues #122 et #144 (catégories de stock personnalisées / autocomplete) redeviennent pertinentes côté Front — le backend (#169, mergé le 21/07) accepte maintenant n'importe quelle catégorie en texte libre (avant : 3 valeurs figées). Aucun blocage backend restant sur ces deux tickets.

---

## Session du 18 juin 2026 — Ce qui a été fait

### Tickets fermés

| #   | Titre                                                                | PR      |
| --- | -------------------------------------------------------------------- | ------- |
| #61 | Modal confirmation avant suppression stock + masquer delete partagés | #190 ✅ |

### #61 — Modale confirmation suppression (PR #190)

- Nouveau composant `src/components/common/ConfirmDeleteModal.tsx` : overlay, focus sur "Annuler", Escape, état `isDeleting`
- `Dashboard.tsx` : `pendingDeleteId` state → `handleDeleteStock` ouvre la modale au lieu de supprimer directement
- `StockCardWrapper.tsx` : injection CSS dans le shadow root du web component pour masquer le bouton "Supprimer" sur les stocks partagés (quand `onDelete` n'est pas fourni)
- 9 tests unitaires dans `ConfirmDeleteModal.test.tsx` (rendering, actions, état isDeleting)

### #189 — Fix auth token expiry (PR #191)

- `ConfigManager.getToken()` : suppression des verrous `interaction.status` périmés avant `acquireTokenSilent`, log des échecs, `loginRedirect` au lieu de `acquireTokenRedirect` sur `InteractionRequiredAuthError`
- `Dashboard.tsx` : bouton "Se reconnecter" dans l'écran d'erreur
- **Diagnostic** : les 401 récurrents viennent du backend Docker (cache JWKS périmé) — restart du conteneur suffit à résoudre. Le fix frontend est complémentaire pour le cas token MSAL vraiment expiré.
- Mergé le 21 juillet 2026 (voir session ci-dessus)

### Tickets créés

| #    | Titre                                             | Priorité |
| ---- | ------------------------------------------------- | -------- |
| #188 | Quitter un stock partagé (backend requis)         | P2       |
| #189 | Fix expiry token / verrou interaction_in_progress | P1       |

---

## Session du 16 juin 2026 — Ce qui a été fait

### Tickets fermés

| #    | Titre                                                               | PR      |
| ---- | ------------------------------------------------------------------- | ------- |
| #165 | Items en cards sur mobile (StockDetail)                             | #179 ✅ |
| #181 | Page détail d'un item de stock                                      | #182 ✅ |
| #183 | Compteur notifications incorrect sur StockDetailPage/ItemDetailPage | #184 ✅ |
| #163 | Panneau de notifications avec alertes contextuelles                 | #186 ✅ |

### #163 — Panneau notifications (PR #186)

Nouveau composant `src/components/layout/NotificationPanel.tsx` :

- Drawer fixe depuis la droite, overlay backdrop derrière
- Fermeture : clic overlay, bouton ✕, touche Escape
- 3 sections : Stocks critiques (🔺), Ruptures de stock (📦), Contributions en attente (🔔)
- Clic sur un stock → navigation vers `/stocks/:stockId` et fermeture du panel
- État vide : message "Aucune notification" avec icône
- Support dark/light mode

Modifications associées :

- `NotificationItem` type ajouté dans `src/types/dashboard.ts`
- `useNotificationCount` enrichi : retourne `notifications: NotificationItem[]`
- `HeaderWrapper` : `isPanelOpen` state, clic cloche → panel (tooltip hover conservé)
- Dashboard : calcule `notificationItems` depuis ses stocks déjà chargés (pas de double fetch)
- StockDetailPage + ItemDetailPage : passent `notifications={notifItems}` à HeaderWrapper

### #183 — Fix compteur notifications global (PR #184)

Nouveau hook `src/hooks/useNotificationCount.ts` :

- Calcule `count = critiques + ruptures + contributions` + tooltip identiques au dashboard
- Remplace `usePendingContributionsCount` sur `StockDetailPage` (qui ne comptait pas les stocks critiques/rupture)
- Ajouté sur `ItemDetailPage` (qui affichait 0 par défaut)
- Le Dashboard garde son calcul existant depuis `useStocks()` déjà chargé

### #181 — Page détail d'un item (PR #182)

Nouvelle page `ItemDetailPage` (`/stocks/:stockId/items/:itemId`) :

- Appel `GET /api/v2/stocks/:stockId/items/:itemId`
- Affiche : label, statut calculé, quantité, seuil minimum, date relative (`updatedAt`)
- Navigation : clic sur le nom de l'item (desktop) ou bouton "Voir →" (mobile card)
- Nouveau type `RawItemDetail` et méthode `ItemsAPI.fetchItem()` dans `itemsAPI.ts`

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

**v1.14.0 — 16 juin 2026**

- Panneau de notifications : drawer slide-in depuis la droite, clic cloche, sections critiques/ruptures/contributions, navigation vers le stock — #163

**v1.13.0 — 15 juin 2026**

- Items d'un stock affichés en cards sur mobile (tableau conservé sur desktop) — #165
- Page détail d'un item `/stocks/:stockId/items/:itemId` — #181
- Compteur et tooltip notifications cohérents sur toutes les pages — #183
- Fix Node 18 → 20 dans le workflow deploy-metrics

**v1.12.1 — (anciennement dans « à venir »)**

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

| #    | Titre                                                | Nature                   |
| ---- | ---------------------------------------------------- | ------------------------ |
| #170 | Rechercher un item par nom depuis le dashboard       | Feature (bloqué backend) |
| #145 | Shopping list UI — générer, afficher, exporter       | Feature IA               |
| #144 | Input catégorie custom avec suggestions autocomplete | UX                       |
| #188 | Quitter un stock partagé                             | Feature (bloqué backend) |

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

### 1. Merger PR #191 (fix/189 auth)

La PR est ouverte, le fix est validé. À merger pour que le bouton "Se reconnecter" arrive sur `main`.

### 2. Merger PR #187 (Release Please v1.15.0)

La PR de release auto-générée inclut #61 + les sessions du 15–16 juin. À merger pour taguer v1.15.0.

### 3. Bugs staging restants

- Bouton "Éditer" (stock) envoie une requête mais n'ouvre pas la modale
- Clic sur une carte stock ne navigue pas vers `StockDetailPage`

### 4. DS#39 (session dédiée DS)

Supprimer les `title` natifs sur les boutons `sh-header` dans `stockhub_design_system`.

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
