import {useCallback, useEffect, useMemo, useState} from 'react';
import type {CreateStockData, SearchFilters, Stock, StockStatus, UpdateStockData} from '@/types';
import {createFrontendError, useAsyncAction, useLocalStorageState} from './useFrontendState';
import {stockData} from "@/data/stockData.ts";


export type {CreateStockData, UpdateStockData};

// ===== HOOK PRINCIPAL POUR GESTION DES STOCKS =====
export const useStocks = () => {
    // Persistance dans localStorage avec gestion d'erreurs
    const {
        value: stocks,
        setValue: setStocks,
        error: storageError
    } = useLocalStorageState<Stock[]>('stocks', stockData);

    const [storageLoading, setStorageLoading] = useState(true);
    useEffect(() => {
        // Simulation du temps de chargement initial du localStorage
        const timer = setTimeout(() => {
            setStorageLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);
    const [filters, setFilters] = useState<SearchFilters>({});


    // ===== ACTIONS AVEC GESTION D'ERREURS =====

    // Charger les stocks (simulé) - FIX: useCallback pour éviter re-création
    const loadStocksAction = useAsyncAction(
        useCallback(async (): Promise<Stock[]> => {
            // Simulation d'un chargement
            await new Promise(resolve => setTimeout(resolve, 800));

            if (!stocks || stocks.length === 0) {
                throw new Error('Aucun stock trouvé');
            }

            return stocks;
        }, [stocks]), // Dépendance stable
        { simulateDelay: 0 }
    );

    // Créer un stock - FIX: useCallback avec dépendances stables
    const createStockAction = useAsyncAction(
        useCallback(async (stockData: CreateStockData): Promise<Stock> => {
            // Validation
            if (!stockData.name.trim()) {
                throw createFrontendError(
                    'validation',
                    'Le nom du stock est obligatoire',
                    'name',
                    { field: 'name' },

                );
            }

            if (stockData.quantity < 0) {
                throw createFrontendError(
                    'validation',
                    'La quantité ne peut pas être négative',
                    'quantity',
                    { field: 'quantity' },

                );
            }

            if (stockData.value < 0) {
                throw createFrontendError(
                    'validation',
                    'La valeur ne peut pas être négative',
                    'value',
                    { field: 'value' },

                );
            }

            // Vérifier si le nom existe déjà
            if (stocks?.some(stock => stock.name.toLowerCase() === stockData.name.toLowerCase())) {
                throw createFrontendError(
                    'validation',
                    'Un stock avec ce nom existe déjà',
                    'name',
                    { field: 'name' },
                );
            }

            // Calculer le statut automatiquement
            const status: StockStatus =
                stockData.quantity === 0 ? 'critical' :
                    stockData.quantity < 10 ? 'low' : 'optimal';

            const newStock: Stock = {
                id: Math.max(...(stocks || []).map(s => s.id), 0) + 1,
                ...stockData,
                status,
                lastUpdate: 'maintenant'
            };

            // Simulation de sauvegarde
            await new Promise(resolve => setTimeout(resolve, 600));

            // Mettre à jour la liste
            const updatedStocks = [...(stocks || []), newStock];
            setStocks(updatedStocks);

            return newStock;
        }, [stocks, setStocks]), // Dépendances stables
        {
            onSuccess: () => {
                console.log('✅ Stock créé avec succès');
            },
            simulateDelay: 0
        }
    );

    // Mettre à jour un stock - FIX: useCallback avec dépendances stables
    const updateStockAction = useAsyncAction(
        useCallback(async (updateData: UpdateStockData): Promise<Stock> => {
            if (!stocks) {
                throw createFrontendError(
                    'unknown',
                    'Liste des stocks non disponible', );
            }

            const existingStock = stocks.find(s => s.id === updateData.id);
            if (!existingStock) {
                throw createFrontendError(
                    'validation',
                    `Stock avec l'ID ${updateData.id} introuvable`,

                );
            }

            // Validation des champs modifiés
            if (updateData.name && !updateData.name.trim()) {
                throw createFrontendError(
                    'validation',
                    'Le nom du stock ne peut pas être vide',
                    'name',
                    { field: 'name' },

                );
            }

            if (updateData.quantity !== undefined && updateData.quantity < 0) {
                throw createFrontendError(
                    'validation',
                    'La quantité ne peut pas être négative',
                    'quantity',
                    { field: 'quantity' },

                );
            }

            // Calculer le nouveau statut si la quantité change
            const newQuantity = updateData.quantity ?? existingStock.quantity;
            const newStatus: StockStatus =
                newQuantity === 0 ? 'critical' :
                    newQuantity < 10 ? 'low' : 'optimal';

            const updatedStock: Stock = {
                ...existingStock,
                ...updateData,
                status: newStatus,
                lastUpdate: 'maintenant'
            };

            // Simulation de sauvegarde
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mettre à jour la liste
            const updatedStocks = stocks.map(stock =>
                stock.id === updateData.id ? updatedStock : stock
            );
            setStocks(updatedStocks);

            return updatedStock;
        }, [stocks, setStocks]), // Dépendances stables
        { simulateDelay: 0 }
    );

    // Supprimer un stock - FIX: useCallback avec dépendances stables
    const deleteStockAction = useAsyncAction(
        useCallback(async (stockId: number): Promise<void> => {
            if (!stocks) {
                throw createFrontendError(
                    'unknown',
                    'Liste des stocks non disponible'
                );
            }

            const stockExists = stocks.some(s => s.id === stockId);
            if (!stockExists) {
                throw createFrontendError(
                    'validation',
                    `Stock avec l'ID ${stockId} introuvable`,

                );
            }

            // Simulation de suppression
            await new Promise(resolve => setTimeout(resolve, 400));

            // Mettre à jour la liste
            const updatedStocks = stocks.filter(stock => stock.id !== stockId);
            setStocks(updatedStocks);
        }, [stocks, setStocks]), // Dépendances stables
        { simulateDelay: 0 }
    );

    // Supprimer plusieurs stocks - FIX: useCallback avec dépendances stables
    const deleteMultipleStocksAction = useAsyncAction(
        useCallback(async (stockIds: number[]): Promise<void> => {
            if (!stocks) {
                throw createFrontendError(
                    'unknown',
                    'Liste des stocks non disponible'
                );
            }

            if (stockIds.length === 0) {
                throw createFrontendError(
                    'validation',
                    'Aucun stock sélectionné'
                );
            }

            // Vérifier que tous les stocks existent
            const missingIds = stockIds.filter(id => !stocks.some(s => s.id === id));
            if (missingIds.length > 0) {
                throw createFrontendError(
                    'validation',
                    `Stocks introuvables: ${missingIds.join(', ')}`,

                );
            }

            // Simulation de suppression en lot
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mettre à jour la liste
            const updatedStocks = stocks.filter(stock => !stockIds.includes(stock.id));
            setStocks(updatedStocks);
        }, [stocks, setStocks]), // Dépendances stables
        { simulateDelay: 0 }
    );

    // ===== COMPUTED VALUES =====

    // Stocks filtrés - FIX: useMemo avec dépendances correctes
    const filteredStocks = useMemo(() => {
        if (!stocks) return [];

        return stocks.filter(stock => {
            // Filtre par nom/recherche
            if (filters.query) {
                const query = filters.query.toLowerCase();
                if (!stock.name.toLowerCase().includes(query)) {
                    return false;
                }
            }

            // Filtre par statut
            if (filters.status && filters.status.length > 0) {
                if (!filters.status.includes(stock.status)) {
                    return false;
                }
            }

            // Filtre par valeur min/max
            if (filters.minValue !== undefined && stock.value < filters.minValue) {
                return false;
            }
            return !(filters.maxValue !== undefined && stock.value > filters.maxValue);
        });
    }, [stocks, filters]); // Dépendances stables

    // Statistiques - FIX: useMemo avec dépendances correctes
    const stats = useMemo(() => {
        if (!stocks) return null;

        return {
            total: stocks.length,
            optimal: stocks.filter(s => s.status === 'optimal').length,
            low: stocks.filter(s => s.status === 'low').length,
            critical: stocks.filter(s => s.status === 'critical').length,
            totalValue: stocks.reduce((sum, stock) => sum + stock.value, 0),
            averageValue: stocks.length > 0 ? stocks.reduce((sum, stock) => sum + stock.value, 0) / stocks.length : 0
        };
    }, [stocks]); // Dépendance stable

    // ===== FONCTIONS UTILITAIRES - FIX: useCallback pour éviter re-création =====

    const getStockById = useCallback((id: number): Stock | undefined => {
        return stocks?.find(stock => stock.id === id);
    }, [stocks]);

    const resetFilters = useCallback(() => {
        setFilters({});
    }, []);

    const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // ===== ACTIONS EXPORTÉES AVEC useCallback =====
    const loadStocks = useCallback(() => loadStocksAction.execute(), [loadStocksAction]);
    const createStock = useCallback((data: CreateStockData) => createStockAction.execute(data), [createStockAction]);
    const updateStock = useCallback((data: UpdateStockData) => updateStockAction.execute(data), [updateStockAction]);
    const deleteStock = useCallback((id: number) => deleteStockAction.execute(id), [deleteStockAction]);
    const deleteMultipleStocks = useCallback((ids: number[]) => deleteMultipleStocksAction.execute(ids), [deleteMultipleStocksAction]);

    // ===== RETURN OBJECT =====
    return {
        // Données
        stocks: filteredStocks,
        allStocks: stocks || [],
        stats,
        filters,

        // Actions avec états de chargement
        loadStocks,
        createStock,
        updateStock,
        deleteStock,
        deleteMultipleStocks,

        // États de chargement (par action)
        isLoading: {
            load: loadStocksAction.isLoading,
            create: createStockAction.isLoading,
            update: updateStockAction.isLoading,
            delete: deleteStockAction.isLoading,
            deleteMultiple: deleteMultipleStocksAction.isLoading,
            storage: storageLoading
        },

        // Erreurs (par action)
        errors: {
            load: loadStocksAction.error,
            create: createStockAction.error,
            update: updateStockAction.error,
            delete: deleteStockAction.error,
            deleteMultiple: deleteMultipleStocksAction.error,
            storage: storageError
        },

        // États globaux
        hasAnyError: !!(
            loadStocksAction.error ||
            createStockAction.error ||
            updateStockAction.error ||
            deleteStockAction.error ||
            deleteMultipleStocksAction.error ||
            storageError
        ),

        isAnyLoading: (
            loadStocksAction.isLoading ||
            createStockAction.isLoading ||
            updateStockAction.isLoading ||
            deleteStockAction.isLoading ||
            deleteMultipleStocksAction.isLoading ||
            storageLoading
        ),

        // Utilitaires
        getStockById,
        updateFilters,
        resetFilters,

        // Reset des erreurs par action
        resetErrors: {
            load: loadStocksAction.reset,
            create: createStockAction.reset,
            update: updateStockAction.reset,
            delete: deleteStockAction.reset,
            deleteMultiple: deleteMultipleStocksAction.reset
        }
    };
};