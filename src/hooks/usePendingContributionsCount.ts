import { useCallback, useEffect, useState } from 'react';
import ConfigManager from '@/services/api/ConfigManager';

export function usePendingContributionsCount() {
  const [count, setCount] = useState(0);

  const fetch = useCallback(async () => {
    try {
      const config = await ConfigManager.getFetchConfig();
      const res = await globalThis.fetch(
        `${ConfigManager.getApiServerUrl()}/contributions/pending-count`,
        config
      );
      if (!res.ok) return;
      const data: { count: number } = await res.json();
      setCount(data.count);
    } catch {
      // silently ignore — notif count is non-critical
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { count, refresh: fetch };
}
