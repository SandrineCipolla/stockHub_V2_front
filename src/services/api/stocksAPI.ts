import { getApiConfig } from './utils';
import type {
  Stock,
  CreateStockData,
  UpdateStockData,
  StockStatus,
  StockDetail,
} from '../../types/stock';

/**
 * Interface pour les items tels que retournés en inline dans la réponse backend
 */
interface BackendItem {
  id: number;
  quantity: number;
  minimumStock: number;
}

interface BackendStockDetailItem {
  id: number;
  label: string;
  description?: string;
  quantity: number;
  minimumStock?: number;
  status: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
}

interface BackendStockDetailResponse {
  id: number;
  label: string;
  description?: string;
  category?: string;
  totalItems: number;
  totalQuantity: number;
  criticalItemsCount: number;
  items: BackendStockDetailItem[];
}

/**
 * Interface pour les données Stock telles que retournées par le backend
 * Le backend retourne: id, label, description, category
 * Les items inline (items?) ne sont pas encore inclus dans GET /stocks — limitation N+1 connue.
 * Quand le backend inclura les items, la quantité et le statut seront calculés dynamiquement.
 */
interface BackendStock {
  id: number;
  label: string;
  description?: string;
  category: string;
  items?: BackendItem[];
}

/**
 * Calcule la quantité totale et le statut d'un stock à partir de ses items.
 * Si les items ne sont pas inclus dans la réponse (N+1 limitation), retourne les valeurs par défaut.
 */
function computeQuantityAndStatus(items?: BackendItem[]): {
  quantity: number;
  status: StockStatus;
} {
  if (!items || items.length === 0) {
    return { quantity: 0, status: 'optimal' };
  }
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const hasLowStock = items.some(item => item.quantity <= item.minimumStock);
  const status: StockStatus = hasLowStock ? 'low' : 'optimal';
  return { quantity, status };
}

/**
 * Transforme les données backend en format frontend.
 * quantity et status sont calculés depuis les items inline si disponibles.
 * Limitation connue : GET /stocks ne retourne pas encore les items en ligne (N+1).
 * La page détail /stocks/:id charge les items séparément via GET /stocks/:id/items.
 */
function mapBackendStockToFrontend(backendStock: BackendStock): Stock {
  const { quantity, status } = computeQuantityAndStatus(backendStock.items);
  return {
    id: backendStock.id,
    label: backendStock.label,
    description: backendStock.description || '',
    category: backendStock.category || 'alimentation',
    quantity,
    value: 0,
    status,
    lastUpdate: new Date().toISOString(),
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
   * Récupère le détail complet d'un stock avec ses items et leurs statuts
   * Appelle GET /api/v2/stocks/:id (backend #75/#93)
   * Retourne les agrégats (totalItems, totalQuantity, criticalItemsCount) et les items avec status
   */
  static async fetchStockDetail(id: string | number): Promise<StockDetail> {
    try {
      const { apiUrl, config } = await getApiConfig('GET', 2);
      const response = await fetch(`${apiUrl}/stocks/${id}`, config);

      if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
      }

      const data: BackendStockDetailResponse = await response.json();
      return {
        id: data.id,
        label: data.label,
        description: data.description ?? '',
        category: data.category,
        totalItems: data.totalItems,
        totalQuantity: data.totalQuantity,
        criticalItemsCount: data.criticalItemsCount,
        items: data.items,
      };
    } catch (error) {
      console.error(`Error fetching stock detail ${id}:`, error);
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
