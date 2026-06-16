import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { formatRelativeDate } from '@/utils/dateUtils';
import type { StockDetailItem } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  optimal: 'OK',
  low: 'Stock bas',
  critical: 'Critique',
  'out-of-stock': 'Rupture',
};

const STATUS_DOT_COLORS: Record<string, string> = {
  optimal: 'bg-green-500',
  low: 'bg-yellow-500',
  critical: 'bg-orange-500',
  'out-of-stock': 'bg-red-600',
};

const STATUS_BADGE_COLORS: Record<string, string> = {
  optimal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  critical: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'out-of-stock': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface ItemMobileCardProps {
  item: StockDetailItem;
  status: 'optimal' | 'low' | 'critical' | 'out-of-stock';
  stockId: number | string;
  myRole: string | undefined;
  theme: 'light' | 'dark';
  textMuted: string;
  cardBg: string;
  editingQuantityId: number | null;
  setEditingQuantityId: (id: number | null) => void;
  inlineQuantityValue: number;
  setInlineQuantityValue: (v: number) => void;
  onUpdateQuantity: (item: StockDetailItem, delta: number) => void;
  onUpdateItem: (id: number, data: { quantity: number }) => Promise<unknown>;
  onRefetch: () => void;
  onEdit: (item: StockDetailItem) => void;
  onDelete: (item: StockDetailItem) => void;
  onContribute: (item: StockDetailItem) => void;
  isLoadingUpdate: boolean;
  isLoadingDelete: boolean;
}

export const ItemMobileCard: React.FC<ItemMobileCardProps> = ({
  item,
  status,
  stockId,
  myRole,
  theme,
  textMuted,
  cardBg,
  editingQuantityId,
  setEditingQuantityId,
  inlineQuantityValue,
  setInlineQuantityValue,
  onUpdateQuantity,
  onUpdateItem,
  onRefetch,
  onEdit,
  onDelete,
  onContribute,
  isLoadingUpdate,
  isLoadingDelete,
}) => {
  const navigate = useNavigate();
  const isOwnerOrEditor = myRole === 'OWNER' || myRole === 'EDITOR';
  const isContributor = myRole === 'VIEWER_CONTRIBUTOR';

  return (
    <article
      className={`rounded-xl border p-4 ${cardBg} ${
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      }`}
      aria-label={`Item : ${item.label}`}
    >
      {/* Header : nom + badge statut */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${STATUS_DOT_COLORS[status]}`}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <button
              onClick={() => navigate(`/stocks/${stockId}/items/${item.id}`)}
              className="font-semibold truncate hover:text-purple-500 transition-colors text-left"
              aria-label={`Voir le détail de ${item.label}`}
            >
              {item.label}
            </button>
            {item.description && (
              <p className={`text-xs truncate ${textMuted}`}>{item.description}</p>
            )}
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE_COLORS[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Quantité */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm ${textMuted}`}>Quantité</span>
        {myRole === 'VIEWER' ? (
          <span className="font-bold tabular-nums">{item.quantity}</span>
        ) : isContributor ? (
          <div className="flex items-center gap-2">
            <span className="font-bold tabular-nums">{item.quantity}</span>
            <button
              onClick={() => onContribute(item)}
              className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              aria-label={`Signaler une modification pour ${item.label}`}
            >
              Signaler
            </button>
          </div>
        ) : isOwnerOrEditor ? (
          <div className="flex items-center gap-1" aria-label={`Quantité : ${item.quantity}`}>
            <button
              onClick={() => onUpdateQuantity(item, -1)}
              disabled={isLoadingUpdate}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-purple-100 dark:hover:bg-slate-600 disabled:opacity-50 text-lg"
              aria-label={`Diminuer la quantité de ${item.label}`}
            >
              −
            </button>
            {editingQuantityId === item.id ? (
              <input
                type="number"
                min={0}
                value={inlineQuantityValue}
                onChange={e => setInlineQuantityValue(Number(e.target.value))}
                onBlur={() => {
                  if (!isNaN(inlineQuantityValue) && inlineQuantityValue >= 0) {
                    void onUpdateItem(item.id, { quantity: inlineQuantityValue });
                    void onRefetch();
                  }
                  setEditingQuantityId(null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                  if (e.key === 'Escape') setEditingQuantityId(null);
                }}
                className="w-16 text-center px-1 py-0.5 border border-purple-500 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none"
                aria-label={`Quantité de ${item.label}`}
              />
            ) : (
              <span
                className="font-bold cursor-pointer hover:text-purple-400 transition-colors min-w-[28px] text-center tabular-nums"
                title="Toucher pour éditer"
                onClick={() => {
                  setEditingQuantityId(item.id);
                  setInlineQuantityValue(item.quantity);
                }}
              >
                {item.quantity}
              </span>
            )}
            <button
              onClick={() => onUpdateQuantity(item, +1)}
              disabled={isLoadingUpdate}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-purple-100 dark:hover:bg-slate-600 disabled:opacity-50 text-lg"
              aria-label={`Augmenter la quantité de ${item.label}`}
            >
              +
            </button>
          </div>
        ) : (
          <span className="font-bold tabular-nums">{item.quantity}</span>
        )}
      </div>

      {/* Min + date */}
      <div className={`flex items-center justify-between text-sm ${textMuted} mb-3`}>
        <span>Min : {item.minimumStock ?? '—'}</span>
        <span>{formatRelativeDate(item.updatedAt)}</span>
      </div>

      {/* Actions */}
      {isOwnerOrEditor && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/30">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-slate-600 transition-colors"
            aria-label={`Modifier ${item.label}`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Modifier
          </button>
          <button
            onClick={() => onDelete(item)}
            disabled={isLoadingDelete}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
            aria-label={`Supprimer ${item.label}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
        </div>
      )}
    </article>
  );
};
