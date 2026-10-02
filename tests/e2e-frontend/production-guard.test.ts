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
  ])('laisse passer : %s', url => {
    expect(isProductionUrl(url)).toBe(false);
    expect(() => assertNotProduction(url)).not.toThrow();
  });
});
