import { test, expect } from './fixtures';

test('Test with fixture', async ({ page, owner }) => {

    await page.goto(`/owners/${owner.id}`);

    const visitRow = page.getByRole('row', { name: owner.visitDescription });

    await visitRow.getByRole('button', { name: 'Delete Visit' }).click();
    await expect(page.getByText(owner.visitDescription)).not.toBeVisible();

    const petRow = page.getByRole('row', { name: owner.petName }).last();

    await petRow.getByRole('button', { name: 'Delete Pet' }).click();
    await expect(
        page.getByRole('row', { name: `Name ${owner.petName}`, exact: true })
    ).not.toBeVisible();
});