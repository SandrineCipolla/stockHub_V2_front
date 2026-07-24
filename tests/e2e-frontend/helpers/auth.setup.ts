import { test as setup, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

const authFile = 'playwright/.auth/user.json';
const sessionStorageFile = 'playwright/.auth/session-storage.json';

setup('authenticate via Azure AD B2C', async ({ page }) => {
  const username = process.env.AZURE_TEST_USERNAME;
  const password = process.env.AZURE_TEST_PASSWORD;
  if (!username || !password) {
    throw new Error('AZURE_TEST_USERNAME / AZURE_TEST_PASSWORD manquants — voir .env.e2e.example');
  }

  // Contourne le mur Vercel Deployment Protection (SSO) sur les URLs de
  // preview (ex. staging) via un paramètre d'URL au premier chargement —
  // Vercel pose alors un cookie de contournement, sauvegardé ensuite dans
  // storageState() et réutilisé automatiquement par les autres tests.
  // Volontairement PAS un header global (extraHTTPHeaders) : celui-ci
  // partirait aussi vers le backend Render sur un domaine différent, dont
  // le CORS n'autorise pas cet en-tête custom — la requête est alors
  // bloquée par le navigateur (net::ERR_FAILED), constaté en CI.
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const initialPath = bypassSecret
    ? `/?x-vercel-protection-bypass=${bypassSecret}&x-vercel-set-bypass-cookie=true`
    : '/';
  await page.goto(initialPath);
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
  mkdirSync(dirname(sessionStorageFile), { recursive: true });
  writeFileSync(sessionStorageFile, sessionStorageData);

  await page.context().storageState({ path: authFile });
});
