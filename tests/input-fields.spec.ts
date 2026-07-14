import { test, expect } from './fixtures';

test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.goToPetTypes();
});

test("Update Pet type", async ({ petTypesPage, editPetTypePage }) => {
    await expect(petTypesPage.heading).toBeVisible();

    await petTypesPage.clickEdit(petTypesPage.rowByName('cat'));

    await expect(editPetTypePage.heading).toBeVisible();
    await expect(editPetTypePage.nameInput).toHaveValue('cat');
    await editPetTypePage.fillName('rabbit');
    await editPetTypePage.clickUpdate();

    await expect(petTypesPage.inputById('0')).toHaveValue('rabbit');

    await petTypesPage.clickEdit(petTypesPage.rowByIndex(1));

    await expect(editPetTypePage.nameInput).toHaveValue('rabbit');
    await editPetTypePage.fillName('cat');
    await editPetTypePage.clickUpdate();

    await expect(petTypesPage.inputById('0')).toHaveValue('cat');
});

test("Cancel Pet type update", async ({ petTypesPage, editPetTypePage }) => {
    await expect(petTypesPage.heading).toBeVisible();

    await petTypesPage.clickEdit(petTypesPage.rowById('1'));

    await expect(editPetTypePage.nameInput).toHaveValue('dog');
    await editPetTypePage.fillName('moose');
    await editPetTypePage.clickCancel();

    await expect(petTypesPage.rowById('1').getByRole('textbox')).toHaveValue('dog');
});

test("Validation of Pet type name is required", async ({ petTypesPage, editPetTypePage }) => {
    await expect(petTypesPage.heading).toBeVisible();

    await petTypesPage.clickEdit(petTypesPage.rowById('2'));
    await expect(editPetTypePage.heading).toBeVisible();
    await expect(editPetTypePage.nameInput).toHaveValue('lizar');
    await editPetTypePage.clearName();
    await expect(editPetTypePage.nameInput).toHaveValue('');

    await editPetTypePage.clickUpdate();


    await expect(editPetTypePage.errorMessage).toBeVisible({ timeout: 5000 });
    await editPetTypePage.clickCancel();

    await expect(petTypesPage.heading).toBeVisible();
});