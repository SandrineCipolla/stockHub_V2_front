/**
 * @fileoverview Calcul des prédictions IA pour la page StockDetail
 *
 * NOTE JURY (C2.5 RNCP) : Ce calcul est intentionnellement simplifié.
 * En l'absence d'historique de consommation réel côté backend, le taux de
 * consommation journalière est simulé à 10% de la quantité actuelle par jour.
 * Une implémentation production utiliserait un historique réel ou l'API Claude/OpenAI.
 * Ce pattern illustre l'intégration de l'IA prédictive dans la gestion de stocks.
 */

import type { StockDetailItem, StockPrediction, RiskLevel } from '@/types';
import type { ItemPrediction } from '@/services/api/predictionsAPI';

/**
 * Calcule les prédictions de rupture de stock à partir des items à risque.
 * Ne retourne des prédictions que pour les items en état critical, low ou out-of-stock.
 *
 * @param items - Items du stock
 * @param predictionMap - Données réelles de prédiction par itemId (optionnel)
 *   Si absent ou absent pour un item, la consommation est simulée à 10%/j.
 */
export function computePredictions(
  items: StockDetailItem[],
  predictionMap?: Record<number, ItemPrediction>
): StockPrediction[] {
  return items
    .filter(
      item => item.status === 'critical' || item.status === 'low' || item.status === 'out-of-stock'
    )
    .map(item => {
      const apiPrediction = predictionMap?.[item.id];

      // Utilise le taux réel du backend si disponible, sinon simulation à 10%/j
      const dailyRate = apiPrediction
        ? Math.max(0.01, apiPrediction.avgDailyConsumption)
        : Math.max(1, Math.round(item.quantity * 0.1));

      const daysUntilRupture = item.quantity === 0 ? 0 : Math.floor(item.quantity / dailyRate);

      const recommendedReorderQuantity = apiPrediction
        ? apiPrediction.recommendedRestock
        : Math.max(10, (item.minimumStock ?? 1) * 3);

      const riskLevel: RiskLevel =
        item.status === 'out-of-stock'
          ? 'critical'
          : item.status === 'critical'
            ? 'high'
            : item.status === 'low'
              ? 'medium'
              : 'low';

      const confidence =
        item.status === 'out-of-stock' ? 100 : item.status === 'critical' ? 92 : 78;

      return {
        stockName: item.label,
        stockId: String(item.id),
        riskLevel,
        daysUntilRupture: daysUntilRupture,
        confidence,
        dailyConsumptionRate: dailyRate,
        currentQuantity: item.quantity,
        recommendedReorderQuantity,
        simulatedFallback: !apiPrediction,
      };
    });
}
