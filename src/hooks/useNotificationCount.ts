import { useCallback, useEffect, useState } from 'react';
import { StocksAPI } from '@/services/api/stocksAPI';
import ConfigManager from '@/services/api/ConfigManager';
import type { NotificationItem } from '@/types';

interface NotificationState {
  count: number;
  tooltip: string[];
  notifications: NotificationItem[];
}

/**
 * Compte global des notifications : stocks critiques + ruptures + contributions en attente.
 * À utiliser sur les pages qui n'ont pas déjà la liste complète des stocks chargée (StockDetailPage, ItemDetailPage).
 * Le Dashboard calcule son propre count depuis useStocks() pour éviter un fetch redondant.
 */
export function useNotificationCount(): NotificationState & { refresh: () => void } {
  const [state, setState] = useState<NotificationState>({
    count: 0,
    tooltip: [],
    notifications: [],
  });

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

      const notifications: NotificationItem[] = [
        ...criticalStocks.map(s => ({
          type: 'critical' as const,
          stockId: typeof s.id === 'number' ? s.id : Number(s.id),
          label: s.label,
        })),
        ...ruptures.map(s => ({
          type: 'out-of-stock' as const,
          stockId: typeof s.id === 'number' ? s.id : Number(s.id),
          label: s.label,
        })),
        ...(pendingCount > 0
          ? [
              {
                type: 'contribution' as const,
                label: `${pendingCount} contribution${pendingCount > 1 ? 's' : ''} en attente`,
              },
            ]
          : []),
      ];

      setState({ count, tooltip, notifications });
    } catch {
      // non-critical, silently ignore
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, refresh: load };
}
