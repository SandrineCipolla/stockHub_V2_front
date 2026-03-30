import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePredictions } from '@/hooks/usePredictions';
import { PredictionsAPI } from '@/services/api/predictionsAPI';
import type { ItemPrediction, ItemHistory } from '@/services/api/predictionsAPI';

vi.mock('@/services/api/predictionsAPI', () => ({
  PredictionsAPI: {
    fetchItemPrediction: vi.fn(),
    fetchItemHistory: vi.fn(),
  },
}));

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
  entries: [{ date: '2026-03-27', quantity: 20, changeType: 'CONSUMPTION', delta: -3 }],
};

describe('usePredictions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PredictionsAPI.fetchItemPrediction).mockResolvedValue(mockPrediction);
    vi.mocked(PredictionsAPI.fetchItemHistory).mockResolvedValue(mockHistory);
  });

  describe('loadPrediction', () => {
    it('should call PredictionsAPI.fetchItemPrediction with correct stockId and itemId', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadPrediction();
      });

      expect(PredictionsAPI.fetchItemPrediction).toHaveBeenCalledWith(42, 1);
    });

    it('should return the prediction from the API', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      let prediction: ItemPrediction | null | undefined;
      await act(async () => {
        prediction = await result.current.loadPrediction();
      });

      expect(prediction).toEqual(mockPrediction);
    });

    it('should set isLoading.prediction to false after loading', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadPrediction();
      });

      expect(result.current.isLoading.prediction).toBe(false);
    });

    it('should set errors.prediction when API fails', async () => {
      vi.mocked(PredictionsAPI.fetchItemPrediction).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadPrediction();
      });

      await waitFor(() => {
        expect(result.current.errors.prediction).not.toBeNull();
      });
    });

    it('should set errors.prediction when backend returns 404', async () => {
      vi.mocked(PredictionsAPI.fetchItemPrediction).mockRejectedValue(
        new Error('HTTP response with status 404')
      );
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadPrediction();
      });

      await waitFor(() => {
        expect(result.current.errors.prediction).not.toBeNull();
      });
    });

    it('should reset errors.prediction after resetErrors.prediction()', async () => {
      vi.mocked(PredictionsAPI.fetchItemPrediction).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadPrediction();
      });

      await waitFor(() => expect(result.current.errors.prediction).not.toBeNull());

      act(() => {
        result.current.resetErrors.prediction();
      });

      await waitFor(() => {
        expect(result.current.errors.prediction).toBeNull();
      });
    });
  });

  describe('loadHistory', () => {
    it('should call PredictionsAPI.fetchItemHistory with correct stockId, itemId and default days', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadHistory();
      });

      expect(PredictionsAPI.fetchItemHistory).toHaveBeenCalledWith(42, 1, undefined);
    });

    it('should call PredictionsAPI.fetchItemHistory with custom days', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadHistory(30);
      });

      expect(PredictionsAPI.fetchItemHistory).toHaveBeenCalledWith(42, 1, 30);
    });

    it('should return the history from the API', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      let history: ItemHistory | null | undefined;
      await act(async () => {
        history = await result.current.loadHistory();
      });

      expect(history).toEqual(mockHistory);
    });

    it('should set isLoading.history to false after loading', async () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadHistory();
      });

      expect(result.current.isLoading.history).toBe(false);
    });

    it('should set errors.history when API fails', async () => {
      vi.mocked(PredictionsAPI.fetchItemHistory).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => usePredictions(42, 1));

      await act(async () => {
        await result.current.loadHistory();
      });

      await waitFor(() => {
        expect(result.current.errors.history).not.toBeNull();
      });
    });
  });

  describe('independent loading states', () => {
    it('should have independent isLoading flags for prediction and history', () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      expect(result.current.isLoading.prediction).toBe(false);
      expect(result.current.isLoading.history).toBe(false);
    });

    it('should have independent error states for prediction and history', () => {
      const { result } = renderHook(() => usePredictions(42, 1));

      expect(result.current.errors.prediction).toBeNull();
      expect(result.current.errors.history).toBeNull();
    });
  });
});
