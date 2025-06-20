import React, {useCallback, useEffect, useState} from 'react';
import {BarChart3, Download, Plus, Search,} from 'lucide-react';

// Import de tes composants existants
import {Header} from '@/components/layout/Header';
import {NavSection} from '@/components/layout/NavSection';
import {Footer} from '@/components/layout/Footer';
import {MetricCard} from '@/components/dashboard/MetricCard';
import {StockGrid} from '@/components/dashboard/StockGrid';
import {Button} from '@/components/common/Button';
import {Input} from '@/components/common/Input';
import {Card} from '@/components/common/Card';


import {useStocks} from '@/hooks/useStocks';
import {useDataExport} from '@/hooks/useFrontendState';
import {useTheme} from '@/hooks/useTheme.ts';

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
                await loadStocks();
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
    }, []); // Dépendance vide - exécuté une seule fois

    // Mettre à jour les filtres avec useCallback et dépendance stable
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        updateFilters({ query: value });
    }, [updateFilters]);

    // Gestionnaires d'événements avec useCallback
    const handleExport = useCallback(async (): Promise<void> => {
        if (stocks.length === 0) return;

        const success = await exportToCsv(stocks, 'stocks-export.csv');
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

            <Header />

            {/* Navigation Section */}
            <NavSection>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
                        <p className={themeClasses.textMuted}>
                            Bienvenue dans votre espace de gestion de stocks intelligent
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3" role="toolbar" aria-label="Actions principales">
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={handleCreateStock}
                            loading={isLoading.create}
                        >
                            Ajouter un Stock
                        </Button>
                        <Button variant="secondary" icon={BarChart3}>
                            Rapport Détaillé
                        </Button>
                        <Button variant="secondary" icon={Search}>
                            Recherche Avancée
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
                        id="total-products"
                        label="Total Produits"
                        value={stats?.total || 0}
                        change={stats?.optimal || 0}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />

                    <MetricCard
                        id="low-stock"
                        label="Stock Faible"
                        value={stats?.low || 0}
                        change={stats?.critical || 0}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />

                    <MetricCard
                        id="total-value"
                        label="Valeur Totale"
                        value={`€${stats?.totalValue?.toLocaleString() || 0}`}
                        change={Math.round((stats?.averageValue || 0) / 10)}
                        changeType="increase"
                        icon="trending-up"
                        color="info"
                    />
                </section>

                {/* Recherche accessible */}
                <section className="mb-8" role="search" aria-labelledby="search-heading">
                    <h2 id="search-heading" className="sr-only">Recherche de produits</h2>
                    <div className="relative max-w-md">
                        <Input
                            id="search-input"
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            icon={Search}
                            aria-describedby="search-help"
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
            
            <Footer />
        </div>
    );
};