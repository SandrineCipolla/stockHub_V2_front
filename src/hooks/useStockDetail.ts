import { useCallback, useEffect, useState } from 'react';
import type { StockDetail } from '@/types';
import { StocksAPI } from '@/services/api/stocksAPI';

export function useStockDetail(stockId: number) {
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await StocksAPI.fetchStockDetail(stockId);
      setStock(data);
    } catch {
      setError('Impossible de charger le stock.');
    } finally {
      setIsLoading(false);
    }
  }, [stockId]);

  useEffect(() => {
    // Chargement asynchrone légitime des détails du stock lors du changement d'ID
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchStock();
  }, [fetchStock]);

  return { stock, isLoading, error, refetch: fetchStock };
}
