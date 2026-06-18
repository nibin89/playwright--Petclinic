import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json';

test.beforeEach(async ({ page }) => {
  const ownerId = owners[0].id;

  await page.route(`**/api/owners/${ownerId}`, async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners[0])
    });
  });

  await page.route('**/api/owners', async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners)
    });
  });

  await page.goto('https://petclinic.bondaracademy.com');
  await page.getByRole('button', { name: 'Owners' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
});

test('mocking API request', async ({ page }) => {
  const ownerRows = page.locator('.table tbody > tr');
  await expect(ownerRows).toHaveCount(2);

  await page.getByRole('link', { name: `${owners[0].firstName} ${owners[0].lastName}` }).click();
  await expect(page).toHaveURL(`https://petclinic.bondaracademy.com/owners/${owners[0].id}`);

  const ownerInfoSection = page.locator('app-owner-detail');
  await expect(ownerInfoSection.locator('.ownerFullName')).toHaveText(`${owners[0].firstName} ${owners[0].lastName}`);

  const addressRow = page.getByRole('row', { name: 'Address' });
  await expect(addressRow.locator('td')).toHaveText(owners[0].address);

  const cityRow = page.getByRole('row', { name: 'City' });
  await expect(cityRow.locator('td')).toHaveText(owners[0].city);

  const telephoneRow = page.getByRole('row', { name: 'Telephone' });
  await expect(telephoneRow.locator('td')).toHaveText(owners[0].telephone);

  const petList = page.locator('app-pet-list');
  await expect(petList.locator('dl').locator('dd').first()).toHaveText(owners[0].pets[0].name);

  const petDls = page.locator('app-pet-list dl')
  await expect(petDls).toHaveCount(owners[0].pets.length)
  
  for(let i=0; i < owners[0].pets.length; i++){
 await expect(petDls.nth(i).locator('dd').first()).toHaveText(owners[0].pets[i].name)

const firstPetSection = page.locator('app-pet-list').first()
const visitRows = firstPetSection.locator('app-visit-list table').getByRole('row').filter({ hasNotText: 'Visit Date' })
await expect(visitRows).toHaveCount(owners[0].pets[0].visits.length)

  }


});
