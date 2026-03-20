import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemsAPI } from '@/services/api/itemsAPI';
import type { StockItem } from '@/types';

vi.mock('@/services/api/utils', () => ({
  getApiConfig: vi.fn().mockResolvedValue({
    apiUrl: 'http://localhost:3000/api/v2',
    config: { method: 'GET', headers: { Authorization: 'Bearer token' } },
  }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockItem: StockItem = {
  id: 1,
  stockId: 42,
  label: 'Café Arabica',
  quantity: 5,
  minimumStock: 2,
  description: 'Grains de café',
};

const mockResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

describe('ItemsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('should call fetch with the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse([mockItem]));

      await ItemsAPI.fetchItems(42);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items',
        expect.any(Object)
      );
    });

    it('should return parsed items from the response', async () => {
      mockFetch.mockReturnValue(mockResponse([mockItem]));

      const result = await ItemsAPI.fetchItems(42);

      expect(result).toEqual([mockItem]);
    });

    it('should throw an error when response is not ok', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 404));

      await expect(ItemsAPI.fetchItems(42)).rejects.toThrow('HTTP response with status 404');
    });
  });

  describe('addItem', () => {
    it('should call fetch with POST on the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse(mockItem));

      await ItemsAPI.addItem(42, { label: 'Café Arabica', quantity: 5 });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items',
        expect.any(Object)
      );
    });

    it('should return the created item', async () => {
      mockFetch.mockReturnValue(mockResponse(mockItem));

      const result = await ItemsAPI.addItem(42, { label: 'Café Arabica', quantity: 5 });

      expect(result).toEqual(mockItem);
    });

    it('should throw an error when response is not ok', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 400));

      await expect(ItemsAPI.addItem(42, { label: 'Café Arabica', quantity: 5 })).rejects.toThrow(
        'HTTP response with status 400'
      );
    });
  });

  describe('updateItem', () => {
    it('should call fetch with PATCH on the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse({ ...mockItem, quantity: 8 }));

      await ItemsAPI.updateItem(42, 1, { quantity: 8 });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items/1',
        expect.any(Object)
      );
    });

    it('should return the updated item', async () => {
      const updated = { ...mockItem, quantity: 8 };
      mockFetch.mockReturnValue(mockResponse(updated));

      const result = await ItemsAPI.updateItem(42, 1, { quantity: 8 });

      expect(result).toEqual(updated);
    });

    it('should only include defined fields in the request body (quantity only)', async () => {
      mockFetch.mockReturnValue(mockResponse(mockItem));
      const { getApiConfig } = await import('@/services/api/utils');
      const getApiConfigMock = vi.mocked(getApiConfig);

      await ItemsAPI.updateItem(42, 1, { quantity: 5 });

      const callArgs = getApiConfigMock.mock.calls[getApiConfigMock.mock.calls.length - 1];
      const body = callArgs?.[2] as Record<string, unknown>;
      expect(body).toHaveProperty('quantity', 5);
      expect(body).not.toHaveProperty('label');
      expect(body).not.toHaveProperty('description');
      expect(body).not.toHaveProperty('minimumStock');
    });

    it('should include label and minimumStock but not quantity when only those are defined', async () => {
      mockFetch.mockReturnValue(mockResponse(mockItem));
      const { getApiConfig } = await import('@/services/api/utils');
      const getApiConfigMock = vi.mocked(getApiConfig);

      await ItemsAPI.updateItem(42, 1, { label: 'Nouveau', minimumStock: 3 });

      const callArgs = getApiConfigMock.mock.calls[getApiConfigMock.mock.calls.length - 1];
      const body = callArgs?.[2] as Record<string, unknown>;
      expect(body).toHaveProperty('label', 'Nouveau');
      expect(body).toHaveProperty('minimumStock', 3);
      expect(body).not.toHaveProperty('quantity');
    });

    it('should throw an error when response is not ok', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 500));

      await expect(ItemsAPI.updateItem(42, 1, { quantity: 5 })).rejects.toThrow(
        'HTTP response with status 500'
      );
    });
  });

  describe('deleteItem', () => {
    it('should call fetch with DELETE on the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse(null));

      await ItemsAPI.deleteItem(42, 1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items/1',
        expect.any(Object)
      );
    });

    it('should resolve without error on success', async () => {
      mockFetch.mockReturnValue(mockResponse(null));

      await expect(ItemsAPI.deleteItem(42, 1)).resolves.toBeUndefined();
    });

    it('should throw an error when response is not ok', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 403));

      await expect(ItemsAPI.deleteItem(42, 1)).rejects.toThrow('HTTP response with status 403');
    });
  });
});
