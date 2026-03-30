import { useCallback } from 'react';
import { createFrontendError, useAsyncAction } from './useFrontendState';
import { PredictionsAPI } from '@/services/api/predictionsAPI';
import type { BackendSuggestion } from '@/services/api/predictionsAPI';
import { logger } from '@/utils/logger';

/**
 * Hook de chargement des suggestions IA backend pour un stock.
 * Endpoint: GET /api/v2/stocks/:stockId/suggestions
 */
export const useSuggestions = (stockId: number | string) => {
  const loadSuggestionsAction = useAsyncAction(
    useCallback(async (): Promise<BackendSuggestion[]> => {
      try {
        logger.debug('Chargement des suggestions IA depuis le backend...', { stockId });
        const suggestions = await PredictionsAPI.getStockSuggestions(stockId);
        logger.debug(`Suggestions chargées: ${suggestions.length}`, {
          llm: suggestions.filter(s => s.source === 'llm').length,
          deterministic: suggestions.filter(s => s.source === 'deterministic').length,
        });
        return suggestions;
      } catch (error) {
        logger.error('Erreur lors du chargement des suggestions:', error);
        throw createFrontendError(
          'network',
          'Impossible de charger les suggestions depuis le serveur'
        );
      }
    }, [stockId]),
    { simulateDelay: 0 }
  );

  const loadSuggestions = useCallback(
    () => loadSuggestionsAction.execute(),
    [loadSuggestionsAction]
  );

  return {
    loadSuggestions,
    isLoading: loadSuggestionsAction.isLoading,
    error: loadSuggestionsAction.error,
    resetError: loadSuggestionsAction.reset,
  };
};
