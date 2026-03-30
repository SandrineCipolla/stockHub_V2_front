import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSuggestions } from '@/hooks/useSuggestions';
import { PredictionsAPI } from '@/services/api/predictionsAPI';
import type { BackendSuggestion } from '@/services/api/predictionsAPI';

vi.mock('@/services/api/predictionsAPI', () => ({
  PredictionsAPI: {
    fetchItemPrediction: vi.fn(),
    fetchItemHistory: vi.fn(),
    getStockSuggestions: vi.fn(),
  },
}));

const mockSuggestions: BackendSuggestion[] = [
  {
    itemId: 1,
    type: 'RESTOCK',
    priority: 'high',
    title: 'Réapprovisionner Café Arabica',
    description: 'Stock critique — commande recommandée sous 3 jours',
    source: 'llm',
  },
  {
    itemId: 2,
    type: 'TREND_ALERT',
    priority: 'medium',
    title: 'Tendance à la baisse détectée',
    description: 'Consommation en hausse ces 30 derniers jours',
    source: 'deterministic',
  },
];

describe('useSuggestions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(PredictionsAPI.getStockSuggestions).mockResolvedValue(mockSuggestions);
  });

  describe('loadSuggestions', () => {
    it('should call PredictionsAPI.getStockSuggestions with correct stockId', async () => {
      const { result } = renderHook(() => useSuggestions(42));

      await act(async () => {
        await result.current.loadSuggestions();
      });

      expect(PredictionsAPI.getStockSuggestions).toHaveBeenCalledWith(42);
    });

    it('should accept string stockId', async () => {
      const { result } = renderHook(() => useSuggestions('42'));

      await act(async () => {
        await result.current.loadSuggestions();
      });

      expect(PredictionsAPI.getStockSuggestions).toHaveBeenCalledWith('42');
    });

    it('should return the suggestions from the API', async () => {
      const { result } = renderHook(() => useSuggestions(42));

      let suggestions: BackendSuggestion[] | null | undefined;
      await act(async () => {
        suggestions = await result.current.loadSuggestions();
      });

      expect(suggestions).toEqual(mockSuggestions);
    });

    it('should return suggestions with correct source fields', async () => {
      const { result } = renderHook(() => useSuggestions(42));

      let suggestions: BackendSuggestion[] | null | undefined;
      await act(async () => {
        suggestions = await result.current.loadSuggestions();
      });

      expect(suggestions?.[0]?.source).toBe('llm');
      expect(suggestions?.[1]?.source).toBe('deterministic');
    });

    it('should set isLoading to false after loading', async () => {
      const { result } = renderHook(() => useSuggestions(42));

      await act(async () => {
        await result.current.loadSuggestions();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error when API fails', async () => {
      vi.mocked(PredictionsAPI.getStockSuggestions).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useSuggestions(42));

      await act(async () => {
        await result.current.loadSuggestions();
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });
    });

    it('should set error on 404', async () => {
      vi.mocked(PredictionsAPI.getStockSuggestions).mockRejectedValue(
        new Error('HTTP response with status 404')
      );
      const { result } = renderHook(() => useSuggestions(42));

      await act(async () => {
        await result.current.loadSuggestions();
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });
    });

    it('should reset error after resetError()', async () => {
      vi.mocked(PredictionsAPI.getStockSuggestions).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useSuggestions(42));

      await act(async () => {
        await result.current.loadSuggestions();
      });

      await waitFor(() => expect(result.current.error).not.toBeNull());

      act(() => {
        result.current.resetError();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('initial state', () => {
    it('should start with isLoading false', () => {
      const { result } = renderHook(() => useSuggestions(42));
      expect(result.current.isLoading).toBe(false);
    });

    it('should start with error null', () => {
      const { result } = renderHook(() => useSuggestions(42));
      expect(result.current.error).toBeNull();
    });
  });
});
