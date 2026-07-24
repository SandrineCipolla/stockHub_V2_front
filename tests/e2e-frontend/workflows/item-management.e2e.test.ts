import { test, expect } from '../fixtures';
import { createStock, deleteStock } from '../helpers/stock-actions';
import { addItem } from '../helpers/item-actions';

test.describe('Gestion des items — ajout et statut', () => {
  test("ajoute un item et vérifie qu'il apparaît avec le statut attendu", async ({ page }) => {
    const stockLabel = `E2E Stock Items ${Date.now()}`;
    const itemLabel = `E2E Item ${Date.now()}`;

    const stockCard = await createStock(page, stockLabel);

    // 1. Naviguer vers le détail du stock
    await stockCard.click();
    await page.waitForURL(/\/stocks\/\d+$/);

    // 2. Ajouter un item avec une quantité sous le seuil minimum pour
    // déclencher le statut "Critique" (getItemStatus : quantity < minimumStock)
    await addItem(page, { label: itemLabel, quantity: 2, minimumStock: 10 });

    // 3. L'item apparaît dans le tableau (vue desktop — vue mobile coexiste
    // dans le DOM mais cachée en CSS, cf. wiki ADR-011) avec le statut Critique
    const desktopTable = page.getByTestId('items-desktop-table');
    const itemRow = desktopTable.locator('tr', { hasText: itemLabel });
    await expect(itemRow).toBeVisible();
    await expect(itemRow).toContainText('Critique');

    // 4. Le compteur du filtre de statut reflète le nouvel item critique
    await expect(page.getByRole('button', { name: /Critique \(\d+\)/ })).toBeVisible();

    // 5. Nettoyage — supprime l'item (confirmation native window.confirm) puis le stock
    page.once('dialog', dialog => dialog.accept());
    await itemRow.getByRole('button', { name: `Supprimer ${itemLabel}` }).click();
    await expect(itemRow).not.toBeVisible();

    await deleteStock(page, stockLabel);
  });
});
