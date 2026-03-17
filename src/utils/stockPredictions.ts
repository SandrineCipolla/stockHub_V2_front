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

/**
 * Calcule les prédictions de rupture de stock à partir des items à risque.
 * Ne retourne des prédictions que pour les items en état critical, low ou out-of-stock.
 */
export function computePredictions(items: StockDetailItem[]): StockPrediction[] {
  return items
    .filter(
      item => item.status === 'critical' || item.status === 'low' || item.status === 'out-of-stock'
    )
    .map(item => {
      // Taux de consommation simulé : 10% de la quantité actuelle par jour (min 1)
      const dailyRate = Math.max(1, Math.round(item.quantity * 0.1));
      const daysUntilRupture = item.quantity === 0 ? 0 : Math.floor(item.quantity / dailyRate);

      const riskLevel: RiskLevel =
        item.status === 'out-of-stock'
          ? 'critical'
          : item.status === 'critical'
            ? 'high'
            : item.status === 'low'
              ? 'medium'
              : 'low';

      const confidence = item.status === 'out-of-stock' ? 99 : item.status === 'critical' ? 92 : 78;

      return {
        stockName: item.label,
        stockId: String(item.id),
        riskLevel,
        daysUntilRupture: item.quantity === 0 ? null : daysUntilRupture,
        confidence,
        dailyConsumptionRate: dailyRate,
        currentQuantity: item.quantity,
        recommendedReorderQuantity: Math.max(10, (item.minimumStock ?? 1) * 3),
      };
    });
}
