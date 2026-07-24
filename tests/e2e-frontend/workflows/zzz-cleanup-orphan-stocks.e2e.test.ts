import { test } from '../fixtures';

/**
 * Script de maintenance ponctuel — supprime les stocks orphelins laissés
 * par des runs E2E qui ont échoué avant l'étape de nettoyage (préfixe
 * "E2E Stock", cf. ETAT-DU-PROJET.md session du 24/07/2026).
 *
 * À retirer après exécution — ce n'est pas un test de régression, juste
 * un ménage ponctuel du compte réel utilisé par la CI.
 */
test('supprime tous les stocks orphelins préfixés "E2E Stock"', async ({ page }) => {
  await page.goto('/dashboard');

  for (let i = 0; i < 50; i++) {
    const deleteButton = page.getByRole('button', { name: /^Supprimer E2E Stock/ }).first();
    if ((await deleteButton.count()) === 0) break;

    await deleteButton.click();
    const confirmModal = page.getByRole('dialog', { name: 'Supprimer ce stock ?' });
    await confirmModal.getByRole('button', { name: 'Supprimer' }).click();
    await page.waitForTimeout(500);
  }
});
