/**
 * @fileoverview AI-powered predictive algorithms for stock management
 * @description Implements business intelligence algorithms for:
 * - Stock rupture prediction
 * - Overstock detection
 * - Optimal reorder quantity calculation
 * - Confidence level computation
 *
 * @module aiPredictions
 * @category Business Intelligence
 * @requires Stock type
 */

import type { Stock } from '@/types/stock';

/**
 * Priority levels for AI suggestions
 */
export type SuggestionPriority = 'critical' | 'high' | 'medium' | 'low';

/**
 * Types of AI suggestions
 */
export type SuggestionType =
  | 'rupture-risk'      // Stock rupture imminent
  | 'overstock'         // Surstock détecté
  | 'reorder-now'       // Réapprovisionnement urgent
  | 'reorder-soon'      // Réapprovisionnement à prévoir
  | 'optimize-stock';   // Optimisation des seuils

/**
 * AI-generated suggestion for stock management
 */
export interface AISuggestion {
  id: string;
  stockId: number;
  stockName: string;
  type: SuggestionType;
  priority: SuggestionPriority;
  confidence: number; // 0-100
  title: string;
  message: string;
  action: string;
  impact: string;
  quantityRecommended?: number;
  daysUntilRupture?: number;
  savingsEstimate?: number;
}

/**
 * Consumption trend analysis result
 */
interface ConsumptionTrend {
  dailyAverage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  volatility: number; // 0-1 (coefficient de variation)
  confidence: number; // 0-100
}

/**
 * Configuration for AI algorithms
 */
const AI_CONFIG = {
  // Seuils de détection
  CRITICAL_DAYS_THRESHOLD: 3,      // Rupture critique si < 3 jours
  HIGH_PRIORITY_DAYS: 7,            // Priorité haute si < 7 jours
  OVERSTOCK_RATIO: 2.0,             // Surstock si > 2x maxQuantity

  // Calculs de confiance
  MIN_CONFIDENCE: 70,               // Confiance minimale pour suggestion
  HIGH_CONFIDENCE: 85,              // Seuil de confiance élevée

  // Facteurs de calcul
  SAFETY_STOCK_FACTOR: 0.2,        // 20% de stock de sécurité
  LEAD_TIME_DAYS: 5,                // Délai de réapprovisionnement
  VOLATILITY_PENALTY: 0.3,          // Pénalité pour volatilité élevée
} as const;

/**
 * Analyzes consumption trends based on historical data (simulated)
 *
 * @param stock - Stock item to analyze
 * @returns Consumption trend analysis
 *
 * @example
 * ```ts
 * const trend = analyzeConsumptionTrend(stock);
 * console.log(`Daily average: ${trend.dailyAverage} units`);
 * ```
 */
function analyzeConsumptionTrend(stock: Stock): ConsumptionTrend {
  // Utiliser les seuils avec valeurs par défaut
  const minThreshold = stock.minThreshold ?? 10;
  const maxThreshold = stock.maxThreshold ?? 100;

  // Simulation : calcul basé sur la différence entre quantité actuelle et seuil optimal
  const optimalMidpoint = (minThreshold + maxThreshold) / 2;
  const deviation = Math.abs(stock.quantity - optimalMidpoint);

  // Estimation de la consommation moyenne quotidienne (simulation)
  // Plus la quantité est basse, plus la consommation estimée est élevée
  const baseConsumption = maxThreshold * 0.05; // 5% du max par jour
  const adjustmentFactor = stock.quantity < optimalMidpoint ? 1.5 : 0.7;
  const dailyAverage = baseConsumption * adjustmentFactor;

  // Détection de tendance (simulation basée sur position relative)
  const relativePosition = stock.quantity / maxThreshold;
  let trend: ConsumptionTrend['trend'];
  if (relativePosition < 0.3) {
    trend = 'increasing'; // Consommation élevée
  } else if (relativePosition > 0.7) {
    trend = 'decreasing'; // Consommation faible
  } else {
    trend = 'stable';
  }

  // Calcul de la volatilité (coefficient de variation simulé)
  // Plus le stock est proche des extrêmes, plus la volatilité est élevée
  const volatility = Math.min(deviation / optimalMidpoint, 1);

  // Confiance : haute si proche des seuils (données plus significatives)
  const confidence = Math.min(
    AI_CONFIG.MIN_CONFIDENCE + (deviation / optimalMidpoint) * 20,
    100
  );

  return {
    dailyAverage,
    trend,
    volatility,
    confidence: Math.round(confidence),
  };
}

/**
 * Predicts days until stock rupture based on consumption trends
 *
 * @param stock - Stock item
 * @param trend - Consumption trend analysis
 * @returns Number of days until rupture, or null if no risk
 */
function predictDaysUntilRupture(
  stock: Stock,
  trend: ConsumptionTrend
): number | null {
  if (stock.quantity <= 0) {
    return 0; // Rupture immédiate
  }

  if (trend.dailyAverage <= 0) {
    return null; // Pas de consommation détectée
  }

  // Calcul simple : quantité restante / consommation moyenne
  const daysUntilEmpty = stock.quantity / trend.dailyAverage;

  // Ajustement selon la volatilité (plus de volatilité = prédiction plus pessimiste)
  const adjustedDays = daysUntilEmpty * (1 - trend.volatility * AI_CONFIG.VOLATILITY_PENALTY);

  return Math.floor(adjustedDays);
}

/**
 * Calculates optimal reorder quantity using economic order quantity (EOQ) simulation
 *
 * @param stock - Stock item
 * @param trend - Consumption trend analysis
 * @returns Recommended quantity to order
 */
function calculateOptimalReorderQuantity(
  stock: Stock,
  trend: ConsumptionTrend
): number {
  const minThreshold = stock.minThreshold ?? 10;
  const maxThreshold = stock.maxThreshold ?? 100;

  // Quantité pour couvrir le délai de livraison + stock de sécurité
  const leadTimeDemand = trend.dailyAverage * AI_CONFIG.LEAD_TIME_DAYS;
  const safetyStock = leadTimeDemand * AI_CONFIG.SAFETY_STOCK_FACTOR;

  // Quantité cible : ramener au point médian optimal
  const targetQuantity = (minThreshold + maxThreshold) / 2;
  const currentGap = Math.max(0, targetQuantity - stock.quantity);

  // Quantité recommandée : gap + demande pendant lead time + sécurité
  const recommendedQuantity = currentGap + leadTimeDemand + safetyStock;

  // Ajustement selon la tendance
  let finalQuantity = recommendedQuantity;
  if (trend.trend === 'increasing') {
    finalQuantity *= 1.2; // +20% si tendance à la hausse
  } else if (trend.trend === 'decreasing') {
    finalQuantity *= 0.8; // -20% si tendance à la baisse
  }

  // Ne pas dépasser maxThreshold
  return Math.min(Math.round(finalQuantity), maxThreshold);
}

/**
 * Generates AI suggestion for stock rupture risk
 */
function generateRuptureRiskSuggestion(
  stock: Stock,
  trend: ConsumptionTrend,
  daysUntilRupture: number
): AISuggestion {
  const priority: SuggestionPriority =
    daysUntilRupture <= AI_CONFIG.CRITICAL_DAYS_THRESHOLD ? 'critical' :
    daysUntilRupture <= AI_CONFIG.HIGH_PRIORITY_DAYS ? 'high' : 'medium';

  const confidence = Math.min(
    trend.confidence - (trend.volatility * 10),
    100
  );

  const quantityRecommended = calculateOptimalReorderQuantity(stock, trend);

  return {
    id: `rupture-${stock.id}`,
    stockId: stock.id,
    stockName: stock.name,
    type: 'rupture-risk',
    priority,
    confidence: Math.round(confidence),
    title: `⚠️ Risque de rupture détecté`,
    message: `Stock ${stock.name} sera en rupture dans ${daysUntilRupture} jour${daysUntilRupture > 1 ? 's' : ''} selon l'analyse des tendances.`,
    action: `Commander ${quantityRecommended} unités`,
    impact: `Évite une rupture de stock et maintient la continuité de service`,
    quantityRecommended,
    daysUntilRupture,
  };
}

/**
 * Generates AI suggestion for overstock situation
 */
function generateOverstockSuggestion(
  stock: Stock,
  trend: ConsumptionTrend
): AISuggestion {
  const maxThreshold = stock.maxThreshold ?? 100;
  const excessRatio = stock.quantity / maxThreshold;
  const excessQuantity = stock.quantity - maxThreshold;

  // Estimation des économies (coût de stockage évité)
  const storageCostPerUnit = 2; // €/unité/mois (simulation)
  const savingsEstimate = Math.round(excessQuantity * storageCostPerUnit);

  return {
    id: `overstock-${stock.id}`,
    stockId: stock.id,
    stockName: stock.name,
    type: 'overstock',
    priority: excessRatio > 2.5 ? 'high' : 'medium',
    confidence: Math.round(trend.confidence),
    title: `📦 Surstock détecté`,
    message: `Stock ${stock.name} dépasse le seuil optimal de ${Math.round((excessRatio - 1) * 100)}%.`,
    action: `Réduire les commandes ou promouvoir le produit`,
    impact: `Économie estimée : ${savingsEstimate}€/mois en coûts de stockage`,
    savingsEstimate,
  };
}

/**
 * Generates AI suggestion for optimal reorder
 */
function generateReorderSuggestion(
  stock: Stock,
  trend: ConsumptionTrend,
  daysUntilRupture: number | null
): AISuggestion {
  const quantityRecommended = calculateOptimalReorderQuantity(stock, trend);
  const isUrgent = daysUntilRupture !== null && daysUntilRupture <= AI_CONFIG.HIGH_PRIORITY_DAYS;

  return {
    id: `reorder-${stock.id}`,
    stockId: stock.id,
    stockName: stock.name,
    type: isUrgent ? 'reorder-now' : 'reorder-soon',
    priority: isUrgent ? 'high' : 'medium',
    confidence: Math.round(trend.confidence),
    title: isUrgent ? `🔔 Réapprovisionnement urgent` : `📅 Planifier réapprovisionnement`,
    message: `Stock ${stock.name} nécessite un réapprovisionnement optimal de ${quantityRecommended} unités.`,
    action: `Commander ${quantityRecommended} unités`,
    impact: `Maintient le stock à un niveau optimal et évite les ruptures`,
    quantityRecommended,
    daysUntilRupture: daysUntilRupture ?? undefined,
  };
}

/**
 * Generates AI suggestion for stock threshold optimization
 */
function generateOptimizeSuggestion(
  stock: Stock,
  trend: ConsumptionTrend
): AISuggestion {
  const minThreshold = stock.minThreshold ?? 10;
  const maxThreshold = stock.maxThreshold ?? 100;

  // Suggestion de nouveaux seuils basés sur la consommation réelle
  const recommendedMin = Math.round(trend.dailyAverage * AI_CONFIG.LEAD_TIME_DAYS * 1.5);
  const recommendedMax = Math.round(recommendedMin * 3);

  return {
    id: `optimize-${stock.id}`,
    stockId: stock.id,
    stockName: stock.name,
    type: 'optimize-stock',
    priority: 'low',
    confidence: Math.round(trend.confidence * 0.9), // Moins certain pour optimisation
    title: `⚙️ Optimisation des seuils recommandée`,
    message: `Les seuils actuels (${minThreshold}-${maxThreshold}) pourraient être ajustés à (${recommendedMin}-${recommendedMax}) selon la consommation réelle.`,
    action: `Ajuster les seuils min/max`,
    impact: `Optimise la gestion du stock et réduit les coûts de stockage`,
  };
}

/**
 * Main algorithm: Generates AI-powered suggestions for all stocks
 *
 * @param stocks - Array of stock items to analyze
 * @returns Array of AI suggestions sorted by priority
 *
 * @example
 * ```ts
 * const suggestions = generateAISuggestions(stocks);
 * const topSuggestions = suggestions.slice(0, 5);
 * ```
 */
export function generateAISuggestions(stocks: Stock[]): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  for (const stock of stocks) {
    const trend = analyzeConsumptionTrend(stock);

    // Vérifier confiance minimale
    if (trend.confidence < AI_CONFIG.MIN_CONFIDENCE) {
      continue; // Pas assez de données pour une suggestion fiable
    }

    const daysUntilRupture = predictDaysUntilRupture(stock, trend);

    // 1. Risque de rupture (priorité la plus haute)
    if (daysUntilRupture !== null && daysUntilRupture <= AI_CONFIG.HIGH_PRIORITY_DAYS) {
      suggestions.push(generateRuptureRiskSuggestion(stock, trend, daysUntilRupture));
      continue; // Une seule suggestion par stock
    }

    // 2. Surstock
    const maxThreshold = stock.maxThreshold ?? 100;
    if (stock.quantity > maxThreshold * AI_CONFIG.OVERSTOCK_RATIO) {
      suggestions.push(generateOverstockSuggestion(stock, trend));
      continue;
    }

    // 3. Réapprovisionnement optimal
    const minThreshold = stock.minThreshold ?? 10;
    if (stock.quantity < minThreshold * 1.5) {
      suggestions.push(generateReorderSuggestion(stock, trend, daysUntilRupture));
      continue;
    }

    // 4. Optimisation des seuils (si rien de critique)
    if (trend.volatility > 0.5 && trend.confidence >= AI_CONFIG.HIGH_CONFIDENCE) {
      suggestions.push(generateOptimizeSuggestion(stock, trend));
    }
  }

  // Tri par priorité puis confiance
  const priorityOrder: Record<SuggestionPriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return suggestions.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidence - a.confidence; // Plus haute confiance en premier
  });
}

/**
 * Gets top N AI suggestions
 *
 * @param stocks - Array of stock items
 * @param limit - Maximum number of suggestions (default: 5)
 * @returns Top AI suggestions
 */
export function getTopAISuggestions(stocks: Stock[], limit = 5): AISuggestion[] {
  const allSuggestions = generateAISuggestions(stocks);
  return allSuggestions.slice(0, limit);
}
