import { getApiConfig } from './utils';
import type { Stock, CreateStockData, UpdateStockData } from '../../types/stock';

/**
 * Interface pour les données Stock telles que retournées par le backend
 * Le backend retourne uniquement: id, label, description, category
 */
interface BackendStock {
  id: number;
  label: string;
  description?: string;
  category: string;
  items?: unknown[];
}

/**
 * Transforme les données backend (partielles) en format frontend (complet)
 * Ajoute les propriétés obligatoires manquantes avec des valeurs par défaut
 *
 * NOTE: quantity et value sont mis à 0 car le backend ne les fournit pas encore.
 * Ces valeurs devraient être calculées à partir des items dans une future version.
 */
function mapBackendStockToFrontend(backendStock: BackendStock): Stock {
  return {
    id: backendStock.id,
    label: backendStock.label,
    description: backendStock.description || '',
    category: backendStock.category || 'alimentation',
    quantity: 0, // TODO: Calculer depuis items quand disponibles
    value: 0, // TODO: Calculer depuis items quand disponibles
    status: 'optimal', // TODO: Calculer selon logique métier
    lastUpdate: new Date().toISOString(), // Date actuelle par défaut
    unit: 'piece',
  };
}

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

      const backendData: BackendStock[] = await response.json();
      console.log('Stocks data received (backend):', backendData);

      // Mapper les données backend vers le format frontend
      const mappedStocks = backendData.map(mapBackendStockToFrontend);
      return mappedStocks;
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

      const backendData: BackendStock = await response.json();
      return mapBackendStockToFrontend(backendData);
    } catch (error) {
      console.error(`Error fetching stock ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau stock
   *
   * NOTE: Le backend actuel ne gère que les propriétés de base du stock:
   * - label: nom du stock (obligatoire)
   * - description: description du stock (optionnel)
   * - category: catégorie du stock (optionnel, défaut: 'alimentation')
   *
   * Les propriétés quantity, value, unit, supplier, etc. du type CreateStockData
   * ne sont PAS encore implémentées côté backend. Ces propriétés sont ignorées.
   *
   * Pour gérer la quantité et la valeur:
   * - Utiliser POST /stocks/:stockId/items pour ajouter des items au stock
   * - La quantité totale et la valeur seront calculées à partir des items
   *
   * TODO: Documenter cette limitation dans INTEGRATION_BACKEND_SESSION.md
   * TODO: Créer une issue pour implémenter quantity/value si nécessaire
   */
  static async createStock(stock: CreateStockData): Promise<Stock> {
    try {
      // Extraction des seuls champs supportés par le backend
      const stockData: Record<string, unknown> = {
        label: stock.label,
        description: stock.description || '',
        category: stock.category || 'alimentation',
      };

      const { apiUrl, config } = await getApiConfig('POST', 2, stockData);
      const response = await fetch(`${apiUrl}/stocks`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }

      const backendData: BackendStock = await response.json();
      return mapBackendStockToFrontend(backendData);
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
      const { apiUrl, config } = await getApiConfig('PATCH', 2, updates);
      const response = await fetch(`${apiUrl}/stocks/${id}`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }

      const backendData: BackendStock = await response.json();
      return mapBackendStockToFrontend(backendData);
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
