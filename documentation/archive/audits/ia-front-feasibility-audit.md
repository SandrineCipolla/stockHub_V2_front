# Audit faisabilité — Module IA Frontend StockHub V2

**Date** : 26 mars 2026
**Version** : 1.9.0
**Branche analysée** : main

---

## Résumé (5 lignes)

Le frontend dispose déjà d'une infrastructure IA solide (prédictions déterministes, composants DS, hooks pattern établi). Les 3 nouveaux écrans demandés ("Que faire ?", Bibliothèque projets, Liste d'approvisionnement) nécessitent surtout de **nouvelles pages et nouveaux types** — les patterns de hook, API et modal sont réutilisables. Le Design System n'a **pas de stepper ni de liste éditable avec cases à cocher** : ces composants sont à créer (côté DS ou en React pur). La dépendance critique est le **backend LLM** (endpoints suggestions recettes/projets) — sans lui, les suggestions seront des placeholders. **Go Niveau 1 partiel** : pages squelettes + intégration déterministe réalisable en ~5 journées ; LLM réel dépend du backend.

---

## Ce qui est réutilisable vs à créer from scratch

### Réutilisable ✅

| Élément                          | Fichier                                  | Usage dans le module IA                         |
| -------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Pattern hook async               | `useFrontendState.ts` (`useAsyncAction`) | Tous les appels API nouveaux                    |
| Pattern API                      | `stocksAPI.ts`, `itemsAPI.ts`            | Base pour `suggestionsAPI.ts`, `projectsAPI.ts` |
| Modal create/edit                | `StockFormModal`, `ItemFormModal`        | Modèle pour `ProjectFormModal`                  |
| `sh-card`                        | DS v1.3.2                                | Cards suggestions, cards projets                |
| `sh-button`                      | DS v1.3.2                                | Toutes les actions                              |
| `sh-badge`, `sh-status-badge`    | DS v1.3.2                                | Statuts projets (TODO/IN_PROGRESS/DONE)         |
| `sh-ia-alert-banner`             | DS v1.3.2                                | Bannière suggestions LLM si adaptable           |
| `sh-stock-prediction-card`       | DS v1.3.2                                | Non réutilisable directement ici                |
| `NavSection` + `HeaderWrapper`   | Layout                                   | Layout pages nouvelles                          |
| `useTheme`                       | Hooks                                    | Thème dark/light                                |
| Lazy loading pages               | `App.tsx`                                | Pattern à dupliquer pour nouvelles pages        |
| Types `RiskLevel`, `StockStatus` | `types/stock.ts`                         | Référence pour nouveaux types                   |

### À créer from scratch ❌

| Élément                                            | Complexité | Justification                        |
| -------------------------------------------------- | ---------- | ------------------------------------ |
| `SuggestionsPage.tsx`                              | 🟡 Moyenne | Nouvelle page, appel LLM             |
| `SuggestionCard.tsx`                               | 🟢 Faible  | Card recette/projet avec tuto résumé |
| `TutoDetailModal.tsx`                              | 🟢 Faible  | Modal expand détail tuto             |
| `ProjectsLibraryPage.tsx`                          | 🟡 Moyenne | CRUD projets + filtres statut        |
| `ProjectCard.tsx`                                  | 🟢 Faible  | Card avec statut badge               |
| `ProjectDetailPage.tsx`                            | 🟡 Moyenne | Vue étapes cochables                 |
| `StepperChecklist.tsx`                             | 🔴 Élevée  | Composant stepper pas dans DS        |
| `ShoppingListPage.tsx`                             | 🟡 Moyenne | Liste générée depuis projet          |
| `ShoppingListItem.tsx`                             | 🟢 Faible  | Item éditable avec case à cocher     |
| `suggestionsAPI.ts`                                | 🟢 Faible  | Pattern identique à stocksAPI        |
| `projectsAPI.ts`                                   | 🟢 Faible  | CRUD projets                         |
| `shoppingListAPI.ts`                               | 🟢 Faible  | CRUD liste                           |
| `useProjects.ts`                                   | 🟡 Moyenne | Hook CRUD projets (pattern useItems) |
| `useSuggestions.ts`                                | 🟢 Faible  | Hook fetch suggestions LLM           |
| Types `Project`, `ProjectStep`, `ShoppingListItem` | 🟢 Faible  | Nouveaux types TypeScript            |

---

## Tableau d'estimation par écran

| Écran / Composant                          | Réutilise existant ?     | Complexité | Durée est.       |
| ------------------------------------------ | ------------------------ | ---------- | ---------------- |
| **Page suggestions "Que faire ?"**         | Layout, hooks, sh-card   | 🟡 Moyenne | 1 jour           |
| Card suggestion (recette/projet/bricolage) | sh-card, sh-badge        | 🟢 Faible  | 0.5 jour         |
| Modal tuto détail                          | Pattern ItemFormModal    | 🟢 Faible  | 0.5 jour         |
| `suggestionsAPI.ts` + `useSuggestions`     | Pattern stocksAPI        | 🟢 Faible  | 0.5 jour         |
| **Page bibliothèque projets**              | Layout, hooks            | 🟡 Moyenne | 1 jour           |
| Card projet avec statut                    | sh-card, sh-status-badge | 🟢 Faible  | 0.5 jour         |
| ProjectFormModal (create/edit)             | Pattern ItemFormModal    | 🟢 Faible  | 0.5 jour         |
| `projectsAPI.ts` + `useProjects`           | Pattern useItems         | 🟡 Moyenne | 0.5 jour         |
| **Page détail projet + étapes cochables**  | Layout                   | 🟡 Moyenne | 1.5 jours        |
| Stepper étapes cochables                   | ❌ À créer (DS manque)   | 🔴 Élevée  | 1 jour           |
| **Page liste d'approvisionnement**         | Layout, hooks            | 🟡 Moyenne | 1 jour           |
| Items éditables avec quantités             | Pattern items table      | 🟢 Faible  | 0.5 jour         |
| Partage famille (copie/export)             | Pattern CSV export       | 🟢 Faible  | 0.5 jour         |
| **Interface chat (optionnel)**             | ❌ Rien de réutilisable  | 🔴 Élevée  | 3+ jours         |
| **Total Niveau 1 (sans chat)**             |                          |            | **~8–10 jours**  |
| **Total Niveau 1 + chat**                  |                          |            | **~11–13 jours** |

> Note : durées estimées pour dev seul, tests inclus, sans backend (mocks).
> Avec intégration backend réelle : +2–3 jours pour le câblage et les edge cases.

---

## Pages existantes à modifier (risque de régression)

| Page                  | Modification nécessaire                                      | Risque                                    |
| --------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| `Dashboard.tsx`       | Lien vers "Que faire ?" + suggestions LLM dans AIAlertBanner | 🟡 Faible — ajout de lien et conditionnel |
| `App.tsx`             | 3–4 nouvelles routes + lazy imports                          | 🟢 Minimal — pattern établi               |
| `Analytics.tsx`       | Aucune modification requise                                  | ✅ Aucun                                  |
| `StockDetailPage.tsx` | Lien "Générer liste d'approvisionnement" depuis détail       | 🟡 Faible                                 |

---

## Conflits avec issues existantes

| Issue                                        | Conflit potentiel                    | Impact                                                                     |
| -------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| **#118** — Brancher mlSimulation sur backend | Même zone: utilitaires IA, Analytics | Faire #118 **avant** d'ajouter suggestions LLM — évite de câbler deux fois |
| **#119** — Distinguer LLM vs déterministe    | Même zone: Dashboard AIAlertBanner   | À faire **en parallèle** avec la page Suggestions                          |
| **#35** — Coverage utils et AI components    | Couvre aiPredictions, mlSimulation   | Finir avant d'ajouter de nouveaux utils IA                                 |
| **#122** — Catégories personnalisées         | Aucun conflit direct                 | Indépendant                                                                |
| **#66/#101** — Tests E2E                     | Nouvelles pages = nouveaux tests E2E | Prévoir scénarios E2E pour les nouvelles pages                             |

---

## Design System — composants manquants

| Composant manquant           | Où l'utiliser         | Recommandation                                                              |
| ---------------------------- | --------------------- | --------------------------------------------------------------------------- |
| Stepper / checklist d'étapes | ProjectDetailPage     | Créer `sh-stepper` dans DS (PR DS) ou créer en React pur localement d'abord |
| Checkbox list item           | ShoppingListPage      | Utiliser `<input type="checkbox">` Tailwind en attendant                    |
| Chat/conversation UI         | Interface optionnelle | Ne pas créer dans DS — trop spécifique                                      |

---

## Recommandation — ordre d'implémentation optimal

### Étape 1 — Pré-requis (avant de commencer)

1. Merger **#118** (brancher mlSimulation sur backend) — stabilise la base IA
2. Merger **#119** (distinguer LLM vs déterministe) — prépare l'affichage dual

### Étape 2 — Niveau 1 sans LLM (données mockées)

```
1. Nouveaux types TypeScript (Project, ProjectStep, Suggestion, ShoppingListItem)
2. suggestionsAPI.ts + useSuggestions (mock data LLM)
3. SuggestionsPage + SuggestionCard + TutoDetailModal
4. projectsAPI.ts + useProjects
5. ProjectsLibraryPage + ProjectCard + ProjectFormModal
6. ProjectDetailPage + StepperChecklist
7. shoppingListAPI.ts
8. ShoppingListPage + ShoppingListItem
9. Ajout routes App.tsx + liens Dashboard/StockDetail
```

### Étape 3 — Intégration LLM réelle

- Câbler `suggestionsAPI.ts` sur l'endpoint backend Mistral/OpenRouter
- Remplacer mocks par vraies réponses
- Gérer loading states (LLM peut être lent)
- Gérer erreurs LLM (timeout, quota)

### Étape 4 — Interface chat (optionnel, après soutenance)

- Uniquement si Niveau 1 + 2 validés
- Nécessite backend multi-tours stabilisé

---

## Question clé : DS ou React pur ?

**Pour le stepper d'étapes** : créer d'abord en React/Tailwind pur dans le frontend, puis migrer vers le DS si le composant s'avère générique et réutilisable. Créer directement dans le DS ralentit l'itération.

**Pour les checkboxes et items éditables** : Tailwind natif suffit — pas besoin de DS.

**Pour les cards suggestions/projets** : `sh-card` du DS suffit comme conteneur, le contenu est du React.
