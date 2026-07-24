import { test, expect } from '../fixtures';
import { createStock, deleteStock } from '../helpers/stock-actions';

test.describe('Création et suppression de stock — workflow complet UI → API → DB', () => {
  test('crée un stock via le formulaire, le voit apparaître, puis le supprime', async ({
    page,
  }) => {
    const stockLabel = `E2E Stock ${Date.now()}`;

    // createStock/deleteStock : voir tests/e2e-frontend/helpers/stock-actions.ts.
    // Le sélecteur CSS [name="..."] ne fonctionne pas sur sh-stock-card : Lit
    // expose `name` comme propriété JS (définie par React sur l'élément), pas
    // comme attribut HTML reflété — on cible le rôle accessible réel du
    // composant (article "Carte de stock ...").
    const stockCard = await createStock(page, stockLabel);
    await expect(stockCard).toBeVisible();

    await deleteStock(page, stockLabel);
  });
});
