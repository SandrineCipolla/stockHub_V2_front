import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StocksAPI } from '@/services/api/stocksAPI';
import type { Stock, StockDetail } from '@/types';

vi.mock('@/services/api/utils', () => ({
  getApiConfig: vi.fn().mockResolvedValue({
    apiUrl: 'http://localhost:3000/api/v2',
    config: { method: 'GET', headers: { Authorization: 'Bearer token' } },
  }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const backendStock = {
  id: 1,
  label: 'Café Arabica',
  description: 'Stock de café',
  category: 'Alimentaire',
  items: [
    { id: 10, quantity: 5, minimumStock: 2 },
    { id: 11, quantity: 3, minimumStock: 4 },
  ],
};

const backendStockNoItems = {
  id: 2,
  label: 'Sucre',
  description: '',
  category: 'Alimentaire',
};

const backendStockDetail = {
  id: 1,
  label: 'Café Arabica',
  description: 'Stock de café',
  category: 'Alimentaire',
  totalItems: 2,
  totalQuantity: 8,
  criticalItemsCount: 1,
  items: [
    { id: 10, label: 'Arabica 250g', quantity: 5, minimumStock: 2, status: 'optimal' },
    { id: 11, label: 'Robusta 500g', quantity: 3, minimumStock: 4, status: 'critical' },
  ],
};

const mockResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

describe('StocksAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchStocksList', () => {
    it('should call fetch with the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse([backendStock]));

      await StocksAPI.fetchStocksList();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks',
        expect.any(Object)
      );
    });

    it('should map backend stocks to frontend format', async () => {
      mockFetch.mockReturnValue(mockResponse([backendStock]));

      const result = await StocksAPI.fetchStocksList();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 1, label: 'Café Arabica', category: 'Alimentaire' });
    });

    it('should compute quantity from items', async () => {
      mockFetch.mockReturnValue(mockResponse([backendStock]));

      const result = await StocksAPI.fetchStocksList();

      expect(result[0]!.quantity).toBe(8); // 5 + 3
    });

    it('should set status to low when any item is at or below minimumStock', async () => {
      mockFetch.mockReturnValue(mockResponse([backendStock]));

      const result = await StocksAPI.fetchStocksList();

      expect(result[0]!.status).toBe('low'); // item 11: quantity 3 <= minimumStock 4
    });

    it('should set quantity to 0 and status to optimal when no items', async () => {
      mockFetch.mockReturnValue(mockResponse([backendStockNoItems]));

      const result = await StocksAPI.fetchStocksList();

      expect(result[0]!.quantity).toBe(0);
      expect(result[0]!.status).toBe('optimal');
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 500));

      await expect(StocksAPI.fetchStocksList()).rejects.toThrow('HTTP response with status 500');
    });
  });

  describe('fetchStockById', () => {
    it('should call fetch with the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStock));

      await StocksAPI.fetchStockById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/1',
        expect.any(Object)
      );
    });

    it('should return mapped stock', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStock));

      const result: Stock = await StocksAPI.fetchStockById(1);

      expect(result.id).toBe(1);
      expect(result.label).toBe('Café Arabica');
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 404));

      await expect(StocksAPI.fetchStockById(999)).rejects.toThrow('HTTP response with status 404');
    });
  });

  describe('fetchStockDetail', () => {
    it('should call fetch with the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStockDetail));

      await StocksAPI.fetchStockDetail(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/1',
        expect.any(Object)
      );
    });

    it('should return StockDetail with items and aggregates', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStockDetail));

      const result: StockDetail = await StocksAPI.fetchStockDetail(1);

      expect(result.id).toBe(1);
      expect(result.totalItems).toBe(2);
      expect(result.totalQuantity).toBe(8);
      expect(result.criticalItemsCount).toBe(1);
      expect(result.items).toHaveLength(2);
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 404));

      await expect(StocksAPI.fetchStockDetail(999)).rejects.toThrow(
        'HTTP response with status 404'
      );
    });
  });

  describe('createStock', () => {
    it('should call fetch with POST on /stocks', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStockNoItems));

      await StocksAPI.createStock({
        label: 'Nouveau',
        quantity: 0,
        value: 0,
        description: 'Test',
        category: 'Alimentation',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks',
        expect.any(Object)
      );
    });

    it('should return mapped stock', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStockNoItems));

      const result: Stock = await StocksAPI.createStock({ label: 'Sucre', quantity: 0, value: 0 });

      expect(result.label).toBe('Sucre');
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 400));

      await expect(StocksAPI.createStock({ label: 'Bad', quantity: 0, value: 0 })).rejects.toThrow(
        'HTTP response with status 400'
      );
    });
  });

  describe('updateStock', () => {
    it('should call fetch with PATCH on /stocks/:id', async () => {
      mockFetch.mockReturnValue(mockResponse(backendStockNoItems));

      await StocksAPI.updateStock({ id: 2, label: 'Sucre roux' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/2',
        expect.any(Object)
      );
    });

    it('should return updated mapped stock', async () => {
      mockFetch.mockReturnValue(mockResponse({ ...backendStockNoItems, label: 'Sucre roux' }));

      const result: Stock = await StocksAPI.updateStock({ id: 2, label: 'Sucre roux' });

      expect(result.label).toBe('Sucre roux');
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 403));

      await expect(StocksAPI.updateStock({ id: 2, label: 'Test' })).rejects.toThrow(
        'HTTP response with status 403'
      );
    });
  });

  describe('deleteStock', () => {
    it('should call fetch with DELETE on /stocks/:id', async () => {
      mockFetch.mockReturnValue(mockResponse(null));

      await StocksAPI.deleteStock(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/1',
        expect.any(Object)
      );
    });

    it('should resolve without error on success', async () => {
      mockFetch.mockReturnValue(mockResponse(null));

      await expect(StocksAPI.deleteStock(1)).resolves.toBeUndefined();
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 404));

      await expect(StocksAPI.deleteStock(999)).rejects.toThrow('HTTP response with status 404');
    });
  });
});
