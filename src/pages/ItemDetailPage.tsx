import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Package } from 'lucide-react';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
import { useTheme } from '@/hooks/useTheme';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import { ItemsAPI } from '@/services/api/itemsAPI';
import type { RawItemDetail } from '@/services/api/itemsAPI';
import { formatRelativeDate } from '@/utils/dateUtils';

type ItemStatus = 'optimal' | 'low' | 'critical' | 'out-of-stock';

const getStatus = (item: RawItemDetail): ItemStatus => {
  const min = item.minimumStock ?? 1;
  if (item.quantity === 0) return 'out-of-stock';
  if (item.quantity < min) return 'critical';
  if (item.quantity === min) return 'low';
  return 'optimal';
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  optimal: 'OK',
  low: 'Stock bas',
  critical: 'Critique',
  'out-of-stock': 'Rupture',
};

const STATUS_COLORS: Record<ItemStatus, string> = {
  optimal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  critical: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const ItemDetailPage: React.FC = () => {
  const { stockId, itemId } = useParams<{ stockId: string; itemId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { count: notifCount } = useNotificationCount();

  const [item, setItem] = useState<RawItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    card: theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
  };

  useEffect(() => {
    if (!stockId || !itemId) return;

    setIsLoading(true);
    ItemsAPI.fetchItem(stockId, itemId)
      .then(data => {
        setItem(data);
        setError(null);
      })
      .catch(() => {
        setError('Impossible de charger les informations de cet item.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [stockId, itemId]);

  const status = item ? getStatus(item) : null;

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper notificationCount={notifCount} />

      <NavSection
        breadcrumbs={[
          { icon: Home, href: '/', label: 'Accueil' },
          { href: `/stocks/${stockId}`, label: 'Stock' },
          { label: item?.label ?? 'Item', current: true },
        ]}
      >
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => navigate(`/stocks/${stockId}`)}
          aria-label="Retour à la liste des items"
        >
          <span className="hidden sm:inline">Retour</span>
        </Button>
      </NavSection>

      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        {isLoading && (
          <div role="status" aria-live="polite" className="flex justify-center py-16">
            <div
              className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">Chargement de l'item…</span>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {item && status && (
          <>
            {/* Header item */}
            <div className="flex items-start gap-3">
              <Package
                className="w-7 h-7 text-purple-500 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <h1 className={`text-2xl font-bold ${themeClasses.text}`}>{item.label}</h1>
                {item.description && (
                  <p className={`mt-1 text-sm ${themeClasses.textMuted}`}>{item.description}</p>
                )}
              </div>
              <span
                className={`ml-auto flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>

            {/* Metrics */}
            <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3`}>
              <div className={`rounded-xl border p-4 ${themeClasses.card}`}>
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${themeClasses.textMuted}`}
                >
                  Quantité
                </p>
                <p className={`mt-1 text-3xl font-bold tabular-nums ${themeClasses.text}`}>
                  {item.quantity}
                </p>
              </div>

              <div className={`rounded-xl border p-4 ${themeClasses.card}`}>
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${themeClasses.textMuted}`}
                >
                  Seuil minimum
                </p>
                <p className={`mt-1 text-3xl font-bold tabular-nums ${themeClasses.text}`}>
                  {item.minimumStock}
                </p>
              </div>

              {item.updatedAt && (
                <div
                  className={`rounded-xl border p-4 ${themeClasses.card} col-span-2 sm:col-span-1`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${themeClasses.textMuted}`}
                  >
                    Dernière mise à jour
                  </p>
                  <p className={`mt-1 text-sm font-medium ${themeClasses.text}`}>
                    {formatRelativeDate(item.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <FooterWrapper />
    </div>
  );
};
