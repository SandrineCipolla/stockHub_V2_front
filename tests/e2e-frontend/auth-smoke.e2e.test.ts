import { test, expect } from './fixtures';

test.describe('Authentification Azure AD B2C', () => {
  test("l'utilisateur reste authentifié via le storageState réutilisé", async ({ page }) => {
    await page.goto('/');

    await expect(page).not.toHaveURL(/b2clogin\.com/);
    await expect(page.getByText('Dashboard')).toBeVisible();
  });
});
