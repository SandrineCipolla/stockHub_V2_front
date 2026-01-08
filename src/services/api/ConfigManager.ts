const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';
const AUTHORIZATION = 'Authorization';

/**
 * Attend que le token soit disponible dans localStorage
 */
const getToken = (): Promise<string | null> => {
  return new Promise(resolve => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        resolve(token);
      } else {
        setTimeout(checkToken, 100);
      }
    };
    checkToken();
  });
};

/**
 * Calcule le path de version (v1 ou v2)
 */
function computeVersionPath(version: number): string {
  if (version === 2) {
    return import.meta.env.VITE_API_V2;
  }
  return import.meta.env.VITE_API_V1;
}

/**
 * Gestionnaire de configuration pour les appels API
 */
class ConfigManager {
  /**
   * Construit l'URL complète de l'API
   */
  static getApiServerUrl(version: number = 2): string {
    return import.meta.env.VITE_API_SERVER_URL + computeVersionPath(version);
  }

  /**
   * Configuration pour GET requests
   */
  static async getFetchConfig(): Promise<RequestInit> {
    const token = await getToken();
    console.log("🔑 Token récupéré pour l'API:", token ? `${token.substring(0, 50)}...` : 'NULL');
    return {
      method: 'GET',
      headers: {
        [AUTHORIZATION]: `Bearer ${token}`,
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      credentials: 'include',
    };
  }

  /**
   * Configuration pour POST requests
   */
  static async postFetchConfig(body: Record<string, unknown>): Promise<RequestInit> {
    const token = await getToken();
    return {
      method: 'POST',
      headers: {
        [AUTHORIZATION]: `Bearer ${token}`,
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    };
  }

  /**
   * Configuration pour PUT requests
   */
  static async putFetchConfig(body: Record<string, unknown>): Promise<RequestInit> {
    const token = await getToken();
    return {
      method: 'PUT',
      headers: {
        [AUTHORIZATION]: `Bearer ${token}`,
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    };
  }

  /**
   * Configuration pour PATCH requests (partial updates)
   */
  static async patchFetchConfig(body: Record<string, unknown>): Promise<RequestInit> {
    const token = await getToken();
    return {
      method: 'PATCH',
      headers: {
        [AUTHORIZATION]: `Bearer ${token}`,
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    };
  }

  /**
   * Configuration pour DELETE requests
   */
  static async deleteFetchConfig(body?: Record<string, unknown>): Promise<RequestInit> {
    const token = await getToken();
    return {
      method: 'DELETE',
      headers: {
        [AUTHORIZATION]: `Bearer ${token}`,
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    };
  }
}

export default ConfigManager;
