import { describe, expect, it } from 'vitest';
import { assertNotProduction, isProductionUrl } from './production-guard';

describe('production-guard', () => {
  it.each([
    'https://brave-field-03611eb03.5.azurestaticapps.net',
    'https://brave-field-03611eb03.5.azurestaticapps.net/dashboard',
    'https://stockhub-back-bqf8e6fbf6dzd6gs.westeurope-01.azurewebsites.net/api',
    'https://stock-hub-v2-front.vercel.app',
  ])('reconnaît la production : %s', url => {
    expect(isProductionUrl(url)).toBe(true);
    expect(() => assertNotProduction(url)).toThrow(/vise la production/);
  });

  it.each([
    'http://localhost:5173',
    'https://stock-hub-v2-front-git-staging-sandrinecipollas-projects.vercel.app',
    'https://brave-field-03611eb03-staging.5.azurestaticapps.net',
    'https://brave-field-03611eb03-staging.5.azurestaticapps.net/dashboard',
    'https://brave-field-03611eb03-feature.5.azurestaticapps.net',
  ])('laisse passer : %s', url => {
    expect(isProductionUrl(url)).toBe(false);
    expect(() => assertNotProduction(url)).not.toThrow();
  });

  it.each([
    'brave-field-03611eb03.5.azurestaticapps.net',
    'brave-field-03611eb03.5.azurestaticapps.net:443',
    'localhost:5173',
    '',
  ])('refuse une URL sans http:// ni https:// : %s', url => {
    expect(() => assertNotProduction(url)).toThrow(/URL complète/);
  });
  it('accepte le schéma en majuscules', () => {
    expect(isProductionUrl('HTTPS://brave-field-03611eb03.5.azurestaticapps.net')).toBe(true);
  });
});
