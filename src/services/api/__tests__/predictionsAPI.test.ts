import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PredictionsAPI } from '@/services/api/predictionsAPI';
import type { ItemPrediction, ItemHistory } from '@/services/api/predictionsAPI';

vi.mock('@/services/api/utils', () => ({
  getApiConfig: vi.fn().mockResolvedValue({
    apiUrl: 'http://localhost:3000/api/v2',
    config: { method: 'GET', headers: { Authorization: 'Bearer token' } },
  }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

const mockPrediction: ItemPrediction = {
  itemId: 1,
  stockId: 42,
  daysUntilEmpty: 14,
  trend: 'STABLE',
  avgDailyConsumption: 2.5,
  recommendedRestock: 35,
  computedAt: '2026-03-28T10:00:00.000Z',
};

const mockHistory: ItemHistory = {
  itemId: 1,
  days: 90,
  entries: [
    { date: '2026-03-27', quantity: 20, changeType: 'CONSUMPTION', delta: -3 },
    { date: '2026-03-26', quantity: 23, changeType: 'RESTOCK', delta: 10 },
  ],
};

describe('PredictionsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchItemPrediction', () => {
    it('should call fetch with the correct URL', async () => {
      mockFetch.mockReturnValue(mockResponse(mockPrediction));

      await PredictionsAPI.fetchItemPrediction(42, 1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items/1/prediction',
        expect.any(Object)
      );
    });

    it('should return the parsed prediction', async () => {
      mockFetch.mockReturnValue(mockResponse(mockPrediction));

      const result = await PredictionsAPI.fetchItemPrediction(42, 1);

      expect(result).toEqual(mockPrediction);
    });

    it('should accept string stockId and itemId', async () => {
      mockFetch.mockReturnValue(mockResponse(mockPrediction));

      await PredictionsAPI.fetchItemPrediction('42', '1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items/1/prediction',
        expect.any(Object)
      );
    });

    it('should throw when response is not ok', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 404));

      await expect(PredictionsAPI.fetchItemPrediction(42, 1)).rejects.toThrow(
        'HTTP response with status 404'
      );
    });

    it('should throw on 500 error', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 500));

      await expect(PredictionsAPI.fetchItemPrediction(42, 1)).rejects.toThrow(
        'HTTP response with status 500'
      );
    });
  });

  describe('fetchItemHistory', () => {
    it('should call fetch with the correct URL and default 90 days', async () => {
      mockFetch.mockReturnValue(mockResponse(mockHistory));

      await PredictionsAPI.fetchItemHistory(42, 1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items/1/history?days=90',
        expect.any(Object)
      );
    });

    it('should call fetch with custom days parameter', async () => {
      mockFetch.mockReturnValue(mockResponse({ ...mockHistory, days: 30 }));

      await PredictionsAPI.fetchItemHistory(42, 1, 30);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v2/stocks/42/items/1/history?days=30',
        expect.any(Object)
      );
    });

    it('should return the parsed history', async () => {
      mockFetch.mockReturnValue(mockResponse(mockHistory));

      const result = await PredictionsAPI.fetchItemHistory(42, 1);

      expect(result).toEqual(mockHistory);
      expect(result.entries).toHaveLength(2);
    });

    it('should return empty entries array when no history', async () => {
      const emptyHistory: ItemHistory = { itemId: 1, days: 90, entries: [] };
      mockFetch.mockReturnValue(mockResponse(emptyHistory));

      const result = await PredictionsAPI.fetchItemHistory(42, 1);

      expect(result.entries).toEqual([]);
    });

    it('should throw when response is not ok', async () => {
      mockFetch.mockReturnValue(mockResponse(null, false, 403));

      await expect(PredictionsAPI.fetchItemHistory(42, 1)).rejects.toThrow(
        'HTTP response with status 403'
      );
    });
  });
});
