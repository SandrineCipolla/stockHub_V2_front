import {useCallback, useEffect, useMemo, useState} from 'react';
import type {CreateStockData, SearchFilters, Stock, UpdateStockData} from '@/types';
import {calculateStockStatus} from '@/types/stock'; // 🆕 AJOUTÉ
import {createFrontendError, useAsyncAction, useLocalStorageState} from './useFrontendState';
import {stockData} from "@/data/stockData.ts";
import {STOCK_MAX_THRESHOLD_DEFAULT, STOCK_MIN_THRESHOLD_DEFAULT} from '@/constants/stock';

export type {CreateStockData, UpdateStockData};

/**
 * Génère un ID temporaire unique pour les nouveaux stocks.
 * Ces IDs temporaires commencent par 'temp-' et seront remplacés
 * par l'ID réel de la base de données lors de la sauvegarde.
 *
 * @returns Un ID temporaire unique sous forme de string
 */
const generateTemporaryId = (): string => {
    return `temp-${crypto.randomUUID()}`;
};

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
        const timer = setTimeout(() => {
            setStorageLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);
    const [filters, setFilters] = useState<SearchFilters>({});

    // ===== ACTIONS AVEC GESTION D'ERREURS =====

    const loadStocksAction = useAsyncAction(
        useCallback(async (): Promise<Stock[]> => {

            await new Promise(resolve => setTimeout(resolve, 800));

            if (!stocks || stocks.length === 0) {
                throw new Error('Aucun stock trouvé');
            }

            return stocks;
        }, [stocks]),
        { simulateDelay: 0 }
    );

    const createStockAction = useAsyncAction(
        useCallback(async (stockData: CreateStockData): Promise<Stock> => {

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

            if (stocks?.some(stock => stock.name.toLowerCase() === stockData.name.toLowerCase())) {
                throw createFrontendError(
                    'validation',
                    'Un stock avec ce nom existe déjà',
                    'name',
                    { field: 'name' },
                );
            }

            const status = calculateStockStatus(
                stockData.quantity,
                stockData.minThreshold || STOCK_MIN_THRESHOLD_DEFAULT,
                stockData.maxThreshold || STOCK_MAX_THRESHOLD_DEFAULT
            );

            // Utilisation d'un UUID temporaire pour éviter les conflits
            // Cet ID sera remplacé par l'ID réel de la BD lors de la sauvegarde côté serveur
            const newStock: Stock = {
                id: generateTemporaryId(),
                ...stockData,
                status,
                lastUpdate: 'maintenant'
            };

            await new Promise(resolve => setTimeout(resolve, 600));

            const updatedStocks = [...(stocks || []), newStock];
            setStocks(updatedStocks);

            return newStock;
        }, [stocks, setStocks]),
        {
            onSuccess: () => {
                console.log('✅ Stock créé avec succès');
            },
            simulateDelay: 0
        }
    );

    const updateStockAction = useAsyncAction(
        useCallback(async (updateData: UpdateStockData): Promise<Stock> => {
            if (!stocks) {
                throw createFrontendError(
                    'unknown',
                    'Liste des stocks non disponible');
            }

            const existingStock = stocks.find(s => s.id === updateData.id);
            if (!existingStock) {
                throw createFrontendError(
                    'validation',
                    `Stock avec l'ID ${updateData.id} introuvable`,
                );
            }

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

            const newQuantity = updateData.quantity ?? existingStock.quantity;
            const newMinThreshold = updateData.minThreshold ?? existingStock.minThreshold ?? STOCK_MIN_THRESHOLD_DEFAULT;
            const newMaxThreshold = updateData.maxThreshold ?? existingStock.maxThreshold ?? STOCK_MAX_THRESHOLD_DEFAULT;

            const newStatus = calculateStockStatus(
                newQuantity,
                newMinThreshold,
                newMaxThreshold
            );

            const updatedStock: Stock = {
                ...existingStock,
                ...updateData,
                status: newStatus,
                lastUpdate: 'maintenant'
            };

            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedStocks = stocks.map(stock =>
                stock.id === updateData.id ? updatedStock : stock
            );
            setStocks(updatedStocks);

            return updatedStock;
        }, [stocks, setStocks]),
        { simulateDelay: 0 }
    );

    const deleteStockAction = useAsyncAction(
        useCallback(async (stockId: number | string): Promise<void> => {
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

            await new Promise(resolve => setTimeout(resolve, 400));

            const updatedStocks = stocks.filter(stock => stock.id !== stockId);
            setStocks(updatedStocks);
        }, [stocks, setStocks]),
        { simulateDelay: 0 }
    );

    const deleteMultipleStocksAction = useAsyncAction(
        useCallback(async (stockIds: (number | string)[]): Promise<void> => {
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

            const missingIds = stockIds.filter(id => !stocks.some(s => s.id === id));
            if (missingIds.length > 0) {
                throw createFrontendError(
                    'validation',
                    `Stocks introuvables: ${missingIds.join(', ')}`,
                );
            }

            await new Promise(resolve => setTimeout(resolve, 800));

            const updatedStocks = stocks.filter(stock => !stockIds.includes(stock.id));
            setStocks(updatedStocks);
        }, [stocks, setStocks]),
        { simulateDelay: 0 }
    );

    // ===== COMPUTED VALUES =====

    const filteredStocks = useMemo(() => {
        if (!stocks) return [];

        return stocks.filter(stock => {

            if (filters.query) {
                const query = filters.query.toLowerCase();
                if (!stock.name.toLowerCase().includes(query)) {
                    return false;
                }
            }

            if (filters.status && filters.status.length > 0) {
                if (!filters.status.includes(stock.status)) {
                    return false;
                }
            }

            if (filters.minValue !== undefined && stock.value < filters.minValue) {
                return false;
            }
            return !(filters.maxValue !== undefined && stock.value > filters.maxValue);
        });
    }, [stocks, filters]);

    const stats = useMemo(() => {
        if (!stocks) return null;

        return {
            total: stocks.length,
            optimal: stocks.filter(s => s.status === 'optimal').length,
            low: stocks.filter(s => s.status === 'low').length,
            critical: stocks.filter(s => s.status === 'critical').length,
            outOfStock: stocks.filter(s => s.status === 'outOfStock').length,
            overstocked: stocks.filter(s => s.status === 'overstocked').length,
            totalValue: stocks.reduce((sum, stock) => sum + stock.value, 0),
            averageValue: stocks.length > 0 ? stocks.reduce((sum, stock) => sum + stock.value, 0) / stocks.length : 0
        };
    }, [stocks]);

    // ===== FONCTIONS UTILITAIRES=====

    const getStockById = useCallback((id: number | string): Stock | undefined => {
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
    const deleteStock = useCallback((id: number | string) => deleteStockAction.execute(id), [deleteStockAction]);
    const deleteMultipleStocks = useCallback((ids: (number | string)[]) => deleteMultipleStocksAction.execute(ids), [deleteMultipleStocksAction]);

    // ===== RETURN OBJECT =====
    return {
        // Données
        stocks: filteredStocks,
        allStocks: stocks || [],
        stats,
        filters,


        loadStocks,
        createStock,
        updateStock,
        deleteStock,
        deleteMultipleStocks,

        isLoading: {
            load: loadStocksAction.isLoading,
            create: createStockAction.isLoading,
            update: updateStockAction.isLoading,
            delete: deleteStockAction.isLoading,
            deleteMultiple: deleteMultipleStocksAction.isLoading,
            storage: storageLoading
        },

        errors: {
            load: loadStocksAction.error,
            create: createStockAction.error,
            update: updateStockAction.error,
            delete: deleteStockAction.error,
            deleteMultiple: deleteMultipleStocksAction.error,
            storage: storageError
        },

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

        getStockById,
        updateFilters,
        resetFilters,

        resetErrors: {
            load: loadStocksAction.reset,
            create: createStockAction.reset,
            update: updateStockAction.reset,
            delete: deleteStockAction.reset,
            deleteMultiple: deleteMultipleStocksAction.reset
        }
    };
};