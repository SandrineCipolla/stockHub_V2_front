import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Pencil, Plus, Trash2 } from 'lucide-react';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { CardWrapper } from '@/components/common/CardWrapper';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
import { MetricCardWrapper } from '@/components/dashboard/MetricCardWrapper';
import { StockFormModal } from '@/components/stocks/StockFormModal';
import { ItemFormModal } from '@/components/items/ItemFormModal';

import { useStockDetail } from '@/hooks/useStockDetail';
import { useItems } from '@/hooks/useItems';
import { useTheme } from '@/hooks/useTheme';
import { computePredictions } from '@/utils/stockPredictions';
import type { StockDetailItem } from '@/types';

const ITEMS_PER_PAGE = 20;

type FilterStatus = 'all' | 'optimal' | 'low' | 'critical' | 'outOfStock';

const getItemStatus = (item: StockDetailItem): 'optimal' | 'low' | 'critical' | 'outOfStock' => {
  const min = item.minimumStock ?? 1;
  if (item.quantity === 0) return 'outOfStock';
  if (item.quantity <= min * 0.5) return 'critical';
  if (item.quantity <= min) return 'low';
  return 'optimal';
};

const STATUS_LABELS: Record<string, string> = {
  optimal: 'OK',
  low: 'Stock bas',
  critical: 'Critique',
  outOfStock: 'Rupture',
};

const STATUS_COLORS: Record<string, string> = {
  optimal: 'text-green-600',
  low: 'text-yellow-600',
  critical: 'text-orange-500',
  outOfStock: 'text-red-600',
};

const STATUS_DOT_COLORS: Record<string, string> = {
  optimal: 'bg-green-500',
  low: 'bg-yellow-500',
  critical: 'bg-orange-500',
  outOfStock: 'bg-red-600',
};

const filterChips = (
  total: number,
  counts: Record<'optimal' | 'low' | 'critical' | 'outOfStock', number>
): { key: FilterStatus; label: string }[] => [
  { key: 'all', label: `Tous (${total})` },
  { key: 'outOfStock', label: `Rupture (${counts.outOfStock})` },
  { key: 'critical', label: `Critique (${counts.critical})` },
  { key: 'low', label: `Stock bas (${counts.low})` },
  { key: 'optimal', label: `OK (${counts.optimal})` },
];

export const StockDetailPage: React.FC = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const numericId = Number(stockId);
  const { stock, isLoading, error, refetch } = useStockDetail(numericId);
  const { updateItem, deleteItem, isLoading: itemsLoading } = useItems(numericId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StockDetailItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    table: theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
    tableRow:
      theme === 'dark' ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-gray-50 border-gray-100',
    tableHeader: theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-50 text-gray-600',
    chip:
      theme === 'dark'
        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    chipActive: 'bg-purple-600 text-white',
  };

  const filteredItems = useMemo(() => {
    if (!stock) return [];
    if (filterStatus === 'all') return stock.items;
    return stock.items.filter(item => getItemStatus(item) === filterStatus);
  }, [stock, filterStatus]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const statusCounts = useMemo(() => {
    if (!stock) return { optimal: 0, low: 0, critical: 0, outOfStock: 0 };
    return stock.items.reduce(
      (acc, item) => {
        acc[getItemStatus(item)]++;
        return acc;
      },
      { optimal: 0, low: 0, critical: 0, outOfStock: 0 }
    );
  }, [stock]);

  const handleUpdateQuantity = async (item: StockDetailItem, delta: number) => {
    const newQty = Math.max(0, item.quantity + delta);
    await updateItem(item.id, { quantity: newQty });
    void refetch();
  };

  const handleDeleteItem = async (item: StockDetailItem) => {
    if (!window.confirm(`Supprimer l'item "${item.label}" ?`)) return;
    await deleteItem(item.id);
    void refetch();
  };

  if (isLoading) {
    return (
      <main
        className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}
        role="status"
        aria-live="polite"
        aria-label="Chargement du détail du stock"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className={themeClasses.textMuted}>Chargement...</span>
        </div>
      </main>
    );
  }

  if (error || !stock) {
    return (
      <main
        className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}
        role="alert"
      >
        <CardWrapper className="max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Stock introuvable</h2>
          <p className={`${themeClasses.textMuted} mb-4`}>
            {error ?? 'Le stock demandé n\u2019existe pas ou vous n\u2019y avez pas accès.'}
          </p>
          <Button onClick={() => navigate('/')}>Retour au tableau de bord</Button>
        </CardWrapper>
      </main>
    );
  }

  const predictions = computePredictions(stock.items);

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper />

      <NavSection>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
            aria-label="Retour au tableau de bord"
          >
            Retour
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold truncate">{stock.label}</h1>
            <p className={themeClasses.textMuted}>
              {stock.category ?? 'Sans catégorie'}
              {stock.description ? ` — ${stock.description}` : ''}
            </p>
          </div>
          <Button
            variant="secondary"
            icon={Edit}
            onClick={() => setIsEditOpen(true)}
            aria-label="Modifier ce stock"
          >
            Modifier le stock
          </Button>
        </div>
      </NavSection>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8" role="main">
        {/* Métriques agrégées */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          aria-labelledby="metrics-heading"
        >
          <h2 id="metrics-heading" className="sr-only">
            Métriques du stock
          </h2>
          <MetricCardWrapper
            title="Nombre d'items"
            value={stock.totalItems}
            icon="package"
            color="info"
          />
          <MetricCardWrapper
            title="Quantité totale"
            value={stock.totalQuantity}
            icon="trending-up"
            color="success"
          />
          <MetricCardWrapper
            title="Items critiques"
            value={stock.criticalItemsCount}
            icon="alert-triangle"
            color={stock.criticalItemsCount > 0 ? 'warning' : 'success'}
          />
        </section>

        {/* Prédictions IA */}
        {predictions.length > 0 && (
          <section className="mb-10" aria-labelledby="predictions-heading">
            <h2 id="predictions-heading" className="text-2xl font-bold mb-4">
              Alertes intelligentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map(pred =>
                React.createElement('sh-stock-prediction-card', {
                  key: pred.stockId,
                  'stock-name': pred.stockName,
                  'stock-id': pred.stockId,
                  'risk-level': pred.riskLevel,
                  'days-until-rupture': pred.daysUntilRupture ?? undefined,
                  confidence: pred.confidence,
                  'daily-consumption-rate': pred.dailyConsumptionRate,
                  'current-quantity': pred.currentQuantity,
                  'recommended-reorder-quantity': pred.recommendedReorderQuantity,
                  'show-details': true,
                  'data-theme': theme,
                })
              )}
            </div>
          </section>
        )}

        {/* Liste des items */}
        <section aria-labelledby="items-heading">
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <h2 id="items-heading" className="text-2xl font-bold">
              Items ({stock.totalItems})
            </h2>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
              aria-label="Ajouter un item"
            >
              Ajouter un item
            </Button>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrer par statut">
            {filterChips(stock.totalItems, statusCounts).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setFilterStatus(key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === key ? themeClasses.chipActive : themeClasses.chip
                }`}
                aria-pressed={filterStatus === key}
              >
                {label}
              </button>
            ))}
          </div>

          {stock.items.length === 0 ? (
            <div className="text-center py-12" role="status">
              <div className="w-12 h-12 mx-auto mb-4 opacity-50">📦</div>
              <p className={themeClasses.textMuted}>Ce stock ne contient pas encore d'items.</p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowAddModal(true)}
                className="mt-4"
              >
                Ajouter le premier item
              </Button>
            </div>
          ) : (
            <>
              <div className={`rounded-xl border overflow-hidden ${themeClasses.table}`}>
                <table className="w-full text-sm" aria-label="Liste des items">
                  <thead>
                    <tr className={themeClasses.tableHeader}>
                      <th className="text-left px-4 py-3 font-medium">Nom / Description</th>
                      <th className="text-left px-4 py-3 font-medium">Statut</th>
                      <th className="text-center px-4 py-3 font-medium">Quantité</th>
                      <th className="text-center px-4 py-3 font-medium">Min</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map(item => {
                      const status = getItemStatus(item);
                      return (
                        <tr
                          key={item.id}
                          className={`group border-t ${themeClasses.tableRow} transition-colors`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT_COLORS[status]}`}
                                aria-hidden="true"
                              />
                              <div className="min-w-0">
                                <p className="font-medium truncate">{item.label}</p>
                                {item.description && (
                                  <p className={`text-xs truncate ${themeClasses.textMuted}`}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 py-3 font-medium ${STATUS_COLORS[status]}`}>
                            {STATUS_LABELS[status]}
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="flex items-center justify-center gap-1"
                              aria-label={`Quantité : ${item.quantity}`}
                            >
                              <button
                                onClick={() => handleUpdateQuantity(item, -1)}
                                disabled={itemsLoading.update}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-purple-100 dark:hover:bg-slate-600 disabled:opacity-50"
                                aria-label={`Diminuer la quantité de ${item.label}`}
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-bold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item, +1)}
                                disabled={itemsLoading.update}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-purple-100 dark:hover:bg-slate-600 disabled:opacity-50"
                                aria-label={`Augmenter la quantité de ${item.label}`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-center ${themeClasses.textMuted}`}>
                            {item.minimumStock}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1 rounded hover:bg-purple-100 dark:hover:bg-slate-600"
                                aria-label={`Modifier ${item.label}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                disabled={itemsLoading.delete}
                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 disabled:opacity-50"
                                aria-label={`Supprimer ${item.label}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className={`text-sm ${themeClasses.textMuted}`}>
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} sur{' '}
                    {filteredItems.length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded text-sm ${themeClasses.chip} disabled:opacity-50`}
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded text-sm ${themeClasses.chip} disabled:opacity-50`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <FooterWrapper />

      {isEditOpen && (
        <StockFormModal
          mode="edit"
          stock={stock}
          onSuccess={() => {
            void refetch();
            setIsEditOpen(false);
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {showAddModal && (
        <ItemFormModal
          mode="create"
          stockId={numericId}
          onSuccess={() => {
            void refetch();
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingItem && (
        <ItemFormModal
          mode="edit"
          stockId={numericId}
          item={editingItem}
          onSuccess={() => {
            void refetch();
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};
