import { getApiConfig } from './utils';
import type { Stock, CreateStockData, UpdateStockData } from '../../types/stock';

/**
 * Client API pour les Stocks
 * Gère les opérations CRUD via l'API Backend v2
 */
export class StocksAPI {
  /**
   * Récupère la liste de tous les stocks
   */
  static async fetchStocksList(): Promise<Stock[]> {
    try {
      const { apiUrl, config } = await getApiConfig('GET', 2);
      console.log('Fetching stocks list from:', `${apiUrl}/stocks`);

      const response = await fetch(`${apiUrl}/stocks`, config);

      if (!response.ok) {
        console.error('Error fetching stocks list');
        throw new Error(`HTTP response with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Stocks data received:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchStocksList:', error);
      throw error;
    }
  }

  /**
   * Récupère un stock par ID
   */
  static async fetchStockById(id: string | number): Promise<Stock> {
    try {
      const { apiUrl, config } = await getApiConfig('GET', 2);
      const response = await fetch(`${apiUrl}/stocks/${id}`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching stock ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau stock
   */
  static async createStock(stock: CreateStockData): Promise<Stock> {
    try {
      const stockData: Record<string, unknown> = { ...stock };
      const { apiUrl, config } = await getApiConfig('POST', 2, stockData);
      const response = await fetch(`${apiUrl}/stocks`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating stock:', error);
      throw error;
    }
  }

  /**
   * Met à jour un stock existant
   */
  static async updateStock(stockData: UpdateStockData): Promise<Stock> {
    try {
      const { id, ...updates } = stockData;
      const { apiUrl, config } = await getApiConfig('PUT', 2, updates);
      const response = await fetch(`${apiUrl}/stocks/${id}`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error updating stock ${stockData.id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un stock
   */
  static async deleteStock(id: string | number): Promise<void> {
    try {
      const { apiUrl, config } = await getApiConfig('DELETE', 2);
      const response = await fetch(`${apiUrl}/stocks/${id}`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting stock ${id}:`, error);
      throw error;
    }
  }
}
