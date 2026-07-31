import { test, expect } from './fixtures';
const API_BASE_URL = 'https://petclinic-api.bondaracademy.com/petclinic/api'

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Performing API Request', () => {
  test('Validation of delete specialty', async ({ specialtiesPage, request }) => {
    const specialtyName = `api testing expert ${Date.now()}`;
    const createSpecialtyResponse = await request.post(`${API_BASE_URL}/specialties`, {
      data: { name: specialtyName },
      timeout: 30000
    });

    expect(createSpecialtyResponse.status()).toBe(201);
    const createdSpecialtyResponseJSON = await createSpecialtyResponse.json();
    expect(createdSpecialtyResponseJSON.name).toBe(specialtyName);

    await specialtiesPage.page.getByRole('link', { name: 'Specialties' }).click();
    const row = specialtiesPage.rowByName(specialtyName).first();
    await expect(row).toBeVisible();
    const deleteResponsePromise = specialtiesPage.page.waitForResponse(
      response => response.url().includes('/petclinic/api/specialties')
        && response.status() === 204);
    await specialtiesPage.clickDelete(row);
    await deleteResponsePromise;
    await specialtiesPage.page.getByRole('link', { name: 'Specialties' }).click();
    await specialtiesPage.page.waitForLoadState('networkidle');
    await expect(specialtiesPage.rowByName(specialtyName)).toHaveCount(0);
  });

  test('Add and delete a Veterinarian', async ({ veterinariansPage, request }) => {
    const createVetResponse = await request.post(`${API_BASE_URL}/vets`, {
      data: {
        firstName: 'Nibin',
        lastName: 'Mathew',
        id: null,
        specialties: []
      },
      timeout: 30000
    });
    expect(createVetResponse.status()).toBe(201);
    const vetResponseJson = await createVetResponse.json();
    const vetId = vetResponseJson.id;
    expect(vetResponseJson.firstName).toBe('Nibin');
    expect(vetResponseJson.lastName).toBe('Mathew');

    await veterinariansPage.page.getByRole('button', { name: 'Veterinarians' }).click();
    await veterinariansPage.page.getByRole('link', { name: 'All' }).click();
    const nibinvetRow = veterinariansPage.rowByName('Nibin Mathew');
    await expect(nibinvetRow).toBeVisible();
    await expect(nibinvetRow.getByRole('cell').first()).toHaveText('Nibin Mathew');
    await expect(nibinvetRow.getByRole('cell').nth(1)).toBeEmpty();
    await veterinariansPage.clickEditVet(nibinvetRow);
    await veterinariansPage.openSpecialtiesDropdown();
    await veterinariansPage.checkSpecialtyByLabel('denistry');
    await veterinariansPage.openSpecialtiesDropdown();
    await veterinariansPage.saveVet();
    await expect(nibinvetRow.getByRole('cell').nth(1)).toHaveText('denistry');

    const deleteResponse = await request.delete(`${API_BASE_URL}/vets/${vetId}`, { timeout: 30000 });
    expect(deleteResponse.status()).toBe(204);
    const getAllVetsResponse = await request.get(`${API_BASE_URL}/vets`, { timeout: 30000 });
    const vetsList = await getAllVetsResponse.json();
    const vetIds = vetsList.map((vet: any) => vet.id);
    expect(vetIds).not.toContain(vetId);
  });

  test('New specilaity displayed', async ({ veterinariansPage, specialtiesPage, request }) => {
    const specialtyName = `api testing ninja ${Date.now()}`;
    const specilatyResponse = await request.post(`${API_BASE_URL}/specialties`, {
      data: { name: specialtyName },
      timeout: 30000
    });

    expect(specilatyResponse.status()).toBe(201);
    const specialtyData = await specilatyResponse.json();
    const specilatyId = specialtyData.id

    const allSpecialtiesResponse = await request.get(`${API_BASE_URL}/specialties`, { timeout: 30000 })
    const allSpecialties = await allSpecialtiesResponse.json()
    const surgerySpecialty = allSpecialties.find((s: any) => s.name === 'surgery')

    const vetResponse = await request.post(`${API_BASE_URL}/vets`, {
      data: {
        firstName: 'Vishnu',
        lastName: 'Prasad',
        id: null,
        specialties: [{ id: surgerySpecialty.id, name: surgerySpecialty.name }]
      },
      timeout: 30000
    });
    expect(vetResponse.status()).toBe(201);
    const vet = await vetResponse.json();
    const vetId = vet.id;

    await veterinariansPage.page.getByRole('button', { name: 'Veterinarians' }).click();
    await veterinariansPage.page.getByRole('link', { name: 'All' }).click();
    const vishnuvetRow = veterinariansPage.rowByName('Vishnu Prasad').last();
    await expect(vishnuvetRow).toBeVisible();
    await expect(vishnuvetRow.getByRole('cell').first()).toHaveText('Vishnu Prasad');
    await expect(vishnuvetRow.getByRole('cell').nth(1)).toHaveText('surgery');
    await veterinariansPage.clickEditVet(vishnuvetRow);
    await veterinariansPage.openSpecialtiesDropdown();
    await veterinariansPage.uncheckSpecialtyByLabel('surgery');
    await veterinariansPage.checkSpecialtyByLabel('api testing ninja');
    await veterinariansPage.openSpecialtiesDropdown();
    await veterinariansPage.saveVet();
    await expect(vishnuvetRow.getByRole('cell').nth(1)).toHaveText('api testing ninja');

    const deleteVetResponse = await request.delete(`${API_BASE_URL}/vets/${vetId}`, { timeout: 30000 });
    expect(deleteVetResponse.status()).toBe(204);
    const deleteSpecilatyResponse = await request.delete(`${API_BASE_URL}/specialties/${specilatyId}`, { timeout: 30000 });
    expect(deleteSpecilatyResponse.status()).toBe(204);
    await specialtiesPage.page.getByRole('link', { name: 'Specialties' }).click()
    await specialtiesPage.page.waitForResponse(`${API_BASE_URL}/specialties`)
    await expect(specialtiesPage.page.getByRole('row', { name: 'api testing ninja' })).not.toBeVisible();
  });
});