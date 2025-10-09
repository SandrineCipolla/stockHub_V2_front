import type {BadgeVariant} from '@/types';

/**
 * Variantes de badge disponibles pour les tests
 */
export const badgeVariants: BadgeVariant[] = ['success', 'warning', 'danger'];

/**
 * Contenus de badge pour les tests de statut de stock
 */
export const stockStatusBadgeContent: Record<string, string> = {
    optimal: 'Optimal',
    low: 'Faible',
    critical: 'Critique',
    outOfStock: 'Rupture',
    lowStock: 'Stock faible',
};

/**
 * Contenus de badge pour les tests de tendances
 */
export const trendBadgeContent: Record<string, string> = {
    positiveNumber: '+8',
    negativeNumber: '-3',
    positivePercentage: '+2%',
    negativePercentage: '-15%',
};

/**
 * Exemples de contenus numériques
 */
export const numericBadgeContent: Record<string, number> = {
    positive: 42,
    negative: -3,
    zero: 0,
};

/**
 * Exemples de contenus textuels
 */
export const textBadgeContent: Record<string, string> = {
    simple: 'Simple text',
    withSpecialChars: '+15%',
    long: 'Very long badge content',
};

/**
 * Cas d'usage métier StockHub : combinaisons variant + contenu
 */
export const stockHubBadgeUseCases: Record<string, { variant: BadgeVariant; content: string }> = {
    optimal: {
        variant: 'success',
        content: stockStatusBadgeContent.optimal,
    },
    low: {
        variant: 'warning',
        content: stockStatusBadgeContent.low,
    },
    critical: {
        variant: 'danger',
        content: stockStatusBadgeContent.critical,
    },
    outOfStock: {
        variant: 'danger',
        content: stockStatusBadgeContent.outOfStock,
    },
    positiveTrend: {
        variant: 'success',
        content: trendBadgeContent.positiveNumber,
    },
    negativeTrend: {
        variant: 'danger',
        content: trendBadgeContent.negativeNumber,
    },
};