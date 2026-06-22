import { test, expect } from '@playwright/test';
const API_BASE_URL = 'https://petclinic-api.bondaracademy.com/petclinic/api'
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Performing API Request', () => {
  test('Validation of delete specialty', async ({ page, request }) => {
    const createResponse = await request.post(`${API_BASE_URL}/specialties`, {
      data: { name: 'api testing expert' }
    });

    expect(createResponse.status()).toBe(201);
    const specialty = await createResponse.json();
    expect(specialty.name).toBe('api testing expert');

    await page.getByRole('link', { name: 'Specialties' }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('row', { name: 'api testing expert' })).toBeVisible();
    await page.getByRole('row', { name: 'api testing expert' })
      .getByRole('button', { name: 'Delete' })
      .click();
    await expect(page.getByRole('row', { name: 'api testing expert' })).not.toBeVisible();
  });

  test('Add and delete a Veterinarian', async ({ page, request }) => {
    // Add a new Veterinarian
    const createResponse = await request.post(`${API_BASE_URL}/vets`, {
      data: {
        firstName: 'Nibin',
        lastName: 'Mathew',
        id: null,
        specialties: []
      }
    });
    expect(createResponse.status()).toBe(201);
    const vet = await createResponse.json();
    const vetId = vet.id;
    expect(vet.firstName).toBe('Nibin');
    expect(vet.lastName).toBe('Mathew');

    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    const nibinvetRow = page.getByRole('row', { name: 'Nibin Mathew' }).last();
    await expect(nibinvetRow).toBeVisible();
    await expect(nibinvetRow.getByRole('cell').first()).toHaveText('Nibin Mathew');
    await expect(nibinvetRow.getByRole('cell').nth(1)).toBeEmpty();
    await nibinvetRow.getByRole('button', { name: 'Edit Vet' }).click();
    await page.locator('div.dropdown').click();
    await page.getByLabel('denistry').check();
    await page.locator('div.dropdown').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(nibinvetRow.getByRole('cell').nth(1)).toHaveText('denistry');

    // Delete a Veterinarian
    const deleteResponse = await request.delete(`${API_BASE_URL}/vets/${vetId}`);
    expect(deleteResponse.status()).toBe(204);
    const getResponse = await request.get(`${API_BASE_URL}/vets`);
    const vets = await getResponse.json();
    const deletedVet = vets.find((v: any) => v.id === vetId);
    expect(deletedVet).toBeUndefined();
  });

  test('New specilaity displayed', async ({ page, request }) => {
    const specilatyResponse = await request.post(`${API_BASE_URL}/specialties`, {
      data: { name: 'api testing ninja' }
    });

    expect(specilatyResponse.status()).toBe(201);
    const specialtyData = await specilatyResponse.json();
    const specilatyId = specialtyData.id

    const vetResponse = await request.post(`${API_BASE_URL}/vets`, {
      data: {
        firstName: 'Vishnu',
        lastName: 'Prasad',
        id: null,
        specialties: [{ id: 5046, name: 'surgery' }]
      }
    });
    expect(vetResponse.status()).toBe(201);
    const vet = await vetResponse.json();
    const vetId = vet.id;

    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    const vishnuvetRow = page.getByRole('row', { name: 'Vishnu Prasad' }).last();
    await expect(vishnuvetRow).toBeVisible();
    await expect(vishnuvetRow.getByRole('cell').first()).toHaveText('Vishnu Prasad');
    await expect(vishnuvetRow.getByRole('cell').nth(1)).toHaveText('surgery');
    await vishnuvetRow.getByRole('button', { name: 'Edit Vet' }).click();
    await page.locator('div.dropdown').click();
    await page.getByLabel('surgery').uncheck();
    await page.getByLabel('api testing ninja').check();
    await page.locator('div.dropdown').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(vishnuvetRow.getByRole('cell').nth(1)).toHaveText('api testing ninja');

    // Delete a Veterinarian
    const deleteVetResponse = await request.delete(`${API_BASE_URL}/vets/${vetId}`);
    expect(deleteVetResponse.status()).toBe(204);
    const deleteSpecilatyResponse = await request.delete(`${API_BASE_URL}/specialties/${specilatyId}`);
    expect(deleteSpecilatyResponse.status()).toBe(204);
    await page.reload();
    await expect(page.getByRole('row', { name: 'api testing ninja' })).not.toBeVisible();
  });
});