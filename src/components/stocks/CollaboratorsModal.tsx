import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useTheme } from '@/hooks/useTheme';
import type { StockRole } from '@/types/collaboration';

interface Props {
  stockId: number;
  stockLabel: string;
  onClose: () => void;
}

const ROLES: { value: StockRole; label: string }[] = [
  { value: 'EDITOR', label: 'Éditeur' },
  { value: 'VIEWER', label: 'Lecteur' },
  { value: 'VIEWER_CONTRIBUTOR', label: 'Contributeur' },
];

export const CollaboratorsModal: React.FC<Props> = ({ stockId, stockLabel, onClose }) => {
  const { theme } = useTheme();
  const { collaborators, isLoading, error, load, add, updateRole, remove } =
    useCollaborators(stockId);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<StockRole>('VIEWER');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const listRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const handleRoleChange = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      void updateRole(e.detail.collaboratorId, e.detail.role);
    };
    const handleRemove = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      void remove(e.detail.collaboratorId);
    };

    el.addEventListener('collaborator-role-change', handleRoleChange);
    el.addEventListener('collaborator-remove', handleRemove);
    return () => {
      el.removeEventListener('collaborator-role-change', handleRoleChange);
      el.removeEventListener('collaborator-remove', handleRemove);
    };
  }, [updateRole, remove, isLoading]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteError(null);
    setIsSubmitting(true);
    try {
      await add(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-slate-900' : 'bg-white';
  const border = isDark ? 'border-slate-700' : 'border-gray-200';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputCls = isDark
    ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collab-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-lg rounded-2xl border ${bg} ${border} shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
          <div>
            <h2 id="collab-modal-title" className={`text-lg font-bold ${text}`}>
              Gestion des accès
            </h2>
            <p className={`text-sm ${textMuted}`}>{stockLabel}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-slate-700/30 ${textMuted}`}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Invite form */}
          <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <p className={`text-sm font-semibold ${text}`}>Inviter un collaborateur</p>
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputCls}`}
              aria-label="Email du collaborateur"
            />
            <div className="flex gap-2">
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as StockRole)} // eslint-disable-line @typescript-eslint/consistent-type-assertions
                className={`flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputCls}`}
                aria-label="Rôle"
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 whitespace-nowrap"
              >
                Inviter
              </button>
            </div>
            {inviteError && <p className="text-sm text-red-400">{inviteError}</p>}
          </form>

          {/* Collaborators list */}
          <div>
            <p className={`text-sm font-semibold mb-3 ${text}`}>
              Collaborateurs ({collaborators.length})
            </p>
            {isLoading ? (
              <div className={`text-sm text-center py-4 ${textMuted}`}>Chargement...</div>
            ) : error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : (
              React.createElement('sh-collaborator-list', {
                ref: (el: HTMLElement | null) => {
                  listRef.current = el;
                },
                collaborators: collaborators,
                'viewer-role': 'OWNER',
                'data-theme': theme,
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
