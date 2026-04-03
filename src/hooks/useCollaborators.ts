import { useState, useCallback } from 'react';
import { msalInstance } from '@/config/msalInstance';
import { CollaboratorsAPI } from '@/services/api/collaboratorsAPI';
import type { Collaborator, StockRole } from '@/types/collaboration';

function getCurrentUserEmail(): string | null {
  const account = msalInstance.getActiveAccount();
  // idTokenClaims is typed as object by MSAL — no narrower type available without assertion
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const claims = account?.idTokenClaims as { emails?: string[] } | undefined;
  if (Array.isArray(claims?.emails) && typeof claims?.emails[0] === 'string') {
    return claims.emails[0];
  }
  return account?.username ?? null;
}

export function useCollaborators(stockId: number) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CollaboratorsAPI.list(stockId);
      setCollaborators(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [stockId]);

  const add = useCallback(
    async (email: string, role: StockRole) => {
      const collab = await CollaboratorsAPI.add(stockId, email, role);
      setCollaborators(prev => [...prev, collab]);
    },
    [stockId]
  );

  const updateRole = useCallback(
    async (collaboratorId: number, role: StockRole) => {
      const updated = await CollaboratorsAPI.updateRole(stockId, collaboratorId, role);
      setCollaborators(prev => prev.map(c => (c.id === collaboratorId ? updated : c)));
    },
    [stockId]
  );

  const remove = useCallback(
    async (collaboratorId: number) => {
      await CollaboratorsAPI.remove(stockId, collaboratorId);
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    },
    [stockId]
  );

  const myRole: StockRole = (() => {
    const email = getCurrentUserEmail();
    if (!email) return 'VIEWER';
    const me = collaborators.find(c => c.userEmail === email);
    return me ? me.role : 'OWNER';
  })();

  return { collaborators, myRole, isLoading, error, load, add, updateRole, remove };
}
