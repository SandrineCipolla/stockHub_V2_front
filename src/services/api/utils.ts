import ConfigManager from './ConfigManager';

/**
 * Helper pour obtenir la config API selon la méthode HTTP
 */
export async function getApiConfig(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  version: number = 2,
  body?: Record<string, unknown>
): Promise<{ apiUrl: string; config: RequestInit }> {
  const apiUrl = ConfigManager.getApiServerUrl(version);
  let config: RequestInit;

  switch (method) {
    case 'PUT':
      config = await ConfigManager.putFetchConfig(body ?? {});
      break;
    case 'PATCH':
      config = await ConfigManager.patchFetchConfig(body ?? {});
      break;
    case 'POST':
      config = await ConfigManager.postFetchConfig(body ?? {});
      break;
    case 'DELETE':
      config = await ConfigManager.deleteFetchConfig(body);
      break;
    case 'GET':
    default:
      config = await ConfigManager.getFetchConfig();
      break;
  }

  return { apiUrl, config };
}
