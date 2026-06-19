import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json';

test.beforeEach(async ({ page }) => {
  await page.route(`**/api/owners/${owners[0].id}`, async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners[0])
    });
  });

  await page.route('**/api/owners', async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners)
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Owners' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
});

test('mocking API request', async ({ page }) => {
  const ownerRows = page.locator('tbody > tr');
  await expect(ownerRows).toHaveCount(2);

  const ownerNameFromOwnersPage = (await ownerRows.first().locator('.ownerFullName').textContent())!;
  const addressFromOwnersPage = (await ownerRows.first().locator('.ownerFullName + td').textContent())!;
  const cityFromOwnersPage = (await ownerRows.first().locator('.ownerFullName + td + td').textContent())!;
  const telephoneFromOwnersPage = (await ownerRows.first().locator('.ownerFullName + td + td + td').textContent())!;
  const petFromOwnersPage = (await ownerRows.first().locator('td').last().textContent())!;
  const petNamesFromOwnersPage = petFromOwnersPage.trim().split(/\s+/);
  
  await ownerRows.getByRole('link').first().click();
  await expect(page).toHaveURL(`/owners/${owners[0].id}`);

  const ownerInfoSection = page.locator('app-owner-detail');
  await expect(ownerInfoSection.locator('.ownerFullName')).toHaveText(ownerNameFromOwnersPage);

  const addressRow = page.getByRole('row', { name: 'Address' });
  await expect(addressRow.locator('td')).toHaveText(addressFromOwnersPage);

  const cityRow = page.getByRole('row', { name: 'City' });
  await expect(cityRow.locator('td')).toHaveText(cityFromOwnersPage);

  const telephoneRow = page.getByRole('row', { name: 'Telephone' });
  await expect(telephoneRow.locator('td')).toHaveText(telephoneFromOwnersPage);

  const petList = page.locator('app-pet-list');

  await expect(petList.locator('dl > dd:first-of-type')).toHaveText(petNamesFromOwnersPage);

  const petNames = page.locator('app-pet-list dl');
  await expect(petNames).toHaveCount(owners[0].pets.length);
  
  const firstPetSection = page.locator('app-pet-list').first();
  const visitRows = firstPetSection.locator('app-visit-list table').getByRole('row').filter({ hasNotText: 'Visit Date' });
  
  await expect(visitRows).toHaveCount(10)
});