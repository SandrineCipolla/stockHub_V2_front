import { test as setup, expect } from '@playwright/test';
import { writeFileSync } from 'fs';

const authFile = 'playwright/.auth/user.json';
const sessionStorageFile = 'playwright/.auth/session-storage.json';

setup('authenticate via Azure AD B2C', async ({ page }) => {
  const username = process.env.AZURE_TEST_USERNAME;
  const password = process.env.AZURE_TEST_PASSWORD;
  if (!username || !password) {
    throw new Error('AZURE_TEST_USERNAME / AZURE_TEST_PASSWORD manquants — voir .env.e2e.example');
  }

  await page.goto('/');
  const appHostname = new URL(page.url()).hostname;

  await page.getByRole('button', { name: 'Se connecter' }).click();

  await page.waitForURL(url => url.hostname.endsWith('.b2clogin.com'));
  await page.getByPlaceholder('Email Address').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL(url => url.hostname === appHostname);
  await expect(page.getByText('Dashboard')).toBeVisible();

  // MSAL est configuré en cacheLocation: 'sessionStorage' (src/config/authConfig.ts).
  // storageState() de Playwright ne capture que cookies + localStorage — le token
  // MSAL doit donc être sauvegardé et réinjecté séparément (voir fixtures.ts).
  const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
  writeFileSync(sessionStorageFile, sessionStorageData);

  await page.context().storageState({ path: authFile });
});
