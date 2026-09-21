Crée une issue GitHub sur le repo stockHub_V2_front.

Titre : feat: distinguer et afficher les suggestions LLM
vs déterministes dans Dashboard et Analytics

Labels : ai, frontend

Description :

## Contexte

Le backend retourne désormais des `AISuggestion` avec un champ
`source: 'llm' | 'deterministic'`.
Le frontend doit refléter cette distinction visuellement
et brancher `AIAlertBannerWrapper` et `StockPrediction`
sur le vrai endpoint `/suggestions`.

## Dépend de

Issue "feat: AIService LLM" sur stockhub_back ✅

## Critères d'acceptation

### Service API

- [ ] `predictionsAPI.ts` : ajouter
      `getStockSuggestions(stockId): Promise<AISuggestion[]>`

### Hook

- [ ] `useSuggestions(stockId)` créé avec React Query

### Composants

- [ ] `AIAlertBannerWrapper` : utilise `useSuggestions`
      au lieu de `generateAISuggestions()` local
- [ ] Distinction visuelle :
  - Badge "IA" (icône Sparkles) sur suggestions `source: 'llm'`
  - Badge "Calcul" (icône TrendingDown) sur `source: 'deterministic'`
- [ ] Loading state pendant appel LLM
      (plus long que calcul local — skeleton ou spinner)
- [ ] Si `source: 'deterministic'` partout :
      message discret "Suggestions basées sur vos données"
- [ ] Si `source: 'llm'` présent :
      mention "Propulsé par IA • Mistral via OpenRouter"

### Tests

- [ ] Tests mis à jour : mock endpoint `/suggestions`
- [ ] Scénario testé : fallback déterministe affiché correctement

## Référence RNCP

Critère C2.5 — UX du module IA visible et démontrable en soutenance
