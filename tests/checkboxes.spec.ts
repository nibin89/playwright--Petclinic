import { test, expect } from './fixtures';

test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.goToVeterinarians();
});

test("Validate selected specialities", async ({ veterinariansPage, editVeterinarianPage }) => {
    await veterinariansPage.clickEditVet(veterinariansPage.rowByName('Helen Leary'));

    await expect(editVeterinarianPage.selectedSpecialties).toHaveText('radiology');
    await editVeterinarianPage.openSpecialtiesDropdown();
    await expect(editVeterinarianPage.specialtyCheckbox('radiology')).toBeChecked();

    await editVeterinarianPage.uncheckSpecialty('surgery');
    await editVeterinarianPage.uncheckSpecialty('denistry');
    await editVeterinarianPage.checkSpecialty('surgery');
    await editVeterinarianPage.uncheckSpecialty('radiology');

    await expect(editVeterinarianPage.specialtyCheckbox('surgery')).toBeChecked();

    await editVeterinarianPage.checkSpecialty('denistry');

    await expect(editVeterinarianPage.selectedSpecialties).toHaveText('surgery, denistry');
});

test("Select all specialities", async ({ veterinariansPage, editVeterinarianPage }) => {
    await veterinariansPage.clickEditVet(veterinariansPage.rowByName('Rafael Ortega'));

    await expect(editVeterinarianPage.selectedSpecialties).toHaveText('surgery');
    await editVeterinarianPage.openSpecialtiesDropdown();

    await editVeterinarianPage.checkAllSpecialties();

    await expect(editVeterinarianPage.selectedSpecialties).toHaveText('surgery, radiology, denistry');
});

test("Unselect all specialities", async ({ veterinariansPage, editVeterinarianPage }) => {
    await veterinariansPage.clickEditVet(veterinariansPage.rowByName('Linda Douglas'));

    await expect(editVeterinarianPage.selectedSpecialties).toHaveText('denistry, surgery');
    await editVeterinarianPage.openSpecialtiesDropdown();

    await editVeterinarianPage.uncheckAllSpecialties();

    await expect(editVeterinarianPage.selectedSpecialties).toBeEmpty();
});