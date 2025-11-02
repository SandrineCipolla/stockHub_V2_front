import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BarChart3, Download, Plus, Search} from 'lucide-react';

import {HeaderWrapper} from '@/components/layout/HeaderWrapper';
import {NavSection} from '@/components/layout/NavSection';
import {MetricCard} from '@/components/dashboard/MetricCard';
import {StockGrid} from '@/components/dashboard/StockGrid';
import {AISummaryWidget} from '@/components/ai/AISummaryWidget';
import {Button} from '@/components/common/Button';
import {Card} from '@/components/common/Card';

import {useStocks} from '@/hooks/useStocks';
import {useDataExport} from '@/hooks/useFrontendState';
import {useTheme} from '@/hooks/useTheme.ts';
import {generateAISuggestions} from '@/utils/aiPredictions';
import type {SearchChangeEvent} from '@/types/web-component-events';

export const Dashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);


    const { theme } = useTheme();

    const {
        stocks,
        stats,
        loadStocks,
        createStock,
        updateStock,
        deleteStock,
        updateFilters,
        resetFilters,
        getStockById,
        isLoading,
        errors,
        hasAnyError,
        isAnyLoading,
        resetErrors
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
                console.error('Erreur lors du chargement:', error);
            }
        };

        initializeData();

        return () => {
            mounted = false;
        };
    }, []);



    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        updateFilters({ query: value });
    }, [updateFilters]);

    // Gestionnaires d'événements avec useCallback
    const handleExport = useCallback(async (): Promise<void> => {
        if (stocks.length === 0) return;

        const stocksForExport = stocks.map(stock => ({ ...stock })) as Record<string, unknown>[];

        const success = await exportToCsv(stocksForExport, 'stocks-export.csv');
        if (success) {
            console.log('Export réussi');
        }
    }, [stocks, exportToCsv]);

    const handleCreateStock = useCallback(async (): Promise<void> => {
        const result = await createStock({
            name: 'Nouveau Stock',
            quantity: 50,
            value: 1000,
            description: 'Stock créé depuis le dashboard'
        });

        if (result) {
            console.log('Stock créé:', result);
        }
    }, [createStock]);

    const handleDeleteStock = useCallback(async (stockId: number): Promise<void> => {
        await deleteStock(stockId);
    }, [deleteStock]);

    const handleUpdateStock = useCallback(async (stockId: number): Promise<void> => {
        const currentStock = getStockById(stockId);
        if (currentStock) {
            await updateStock({
                id: stockId,
                quantity: currentStock.quantity + 10
            });
        }
    }, [getStockById, updateStock]);

    const handleViewStock = useCallback((stockId: number): void => {
        console.log('Voir détails:', getStockById(stockId));
    }, [getStockById]);

    const handleResetFilters = useCallback(() => {
        setSearchTerm('');
        resetFilters();
    }, [resetFilters]);

    // Affichage d'erreur globale
    if (hasAnyError) {
        return (
            <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}>
                <Card className="max-w-md">
                    <h2 className="text-xl font-bold text-red-500 mb-4">Erreur</h2>
                    <div className="space-y-2 mb-4">
                        {errors.load && <p className="text-sm text-red-400">Chargement: {errors.load.message}</p>}
                        {errors.create && <p className="text-sm text-red-400">Création: {errors.create.message}</p>}
                        {errors.update && <p className="text-sm text-red-400">Mise à jour: {errors.update.message}</p>}
                        {errors.delete && <p className="text-sm text-red-400">Suppression: {errors.delete.message}</p>}
                        {errors.storage && <p className="text-sm text-red-400">Stockage: {errors.storage.message}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => window.location.reload()}>
                            Recharger
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            resetErrors.load();
                            resetErrors.create();
                            resetErrors.update();
                            resetErrors.delete();
                        }}>
                            Réessayer
                        </Button>
                    </div>
                </Card>
            </div>
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

                    <div className="flex flex-row gap-3 flex-wrap justify-start" role="toolbar" aria-label="Actions principales">
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={handleCreateStock}
                            loading={isLoading.create}
                            aria-label="Ajouter un nouveau stock à l'inventaire"
                            className="w-auto max-w-[150px]"
                        >
                            <span className="hidden md:hidden lg:inline">Ajouter un Stock</span>
                        </Button>
                        <Button variant="secondary"
                                icon={BarChart3}
                                aria-label="Générer et télécharger un rapport détaillé des stocks"
                                onClick={() => console.log('📊 Rapport détaillé')}
                                className="w-auto max-w-[150px]"
                        >
                            <span className="hidden md:hidden lg:inline">Rapport Détaillé</span>
                        </Button>
                        <Button variant="secondary"
                                icon={Search}
                                aria-label="Ouvrir la page de recherche avancée de stocks"
                                onClick={() => console.log('🔍 Recherche avancée')}
                        >
                            <span className="hidden md:hidden lg:inline">Recherche Avancée</span>
                        </Button>
                    </div>
                </div>
            </NavSection>

            {/* Main Content avec id pour skip link */}
            <main id="main-content" className="max-w-7xl mx-auto px-6 py-8" role="main">

                {/* Métriques principales utilisant MetricCard */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" aria-labelledby="metrics-heading">
                    <h2 id="metrics-heading" className="sr-only">Métriques principales</h2>

                    <MetricCard
                        title="Total Produits"
                        value={stats?.total || 0}
                        change={{
                            value: stats?.optimal || 0,
                            type: "increase"
                        }}
                        icon="package"
                        color="success"
                    />

                    <MetricCard
                        title="Stock Faible"
                        value={stats?.low || 0}
                        change={{
                            value: stats?.critical || 0,
                            type: "decrease"
                        }}
                        icon="alert-triangle"
                        color="warning"
                    />

                    <MetricCard
                        title="Valeur Totale"
                        value={`€${stats?.totalValue?.toLocaleString() || 0}`}
                        change={{
                            value: Math.round((stats?.averageValue || 0) / 10),
                            type: "increase"
                        }}
                        icon="trending-up"
                        color="info"
                    />
                </section>

                {/* AI Smart Suggestions Section - Summary Widget */}
                <section className="mb-8" aria-labelledby="ai-suggestions-heading">
                    <h2 id="ai-suggestions-heading" className="sr-only">Suggestions intelligentes</h2>
                    <AISummaryWidget
                        suggestions={allAISuggestions.slice(0, 5)}
                    />
                </section>

                {/* Recherche accessible */}
                <section className="mb-8" role="search" aria-labelledby="search-heading">
                    <h2 id="search-heading" className="sr-only">Recherche de produits</h2>
                    <div className="relative max-w-md">
                        <sh-search-input
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            debounce={300}
                            clearable={true}
                            onsh-search-change={(e: SearchChangeEvent) => {
                                if (e.detail && typeof e.detail.query === 'string') {
                                    handleSearchChange(e.detail.query);
                                }
                            }}
                            onsh-search-clear={() => setSearchTerm('')}
                            aria-label="Rechercher un produit"
                        />
                        <div id="search-help" className="sr-only">
                            Tapez le nom, la catégorie ou le SKU du produit que vous recherchez
                        </div>
                    </div>
                </section>

                {/* Section titre stocks */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Mes Stocks Récents ({stocks.length})</h2>
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

                {/* Loading state accessible */}
                {isAnyLoading && (
                    <div className="flex justify-center py-12" role="status" aria-live="polite">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                            <span className={themeClasses.textMuted}>
                {isLoading.load && 'Chargement des stocks...'}
                                {isLoading.create && 'Création en cours...'}
                                {isLoading.update && 'Mise à jour...'}
                                {isLoading.delete && 'Suppression...'}
                                {isLoading.storage && 'Sauvegarde...'}
              </span>
                        </div>
                    </div>
                )}

                {/* Grid des stocks  StockGrid */}
                {!isAnyLoading && (
                    <StockGrid
                        stocks={stocks}
                        isLoaded={isLoaded}
                        onView={handleViewStock}
                        onEdit={handleUpdateStock}
                        onDelete={handleDeleteStock}
                        isUpdating={isLoading.update}
                        isDeleting={isLoading.delete}
                        aiSuggestions={allAISuggestions}
                    />
                )}

                {/* État vide accessible */}
                {!isAnyLoading && stocks.length === 0 && (
                    <div className="text-center py-12" role="region" aria-live="polite">
                        <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                            📦
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucun stock trouvé</h3>
                        <p className={themeClasses.textMuted}>
                            {searchTerm
                                ? `Aucun résultat pour "${searchTerm}". Essayez un autre terme.`
                                : 'Commencez par ajouter votre premier stock.'
                            }
                        </p>
                        <div className="mt-4 flex gap-2 justify-center">
                            <Button
                                variant="primary"
                                icon={Plus}
                                onClick={handleCreateStock}
                                loading={isLoading.create}
                                className="lg:hidden"
                                aria-label="Ajouter un stock"
                            >
                                Ajouter un Stock
                            </Button>
                            {searchTerm && (
                                <Button
                                    variant="secondary"
                                    onClick={handleResetFilters}
                                >
                                    Effacer les filtres
                                </Button>
                            )}
                        </div>
                    </div>
                )}


            </main>

            <sh-footer
                app-name="STOCK HUB"
                year="2025"
                data-theme="dark"
            />
        </div>
    );
};