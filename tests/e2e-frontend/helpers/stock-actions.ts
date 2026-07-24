import type { Locator, Page } from '@playwright/test';
import { expect } from '../fixtures';

/** Crée un stock via le formulaire UI et retourne le locator de sa carte. */
export async function createStock(page: Page, label: string): Promise<Locator> {
  await page.goto('/dashboard');

  await page.getByRole('button', { name: "Ajouter un Stock à l'inventaire" }).click();
  const formModal = page.getByRole('dialog', { name: 'Nouveau stock' });
  await expect(formModal).toBeVisible();

  await page.locator('#stock-label').fill(label);
  await page.locator('#stock-description').fill('Créé par un test E2E automatisé');
  await page.locator('#stock-category').selectOption('alimentation');
  await formModal.getByRole('button', { name: 'Créer' }).click();

  await expect(formModal).not.toBeVisible();
  const stockCard = page.getByRole('article', { name: `Carte de stock ${label}` });
  await expect(stockCard).toBeVisible();
  return stockCard;
}

/** Supprime un stock depuis le dashboard (avec confirmation). */
export async function deleteStock(page: Page, label: string): Promise<void> {
  await page.goto('/dashboard');
  const stockCard = page.getByRole('article', { name: `Carte de stock ${label}` });
  await page.getByRole('button', { name: `Supprimer ${label}` }).click();

  const confirmModal = page.getByRole('dialog', { name: 'Supprimer ce stock ?' });
  await expect(confirmModal).toBeVisible();
  await confirmModal.getByRole('button', { name: 'Supprimer' }).click();

  await expect(stockCard).not.toBeVisible();
}
