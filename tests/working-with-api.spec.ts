import { test, expect } from './fixtures';
import owners from '../test-data/owners.json';
import specialities from '../test-data/sharonspecialities.json';

test.beforeEach(async ({ page }) => {
  await page.route(`**/petclinic/api/owners/${owners[0].id}*`, async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners[0])
    });
  });

  await page.route('**/petclinic/api/owners*', async (route) => {
    await route.fulfill({
      body: JSON.stringify(owners)
    });
  });

  await page.route('**/petclinic/api/vets*', async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();

    const vet = responseBody.find((v: any) => v.firstName === 'Sharon' && v.lastName === 'Jenkins');

    if (vet) {
      vet.specialties = specialities;
    }

    await route.fulfill({ json: responseBody });
  });

  await page.goto('/');
});

test(
  'validate ownerslist and visit list count',
  {
    annotation: {
      type: 'description',
      description: 'Mocking API reponse.'
    }
  },
  async ({ ownersPage, ownerInformationPage }) => {
    // Navigate to Owners search page to ensure the table is populated
    await ownersPage.goto();
    await ownersPage.page.waitForSelector('table tbody tr');
    const ownerRows = ownersPage.rows;
    await expect(ownerRows).toHaveCount(2);

    const ownerNameFromOwnersPage = (await ownerRows.first().locator('.ownerFullName').textContent())!;
    const petFromOwnersPage = (await ownerRows.first().locator('td').last().textContent())!;
    const petNamesFromOwnersPage = petFromOwnersPage.trim().split(/\s+/);

    await ownersPage.openOwner(ownerNameFromOwnersPage.trim());
    await expect(ownerInformationPage.ownerFullName).toHaveText(ownerNameFromOwnersPage.trim());

    const addressFromOwnersPage = (await ownerRows.first().locator('.ownerFullName + td').textContent())!;
    const cityFromOwnersPage = (await ownerRows.first().locator('.ownerFullName + td + td').textContent())!;
    const telephoneFromOwnersPage = (await ownerRows.first().locator('.ownerFullName + td + td + td').textContent())!;

    await expect(ownerInformationPage.rowValue('Address')).toHaveText(addressFromOwnersPage);
    await expect(ownerInformationPage.rowValue('City')).toHaveText(cityFromOwnersPage);
    await expect(ownerInformationPage.rowValue('Telephone')).toHaveText(telephoneFromOwnersPage);

    const petList = ownerInformationPage.page.locator('app-pet-list');
    await expect(petList.locator('dl > dd:first-of-type')).toHaveText(petNamesFromOwnersPage);

    const petNames = ownerInformationPage.page.locator('app-pet-list dl');
    await expect(petNames).toHaveCount(owners[0].pets.length);

    const firstPetSection = ownerInformationPage.page.locator('app-pet-list').first();
    const visitRows = firstPetSection.getByRole('table').getByRole('row').filter({ hasNotText: 'Visit Date' });

    await expect(visitRows).toHaveCount(10);
  }
);

test(
  'validate specilaities list for veterinarian',
  {
    annotation: {
      type: 'description',
      description: 'Intercepting API reponse.'
    }
  },
  async ({ homePage, veterinariansPage }) => {
    await homePage.goto();
    await homePage.goToVeterinarians();
    const sharonRow = veterinariansPage.rowByName('Sharon Jenkins');
    const specialtiesCell = sharonRow.locator('td:has-text("Sharon Jenkins") + td');
    for (let i = 0; i < specialities.length; i++) {
      await expect(specialtiesCell).toContainText(specialities[i].name);
    }
  }
);

