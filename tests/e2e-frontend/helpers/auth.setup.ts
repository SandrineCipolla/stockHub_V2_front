import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via Azure AD B2C', async ({ page }) => {
  const username = process.env.AZURE_TEST_USERNAME;
  const password = process.env.AZURE_TEST_PASSWORD;
  if (!username || !password) {
    throw new Error('AZURE_TEST_USERNAME / AZURE_TEST_PASSWORD manquants — voir .env.e2e.example');
  }

  await page.goto('/');

  await page.getByRole('button', { name: 'Se connecter' }).click();

  await page.waitForURL(/b2clogin\.com/);
  await page.getByPlaceholder('Email Address').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL(url => !url.hostname.includes('b2clogin.com'));
  await expect(page.getByText('Dashboard')).toBeVisible();

  await page.context().storageState({ path: authFile });
});
