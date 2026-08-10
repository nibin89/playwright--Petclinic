import { test, expect } from './fixtures';

test.beforeEach(async ({ homePage }) => {
  await homePage.goto();
});

test.describe('Owners Management', () => {
  test.beforeEach(async ({ ownersPage }) => {
    await ownersPage.goto();
    await expect(ownersPage.heading).toBeVisible();
  });

  test('Validate the pet name city of the owner', async ({ ownersPage }) => {
    const jeffBlackRow = ownersPage.rowByName('Jeff Black');
    await expect(ownersPage.cell(jeffBlackRow, 2)).toHaveText('Monona');
    await expect(ownersPage.cell(jeffBlackRow, 4)).toHaveText('Lucky');
  });

  test('Validate the owners count of madison city', async ({ ownersPage }) => {
    await expect(ownersPage.rowByName('Madison')).toHaveCount(4);
  });

  test('Validate search by Last Name', async ({ ownersPage }) => {
    const searchCases = ['Black', 'Davis', 'Es', 'Playwright'];
    for (const lastName of searchCases) {
      await ownersPage.searchByLastName(lastName);
      if (lastName == 'Playwright') {
        await expect(ownersPage.noOwnersMessage(lastName)).toBeVisible();
      } else {
        for (const row of await ownersPage.rows.all()) {
          await expect(ownersPage.cell(row, 0)).toContainText(lastName);
        }
      }
    }
  });

  test('Validate phone number and pet name on the Owner Information page', async ({ ownersPage, ownerInformationPage }) => {
    const ownerRow = ownersPage.rowByName('6085552765');
    const petName = await ownersPage.cellText(ownerRow, 4);

    await ownerRow.getByRole('link').click();

    await expect(ownerInformationPage.telephoneCell).toHaveText('6085552765');
    await expect(ownerInformationPage.firstPetName).toHaveText(petName);
  });

  test('Validate pets of Madison city', async ({ ownersPage }) => {
    await expect(ownersPage.rows.first()).toBeVisible();
    let pets: string[] = [];
    const madisonRows = ownersPage.rowByName('Madison');
    for (const row of await madisonRows.all()) {
      pets.push(await ownersPage.cellText(row, 4));
    }
    expect(pets).toEqual(['Leo', 'George', 'Mulligan', 'Freddy']);
  });

  test('Validate specialty update', async ({ homePage, veterinariansPage, specialtiesPage }) => {
    await homePage.goToVeterinarians();
    await expect(veterinariansPage.specialtyCell(veterinariansPage.rowByName('Rafael Ortega'), 'surgery')).toBeVisible();

    await homePage.goToSpecialties();
    await expect(specialtiesPage.heading).toBeVisible();

    await specialtiesPage.clickEdit(specialtiesPage.rowByName('surgery'));
    await expect(specialtiesPage.editHeading).toBeVisible();
    await expect(specialtiesPage.activeEditInput).toHaveValue('surgery');
    await specialtiesPage.fillActiveEditInput('dermatology');
    await specialtiesPage.clickUpdate();
    await expect(specialtiesPage.rowByName('dermatology').getByRole('textbox')).toHaveValue('dermatology');

    await homePage.goToVeterinarians();
    await expect(veterinariansPage.specialtyCell(veterinariansPage.rowByName('Rafael Ortega'), 'dermatology')).toBeVisible();

    await homePage.goToSpecialties();
    await specialtiesPage.clickEdit(specialtiesPage.rowByName('dermatology'));
    await expect(specialtiesPage.activeEditInput).toHaveValue('dermatology');
    await specialtiesPage.fillActiveEditInput('surgery');
    await specialtiesPage.clickUpdate();
  });

  test('Validate speciality lists', async ({ homePage, veterinariansPage, editVeterinarianPage, specialtiesPage }) => {
    await homePage.goToSpecialties();
    await specialtiesPage.addSpecialty('oncology');
    await expect(specialtiesPage.rowByName('oncology').last()).toBeVisible();

    const specialties = await specialtiesPage.getAllSpecialtyNames();

    await homePage.goToVeterinarians();
    await veterinariansPage.clickEditVet(veterinariansPage.rowByName('Sharon Jenkins'));
    await expect(editVeterinarianPage.heading).toBeVisible();

    await editVeterinarianPage.openSpecialtiesDropdown();
    const dropdownSpecialties = await editVeterinarianPage.getDropdownLabelTexts();

    expect(specialties).toEqual(dropdownSpecialties);

    await editVeterinarianPage.toggleSpecialty('oncology');
    await editVeterinarianPage.openSpecialtiesDropdown();
    await editVeterinarianPage.save();

    await expect(veterinariansPage.specialtyCellAt(veterinariansPage.rowByName('Sharon Jenkins'), 1)).toHaveText('oncology');

    await homePage.goToSpecialties();
    await expect(specialtiesPage.heading).toBeVisible();
    await specialtiesPage.clickDelete(specialtiesPage.rowByName('oncology'));

    await homePage.goToVeterinarians();
    await expect(veterinariansPage.heading).toBeVisible();
    await expect(veterinariansPage.specialtyCellAt(veterinariansPage.rowByName('Sharon Jenkins'), 1)).toBeEmpty();
  });
});