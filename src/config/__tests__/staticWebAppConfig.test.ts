import { describe, expect, it } from 'vitest';
import configRaw from '../../../public/staticwebapp.config.json?raw';

describe('public/staticwebapp.config.json', () => {
  const config = JSON.parse(configRaw);

  it('renvoie les routes inconnues vers index.html (fallback SPA)', () => {
    expect(config.navigationFallback.rewrite).toBe('/index.html');
  });

  it('laisse les fichiers statiques répondre 404 au lieu de renvoyer index.html', () => {
    const exclude: string[] = config.navigationFallback.exclude;
    expect(exclude).toContain('/assets/*');
    expect(exclude.some(pattern => pattern.includes('js'))).toBe(true);
  });
});
