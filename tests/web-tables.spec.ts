import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Owners' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
  await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
});

test('Validate the pet name city of the owner', async ({ page }) => {
  const jeffBlackRow = page.locator('tr', { hasText: 'Jeff Black' });
  await expect(jeffBlackRow.locator('td').nth(2)).toHaveText('Monona');
  await expect(jeffBlackRow.locator('td').nth(4)).toHaveText('Lucky');
});
test('Validate the owners count of madison city', async ({ page }) => {
  const madisonOwners = page.locator('tbody tr').filter({ has: page.locator('td').nth(2).filter({ hasText: 'Madison' }) });
  await expect(madisonOwners).toHaveCount(4);
});

test('Validate search by Last Name', async ({ page }) => {
  const lastNameInput = page.locator('#lastName');
  const findOwnerButton = page.getByRole('button', { name: 'Find Owner' });
  await expect(lastNameInput).toBeVisible();
  const blackRow = page.locator('tbody tr:has(td:nth-child(1):has-text("Black"))');
  await lastNameInput.fill('Black');
  await findOwnerButton.click();
  await expect(blackRow).toBeVisible();
  await expect(blackRow.locator('td').first()).toContainText('Black', { ignoreCase: true });
  await lastNameInput.clear();
  await lastNameInput.fill('Davis');
  await findOwnerButton.click();
  await expect(page.locator('tbody tr:has-text("Jeff Black")')).not.toBeVisible({ visible: false });

  const davisRows = page.locator('tbody tr');

  const davisRowCount = await davisRows.count();

  for (let i = 0; i < davisRowCount; i++) {
    const nameCell = davisRows.nth(i).locator('td').first();
    await expect(nameCell).toContainText('Davis', { ignoreCase: true });
  }
  await lastNameInput.clear();
  await lastNameInput.fill('ES');
  await findOwnerButton.click();
  await expect(page.locator('tbody tr:has-text("Davis")')).toHaveCount(0);
  const eSRows = page.locator('tbody tr');

  const eSRowCount = await eSRows.count();

 for (let i = 0; i < eSRowCount; i++) {
    const nameCell = eSRows.nth(i).locator('td').first();
    await expect(nameCell).toContainText('ES', { ignoreCase: true });
  }
});
