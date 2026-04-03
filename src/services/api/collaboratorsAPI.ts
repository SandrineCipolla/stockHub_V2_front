import ConfigManager from './ConfigManager';
import type { Collaborator, StockRole } from '@/types/collaboration';

interface ErrorBody {
  error?: string;
}

export const CollaboratorsAPI = {
  async list(stockId: number): Promise<Collaborator[]> {
    const config = await ConfigManager.getFetchConfig();
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/collaborators`,
      config
    );
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    const data: Collaborator[] = await res.json();
    return data;
  },

  async add(stockId: number, email: string, role: StockRole): Promise<Collaborator> {
    const config = await ConfigManager.postFetchConfig({ email, role });
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/collaborators`,
      config
    );
    if (!res.ok) {
      const body: ErrorBody = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Erreur ${res.status}`);
    }
    const data: Collaborator = await res.json();
    return data;
  },

  async updateRole(
    stockId: number,
    collaboratorId: number,
    role: StockRole
  ): Promise<Collaborator> {
    const config = await ConfigManager.patchFetchConfig({ role });
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/collaborators/${collaboratorId}`,
      config
    );
    if (!res.ok) {
      const body: ErrorBody = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Erreur ${res.status}`);
    }
    const data: Collaborator = await res.json();
    return data;
  },

  async remove(stockId: number, collaboratorId: number): Promise<void> {
    const config = await ConfigManager.deleteFetchConfig();
    const res = await fetch(
      `${ConfigManager.getApiServerUrl()}/stocks/${stockId}/collaborators/${collaboratorId}`,
      config
    );
    if (!res.ok) {
      const body: ErrorBody = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `Erreur ${res.status}`);
    }
  },
};
