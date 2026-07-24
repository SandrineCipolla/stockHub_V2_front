import { test, expect } from '../fixtures';
import { createStock, deleteStock } from '../helpers/stock-actions';

test.describe('Gestion des items — ajout et statut', () => {
  test("ajoute un item et vérifie qu'il apparaît avec le statut attendu", async ({ page }) => {
    const stockLabel = `E2E Stock Items ${Date.now()}`;
    const itemLabel = `E2E Item ${Date.now()}`;

    const stockCard = await createStock(page, stockLabel);

    // 1. Naviguer vers le détail du stock
    await stockCard.click();
    await page.waitForURL(/\/stocks\/\d+$/);

    // 2. Ouvrir le formulaire d'ajout d'item
    await page.getByRole('button', { name: 'Ajouter un item' }).click();
    const itemModal = page.getByRole('dialog', { name: 'Nouvel item' });
    await expect(itemModal).toBeVisible();

    // 3. Remplir avec une quantité sous le seuil minimum pour déclencher le
    // statut "Critique" (getItemStatus : quantity < minimumStock)
    await page.getByLabel('Nom', { exact: true }).fill(itemLabel);
    await page.getByLabel('Quantité initiale', { exact: true }).fill('2');
    await page.getByLabel('Stock minimum', { exact: true }).fill('10');
    await itemModal.getByRole('button', { name: 'Créer' }).click();
    await expect(itemModal).not.toBeVisible();

    // 4. L'item apparaît dans le tableau (vue desktop — vue mobile coexiste
    // dans le DOM mais cachée en CSS, cf. wiki ADR-011) avec le statut Critique
    const desktopTable = page.getByTestId('items-desktop-table');
    const itemRow = desktopTable.locator('tr', { hasText: itemLabel });
    await expect(itemRow).toBeVisible();
    await expect(itemRow).toContainText('Critique');

    // 5. Le compteur du filtre de statut reflète le nouvel item critique
    await expect(page.getByRole('button', { name: /Critique \(\d+\)/ })).toBeVisible();

    // 6. Nettoyage — supprime l'item (confirmation native window.confirm) puis le stock
    page.once('dialog', dialog => dialog.accept());
    await itemRow.getByRole('button', { name: `Supprimer ${itemLabel}` }).click();
    await expect(itemRow).not.toBeVisible();

    await deleteStock(page, stockLabel);
  });
});
