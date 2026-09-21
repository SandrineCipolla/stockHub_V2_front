Crée une issue GitHub sur le repo stockHub_V2_front.

Titre : feat: brancher mlSimulation.ts et aiPredictions.ts
sur les endpoints de prédiction backend

Labels : ai, frontend

Description :

## Contexte

`mlSimulation.ts`, `stockPredictions.ts` et `aiPredictions.ts`
calculent actuellement des prédictions avec des constantes hardcodées
(taux 10%/j, historique simulé 30j, coûts figés).
Les vrais endpoints backend sont maintenant disponibles
(issue #XX stockhub_back).

## Dépend de

Issue "feat: module prédictions déterministes" sur stockhub_back ✅

## Critères d'acceptation

### Service API

- [ ] `src/services/api/predictionsAPI.ts` créé
  - `getItemPrediction(stockId, itemId): Promise<Prediction>`
  - `getItemHistory(stockId, itemId): Promise<HistoryEntry[]>`
  - Typage TypeScript complet des réponses

### Hook

- [ ] `src/hooks/usePredictions.ts` créé
  - Utilise React Query (cohérent avec `useItems.ts` existant)
  - Gère loading / error / données insuffisantes

### Mise à jour des utils

- [ ] `mlSimulation.ts` : remplacer `simulateHistoricalData()`
      par appel `getItemHistory()`
      — conserver la simulation comme fallback si `simulatedFallback: true`
- [ ] `stockPredictions.ts` : remplacer taux hardcodé 10%/j
      par `avgDailyConsumption` retourné par l'API
- [ ] `aiPredictions.ts` : remplacer taux hardcodé 5%/j
      par données réelles

### Fallback UX

- [ ] Si `simulatedFallback: true` → afficher mention discrète
      "Données insuffisantes — estimation approximative"
- [ ] Si API indisponible → conserver comportement actuel (dégradé gracieux)

### Tests

- [ ] Tests mis à jour avec mock des nouveaux endpoints
- [ ] Scénario testé : fallback quand backend indisponible

## Référence RNCP

Critère C2.5 — connexion front/back, gestion des cas limites
