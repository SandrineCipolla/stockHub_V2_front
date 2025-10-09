import type {ChangeType, MetricCardData, MetricColor, MetricIcon} from '@/types';

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
        title: metricLabels.totalStocks,
        value: metricValues.high,
        change: {
            value: 12,
            type: 'increase',
            period: 'ce mois'
        },
        icon: 'package',
        color: 'success',
    },
    lowStockAlert: {
        title: metricLabels.lowStocks,
        value: metricValues.medium,
        change: {
            value: 3,
            type: 'increase',
            period: 'cette semaine'
        },
        icon: 'alert-triangle',
        color: 'warning',
    },
    criticalStockAlert: {
        title: metricLabels.criticalStocks,
        value: metricValues.low,
        change: {
            value: 2,
            type: 'decrease',
            period: 'aujourd\'hui'
        },
        icon: 'alert-triangle',
        color: 'warning',
    },
    totalValueMetric: {
        title: metricLabels.totalValue,
        value: metricValues.currency,
        change: {
            value: 15,
            type: 'increase',
            period: 'ce mois'
        },
        icon: 'trending-up',
        color: 'info',
    },
    averageValueMetric: {
        title: metricLabels.averageValue,
        value: '289€',
        change: {
            value: 5,
            type: 'increase',
            period: 'cette semaine'
        },
        icon: 'trending-up',
        color: 'info',
    },
    noChangeMetric: {
        title: 'Stocks Stables',
        value: metricValues.medium,
        icon: 'package',
        color: 'success',
    },
    decreasingMetric: {
        title: 'Stocks en Baisse',
        value: metricValues.low,
        change: {
            value: 8,
            type: 'decrease',
            period: 'cette semaine'
        },
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
