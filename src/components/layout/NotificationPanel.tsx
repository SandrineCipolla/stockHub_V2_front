import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle, Package, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import type { NotificationItem } from '@/types';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const critical = notifications.filter(n => n.type === 'critical');
  const ruptures = notifications.filter(n => n.type === 'out-of-stock');
  const contributions = notifications.filter(n => n.type === 'contribution');

  const handleStockClick = (stockId: number) => {
    navigate(`/stocks/${stockId}`);
    onClose();
  };

  const isDark = theme === 'dark';
  const panelBg = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const itemHover = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100';
  const contribBg = isDark ? 'bg-slate-700/50' : 'bg-gray-50';

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panneau de notifications"
        tabIndex={-1}
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 shadow-2xl border-l flex flex-col outline-none ${panelBg}`}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b ${borderColor}`}>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" aria-hidden="true" />
            <h2 className={`text-base font-semibold ${textPrimary}`}>Notifications</h2>
            {notifications.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-600 text-white">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le panneau de notifications"
            className={`p-1.5 rounded-lg transition-colors ${itemHover} ${textMuted}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-4 px-3">
          {notifications.length === 0 && (
            <div className={`text-center py-12 ${textMuted}`}>
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="text-sm">Aucune notification</p>
            </div>
          )}

          {critical.length > 0 && (
            <section aria-label="Stocks critiques">
              <h3
                className={`text-xs font-semibold uppercase tracking-wide mb-2 px-1 ${textMuted}`}
              >
                Stocks critiques
              </h3>
              <ul className="space-y-1">
                {critical.map(n => (
                  <li key={`critical-${n.stockId}`}>
                    <button
                      onClick={() => n.stockId !== undefined && handleStockClick(n.stockId)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${itemHover}`}
                    >
                      <AlertTriangle
                        className="w-4 h-4 text-orange-500 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className={`text-sm flex-1 ${textPrimary}`}>{n.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex-shrink-0">
                        Critique
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ruptures.length > 0 && (
            <section aria-label="Ruptures de stock">
              <h3
                className={`text-xs font-semibold uppercase tracking-wide mb-2 px-1 ${textMuted}`}
              >
                Ruptures de stock
              </h3>
              <ul className="space-y-1">
                {ruptures.map(n => (
                  <li key={`rupture-${n.stockId}`}>
                    <button
                      onClick={() => n.stockId !== undefined && handleStockClick(n.stockId)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${itemHover}`}
                    >
                      <Package className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                      <span className={`text-sm flex-1 ${textPrimary}`}>{n.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex-shrink-0">
                        Rupture
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {contributions.length > 0 && (
            <section aria-label="Contributions en attente">
              <h3
                className={`text-xs font-semibold uppercase tracking-wide mb-2 px-1 ${textMuted}`}
              >
                Contributions en attente
              </h3>
              <ul className="space-y-1">
                {contributions.map((n, i) => (
                  <li key={`contribution-${i}`}>
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${contribBg}`}>
                      <Bell className="w-4 h-4 text-purple-500 flex-shrink-0" aria-hidden="true" />
                      <span className={`text-sm ${textPrimary}`}>{n.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
};
