import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStockDetail } from '@/hooks/useStockDetail';
import { StocksAPI } from '@/services/api/stocksAPI';
import type { StockDetail } from '@/types';

vi.mock('@/services/api/stocksAPI', () => ({
  StocksAPI: {
    fetchStockDetail: vi.fn(),
  },
}));

const mockStockDetail: StockDetail = {
  id: 42,
  label: 'Stock Café',
  description: 'Stocks de café',
  category: 'Alimentaire',
  totalItems: 2,
  totalQuantity: 50,
  criticalItemsCount: 0,
  items: [
    { id: 1, label: 'Arabica', quantity: 30, minimumStock: 5, description: '', status: 'optimal' },
    { id: 2, label: 'Robusta', quantity: 20, minimumStock: 3, description: '', status: 'optimal' },
  ],
};

describe('useStockDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StocksAPI.fetchStockDetail).mockResolvedValue(mockStockDetail);
  });

  describe('initial fetch on mount', () => {
    it('should call StocksAPI.fetchStockDetail with the correct stockId', async () => {
      renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(StocksAPI.fetchStockDetail).toHaveBeenCalledWith(42);
      });
    });

    it('should set stock data on successful fetch', async () => {
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.stock).toEqual(mockStockDetail);
      });
    });

    it('should set isLoading to false after successful fetch', async () => {
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should have null error after successful fetch', async () => {
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it('should set error message on network failure', async () => {
      vi.mocked(StocksAPI.fetchStockDetail).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.error).toBe('Impossible de charger le stock.');
      });
    });

    it('should set isLoading to false even on error', async () => {
      vi.mocked(StocksAPI.fetchStockDetail).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should have null stock on network failure', async () => {
      vi.mocked(StocksAPI.fetchStockDetail).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.stock).toBeNull();
      });
    });
  });

  describe('refetch', () => {
    it('should expose a refetch function', async () => {
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should re-call the API when refetch is called', async () => {
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(StocksAPI.fetchStockDetail).toHaveBeenCalledTimes(2);
    });

    it('should update stock data after refetch', async () => {
      const { result } = renderHook(() => useStockDetail(42));

      await waitFor(() => {
        expect(result.current.stock).toEqual(mockStockDetail);
      });

      const updatedStock = { ...mockStockDetail, label: 'Stock Café Mis à Jour' };
      vi.mocked(StocksAPI.fetchStockDetail).mockResolvedValue(updatedStock);

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.stock?.label).toBe('Stock Café Mis à Jour');
      });
    });
  });
});
