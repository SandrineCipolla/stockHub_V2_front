import { useCallback } from 'react';
import type { StockItem, CreateItemData, UpdateItemData } from '@/types';
import { createFrontendError, useAsyncAction } from './useFrontendState';
import { ItemsAPI } from '@/services/api/itemsAPI';
import { logger } from '@/utils/logger';

/**
 * Hook de gestion des items d'un stock
 * Expose les opérations CRUD connectées au backend v2
 */
export const useItems = (stockId: number | string) => {
  const loadItemsAction = useAsyncAction(
    useCallback(async (): Promise<StockItem[]> => {
      try {
        logger.debug('Chargement des items depuis le backend...', { stockId });
        const items = await ItemsAPI.fetchItems(stockId);
        logger.debug('Items chargés:', items);
        return items;
      } catch (error) {
        logger.error('Erreur lors du chargement des items:', error);
        throw createFrontendError('network', 'Impossible de charger les items depuis le serveur');
      }
    }, [stockId]),
    { simulateDelay: 0 }
  );

  const addItemAction = useAsyncAction(
    useCallback(
      async (itemData: CreateItemData): Promise<StockItem> => {
        if (!itemData.label.trim()) {
          throw createFrontendError('validation', "Le nom de l'item est obligatoire", 'label', {
            field: 'label',
          });
        }

        if (itemData.quantity < 0) {
          throw createFrontendError(
            'validation',
            'La quantité ne peut pas être négative',
            'quantity',
            { field: 'quantity' }
          );
        }

        try {
          logger.debug("Ajout d'un item sur le backend...", { stockId, itemData });
          const newItem = await ItemsAPI.addItem(stockId, itemData);
          logger.debug('Item ajouté:', newItem);
          return newItem;
        } catch (error) {
          logger.error("Erreur lors de l'ajout de l'item:", error);
          throw createFrontendError('network', "Impossible d'ajouter l'item sur le serveur");
        }
      },
      [stockId]
    ),
    { simulateDelay: 0 }
  );

  const updateItemAction = useAsyncAction(
    useCallback(
      async ({
        itemId,
        updates,
      }: {
        itemId: number | string;
        updates: UpdateItemData;
      }): Promise<StockItem> => {
        if (updates.quantity < 0) {
          throw createFrontendError(
            'validation',
            'La quantité ne peut pas être négative',
            'quantity',
            { field: 'quantity' }
          );
        }

        try {
          logger.debug("Mise à jour de l'item sur le backend...", { stockId, itemId, updates });
          const updatedItem = await ItemsAPI.updateItem(stockId, itemId, updates);
          logger.debug('Item mis à jour:', updatedItem);
          return updatedItem;
        } catch (error) {
          logger.error("Erreur lors de la mise à jour de l'item:", error);
          throw createFrontendError('network', "Impossible de mettre à jour l'item sur le serveur");
        }
      },
      [stockId]
    ),
    { simulateDelay: 0 }
  );

  const deleteItemAction = useAsyncAction(
    useCallback(
      async (itemId: number | string): Promise<void> => {
        try {
          logger.debug("Suppression de l'item sur le backend...", { stockId, itemId });
          await ItemsAPI.deleteItem(stockId, itemId);
          logger.debug('Item supprimé');
        } catch (error) {
          logger.error("Erreur lors de la suppression de l'item:", error);
          throw createFrontendError('network', "Impossible de supprimer l'item sur le serveur");
        }
      },
      [stockId]
    ),
    { simulateDelay: 0 }
  );

  const loadItems = useCallback(() => loadItemsAction.execute(), [loadItemsAction]);
  const addItem = useCallback(
    (data: CreateItemData) => addItemAction.execute(data),
    [addItemAction]
  );
  const updateItem = useCallback(
    (itemId: number | string, updates: UpdateItemData) =>
      updateItemAction.execute({ itemId, updates }),
    [updateItemAction]
  );
  const deleteItem = useCallback(
    (itemId: number | string) => deleteItemAction.execute(itemId),
    [deleteItemAction]
  );

  return {
    loadItems,
    addItem,
    updateItem,
    deleteItem,

    isLoading: {
      load: loadItemsAction.isLoading,
      add: addItemAction.isLoading,
      update: updateItemAction.isLoading,
      delete: deleteItemAction.isLoading,
    },

    errors: {
      load: loadItemsAction.error,
      add: addItemAction.error,
      update: updateItemAction.error,
      delete: deleteItemAction.error,
    },

    resetErrors: {
      load: loadItemsAction.reset,
      add: addItemAction.reset,
      update: updateItemAction.reset,
      delete: deleteItemAction.reset,
    },
  };
};
