import {vi} from 'vitest';
import React from 'react';

// Mock data for stocks
export const mockStocksData = [
    { id: 1, name: 'Stock A', quantity: 100, value: 5000, status: 'optimal' as const, lastUpdate: '2h' },
    { id: 2, name: 'Stock B', quantity: 5, value: 500, status: 'low' as const, lastUpdate: '1h' }
];

export const mockStatsData = {
    total: 2,
    optimal: 1,
    low: 1,
    critical: 0,
    totalValue: 5500,
    averageValue: 2750
};

export const mockLoadingStates = {
    load: false,
    create: false,
    update: false,
    delete: false,
    deleteMultiple: false,
    storage: false
};

export const mockErrorStates = {
    load: null,
    create: null,
    update: null,
    delete: null,
    deleteMultiple: null,
    storage: null
};

export const mockResetErrors = {
    load: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMultiple: vi.fn()
};

// Factory function for useStocks mock
export const createMockUseStocks = (overrides = {}) => ({
    stocks: mockStocksData,
    allStocks: mockStocksData,
    stats: mockStatsData,
    filters: {},
    loadStocks: vi.fn().mockResolvedValue(undefined),
    createStock: vi.fn(),
    updateStock: vi.fn(),
    deleteStock: vi.fn(),
    deleteMultipleStocks: vi.fn(),
    updateFilters: vi.fn(),
    resetFilters: vi.fn(),
    getStockById: vi.fn(),
    isLoading: mockLoadingStates,
    errors: mockErrorStates,
    hasAnyError: false,
    isAnyLoading: false,
    resetErrors: mockResetErrors,
    ...overrides
});

// Factory function for useDataExport mock
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

// Component mocks
export const mockTheme = {
    useTheme: () => ({ theme: 'dark' })
};

export const mockHeader = {
    Header: () => React.createElement('header', { 'data-testid': 'header' }, 'Header')
};

export const mockFooter = {
    Footer: () => React.createElement('footer', { 'data-testid': 'footer' }, 'Footer')
};

export const mockNavSection = {
    NavSection: ({ children }: { children: React.ReactNode }) =>
        React.createElement('nav', { 'data-testid': 'nav-section' }, children)
};
