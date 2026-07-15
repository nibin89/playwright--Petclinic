import { test, expect } from './fixtures';

test.beforeEach(async ({ page, ownersPage }) => {
  await page.goto('/');
  await ownersPage.goto();
});

test('Validate selected Pet types from the list @smoke', async ({ ownersPage, ownerInformationPage, editPetPage }) => {
  await expect(ownersPage.heading).toHaveText('Owners');

  await ownersPage.openOwner('George Franklin');
  await expect(ownerInformationPage.ownerFullName).toHaveText('George Franklin');

  await ownerInformationPage.clickEditPet('Leo');
  await expect(editPetPage.heading).toHaveText('Pet');
  await expect(editPetPage.ownerNameField).toHaveValue('George Franklin');
  await expect(editPetPage.typeReadOnlyField).toHaveValue('cat');

  const options = await editPetPage.getTypeOptions();

  for (const option of options) {
    await editPetPage.selectType(option);
    await expect(editPetPage.typeReadOnlyField).toHaveValue(option);
  }
});

test('Validate pet type update @smoke', async ({ ownersPage, ownerInformationPage, editPetPage }) => {
  await expect(ownersPage.heading).toHaveText('Owners');

  await ownersPage.openOwner('Eduardo Rodriquez');
  await expect(ownerInformationPage.petsAndVisitsHeading).toBeVisible();

  await ownerInformationPage.clickEditPet('Rosy');
  await expect(editPetPage.nameInput).toHaveValue('Rosy');
  await expect(editPetPage.typeReadOnlyField).toHaveValue('dog');

  await editPetPage.selectType('bird');
  await expect(editPetPage.typeReadOnlyField).toHaveValue('bird');
  await editPetPage.clickUpdate();

  await expect(ownerInformationPage.petsAndVisitsHeading).toBeVisible();
  await expect(ownerInformationPage.petType('Rosy')).toHaveText('bird');

  // Revert the pet type back to its initial value "dog"
  await ownerInformationPage.clickEditPet('Rosy');
  await expect(editPetPage.nameInput).toHaveValue('Rosy');
  await expect(editPetPage.typeReadOnlyField).toHaveValue('bird');

  await editPetPage.selectType('dog');
  await expect(editPetPage.typeReadOnlyField).toHaveValue('dog');
  await editPetPage.clickUpdate();

  await expect(ownerInformationPage.petType('Rosy')).toHaveText('dog');
});