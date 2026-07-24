import { test, expect } from '../fixtures';

test.describe('Création et suppression de stock — workflow complet UI → API → DB', () => {
  test('crée un stock via le formulaire, le voit apparaître, puis le supprime', async ({
    page,
  }) => {
    const stockLabel = `E2E Stock ${Date.now()}`;

    await page.goto('/dashboard');

    // 1. Ouvrir le formulaire de création
    await page.getByRole('button', { name: "Ajouter un Stock à l'inventaire" }).click();
    const formModal = page.getByRole('dialog', { name: 'Nouveau stock' });
    await expect(formModal).toBeVisible();

    // 2. Remplir et soumettre
    await page.locator('#stock-label').fill(stockLabel);
    await page.locator('#stock-description').fill('Créé par un test E2E automatisé');
    await page.locator('#stock-category').selectOption('alimentation');
    await formModal.getByRole('button', { name: 'Créer' }).click();

    // 3. Le formulaire se ferme et le stock apparaît dans la liste (POST /stocks
    // déclenché en interne par le formulaire — pas de notification de succès dans
    // l'app, cf. docs/E2E_TESTS_GUIDE.md)
    await expect(formModal).not.toBeVisible();
    const stockCard = page.locator(`sh-stock-card[name="${stockLabel}"]`);
    await expect(stockCard).toBeVisible();

    // 4. Nettoyage — supprime le stock créé pour ne pas polluer le compte réel
    await page.getByRole('button', { name: `Supprimer ${stockLabel}` }).click();
    const confirmModal = page.getByRole('dialog', { name: 'Supprimer ce stock ?' });
    await expect(confirmModal).toBeVisible();
    await confirmModal.getByRole('button', { name: 'Supprimer' }).click();

    // 5. Le stock a disparu (DELETE /stocks/:id)
    await expect(stockCard).not.toBeVisible();
  });
});
