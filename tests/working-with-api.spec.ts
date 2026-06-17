import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json';

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/owners**', async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners)
    });
  });
  await page.goto('https://petclinic.bondaracademy.com/owners');
});

test('mocking API request', async ({ page }) => {
  const ownerRows = page.locator('#ownersTable tbody > tr');
  await expect(ownerRows).toHaveCount(2);
  await page.getByRole('link', { name: `${owners[0].firstName} ${owners[0].lastName}` }).click();
  await expect(page).toHaveURL(`https://petclinic.bondaracademy.com/owners/${owners[0].id}`);
  const ownerInfoSection = page.locator('app-owner-detail');
  await expect(ownerInfoSection.locator('.ownerFullName')).toHaveText(`${owners[0].firstName} ${owners[0].lastName}`);

  const addressRow = page.getByRole('row', { name: 'Address' });
  await expect(addressRow.getByRole('cell')).toHaveText(owners[0].address);

  const cityRow = page.getByRole('row', { name: 'City' });
  await expect(cityRow.getByRole('cell')).toHaveText(owners[0].city);

  const telephoneRow = page.getByRole('row', { name: 'Telephone' });
  await expect(telephoneRow.getByRole('cell')).toHaveText(owners[0].telephone);

  const petList = page.locator('app-pet-list');
  await expect(petList.locator('dl').locator('dd').first()).toHaveText(owners[0].pets[0].name);
});
