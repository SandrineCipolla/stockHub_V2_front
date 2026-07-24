import type { Page } from '@playwright/test';
import { expect } from '../fixtures';

interface AddItemOptions {
  label: string;
  quantity: number;
  minimumStock: number;
}

/**
 * Ajoute un item au stock actuellement affiché (page de détail déjà ouverte).
 * Sélecteurs par id plutôt que getByLabel : le texte réel du <label> "Nom"
 * est "Nom *" (l'astérisque de champ requis fait partie du texte matché par
 * getByLabel, malgré le aria-hidden sur le span), donc getByLabel('Nom',
 * { exact: true }) ne matche jamais et bloque le test jusqu'au timeout.
 */
export async function addItem(page: Page, { label, quantity, minimumStock }: AddItemOptions) {
  await page.getByRole('button', { name: 'Ajouter un item' }).click();
  const itemModal = page.getByRole('dialog', { name: 'Nouvel item' });
  await expect(itemModal).toBeVisible();

  await page.locator('#item-label').fill(label);
  await page.locator('#item-quantity').fill(String(quantity));
  await page.locator('#item-minimum-stock').fill(String(minimumStock));
  await itemModal.getByRole('button', { name: 'Créer' }).click();
  await expect(itemModal).not.toBeVisible();
}
