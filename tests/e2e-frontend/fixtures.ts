import { test as base } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';

const sessionStorageFile = 'playwright/.auth/session-storage.json';

export const test = base.extend({
  context: async ({ context }, use) => {
    if (existsSync(sessionStorageFile)) {
      const sessionStorageData = readFileSync(sessionStorageFile, 'utf-8');
      await context.addInitScript(data => {
        const entries: Record<string, string> = JSON.parse(data);
        for (const [key, value] of Object.entries(entries)) {
          window.sessionStorage.setItem(key, value);
        }
      }, sessionStorageData);
    }
    await use(context);
  },
});

export { expect } from '@playwright/test';
