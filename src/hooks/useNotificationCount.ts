import { useCallback, useEffect, useState } from 'react';
import { StocksAPI } from '@/services/api/stocksAPI';
import ConfigManager from '@/services/api/ConfigManager';

interface NotificationState {
  count: number;
  tooltip: string[];
}

/**
 * Compte global des notifications : stocks critiques + ruptures + contributions en attente.
 * À utiliser sur les pages qui n'ont pas déjà la liste complète des stocks chargée (StockDetailPage, ItemDetailPage).
 * Le Dashboard calcule son propre count depuis useStocks() pour éviter un fetch redondant.
 */
export function useNotificationCount(): NotificationState & { refresh: () => void } {
  const [state, setState] = useState<NotificationState>({ count: 0, tooltip: [] });

  const load = useCallback(async () => {
    try {
      const [stocks, pendingData] = await Promise.all([
        StocksAPI.fetchStocksList(),
        (async () => {
          const config = await ConfigManager.getFetchConfig();
          const res = await globalThis.fetch(
            `${ConfigManager.getApiServerUrl()}/contributions/pending-count`,
            config
          );
          if (!res.ok) return { count: 0 };
          const json: { count: number } = await res.json();
          return json;
        })(),
      ]);

      const criticalStocks = stocks.filter(s => s.status === 'critical');
      const ruptures = stocks.filter(s => s.status === 'out-of-stock');
      const pendingCount = pendingData.count;

      const count = criticalStocks.length + ruptures.length + pendingCount;
      const tooltip: string[] = [
        ...criticalStocks.map(s => `🔴 ${s.label} — critique`),
        ...ruptures.map(s => `⚫ ${s.label} — rupture`),
        ...(pendingCount > 0
          ? [`🔔 ${pendingCount} contribution${pendingCount > 1 ? 's' : ''} en attente`]
          : []),
      ];

      setState({ count, tooltip });
    } catch {
      // non-critical, silently ignore
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, refresh: load };
}
