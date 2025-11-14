/**
 * @fileoverview StockPrediction - ML-powered stock rupture prediction component
 * @description Displays ML prediction with progress bar, confidence level, and recommendations
 */

import { AlertTriangle, TrendingDown, Clock, Package, Info } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { StockPrediction as StockPredictionData } from '@/utils/mlSimulation';
import { CardWrapper } from '@/components/common/CardWrapper';

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
 * Get color scheme based on risk level
 * Uses default variant with custom border colors
 * Background colors only on hover (managed by Tailwind)
 */
function getRiskColors(riskLevel: StockPredictionData['riskLevel']) {
  switch (riskLevel) {
    case 'critical':
      return {
        borderColor: 'border-l-4 border-l-red-500 dark:border-l-red-400',
        hoverBg: 'hover:bg-red-50 dark:hover:bg-red-950/30',
        text: 'text-red-700 dark:text-red-400',
        progress: 'bg-red-500',
        icon: 'text-red-600 dark:text-red-400',
      };
    case 'high':
      return {
        borderColor: 'border-l-4 border-l-orange-500 dark:border-l-orange-400',
        hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-950/30',
        text: 'text-orange-700 dark:text-orange-400',
        progress: 'bg-orange-500',
        icon: 'text-orange-600 dark:text-orange-400',
      };
    case 'medium':
      return {
        borderColor: 'border-l-4 border-l-amber-500 dark:border-l-amber-400',
        hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-400',
        progress: 'bg-amber-500',
        icon: 'text-amber-600 dark:text-amber-400',
      };
    case 'low':
    default:
      return {
        borderColor: 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400',
        hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        progress: 'bg-emerald-500',
        icon: 'text-emerald-600 dark:text-emerald-400',
      };
  }
}

/**
 * Calculate risk percentage (0-100) for progress bar
 * Higher risk = higher percentage
 */
function calculateRiskPercentage(prediction: StockPredictionData): number {
  if (prediction.daysUntilRupture === null) return 0;

  // Critical: 0-3 days = 100-80%
  if (prediction.daysUntilRupture <= 3) {
    return 100 - (prediction.daysUntilRupture * 6.67);
  }

  // High: 4-7 days = 80-50%
  if (prediction.daysUntilRupture <= 7) {
    return 80 - ((prediction.daysUntilRupture - 3) * 7.5);
  }

  // Medium: 8-14 days = 50-25%
  if (prediction.daysUntilRupture <= 14) {
    return 50 - ((prediction.daysUntilRupture - 7) * 3.57);
  }

  // Low: 15+ days = 25-0%
  return Math.max(0, 25 - ((prediction.daysUntilRupture - 14) * 1));
}

/**
 * Format date to readable string
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Animation variants for progress bar
 */
const progressVariants: Variants = {
  hidden: { width: 0 },
  visible: (percentage: number) => ({
    width: `${percentage}%`,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2,
    },
  }),
};

/**
 * StockPrediction Component
 *
 * Displays ML-powered stock rupture prediction with:
 * - Risk level indicator (critical/high/medium/low)
 * - Progress bar showing risk percentage
 * - Days until rupture with confidence interval
 * - ML confidence level
 * - Recommended actions and reorder date
 *
 * @component
 * @example
 * ```tsx
 * import { predictStockRupture } from '@/utils/mlSimulation';
 *
 * const prediction = predictStockRupture(stock);
 *
 * <StockPrediction
 *   prediction={prediction}
 *   showDetails={true}
 * />
 * ```
 */
export function StockPrediction({
  prediction,
  className = '',
  showDetails = true,
}: StockPredictionProps) {
  const shouldReduceMotion = useReducedMotion();
  const colors = getRiskColors(prediction.riskLevel);
  const riskPercentage = calculateRiskPercentage(prediction);

  // Format main message
  const getMessage = () => {
    if (prediction.daysUntilRupture === null) {
      return 'Aucun risque de rupture détecté';
    }

    if (prediction.daysUntilRupture === 0) {
      return 'Rupture de stock imminente';
    }

    return `Rupture prévue dans ${prediction.daysUntilRupture} jour${prediction.daysUntilRupture > 1 ? 's' : ''}`;
  };

  return (
    <CardWrapper
      variant="default"
      className={`${colors.borderColor} ${colors.hoverBg} transition-colors [&:hover]:!border-transparent ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`mt-0.5 ${colors.icon}`}>
            {prediction.riskLevel === 'critical' || prediction.riskLevel === 'high' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {prediction.stockName}
              </span>
            </div>
            <h3 className={`text-sm font-semibold ${colors.text} mb-1`}>
              🤖 IA détecte : {getMessage()}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Analyse ML basée sur régression linéaire
            </p>
          </div>
        </div>

        {/* Confidence badge */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
          <Info className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {prediction.confidence}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Niveau de risque
          </span>
          <span className={`text-xs font-semibold ${colors.text} uppercase`}>
            {prediction.riskLevel === 'critical' && 'Critique'}
            {prediction.riskLevel === 'high' && 'Élevé'}
            {prediction.riskLevel === 'medium' && 'Modéré'}
            {prediction.riskLevel === 'low' && 'Faible'}
          </span>
        </div>

        {/* Progress bar container */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${colors.progress} rounded-full`}
            variants={shouldReduceMotion ? undefined : progressVariants}
            initial={shouldReduceMotion ? { width: `${riskPercentage}%` } : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            custom={riskPercentage}
          />
        </div>

        {/* Confidence interval */}
        {prediction.daysUntilRupture !== null && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Pessimiste: {prediction.daysUntilRupturePessimistic}j
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Optimiste: {prediction.daysUntilRuptureOptimistic}j
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      {showDetails && prediction.daysUntilRupture !== null && (
        <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Consumption rate */}
          <div className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Consommation moyenne:</span>{' '}
                {prediction.dailyConsumptionRate.toFixed(2)} unités/jour
              </p>
            </div>
          </div>

          {/* Rupture date */}
          {prediction.dateOfRupture && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Date de rupture estimée:</span>{' '}
                  {formatDate(prediction.dateOfRupture)}
                </p>
              </div>
            </div>
          )}

          {/* Recommended action */}
          {prediction.recommendedReorderDate && prediction.recommendedReorderQuantity > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-2">
                <Package className={`w-4 h-4 ${colors.icon} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${colors.text} mb-1`}>
                    Action recommandée
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Commander <span className="font-semibold">{prediction.recommendedReorderQuantity} unités</span>{' '}
                    avant le <span className="font-semibold">{formatDate(prediction.recommendedReorderDate)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </CardWrapper>
  );
}
