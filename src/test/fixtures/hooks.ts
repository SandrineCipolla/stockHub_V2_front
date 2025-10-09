import {vi} from 'vitest';
import {dashboardStocks, stockCategories, stocksByStatus} from './stock';

/**
 * Mock complet pour le hook useStocks
 * Simule toutes les fonctionnalités du hook avec des données fixtures
 */
export const createMockUseStocks = (overrides = {}) => ({
    stocks: dashboardStocks,
    allStocks: dashboardStocks,
    stats: {
        total: dashboardStocks.length,
        optimal: stocksByStatus.optimal.length,
        low: stocksByStatus.low.length,
        critical: stocksByStatus.critical.length,
        totalValue: dashboardStocks.reduce((sum, stock) => sum + stock.value, 0),
        averageValue: dashboardStocks.reduce((sum, stock) => sum + stock.value, 0) / dashboardStocks.length,
        byStatus: {
            optimal: stocksByStatus.optimal.length,
            low: stocksByStatus.low.length,
            critical: stocksByStatus.critical.length
        },
        byCategory: Object.keys(stockCategories).reduce((acc, category) => {
            acc[category] = dashboardStocks.filter(s => s.category === stockCategories[category]).length;
            return acc;
        }, {} as Record<string, number>)
    },
    filters: {},
    loadStocks: vi.fn().mockResolvedValue(undefined),
    createStock: vi.fn(),
    updateStock: vi.fn(),
    deleteStock: vi.fn(),
    deleteMultipleStocks: vi.fn(),
    updateFilters: vi.fn(),
    resetFilters: vi.fn(),
    getStockById: vi.fn(),
    isLoading: {
        load: false,
        create: false,
        update: false,
        delete: false,
        deleteMultiple: false,
        storage: false
    },
    errors: {
        load: null,
        create: null,
        update: null,
        delete: null,
        deleteMultiple: null,
        storage: null
    },
    hasAnyError: false,
    isAnyLoading: false,
    resetErrors: {
        load: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMultiple: vi.fn()
    },
    ...overrides
});

/**
 * Mock complet pour le hook useDataExport
 * Simule l'export de données CSV
 */
export const createMockUseDataExport = (overrides = {}) => ({
    exportToCsv: vi.fn().mockResolvedValue(true),
    data: null,
    loading: false,
    error: null,
    status: 'idle' as const,
    setLoading: vi.fn(),
    setData: vi.fn(),
    setError: vi.fn(),
    reset: vi.fn(),
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    ...overrides
});

/**
 * Mock pour le hook useTheme
 * Valeur par défaut : thème dark
 */
export const createMockUseTheme = (theme: 'dark' | 'light' = 'dark') => ({
    theme,
    toggleTheme: vi.fn(),
    setTheme: vi.fn()
});
