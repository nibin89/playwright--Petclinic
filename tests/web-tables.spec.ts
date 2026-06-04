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

  await lastNameInput.fill('Black');
  await findOwnerButton.click();

  const blackRow = page.getByRole('row', { name: 'Jeff Black' });
  await expect(blackRow).toBeVisible();
  await expect(blackRow.getByRole('cell').first()).toContainText('Black', { ignoreCase: true });

  await lastNameInput.clear();
  await lastNameInput.fill('Davis');
  await findOwnerButton.click();

  await expect(page.getByRole('row', { name: 'Jeff Black' })).not.toBeVisible();

  const davisRows = page.getByRole('row').filter({ hasText: 'Davis' });
  for (const row of await davisRows.all()) {
    const nameCell = row.getByRole('cell').first();
    await expect(nameCell).toContainText('Davis', { ignoreCase: true });
  }

  await lastNameInput.clear();
  await lastNameInput.fill('ES');

  const responsePromise = page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName=ES');
  await findOwnerButton.click();
  const response = await responsePromise;
  await expect(page.getByRole('row').filter({ hasText: 'Davis' })).toHaveCount(0);

  const esRows = page.locator('tbody tr').filter({ hasText: 'ES' });
  for (const row of await esRows.all()) {
    await expect(row.getByRole('cell').first()).toContainText('ES', { ignoreCase: true });
  }
    await lastNameInput.clear();
    await lastNameInput.fill('Playwright');
    await findOwnerButton.click();
    await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible();
  
});
test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
  const ownerRow = page.locator('tbody tr', { hasText: '6085552765' });
  const petNameCell = ownerRow.getByRole('cell').nth(4);
  await expect(ownerRow.getByRole('cell').nth(3)).toHaveText('6085552765');
  await expect(petNameCell).toHaveText('George');
});
test.only('Validate pets of Madison city', async ({ page }) => {
  let pets = [];

  const allRows = page.locator('tbody tr');

  for (const row of await allRows.all()) {
    const cityCell = await row.locator('td').nth(2).textContent();

    if (cityCell === 'Madison') {
      const petNameCell = await row.locator('td').nth(4).textContent();
      pets.push(petNameCell)
    }
    else {
        continue;
    }
  }

  expect(pets).toEqual(['Leo', 'George', 'Mulligan', 'Freddy']);
});
