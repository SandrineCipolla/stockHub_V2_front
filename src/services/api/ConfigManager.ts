import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalInstance } from '@/config/msalInstance';
import { loginRequest } from '@/config/authConfig';

const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';
const AUTHORIZATION = 'Authorization';

/**
 * Récupère le token d'accès via MSAL (acquireTokenSilent)
 *
 * Les appels concurrents partagent la même promesse en vol : plusieurs composants
 * demandant un token en même temps (ex: useNotificationCount qui fait 2 appels dans
 * un même Promise.all) déclenchaient sinon plusieurs acquireTokenSilent/loginRedirect
 * simultanés, ce qui plante MSAL avec "interaction_in_progress" (voir issue #221).
 */
let inFlightTokenRequest: Promise<string | null> | null = null;

const acquireToken = async (): Promise<string | null> => {
  const account = msalInstance.getActiveAccount();
  if (!account) return null;

  // Supprime les verrous d'interaction périmés qui bloquent l'acquisition silencieuse
  Object.keys(sessionStorage)
    .filter(k => k.includes('interaction.status'))
    .forEach(k => sessionStorage.removeItem(k));

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account,
    });
    return response.accessToken;
  } catch (error) {
    console.error('[getToken] token acquisition failed:', error);
    if (error instanceof InteractionRequiredAuthError) {
      void msalInstance.loginRedirect(loginRequest);
    }
    return null;
  }
};

const getToken = (): Promise<string | null> => {
  if (!inFlightTokenRequest) {
    inFlightTokenRequest = acquireToken().finally(() => {
      inFlightTokenRequest = null;
    });
  }
  return inFlightTokenRequest;
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
  static getApiServerUrl(version: number = 2): string {
    return import.meta.env.VITE_API_SERVER_URL + computeVersionPath(version);
  }

  static async getFetchConfig(): Promise<RequestInit> {
    const token = await getToken();
    return {
      method: 'GET',
      headers: {
        [AUTHORIZATION]: `Bearer ${token}`,
        [CONTENT_TYPE]: APPLICATION_JSON,
      },
      credentials: 'include',
    };
  }

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
