import { vi } from 'vitest';
import { dashboardStocks, stocksByStatus } from './stock';

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
    'out-of-stock': dashboardStocks.filter(s => s.status === 'out-of-stock').length,
    overstocked: dashboardStocks.filter(s => s.status === 'overstocked').length,
    totalValue: dashboardStocks.reduce((sum, stock) => sum + stock.value, 0),
    averageValue:
      dashboardStocks.reduce((sum, stock) => sum + stock.value, 0) / dashboardStocks.length,
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
    storage: false,
  },
  errors: {
    load: null,
    create: null,
    update: null,
    delete: null,
    deleteMultiple: null,
    storage: null,
  },
  hasAnyError: false,
  isAnyLoading: false,
  resetErrors: {
    load: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMultiple: vi.fn(),
  },
  ...overrides,
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
  status: 'idle' as const, // NÉCESSAIRE pour le type LoadingState
  setLoading: vi.fn(),
  setData: vi.fn(),
  setError: vi.fn(),
  reset: vi.fn(),
  isIdle: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
  ...overrides,
});

/**
 * Mock pour le hook useTheme
 * Valeur par défaut : thème dark
 */
export const createMockUseTheme = (theme: 'dark' | 'light' = 'dark') => ({
  theme,
  toggleTheme: vi.fn(),
  setTheme: vi.fn(),
});

import type { StockDetail } from '@/types';

/**
 * Factory function for StockDetail test fixtures
 */
export const createMockStockDetail = (overrides: Partial<StockDetail> = {}): StockDetail => ({
  id: 1,
  label: 'Stock Alimentaire Test',
  description: 'Stock de test pour la page détail',
  category: 'alimentation',
  totalItems: 2,
  totalQuantity: 8,
  criticalItemsCount: 1,
  items: [
    {
      id: 1,
      label: 'Tomates',
      description: 'Légumes frais',
      quantity: 3,
      minimumStock: 5,
      status: 'critical',
    },
    {
      id: 2,
      label: 'Carottes',
      description: 'Légumes',
      quantity: 5,
      minimumStock: 3,
      status: 'optimal',
    },
  ],
  ...overrides,
});

/**
 * Mock pour le hook useStockDetail
 */
export const createMockUseStockDetail = (overrides = {}) => ({
  stock: createMockStockDetail(),
  isLoading: false,
  error: null,
  refetch: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});
