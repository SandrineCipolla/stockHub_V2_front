# Audit faisabilité — Module IA Frontend StockHub V2

## Contexte

Je veux ajouter côté frontend les écrans suivants :

1. Page "Que faire avec ce que j'ai ?"
   → suggestions LLM par catégorie (recettes/projets/bricolage)
   → tuto résumé + détail à la demande
2. Bibliothèque de projets sauvegardés
   → liste avec statut (TODO / IN_PROGRESS / DONE)
   → vue détail avec étapes cochables
3. Liste d'approvisionnement
   → générée depuis un projet
   → éditable, cases à cocher, partage famille
4. (Optionnel V2) Interface conversationnelle assistant

## Tâche 1 — État du repo stockHub_V2_front

Analyser :

### Structure et routing

- `src/pages/` : toutes les pages existantes
- `src/App.tsx` ou équivalent : routes définies
- Combien de pages existent déjà ?
- Y a-t-il un pattern de layout partagé ?

### Composants IA existants

- `src/components/ai/` : ce qui existe déjà
- `src/utils/aiPredictions.ts`, `mlSimulation.ts`,
  `stockPredictions.ts` : état actuel
- Ces composants sont-ils connectés au backend
  ou encore sur données mockées ?

### Services API

- `src/services/api/` : quels services existent ?
- Y a-t-il déjà un pattern établi
  (ex: itemsAPI.ts, stocksAPI.ts) ?
- React Query est-il déjà utilisé ?
  Quels hooks existent (useItems, useStocks...) ?

### Design System

- Quels composants du DS sont disponibles
  et utilisés dans le front ?
- Y a-t-il des composants cards, listes,
  steppers, badges déjà dans le DS ?
- Version actuelle du DS dans package.json ?

### État général

- `package.json` : dépendances notables
- Nombre de composants dans src/components/
- Y a-t-il des composants réutilisables
  qui pourraient servir pour le module IA ?
  (ex: cards, modals, listes éditables)

## Tâche 2 — Issues front en cours

Lister toutes les issues ouvertes stockHub_V2_front.
Pour chaque issue : titre, labels, état.
Identifier celles qui touchent :

- Les pages Dashboard, Analytics, StockDetail
- Les composants ai/
- Les services API
- Le routing

## Tâche 3 — Estimation par écran

| Écran / Composant                | Réutilise existant ? | Complexité | Durée est. |
| -------------------------------- | -------------------- | ---------- | ---------- |
| Page suggestions "Que faire ?"   | ?                    | ?          | ?          |
| Card suggestion (recette/projet) | ?                    | ?          | ?          |
| Vue tuto détail                  | ?                    | ?          | ?          |
| Page bibliothèque projets        | ?                    | ?          | ?          |
| Card projet avec statut          | ?                    | ?          | ?          |
| Vue détail projet + étapes       | ?                    | ?          | ?          |
| Stepper étapes cochables         | ?                    | ?          | ?          |
| Page liste d'approvisionnement   | ?                    | ?          | ?          |
| Items éditables avec quantités   | ?                    | ?          | ?          |
| Interface chat (optionnel)       | ?                    | ?          | ?          |

## Tâche 4 — Conflits et dépendances

- Quelles pages existantes faudrait-il modifier
  pour intégrer le module IA ?
  (ex: Dashboard, StockDetailPage, Analytics)
- Y a-t-il des PRs ouvertes qui touchent ces pages ?
- Le Design System a-t-il les composants nécessaires
  ou faut-il en créer de nouveaux ?

## Format du rapport

Produire `audit-results/ia-front-feasibility-audit.md` avec :

- Résumé : ce qui est réutilisable vs à créer from scratch
- Tableau d'estimation par écran
- Pages existantes à modifier (risque de régression)
- Recommandation : ordre d'implémentation optimal
- Question clé : faut-il de nouveaux composants DS
  ou les composants existants suffisent ?

```

---

## Ce que les deux audits ensemble vont révéler

Une fois que tu as les deux rapports, on pourra répondre précisément à :
```

Questions clés
├── Combien d'issues sont déjà en cours ?
│ → risque de surcharge ?
│
├── Le DS a-t-il les composants nécessaires ?
│ → si non, faut-il d'abord passer par le repo DS ?
│
├── Les patterns API/hooks sont-ils cohérents ?
│ → le nouveau code s'intègre naturellement ?
│
└── Estimation totale réaliste
→ Niveau 1 seul : X journées
→ Niveau 1 + 2 : Y journées
→ Go V2 ou Go V3 pour certaines briques ?
