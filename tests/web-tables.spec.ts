import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Owners Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click();
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  test('Validate the pet name city of the owner', async ({ page }) => {
    const jeffBlackRow = page.getByRole('row', { name: 'Jeff Black' });
    await expect(jeffBlackRow.locator('td').nth(2)).toHaveText('Monona');
    await expect(jeffBlackRow.locator('td').nth(4)).toHaveText('Lucky');
  });

  test('Validate the owners count of madison city', async ({ page }) => {
    await expect(page.getByRole('row', { name: 'Madison' })).toHaveCount(4);
  });

  test('Validate search by Last Name', async ({ page }) => {
    const searchCases  = ['Black', 'Davis', 'Es', 'Playwright'];
    for (const lastName of searchCases ) {
      await page.locator('#lastName').fill(lastName);
      const responsePromise = page.waitForResponse(`**/api/owners?lastName=${lastName}`);
      await page.getByRole('button', { name: 'Find Owner' }).click();
      await responsePromise;
      if (lastName == 'Playwright') {
        await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible();
      } else {
        for (const row of await page.locator('tbody > tr').all()) {
          await expect(row.locator('td').first()).toContainText(lastName);
        }
      }
    }
  });

  test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
    const ownerRow = page.getByRole('row', { name: '6085552765' });
    const petName = (await ownerRow.getByRole('cell').nth(4).textContent())!.trim()
    await ownerRow.getByRole('link').click();
    await expect(page.getByRole('row', { name: 'Telephone' }).getByRole('cell')).toHaveText('6085552765');
    await expect(page.locator('app-pet-list dd').filter({ hasText: petName })).toHaveText(petName);
    
  });

  test('Validate pets of Madison city', async ({ page }) => {
    let pets = [];
    const madisonRows = page.getByRole('row', { name: 'Madison' });
    for (const row of await madisonRows.all()) {
      const petName = await row.locator('td').nth(4).textContent();
      pets.push(petName!.trim());
    }
    expect(pets).toEqual(['Leo', 'George', 'Mulligan', 'Freddy']);
  });

  test('Validate specialty update', async ({ page }) => {
  await page.getByRole('button', { name: 'Veterinarians' }).click();
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell', { name: 'surgery' })).toBeVisible();
  await page.getByRole('link', { name: ' Specialties' }).click();
  await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
  await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveValue('surgery');
  await page.getByRole('textbox').fill('dermatology');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByRole('row', { name: 'dermatology' }).getByRole('textbox')).toHaveValue('dermatology');
  await page.getByRole('button', { name: 'Veterinarians' }).click();
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell', { name: 'dermatology' })).toBeVisible();
  await page.getByRole('link', { name: ' Specialties' }).click();
  await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByRole('textbox')).toHaveValue('dermatology');
  await page.getByRole('textbox').fill('surgery');
  await page.getByRole('button', { name: 'Update' }).click();

});

  test('Validate speciality lists', async ({ page }) => {
    const specialitieslink = page.getByRole('link', { name: ' Specialties' });
    const veterinariansButton = page.getByRole('button', { name: 'Veterinarians' });
    await specialitieslink.click();
    await page.getByRole('button', { name: ' Add ' }).click();
    await page.locator('#name').fill('oncology');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('row', { name: 'oncology' }).last()).toBeVisible();
    let specialties: string[] = [];
    const specialtiesFirstcell = page.locator('#specialties tbody tr td:first-child input');

    for (const cell of await specialtiesFirstcell.all()) {
      specialties.push((await cell.inputValue())?.trim());
    }
    await veterinariansButton.click();
    await page.getByRole('link', { name: 'All' }).click();
    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
    await page.locator('div.dropdown-display').click();
    const dropdownSpecialties: string[] = [];

    for (const label of await page.locator('div.dropdown-content label').all()) {
      dropdownSpecialties.push((await label.textContent())!.trim());
    }

    expect(specialties).toEqual(dropdownSpecialties);
    await page.getByLabel('oncology').click();
    await page.locator('div.dropdown-display').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();

    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toHaveText('oncology');
    await specialitieslink.click();
    await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
    await page.getByRole('row', { name: 'oncology' }).getByRole('button', { name: 'Delete' }).click();
    await veterinariansButton.click();
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toBeEmpty();
  });
});