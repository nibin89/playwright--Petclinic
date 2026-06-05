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
  test('Validate pets of Madison city', async ({ page }) => {
    let pets = [];
    const ownerRows = page.locator('tbody tr').filter({ has: page.locator('td').nth(4) });
    for (const row of await ownerRows.all()) {
      const cityCell = await row.locator('td').nth(2).textContent();

      if (cityCell?.trim() === 'Madison') {
        const petNameCell = await row.locator('td').nth(4).textContent();
        pets.push(petNameCell?.trim() || '');
      }
    }

    expect(pets).toEqual(['Leo', 'George', 'Mulligan', 'Freddy']);
  });

  test('Validate speciality update', async ({ page }) => {
    const veterinariansButton = page.getByRole('button', { name: 'Veterinarians' });
    await veterinariansButton.click();
    const allButton = page.getByRole('link', { name: 'All' });
    await allButton.click();
    const rafaelCell = page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1);
    await expect(rafaelCell).toHaveText('surgery');
    const specialitieslink = page.getByRole('link', { name: ' Specialties' });
    await specialitieslink.click();
    await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
    const specialtiesRow = page.getByRole('row').nth(2);

    await specialtiesRow.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
    await expect(page.getByRole('textbox')).toHaveValue('surgery');
    await page.getByRole('textbox').clear();
    await page.getByRole('textbox').fill('dermatology');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByRole('row').nth(2).getByRole('textbox')).toHaveValue('dermatology');
    await veterinariansButton.click();
    await allButton.click();
    await expect(rafaelCell).toBeVisible();
    await expect(rafaelCell).toHaveText('dermatology');
    await specialitieslink.click();
    await specialtiesRow.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('textbox')).toHaveValue('dermatology');
    await page.getByRole('textbox').fill('surgery');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByRole('row').nth(2).getByRole('textbox')).toHaveValue('surgery');
  });
  test('Validate speciality lists', async ({ page }) => {
    const specialitieslink = page.getByRole('link', { name: ' Specialties' });
    await specialitieslink.click();
    await page.getByRole('button', { name: ' Add ' }).click();
    await page.locator('#name').fill('oncology');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('row', { name: 'oncology' })).toBeVisible();
    let specialties: String[] = [];
    const specialtiesFirstcell = page.locator('#specialties tbody tr td:first-child input');

    for (const cell of await specialtiesFirstcell.all()) {
      specialties.push((await cell.inputValue())?.trim() || '');
    }
    const veterinariansButton = page.getByRole('button', { name: 'Veterinarians' });
    await veterinariansButton.click();
    const allButton = page.getByRole('link', { name: 'All' });
    await allButton.click();
    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
    await page.locator('div.dropdown-display').click();
    const dropdownSpecialties: string[] = [];

    for (const label of await page.locator('div.dropdown-content label').all()) {
      dropdownSpecialties.push((await label.textContent())?.trim() || '');
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
    await allButton.click();
    await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toBeEmpty();
  });
});
