import type {MetricCardData, MetricIcon, MetricColor, ChangeType} from '@/types';

/**
 * Icônes disponibles pour les métriques
 */
export const metricIcons: MetricIcon[] = ['package', 'alert-triangle', 'trending-up'];

/**
 * Couleurs disponibles pour les métriques
 */
export const metricColors: MetricColor[] = ['success', 'warning', 'info'];

/**
 * Types de changement pour les métriques
 */
export const changeTypes: ChangeType[] = ['increase', 'decrease'];

/**
 * Labels de métriques pour les tests
 */
export const metricLabels: Record<string, string> = {
    totalStocks: 'Total Stocks',
    lowStocks: 'Stocks Faibles',
    criticalStocks: 'Stocks Critiques',
    totalValue: 'Valeur Totale',
    averageValue: 'Valeur Moyenne',
    trending: 'En Tendance',
};

/**
 * Valeurs de métriques pour les tests
 */
export const metricValues: Record<string, string | number> = {
    high: 156,
    medium: 42,
    low: 3,
    zero: 0,
    currency: '45 250€',
    percentage: '85%',
};

/**
 * Changements de métriques pour les tests
 */
export const metricChanges: Record<string, number> = {
    positive: 12,
    negative: -8,
    small: 2,
    large: 25,
    zero: 0,
};

/**
 * Cas d'usage métier StockHub : métriques dashboard
 */
export const stockHubMetricUseCases: Record<string, MetricCardData> = {
    totalStockMetric: {
        id: 'metric-total-stocks',
        label: metricLabels.totalStocks,
        value: metricValues.high,
        change: metricChanges.positive,
        changeType: 'increase',
        icon: 'package',
        color: 'success',
    },
    lowStockAlert: {
        id: 'metric-low-stocks',
        label: metricLabels.lowStocks,
        value: metricValues.medium,
        change: metricChanges.small,
        changeType: 'increase',
        icon: 'alert-triangle',
        color: 'warning',
    },
    criticalStockAlert: {
        id: 'metric-critical-stocks',
        label: metricLabels.criticalStocks,
        value: metricValues.low,
        change: metricChanges.negative,
        changeType: 'decrease',
        icon: 'alert-triangle',
        color: 'warning',
    },
    totalValueMetric: {
        id: 'metric-total-value',
        label: metricLabels.totalValue,
        value: metricValues.currency,
        change: metricChanges.large,
        changeType: 'increase',
        icon: 'trending-up',
        color: 'info',
    },
    averageValueMetric: {
        id: 'metric-average-value',
        label: metricLabels.averageValue,
        value: '289€',
        change: metricChanges.small,
        changeType: 'increase',
        icon: 'trending-up',
        color: 'info',
    },
    noChangeMetric: {
        id: 'metric-stable',
        label: 'Stocks Stables',
        value: metricValues.medium,
        change: metricChanges.zero,
        changeType: 'increase',
        icon: 'package',
        color: 'success',
    },
    decreasingMetric: {
        id: 'metric-decreasing',
        label: 'Stocks en Baisse',
        value: metricValues.low,
        change: metricChanges.negative,
        changeType: 'decrease',
        icon: 'alert-triangle',
        color: 'warning',
    },
};

/**
 * Collection de métriques pour tests de dashboard complet
 */
export const dashboardMetrics: MetricCardData[] = [
    stockHubMetricUseCases.totalStockMetric,
    stockHubMetricUseCases.lowStockAlert,
    stockHubMetricUseCases.criticalStockAlert,
    stockHubMetricUseCases.totalValueMetric,
];
