/**
 * @fileoverview Machine Learning simulation for stock prediction
 * @description Implements statistical and ML algorithms:
 * - Linear regression for consumption prediction
 * - Confidence intervals based on historical variance
 * - Time-series forecasting for stock rupture
 * - Optimal reorder point calculation
 *
 * @module mlSimulation
 * @category Machine Learning
 * @requires Stock type
 */

import type { Stock } from '@/types/stock';

/**
 * Historical data point for time-series analysis
 */
interface DataPoint {
  timestamp: number; // Unix timestamp (ms)
  quantity: number;
}

/**
 * Result of linear regression analysis
 * Formula: y = slope * x + intercept
 */
export interface LinearRegressionResult {
  slope: number;           // Rate of consumption (units per day)
  intercept: number;       // Initial quantity at t=0
  rSquared: number;        // Coefficient of determination (0-1)
  variance: number;        // Variance of residuals
  confidence: number;      // Confidence level (0-100%)
}

/**
 * Stock prediction with confidence intervals
 */
export interface StockPrediction {
  stockId: number;
  stockName: string;
  currentQuantity: number;

  // Predictions
  daysUntilRupture: number | null;
  dateOfRupture: Date | null;

  // Confidence intervals (pessimistic/optimistic scenarios)
  daysUntilRupturePessimistic: number | null;
  daysUntilRuptureOptimistic: number | null;

  // ML metrics
  dailyConsumptionRate: number;
  confidence: number; // 0-100%
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // Recommendations
  recommendedReorderDate: Date | null;
  recommendedReorderQuantity: number;
}

/**
 * Configuration for ML algorithms
 */
const ML_CONFIG = {
  // Regression parameters
  MIN_DATA_POINTS: 3,           // Minimum historical points for regression
  CONFIDENCE_LEVEL: 0.95,       // 95% confidence interval

  // Time parameters
  SIMULATION_HISTORY_DAYS: 30,  // Simulate 30 days of history
  LEAD_TIME_DAYS: 5,            // Delivery lead time
  SAFETY_MARGIN_DAYS: 2,        // Additional safety margin

  // Risk thresholds (days)
  RISK_CRITICAL: 3,
  RISK_HIGH: 7,
  RISK_MEDIUM: 14,

  // Confidence penalties
  LOW_VARIANCE_BONUS: 10,       // +10% confidence if low variance
  HIGH_VARIANCE_PENALTY: 20,    // -20% confidence if high variance
} as const;

/**
 * Simulates historical consumption data for a stock item
 * Uses the current quantity and thresholds to extrapolate backward
 *
 * @param stock - Stock item
 * @param days - Number of days to simulate (default: 30)
 * @returns Array of historical data points
 *
 * @example
 * ```ts
 * const history = simulateHistoricalData(stock, 30);
 * // Returns 30 data points showing quantity evolution over time
 * ```
 */
function simulateHistoricalData(stock: Stock, days = ML_CONFIG.SIMULATION_HISTORY_DAYS): DataPoint[] {
  const now = Date.now();
  const dataPoints: DataPoint[] = [];

  // Calculate base consumption rate from thresholds
  const minThreshold = stock.minThreshold ?? 10;
  const maxThreshold = stock.maxThreshold ?? 100;

  // Estimate consumption rate: how fast we go from max to min
  // Adjust based on current stock status for realistic simulation
  let estimatedDaysToDeplete = 20; // Default: 20 days to go from max to min

  // Adapt simulation to stock status (why they're at current level)
  if (stock.status === 'critical') {
    // Critical stocks have been consumed rapidly → faster consumption rate
    estimatedDaysToDeplete = 10; // Fast consumption (10 days to deplete)
  } else if (stock.status === 'low') {
    // Low stocks have moderate consumption
    estimatedDaysToDeplete = 15; // Moderate consumption (15 days)
  } else if (stock.status === 'overstocked') {
    // Overstocked = slow consumption or recent purchase
    estimatedDaysToDeplete = 40; // Slow consumption (40 days)
  }
  // optimal or out-of-stock keep default (20 days)

  const baseConsumptionRate = (maxThreshold - minThreshold) / estimatedDaysToDeplete;

  // Add some randomness (±30%) to simulate realistic variance
  const variance = baseConsumptionRate * 0.3;

  // Generate historical data points showing consumption over time
  // Start from a higher quantity in the past and decrease to current level
  const startQuantity = Math.min(
    stock.quantity + (baseConsumptionRate * days),
    maxThreshold * 1.1
  );

  let currentQuantity = startQuantity;

  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - i) * 24 * 60 * 60 * 1000;

    dataPoints.push({
      timestamp,
      quantity: currentQuantity,
    });

    // SUBTRACT consumption for next day (moving forward in time)
    const dailyVariation = (Math.random() - 0.5) * variance;
    currentQuantity -= baseConsumptionRate + dailyVariation;

    // Ensure quantity stays within realistic bounds
    currentQuantity = Math.max(minThreshold * 0.5, Math.min(currentQuantity, maxThreshold * 1.2));
  }

  // Add current data point (actual current quantity)
  dataPoints.push({
    timestamp: now,
    quantity: stock.quantity,
  });

  return dataPoints;
}

/**
 * Performs linear regression on historical data
 * Uses least squares method: y = mx + b
 *
 * Mathematical formulas:
 * - slope (m) = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)
 * - intercept (b) = (∑y - m∑x) / n
 * - R² = 1 - (SS_res / SS_tot)
 *
 * @param dataPoints - Historical consumption data
 * @returns Linear regression analysis result
 *
 * @example
 * ```ts
 * const regression = performLinearRegression(history);
 * console.log(`Daily consumption: ${-regression.slope} units/day`);
 * console.log(`R²: ${regression.rSquared} (${regression.rSquared > 0.7 ? 'good fit' : 'poor fit'})`);
 * ```
 */
export function performLinearRegression(dataPoints: DataPoint[]): LinearRegressionResult {
  const n = dataPoints.length;

  if (n < ML_CONFIG.MIN_DATA_POINTS) {
    throw new Error(`Insufficient data points for regression. Need at least ${ML_CONFIG.MIN_DATA_POINTS}, got ${n}`);
  }

  // Convert timestamps to days (x-axis)
  const baseTimestamp = dataPoints[0].timestamp;
  const x = dataPoints.map(p => (p.timestamp - baseTimestamp) / (24 * 60 * 60 * 1000));
  const y = dataPoints.map(p => p.quantity);

  // Calculate sums for least squares method
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

  // Calculate slope (m) and intercept (b)
  // Formula: m = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Formula: b = (∑y - m∑x) / n
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² (coefficient of determination)
  const yMean = sumY / n;
  const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssRes = y.reduce((sum, val, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(val - predicted, 2);
  }, 0);

  const rSquared = 1 - (ssRes / ssTot);

  // Calculate variance of residuals
  const variance = ssRes / (n - 2); // Divide by (n-2) for sample variance

  // Calculate confidence based on R² and variance
  // High R² (good fit) = high confidence
  // Low variance = high confidence
  let confidence = rSquared * 100;

  // Adjust confidence based on variance
  const relativeVariance = Math.sqrt(variance) / yMean;
  if (relativeVariance < 0.1) {
    confidence += ML_CONFIG.LOW_VARIANCE_BONUS;
  } else if (relativeVariance > 0.3) {
    confidence -= ML_CONFIG.HIGH_VARIANCE_PENALTY;
  }

  // Clamp confidence to [0, 100]
  confidence = Math.max(0, Math.min(100, confidence));

  return {
    slope,
    intercept,
    rSquared,
    variance,
    confidence,
  };
}

/**
 * Predicts when stock will reach rupture point (quantity = 0)
 * Uses linear regression to forecast future consumption
 *
 * Formula: daysUntilRupture = -currentQuantity / slope
 * (when y = 0, then x = -intercept/slope)
 *
 * @param stock - Stock item
 * @param regression - Linear regression analysis
 * @returns Number of days until rupture, or null if no risk detected
 *
 * @example
 * ```ts
 * const days = predictRuptureTime(stock, regression);
 * if (days !== null && days < 7) {
 *   console.log(`⚠️ Rupture in ${days} days!`);
 * }
 * ```
 */
function predictRuptureTime(stock: Stock, regression: LinearRegressionResult): number | null {
  // If slope is positive or near zero, stock is increasing/stable (no rupture risk)
  if (regression.slope >= -0.01) {
    return null;
  }

  // Calculate when quantity will reach zero
  // y = slope * x + intercept
  // 0 = slope * x + currentQuantity (taking current as intercept)
  // x = -currentQuantity / slope

  const daysUntilRupture = -stock.quantity / regression.slope;

  // Only return if it's a realistic timeframe (< 365 days)
  if (daysUntilRupture < 0 || daysUntilRupture > 365) {
    return null;
  }

  return Math.floor(daysUntilRupture);
}

/**
 * Calculates confidence interval for rupture prediction
 * Uses variance to compute pessimistic and optimistic scenarios
 *
 * Formula: interval = prediction ± z * σ
 * where z = 1.96 for 95% confidence, σ = standard deviation
 *
 * @param prediction - Base prediction (days)
 * @param variance - Variance from regression
 * @param slope - Consumption rate (negative)
 * @returns [pessimistic, optimistic] days
 */
function calculateConfidenceInterval(
  prediction: number,
  variance: number,
  slope: number
): [number, number] {
  // Standard deviation of residuals
  const stdDev = Math.sqrt(variance);

  // Z-score for 95% confidence interval
  const zScore = 1.96;

  // Error margin in quantity units
  const errorMargin = zScore * stdDev;

  // Convert error margin to days (divide by consumption rate)
  // Negative slope means consumption, so we need absolute value
  const errorMarginDays = errorMargin / Math.abs(slope);

  // Pessimistic: rupture happens sooner (subtract error)
  const pessimistic = Math.max(0, Math.floor(prediction - errorMarginDays));

  // Optimistic: rupture happens later (add error)
  const optimistic = Math.ceil(prediction + errorMarginDays);

  return [pessimistic, optimistic];
}

/**
 * Determines risk level based on days until rupture
 *
 * @param daysUntilRupture - Days until stock rupture
 * @returns Risk level classification
 */
function determineRiskLevel(daysUntilRupture: number | null): StockPrediction['riskLevel'] {
  if (daysUntilRupture === null) return 'low';

  if (daysUntilRupture <= ML_CONFIG.RISK_CRITICAL) return 'critical';
  if (daysUntilRupture <= ML_CONFIG.RISK_HIGH) return 'high';
  if (daysUntilRupture <= ML_CONFIG.RISK_MEDIUM) return 'medium';

  return 'low';
}

/**
 * Calculates optimal reorder date considering lead time and safety margin
 *
 * @param ruptureDate - Predicted date of rupture
 * @returns Recommended date to place order
 */
function calculateReorderDate(ruptureDate: Date | null): Date | null {
  if (!ruptureDate) return null;

  const reorderDate = new Date(ruptureDate);
  const daysBeforeRupture = ML_CONFIG.LEAD_TIME_DAYS + ML_CONFIG.SAFETY_MARGIN_DAYS;
  reorderDate.setDate(reorderDate.getDate() - daysBeforeRupture);

  // If reorder date is in the past, recommend ordering now
  if (reorderDate < new Date()) {
    return new Date();
  }

  return reorderDate;
}

/**
 * Main ML algorithm: Predicts stock rupture using linear regression
 *
 * @param stock - Stock item to analyze
 * @returns Complete stock prediction with ML metrics
 *
 * @example
 * ```ts
 * const prediction = predictStockRupture(stock);
 * console.log(`Risk level: ${prediction.riskLevel}`);
 * console.log(`Rupture in ${prediction.daysUntilRupture} days (confidence: ${prediction.confidence}%)`);
 * console.log(`Reorder ${prediction.recommendedReorderQuantity} units by ${prediction.recommendedReorderDate}`);
 * ```
 */
export function predictStockRupture(stock: Stock): StockPrediction {
  // Step 1: Simulate historical data (in production, use real historical data)
  const historicalData = simulateHistoricalData(stock);

  // Step 2: Perform linear regression
  const regression = performLinearRegression(historicalData);

  // Debug: Log regression for critical/low stocks
  if (stock.status === 'critical' || stock.status === 'low') {
    console.log(`📊 ${stock.name}:`, {
      status: stock.status,
      quantity: stock.quantity,
      slope: regression.slope.toFixed(2),
      rSquared: regression.rSquared.toFixed(2),
      confidence: regression.confidence
    });
  }

  // Step 3: Predict rupture time
  const daysUntilRupture = predictRuptureTime(stock, regression);

  // Debug: Log prediction result
  if (stock.status === 'critical' || stock.status === 'low') {
    console.log(`  → daysUntilRupture: ${daysUntilRupture}`);
  }

  // Step 4: Calculate confidence intervals
  let daysUntilRupturePessimistic: number | null = null;
  let daysUntilRuptureOptimistic: number | null = null;

  if (daysUntilRupture !== null) {
    const [pessimistic, optimistic] = calculateConfidenceInterval(
      daysUntilRupture,
      regression.variance,
      regression.slope
    );
    daysUntilRupturePessimistic = pessimistic;
    daysUntilRuptureOptimistic = optimistic;
  }

  // Step 5: Calculate rupture date
  const dateOfRupture = daysUntilRupture !== null
    ? new Date(Date.now() + daysUntilRupture * 24 * 60 * 60 * 1000)
    : null;

  // Step 6: Determine risk level
  const riskLevel = determineRiskLevel(daysUntilRupture);

  // Step 7: Calculate reorder recommendations
  const recommendedReorderDate = calculateReorderDate(dateOfRupture);

  // Calculate optimal reorder quantity (bring back to 70% of max)
  const maxThreshold = stock.maxThreshold ?? 100;
  const targetQuantity = maxThreshold * 0.7;
  const recommendedReorderQuantity = Math.max(0, Math.ceil(targetQuantity - stock.quantity));

  // Step 8: Return complete prediction
  return {
    stockId: stock.id,
    stockName: stock.name,
    currentQuantity: stock.quantity,
    daysUntilRupture,
    dateOfRupture,
    daysUntilRupturePessimistic,
    daysUntilRuptureOptimistic,
    dailyConsumptionRate: Math.abs(regression.slope),
    confidence: Math.round(regression.confidence),
    riskLevel,
    recommendedReorderDate,
    recommendedReorderQuantity,
  };
}

/**
 * Batch prediction for multiple stocks
 *
 * @param stocks - Array of stock items
 * @returns Array of predictions sorted by risk level
 *
 * @example
 * ```ts
 * const predictions = predictStockRuptures(allStocks);
 * const criticalStocks = predictions.filter(p => p.riskLevel === 'critical');
 * ```
 */
export function predictStockRuptures(stocks: Stock[]): StockPrediction[] {
  const predictions = stocks.map(stock => {
    try {
      return predictStockRupture(stock);
    } catch (error) {
      // If prediction fails (e.g., insufficient data), return a safe default
      console.warn(`Failed to predict stock ${stock.id}:`, error);
      return null;
    }
  }).filter((p): p is StockPrediction => p !== null);

  // Sort by risk level (critical first)
  const riskOrder: Record<StockPrediction['riskLevel'], number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return predictions.sort((a, b) => {
    const riskDiff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    if (riskDiff !== 0) return riskDiff;

    // If same risk, sort by days until rupture (sooner first)
    if (a.daysUntilRupture !== null && b.daysUntilRupture !== null) {
      return a.daysUntilRupture - b.daysUntilRupture;
    }

    return 0;
  });
}
