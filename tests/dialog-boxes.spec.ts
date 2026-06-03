import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Add and Delete Pet Types', async ({ page }) => {
  await page.getByRole('link', { name: 'Pet Types' }).click();
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Pet Types');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('heading', { level: 2 }).nth(1)).toHaveText('New Pet Type');
  await expect(page.locator('label', { hasText: 'Name' })).toBeVisible(); 
  await expect(page.locator('#name')).toBeVisible(); 
  await page.locator('#name').fill('pig');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('row').last().getByRole('textbox')).toHaveValue('pig');
  page.on('dialog', (dialog) => {
    expect(dialog.message()).toEqual('Delete the pet type?');
    dialog.accept();
  });
  await page.getByRole('row', { name: 'pig' }).last().getByRole('button', { name: 'Delete' }).click();
  await page.waitForResponse('**/pettypes/*');
  await expect(page.getByRole('row').last().getByRole('textbox')).not.toHaveValue('pig');
});
