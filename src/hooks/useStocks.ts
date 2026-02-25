import { useCallback, useMemo, useState } from 'react';
import type { CreateStockData, SearchFilters, Stock, UpdateStockData } from '@/types';
import { createFrontendError, useAsyncAction } from './useFrontendState';
import { StocksAPI } from '@/services/api/stocksAPI';
import { logger } from '@/utils/logger';

export type { CreateStockData, UpdateStockData };

// ===== HOOK PRINCIPAL POUR GESTION DES STOCKS =====
export const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});

  // ===== ACTIONS AVEC GESTION D'ERREURS =====

  const loadStocksAction = useAsyncAction(
    useCallback(async (): Promise<Stock[]> => {
      try {
        // Appel au backend via StocksAPI
        logger.debug('Chargement des stocks depuis le backend...');
        const stocksFromBackend = await StocksAPI.fetchStocksList();
        logger.debug('Stocks chargés depuis le backend:', stocksFromBackend);

        setStocks(stocksFromBackend);

        return stocksFromBackend;
      } catch (error) {
        logger.error('Erreur lors du chargement depuis le backend:', error);

        throw createFrontendError('network', 'Impossible de charger les stocks depuis le serveur');
      }
    }, []),
    { simulateDelay: 0 }
  );

  const createStockAction = useAsyncAction(
    useCallback(async (stockData: CreateStockData): Promise<Stock> => {
      // Validations frontend
      if (!stockData.label.trim()) {
        throw createFrontendError('validation', 'Le nom du stock est obligatoire', 'label', {
          field: 'label',
        });
      }

      if (stockData.quantity < 0) {
        throw createFrontendError(
          'validation',
          'La quantité ne peut pas être négative',
          'quantity',
          { field: 'quantity' }
        );
      }

      if (stockData.value < 0) {
        throw createFrontendError('validation', 'La valeur ne peut pas être négative', 'value', {
          field: 'value',
        });
      }

      try {
        // Appel au backend via StocksAPI
        logger.debug('Création du stock sur le backend...', stockData);
        const newStock = await StocksAPI.createStock(stockData);
        logger.debug('Stock créé sur le backend:', newStock);

        setStocks(prev => [...prev, newStock]);

        return newStock;
      } catch (error) {
        logger.error('Erreur lors de la création sur le backend:', error);
        throw createFrontendError('network', 'Impossible de créer le stock sur le serveur');
      }
    }, []),
    {
      onSuccess: () => {
        logger.info('Stock créé avec succès');
      },
      simulateDelay: 0,
    }
  );

  const updateStockAction = useAsyncAction(
    useCallback(
      async (updateData: UpdateStockData): Promise<Stock> => {
        const existingStock = stocks.find(s => s.id === updateData.id);
        if (!existingStock) {
          throw createFrontendError('validation', `Stock avec l'ID ${updateData.id} introuvable`);
        }

        // Validations frontend
        if (updateData.label && !updateData.label.trim()) {
          throw createFrontendError(
            'validation',
            'Le nom du stock ne peut pas être vide',
            'label',
            {
              field: 'label',
            }
          );
        }

        if (updateData.quantity !== undefined && updateData.quantity < 0) {
          throw createFrontendError(
            'validation',
            'La quantité ne peut pas être négative',
            'quantity',
            { field: 'quantity' }
          );
        }

        try {
          // Appel au backend via StocksAPI
          logger.debug('Mise à jour du stock sur le backend...', updateData);
          const updatedStock = await StocksAPI.updateStock(updateData);
          logger.debug('Stock mis à jour sur le backend:', updatedStock);

          // Calcul du nouveau statut côté frontend (le backend ne retourne pas les champs
          // quantity/value/status correctement dans la version actuelle)
          const newQuantity = updateData.quantity ?? existingStock.quantity;
          const minThreshold = updateData.minThreshold ?? existingStock.minThreshold;
          const maxThreshold = updateData.maxThreshold ?? existingStock.maxThreshold;
          let newStatus = existingStock.status;
          if (updateData.quantity !== undefined) {
            if (newQuantity === 0) {
              newStatus = 'outOfStock';
            } else if (minThreshold !== undefined) {
              if (newQuantity <= minThreshold * 0.5) newStatus = 'critical';
              else if (newQuantity <= minThreshold) newStatus = 'low';
              else if (maxThreshold !== undefined && newQuantity > maxThreshold)
                newStatus = 'overstocked';
              else newStatus = 'optimal';
            } else {
              newStatus = 'optimal';
            }
          }

          // Fusion : conserver les champs locaux non retournés correctement par le backend
          const mergedStock: Stock = {
            ...existingStock,
            ...updateData,
            status: newStatus,
            lastUpdate: updatedStock.lastUpdate,
          };
          setStocks(prev => prev.map(stock => (stock.id === updateData.id ? mergedStock : stock)));

          return mergedStock;
        } catch (error) {
          logger.error('Erreur lors de la mise à jour sur le backend:', error);
          throw createFrontendError(
            'network',
            'Impossible de mettre à jour le stock sur le serveur'
          );
        }
      },
      [stocks]
    ),
    { simulateDelay: 0 }
  );

  const deleteStockAction = useAsyncAction(
    useCallback(
      async (stockId: number | string): Promise<void> => {
        const stockExists = stocks.some(s => s.id === stockId);
        if (!stockExists) {
          throw createFrontendError('validation', `Stock avec l'ID ${stockId} introuvable`);
        }

        // Mise à jour optimiste : suppression immédiate de l'UI avant l'appel API
        const previousStocks = [...stocks];
        setStocks(prev => prev.filter(stock => stock.id !== stockId));

        try {
          // Appel au backend via StocksAPI
          logger.debug('Suppression du stock sur le backend...', stockId);
          await StocksAPI.deleteStock(stockId);
          logger.debug('Stock supprimé sur le backend');
        } catch (error) {
          // Rollback : restaurer la liste si l'API échoue
          setStocks(previousStocks);
          logger.error('Erreur lors de la suppression sur le backend:', error);
          throw createFrontendError('network', 'Impossible de supprimer le stock sur le serveur');
        }
      },
      [stocks]
    ),
    { simulateDelay: 0 }
  );

  const deleteMultipleStocksAction = useAsyncAction(
    useCallback(
      async (stockIds: (number | string)[]): Promise<void> => {
        if (stockIds.length === 0) {
          throw createFrontendError('validation', 'Aucun stock sélectionné');
        }

        const missingIds = stockIds.filter(id => !stocks.some(s => s.id === id));
        if (missingIds.length > 0) {
          throw createFrontendError('validation', `Stocks introuvables: ${missingIds.join(', ')}`);
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        setStocks(prev => prev.filter(stock => !stockIds.includes(stock.id)));
      },
      [stocks]
    ),
    { simulateDelay: 0 }
  );

  // ===== COMPUTED VALUES =====

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (!stock.label.toLowerCase().includes(query)) {
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
    return {
      total: stocks.length,
      optimal: stocks.filter(s => s.status === 'optimal').length,
      low: stocks.filter(s => s.status === 'low').length,
      critical: stocks.filter(s => s.status === 'critical').length,
      outOfStock: stocks.filter(s => s.status === 'outOfStock').length,
      overstocked: stocks.filter(s => s.status === 'overstocked').length,
      totalValue: stocks.reduce((sum, stock) => sum + stock.value, 0),
      averageValue:
        stocks.length > 0 ? stocks.reduce((sum, stock) => sum + stock.value, 0) / stocks.length : 0,
    };
  }, [stocks]);

  // ===== FONCTIONS UTILITAIRES =====

  const getStockById = useCallback(
    (id: number | string): Stock | undefined => {
      return stocks.find(stock => stock.id === id);
    },
    [stocks]
  );

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ===== ACTIONS EXPORTÉES AVEC useCallback =====
  const loadStocks = useCallback(() => loadStocksAction.execute(), [loadStocksAction]);
  const createStock = useCallback(
    (data: CreateStockData) => createStockAction.execute(data),
    [createStockAction]
  );
  const updateStock = useCallback(
    (data: UpdateStockData) => updateStockAction.execute(data),
    [updateStockAction]
  );
  const deleteStock = useCallback(
    (id: number | string) => deleteStockAction.execute(id),
    [deleteStockAction]
  );
  const deleteMultipleStocks = useCallback(
    (ids: (number | string)[]) => deleteMultipleStocksAction.execute(ids),
    [deleteMultipleStocksAction]
  );

  // ===== RETURN OBJECT =====
  return {
    // Données
    stocks: filteredStocks,
    allStocks: stocks,
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
    },

    errors: {
      load: loadStocksAction.error,
      create: createStockAction.error,
      update: updateStockAction.error,
      delete: deleteStockAction.error,
      deleteMultiple: deleteMultipleStocksAction.error,
    },

    hasAnyError: !!(
      loadStocksAction.error ||
      createStockAction.error ||
      updateStockAction.error ||
      deleteStockAction.error ||
      deleteMultipleStocksAction.error
    ),

    isAnyLoading:
      loadStocksAction.isLoading ||
      createStockAction.isLoading ||
      updateStockAction.isLoading ||
      deleteStockAction.isLoading ||
      deleteMultipleStocksAction.isLoading,

    getStockById,
    updateFilters,
    resetFilters,

    resetErrors: {
      load: loadStocksAction.reset,
      create: createStockAction.reset,
      update: updateStockAction.reset,
      delete: deleteStockAction.reset,
      deleteMultiple: deleteMultipleStocksAction.reset,
    },
  };
};
