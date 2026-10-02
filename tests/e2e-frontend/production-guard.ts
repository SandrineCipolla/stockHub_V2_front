// Les tests E2E créent et suppriment des stocks avec un vrai compte : ils ne
// doivent jamais viser la production (#317). Production = Azure Static Web Apps
// (frontend) et Azure App Service (backend), plus l'ancien déploiement Vercel.
const PRODUCTION_HOST_SUFFIXES = ['.azurestaticapps.net', '.azurewebsites.net'];
const PRODUCTION_HOSTS = ['stock-hub-v2-front.vercel.app'];

// Un hôte sans schéma n'est pas toujours rejeté par new URL : `hote:443` est lu comme un
// schéma `hote:` avec un hostname vide, ce qui passerait pour une URL hors production.
const parseBaseUrl = (url: string): URL => {
  const invalid = new Error(
    `E2E_BASE_URL doit être une URL complète en http:// ou https:// (reçu : ${url}).`
  );
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw invalid;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw invalid;
  return parsed;
};

export const isProductionUrl = (url: string): boolean => {
  const { hostname } = parseBaseUrl(url);
  return (
    PRODUCTION_HOSTS.includes(hostname) ||
    PRODUCTION_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix))
  );
};

export const assertNotProduction = (url: string): void => {
  if (isProductionUrl(url)) {
    throw new Error(
      `E2E_BASE_URL vise la production (${url}). Les tests E2E créent et suppriment des stocks : ` +
        'utiliser le staging ou localhost (voir docs/17-E2E-TESTS-GUIDE.md).'
    );
  }
};
