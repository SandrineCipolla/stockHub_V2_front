import { useCallback } from 'react';
import { createFrontendError, useAsyncAction } from './useFrontendState';
import { PredictionsAPI } from '@/services/api/predictionsAPI';
import type { ItemPrediction, ItemHistory } from '@/services/api/predictionsAPI';
import { logger } from '@/utils/logger';

/**
 * Hook de chargement des prédictions et de l'historique d'un item.
 * Expose loadPrediction et loadHistory connectés au backend v2.
 */
export const usePredictions = (stockId: number | string, itemId: number | string) => {
  const loadPredictionAction = useAsyncAction(
    useCallback(async (): Promise<ItemPrediction> => {
      try {
        logger.debug('Chargement de la prédiction depuis le backend...', { stockId, itemId });
        const prediction = await PredictionsAPI.fetchItemPrediction(stockId, itemId);
        logger.debug('Prédiction chargée:', prediction);
        return prediction;
      } catch (error) {
        logger.error('Erreur lors du chargement de la prédiction:', error);
        throw createFrontendError(
          'network',
          'Impossible de charger la prédiction depuis le serveur'
        );
      }
    }, [stockId, itemId]),
    { simulateDelay: 0 }
  );

  const loadHistoryAction = useAsyncAction(
    useCallback(
      async (days?: number): Promise<ItemHistory> => {
        try {
          logger.debug("Chargement de l'historique depuis le backend...", {
            stockId,
            itemId,
            days,
          });
          const history = await PredictionsAPI.fetchItemHistory(stockId, itemId, days);
          logger.debug('Historique chargé:', history);
          return history;
        } catch (error) {
          logger.error("Erreur lors du chargement de l'historique:", error);
          throw createFrontendError(
            'network',
            "Impossible de charger l'historique depuis le serveur"
          );
        }
      },
      [stockId, itemId]
    ),
    { simulateDelay: 0 }
  );

  const loadPrediction = useCallback(() => loadPredictionAction.execute(), [loadPredictionAction]);

  const loadHistory = useCallback(
    (days?: number) => loadHistoryAction.execute(days),
    [loadHistoryAction]
  );

  return {
    loadPrediction,
    loadHistory,

    isLoading: {
      prediction: loadPredictionAction.isLoading,
      history: loadHistoryAction.isLoading,
    },

    errors: {
      prediction: loadPredictionAction.error,
      history: loadHistoryAction.error,
    },

    resetErrors: {
      prediction: loadPredictionAction.reset,
      history: loadHistoryAction.reset,
    },
  };
};
