import { test, expect } from './fixtures';

test('Test with fixture', async ({ ownerInformationPage, owner }) => {
    await ownerInformationPage.gotoOwner(owner.id);

    await ownerInformationPage.deleteVisit(owner.visitDescription);
    await expect(ownerInformationPage.page.getByText(owner.visitDescription)).not.toBeVisible();

    await ownerInformationPage.deletePet(owner.petName);
    await expect(
        ownerInformationPage.page.getByRole('row', { name: `Name ${owner.petName}`, exact: true })
    ).not.toBeVisible();
});