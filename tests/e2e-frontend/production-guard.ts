// Les tests E2E créent et suppriment des stocks avec un vrai compte : ils ne
// doivent jamais viser la production (#317). Production = Azure Static Web Apps
// (frontend) et Azure App Service (backend), plus l'ancien déploiement Vercel.
const PRODUCTION_HOST_SUFFIXES = ['.azurestaticapps.net', '.azurewebsites.net'];
const PRODUCTION_HOSTS = ['stock-hub-v2-front.vercel.app'];

export const isProductionUrl = (url: string): boolean => {
  const { hostname } = new URL(url);
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
