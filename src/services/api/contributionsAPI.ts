import ConfigManager from './ConfigManager';
import type { Contribution } from '@/types/collaboration';

interface ErrorBody {
  error?: string;
}

export const ContributionsAPI = {
  async create(stockId: number, itemId: number, suggestedQuantity: number): Promise<Contribution> {
    const config = await ConfigManager.postFetchConfig({ suggestedQuantity });
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/items/${itemId}/contributions`,
      config
    );
    if (!res.ok) {
      const body: ErrorBody = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Erreur ${res.status}`);
    }
    const data: Contribution = await res.json();
    return data;
  },

  async listPending(stockId: number): Promise<Contribution[]> {
    const config = await ConfigManager.getFetchConfig();
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/contributions`,
      config
    );
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    const data: Contribution[] = await res.json();
    return data;
  },

  async review(
    stockId: number,
    contributionId: number,
    action: 'APPROVE' | 'REJECT'
  ): Promise<Contribution> {
    const config = await ConfigManager.patchFetchConfig({ action });
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/contributions/${contributionId}`,
      config
    );
    if (!res.ok) {
      const body: ErrorBody = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Erreur ${res.status}`);
    }
    const data: Contribution = await res.json();
    return data;
  },
};
