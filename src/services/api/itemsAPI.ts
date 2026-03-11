import { getApiConfig } from './utils';
import type { StockItem, CreateItemData, UpdateItemData } from '../../types/stock';

/**
 * Client API pour les Items d'un Stock
 * Gère les opérations CRUD via l'API Backend v2
 * Endpoints : /api/v2/stocks/:stockId/items
 */
export class ItemsAPI {
  /**
   * Récupère la liste des items d'un stock
   */
  static async fetchItems(stockId: number | string): Promise<StockItem[]> {
    const { apiUrl, config } = await getApiConfig('GET', 2);
    const response = await fetch(`${apiUrl}/stocks/${stockId}/items`, config);

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }

    const items: StockItem[] = await response.json();
    return items;
  }

  /**
   * Ajoute un item à un stock
   */
  static async addItem(stockId: number | string, item: CreateItemData): Promise<StockItem> {
    const itemData: Record<string, unknown> = {
      label: item.label,
      quantity: item.quantity,
      description: item.description ?? '',
      minimumStock: item.minimumStock ?? 1,
    };

    const { apiUrl, config } = await getApiConfig('POST', 2, itemData);
    const response = await fetch(`${apiUrl}/stocks/${stockId}/items`, config);

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }

    const newItem: StockItem = await response.json();
    return newItem;
  }

  /**
   * Met à jour la quantité d'un item
   */
  static async updateItem(
    stockId: number | string,
    itemId: number | string,
    updates: UpdateItemData
  ): Promise<StockItem> {
    const { apiUrl, config } = await getApiConfig('PATCH', 2, {
      quantity: updates.quantity,
    });
    const response = await fetch(`${apiUrl}/stocks/${stockId}/items/${itemId}`, config);

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }

    const updatedItem: StockItem = await response.json();
    return updatedItem;
  }

  /**
   * Supprime un item d'un stock
   */
  static async deleteItem(stockId: number | string, itemId: number | string): Promise<void> {
    const { apiUrl, config } = await getApiConfig('DELETE', 2);
    const response = await fetch(`${apiUrl}/stocks/${stockId}/items/${itemId}`, config);

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }
  }
}
