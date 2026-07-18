import { test, expect } from './fixtures';

test.beforeEach(async ({ homePage }) => {
  await homePage.goto();
});

test('Add and Delete Pet Types @Smoke', async ({ homePage, petTypesPage, newPetTypePage }) => {
  await homePage.goToPetTypes();
  await expect(petTypesPage.heading).toHaveText('Pet Types');

  await petTypesPage.clickAdd();
  await expect(newPetTypePage.heading).toHaveText('New Pet Type');
  await expect(newPetTypePage.nameLabel).toBeVisible();
  await expect(newPetTypePage.nameInput).toBeVisible();

  await newPetTypePage.fillName('pig');
  await newPetTypePage.save();

  await expect(petTypesPage.lastRow().getByRole('textbox')).toHaveValue('pig');

  await petTypesPage.deleteRow(petTypesPage.rowByName('pig').last());

  expect(petTypesPage.getLastDialogMessage()).toEqual('Delete the pet type?');
  await expect(petTypesPage.lastRow().getByRole('textbox')).not.toHaveValue('pig');
});