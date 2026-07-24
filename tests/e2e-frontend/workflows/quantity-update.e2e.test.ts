import { test, expect } from '../fixtures';
import { createStock, deleteStock } from '../helpers/stock-actions';

test.describe('Mise à jour de quantité — boutons +/-', () => {
  test('incrémente puis décrémente la quantité via les boutons +/-', async ({ page }) => {
    const stockLabel = `E2E Stock Qty ${Date.now()}`;
    const itemLabel = `E2E Item Qty ${Date.now()}`;

    const stockCard = await createStock(page, stockLabel);

    await stockCard.click();
    await page.waitForURL(/\/stocks\/\d+$/);

    await page.getByRole('button', { name: 'Ajouter un item' }).click();
    const itemModal = page.getByRole('dialog', { name: 'Nouvel item' });
    await page.getByLabel('Nom', { exact: true }).fill(itemLabel);
    await page.getByLabel('Quantité initiale', { exact: true }).fill('5');
    await page.getByLabel('Stock minimum', { exact: true }).fill('1');
    await itemModal.getByRole('button', { name: 'Créer' }).click();
    await expect(itemModal).not.toBeVisible();

    const desktopTable = page.getByTestId('items-desktop-table');
    const itemRow = desktopTable.locator('tr', { hasText: itemLabel });
    const quantityValue = itemRow.locator('[data-testid^="qty-edit-span-"]');
    await expect(quantityValue).toHaveText('5');

    // Le clic sur "+" appelle PATCH /stocks/:id/items/:itemId directement
    // (handleUpdateQuantity), sans passer par l'input d'édition inline.
    await itemRow.getByRole('button', { name: `Augmenter la quantité de ${itemLabel}` }).click();
    await expect(quantityValue).toHaveText('6');

    await itemRow.getByRole('button', { name: `Diminuer la quantité de ${itemLabel}` }).click();
    await itemRow.getByRole('button', { name: `Diminuer la quantité de ${itemLabel}` }).click();
    await expect(quantityValue).toHaveText('4');

    // Nettoyage
    page.once('dialog', dialog => dialog.accept());
    await itemRow.getByRole('button', { name: `Supprimer ${itemLabel}` }).click();
    await expect(itemRow).not.toBeVisible();

    await deleteStock(page, stockLabel);
  });
});
