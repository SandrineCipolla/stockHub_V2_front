/**
 * @fileoverview StockPrediction - ML-powered stock rupture prediction component
 * @description Wrapper React pour le web component sh-stock-prediction-card du Design System
 */

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { StockPrediction as StockPredictionData } from '@/utils/mlSimulation';

/**
 * Props for StockPrediction component
 */
export interface StockPredictionProps {
  /** ML prediction data */
  prediction: StockPredictionData;
  /** Optional CSS class name */
  className?: string;
  /** Show detailed metrics (default: true) */
  showDetails?: boolean;
}

/**
 * StockPrediction component - Wrapper pour sh-stock-prediction-card
 * Affiche les prédictions ML de rupture de stock avec métriques détaillées
 */
export const StockPrediction: React.FC<StockPredictionProps> = ({
  prediction,
  className = '',
  showDetails = true,
}) => {
  const { theme } = useTheme();

  const {
    stockId,
    stockName,
    riskLevel,
    daysUntilRupture,
    dateOfRupture,
    confidence,
    dailyConsumptionRate,
    currentQuantity,
    daysUntilRupturePessimistic,
    daysUntilRuptureOptimistic,
    recommendedReorderDate,
    recommendedReorderQuantity,
  } = prediction;

  return React.createElement('sh-stock-prediction-card', {
    'stock-id': stockId,
    'stock-name': stockName,
    'risk-level': riskLevel,
    'days-until-rupture': daysUntilRupture !== null ? daysUntilRupture : undefined,
    'date-of-rupture': dateOfRupture ? dateOfRupture.toISOString() : undefined,
    confidence: confidence,
    'daily-consumption-rate': dailyConsumptionRate,
    'current-quantity': currentQuantity,
    'days-until-rupture-pessimistic': daysUntilRupturePessimistic,
    'days-until-rupture-optimistic': daysUntilRuptureOptimistic,
    'recommended-reorder-date': recommendedReorderDate ? recommendedReorderDate.toISOString() : undefined,
    'recommended-reorder-quantity': recommendedReorderQuantity,
    'show-details': showDetails ? '' : undefined,
    'data-theme': theme,
    className: className,
  });
};
