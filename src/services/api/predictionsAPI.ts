import { getApiConfig } from './utils';

/**
 * Prediction data returned by the backend for a single item.
 * Endpoint: GET /api/v2/stocks/:stockId/items/:itemId/prediction
 */
export interface ItemPrediction {
  itemId: number;
  stockId: number;
  daysUntilEmpty: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  avgDailyConsumption: number;
  recommendedRestock: number;
  computedAt: string;
}

export interface HistoryEntry {
  date: string;
  quantity: number;
  changeType: 'CONSUMPTION' | 'RESTOCK' | 'ADJUSTMENT';
  delta: number;
}

/**
 * Item history returned by the backend.
 * Endpoint: GET /api/v2/stocks/:stockId/items/:itemId/history?days=90
 */
export interface ItemHistory {
  itemId: number;
  days: number;
  entries: HistoryEntry[];
}

/**
 * AI suggestion returned by the backend.
 * Endpoint: GET /api/v2/stocks/:stockId/suggestions
 */
export interface BackendSuggestion {
  itemId: number;
  type: 'RESTOCK' | 'OVERSTOCK' | 'TREND_ALERT' | 'EXPIRY_ALERT' | 'OPTIMIZATION';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: 'llm' | 'deterministic';
}

/**
 * Client API pour les prédictions et l'historique des items.
 */
export class PredictionsAPI {
  static async fetchItemPrediction(
    stockId: number | string,
    itemId: number | string
  ): Promise<ItemPrediction> {
    const { apiUrl, config } = await getApiConfig('GET', 2);
    const response = await fetch(`${apiUrl}/stocks/${stockId}/items/${itemId}/prediction`, config);

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }

    const prediction: ItemPrediction = await response.json();
    return prediction;
  }

  static async fetchItemHistory(
    stockId: number | string,
    itemId: number | string,
    days = 90
  ): Promise<ItemHistory> {
    const { apiUrl, config } = await getApiConfig('GET', 2);
    const response = await fetch(
      `${apiUrl}/stocks/${stockId}/items/${itemId}/history?days=${days}`,
      config
    );

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }

    const history: ItemHistory = await response.json();
    return history;
  }

  static async getStockSuggestions(stockId: number | string): Promise<BackendSuggestion[]> {
    const { apiUrl, config } = await getApiConfig('GET', 2);
    const response = await fetch(`${apiUrl}/stocks/${stockId}/suggestions`, config);

    if (!response.ok) {
      throw new Error(`HTTP response with status ${response.status}`);
    }

    const suggestions: BackendSuggestion[] = await response.json();
    return suggestions;
  }
}
