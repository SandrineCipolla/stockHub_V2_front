import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, Download, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Stock } from '@/types';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { MetricCardWrapper } from '@/components/dashboard/MetricCardWrapper';
import { StockGrid } from '@/components/dashboard/StockGrid';
import { AIAlertBannerWrapper as AISummaryWidget } from '@/components/ai/AIAlertBannerWrapper';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
import { SearchInputWrapper } from '@/components/common/SearchInputWrapper';
import { CardWrapper } from '@/components/common/CardWrapper';
import { StockFormModal } from '@/components/stocks/StockFormModal';

import { useStocks } from '@/hooks/useStocks';
import { useDataExport } from '@/hooks/useFrontendState';
import { useTheme } from '@/hooks/useTheme.ts';
import { generateAISuggestions } from '@/utils/aiPredictions';
import { logger } from '@/utils/logger';

export const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    stocks,
    ownedStocks,
    sharedStocks,
    stats,
    loadStocks,
    deleteStock,
    updateFilters,
    resetFilters,
    getStockById,
    isLoading,
    errors,
    hasAnyError,
    isAnyLoading,
    resetErrors,
  } = useStocks();

  const { exportToCsv, isLoading: isExporting } = useDataExport();

  const loadStocksRef = useRef(loadStocks);
  loadStocksRef.current = loadStocks;

  // Generate all AI suggestions (memoized for performance)
  const allAISuggestions = useMemo(() => {
    return generateAISuggestions(stocks);
  }, [stocks]);

  // Classes CSS basées sur le thème
  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textSubtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
  };

  useEffect(() => {
    let mounted = true;

    const initializeData = async () => {
      try {
        await loadStocksRef.current();
        if (mounted) {
          setIsLoaded(true);
        }
      } catch (error) {
        logger.error('Erreur lors du chargement:', error);
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateFilters({ query: value });
    },
    [updateFilters]
  );

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Gestionnaires d'événements avec useCallback
  const handleExport = useCallback(async (): Promise<void> => {
    if (stocks.length === 0) return;

    const stocksForExport: Record<string, unknown>[] = stocks.map(stock => ({ ...stock }));

    const success = await exportToCsv(stocksForExport, 'stocks-export.csv');
    if (success) {
      logger.info('Export réussi');
    }
  }, [stocks, exportToCsv]);

  const handleCreateStock = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleDeleteStock = useCallback(
    async (stockId: number | string): Promise<void> => {
      await deleteStock(stockId);
    },
    [deleteStock]
  );

  const handleUpdateStock = useCallback(
    (stockId: number | string) => {
      const stock = getStockById(stockId);
      if (stock) {
        setEditingStock(stock);
        setIsFormOpen(true);
      }
    },
    [getStockById]
  );

  const handleViewStock = useCallback(
    (stockId: number | string): void => {
      navigate(`/stocks/${stockId}`);
    },
    [navigate]
  );

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    resetFilters();
  }, [resetFilters]);

  // Affichage d'erreur globale
  if (hasAnyError) {
    return (
      <main
        className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}
      >
        <CardWrapper className="max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-4">Erreur</h2>
          <div className="space-y-2 mb-4">
            {errors.load && (
              <p className="text-sm text-red-400">Chargement: {errors.load.message}</p>
            )}
            {errors.create && (
              <p className="text-sm text-red-400">Création: {errors.create.message}</p>
            )}
            {errors.update && (
              <p className="text-sm text-red-400">Mise à jour: {errors.update.message}</p>
            )}
            {errors.delete && (
              <p className="text-sm text-red-400">Suppression: {errors.delete.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Recharger</Button>
            <Button
              variant="secondary"
              onClick={() => {
                resetErrors.load();
                resetErrors.create();
                resetErrors.update();
                resetErrors.delete();
              }}
            >
              Réessayer
            </Button>
          </div>
        </CardWrapper>
      </main>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper />

      {/* Navigation Section */}
      <NavSection>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
            <p className={themeClasses.textMuted}>
              Bienvenue dans votre espace de gestion de stocks intelligent
            </p>
          </div>

          <div
            className="flex flex-row gap-3 flex-wrap justify-start"
            role="toolbar"
            aria-label="Actions principales"
          >
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateStock}
              aria-label="Ajouter un Stock à l'inventaire"
              className="w-auto max-w-[150px]"
            >
              <span className="hidden md:hidden lg:inline">Ajouter un Stock</span>
            </Button>
            <Button
              variant="secondary"
              icon={BarChart3}
              aria-label="Analyses IA et prédictions ML"
              onClick={() => navigate('/analytics')}
              className="w-auto max-w-[150px]"
            >
              <span className="hidden md:hidden lg:inline">Analyses IA</span>
            </Button>
            <Button
              variant="secondary"
              icon={Search}
              aria-label="Recherche Avancée de stocks"
              onClick={() => logger.debug('Recherche avancée')}
            >
              <span className="hidden md:hidden lg:inline">Recherche Avancée</span>
            </Button>
          </div>
        </div>
      </NavSection>

      {/* Main Content avec id pour skip link */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8" role="main">
        {/* Métriques principales utilisant MetricCard */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          aria-labelledby="metrics-heading"
        >
          <h2 id="metrics-heading" className="sr-only">
            Métriques principales
          </h2>

          <MetricCardWrapper
            title="Total Produits"
            value={stats?.total || 0}
            change={{
              value: stats?.optimal || 0,
              type: 'increase',
            }}
            icon="package"
            color="success"
          />

          <MetricCardWrapper
            title="Stock Faible"
            value={stats?.low || 0}
            change={{
              value: stats?.critical || 0,
              type: 'decrease',
            }}
            icon="alert-triangle"
            color="warning"
          />

          <MetricCardWrapper
            title="Valeur Totale"
            value={`€${stats?.totalValue?.toLocaleString() || 0}`}
            change={{
              value: Math.round((stats?.averageValue || 0) / 10),
              type: 'increase',
            }}
            icon="trending-up"
            color="info"
          />
        </section>

        {/* AI Smart Suggestions Section - Summary Widget */}
        <section className="mb-8" aria-labelledby="ai-suggestions-heading">
          <h2 id="ai-suggestions-heading" className="sr-only">
            Suggestions intelligentes
          </h2>
          <AISummaryWidget suggestions={allAISuggestions.slice(0, 5)} />
        </section>

        {/* Recherche accessible */}
        <section className="mb-8" role="search" aria-labelledby="search-heading">
          <h2 id="search-heading" className="sr-only">
            Recherche de produits
          </h2>
          <div className="relative max-w-md">
            <SearchInputWrapper
              placeholder="Rechercher un produit..."
              value={searchTerm}
              debounce={300}
              clearable={true}
              onSearchChange={handleSearchChange}
              onSearchClear={handleSearchClear}
              ariaLabel="Rechercher un produit"
            />
            <div id="search-help" className="sr-only">
              Tapez le nom, la catégorie ou le SKU du produit que vous recherchez
            </div>
          </div>
        </section>

        {/* Loading state accessible */}
        {isAnyLoading && (
          <div className="flex justify-center py-12" role="status" aria-live="polite">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              <span className={themeClasses.textMuted}>
                {isLoading.load && 'Chargement des stocks...'}
                {isLoading.delete && 'Suppression...'}
              </span>
            </div>
          </div>
        )}

        {!isAnyLoading && (
          <>
            {/* Section Mes stocks */}
            <section aria-labelledby="owned-stocks-heading" className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 id="owned-stocks-heading" className="text-2xl font-bold">
                  Mes stocks ({ownedStocks.length})
                </h2>
                <Button
                  variant="ghost"
                  icon={Download}
                  onClick={handleExport}
                  loading={isExporting}
                  disabled={stocks.length === 0}
                  aria-describedby="export-help"
                >
                  Exporter
                </Button>
                <div id="export-help" className="sr-only">
                  Exporter la liste des stocks au format CSV
                </div>
              </div>

              {ownedStocks.length > 0 ? (
                <StockGrid
                  stocks={ownedStocks}
                  isLoaded={isLoaded}
                  onView={handleViewStock}
                  onEdit={handleUpdateStock}
                  onDelete={handleDeleteStock}
                  isUpdating={isLoading.update}
                  isDeleting={isLoading.delete}
                  aiSuggestions={allAISuggestions}
                />
              ) : (
                <div className="text-center py-12" role="status" aria-live="polite">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-50">📦</div>
                  <h3 className="text-lg font-medium mb-2">Aucun stock trouvé</h3>
                  <p className={themeClasses.textMuted}>
                    {searchTerm
                      ? `Aucun résultat pour "${searchTerm}". Essayez un autre terme.`
                      : 'Commencez par ajouter votre premier stock.'}
                  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button
                      variant="primary"
                      icon={Plus}
                      onClick={handleCreateStock}
                      className="lg:hidden"
                      aria-label="Ajouter un stock"
                    >
                      Ajouter un Stock
                    </Button>
                    {searchTerm && (
                      <Button variant="secondary" onClick={handleResetFilters}>
                        Effacer les filtres
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Section Partagés avec moi */}
            {sharedStocks.length > 0 && (
              <section aria-labelledby="shared-stocks-heading" className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 id="shared-stocks-heading" className="text-2xl font-bold">
                    Partagés avec moi ({sharedStocks.length})
                  </h2>
                </div>
                <StockGrid
                  stocks={sharedStocks}
                  isLoaded={isLoaded}
                  onView={handleViewStock}
                  isUpdating={false}
                  isDeleting={false}
                  aiSuggestions={[]}
                />
              </section>
            )}
          </>
        )}
      </main>

      <FooterWrapper />

      {isFormOpen && (
        <StockFormModal
          mode={editingStock ? 'edit' : 'create'}
          stock={editingStock ?? undefined}
          onSuccess={() => {
            void loadStocks();
            setEditingStock(null);
          }}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStock(null);
          }}
        />
      )}
    </div>
  );
};
