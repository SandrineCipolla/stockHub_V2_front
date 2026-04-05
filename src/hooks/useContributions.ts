import { useState, useCallback } from 'react';
import { ContributionsAPI } from '@/services/api/contributionsAPI';
import type { Contribution } from '@/types/collaboration';

export function useContributions(stockId: number) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ContributionsAPI.listPending(stockId);
      setContributions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [stockId]);

  const submit = useCallback(
    async (itemId: number, suggestedQuantity: number) => {
      await ContributionsAPI.create(stockId, itemId, suggestedQuantity);
    },
    [stockId]
  );

  const review = useCallback(
    async (contributionId: number, action: 'APPROVE' | 'REJECT') => {
      const normalizedAction: 'approve' | 'reject' = action === 'APPROVE' ? 'approve' : 'reject';
      const updated = await ContributionsAPI.review(stockId, contributionId, normalizedAction);
      setContributions(prev => prev.filter(c => c.id !== updated.id));
    },
    [stockId]
  );

  return { contributions, isLoading, error, load, submit, review };
}
