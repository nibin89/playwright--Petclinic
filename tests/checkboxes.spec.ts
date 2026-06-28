import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole("link", { name: "Pet Types" }).click();
});

test("Validate selected specialities", async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole("link", { name: 'All' }).click();

    await page.getByRole('row', { name: 'Helen Leary' }).getByRole("button", { name: "Edit Vet" }).click();
    await expect(page.locator(".selected-specialties")).toHaveText('radiology');
    await page.locator(".selected-specialties").click();
    await expect(page.getByRole('checkbox', { name: 'radiology' })).toBeChecked();

    await page.getByRole('checkbox', { name: 'surgery' }).uncheck();
    await page.getByRole('checkbox', { name: 'denistry' }).uncheck();
    await page.getByRole('checkbox', { name: 'surgery' }).check();
    await page.getByRole('checkbox', { name: 'radiology' }).uncheck();

    await expect(page.getByRole('checkbox', { name: 'surgery' })).toBeChecked();

    await page.getByRole('checkbox', { name: 'denistry' }).check();

    await expect(page.locator(".selected-specialties")).toHaveText('surgery, denistry');
})

test("Select all specialities", async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole("link", { name: 'All' }).click();
    await page.getByRole('row', { name: 'Rafael Ortega' }).getByRole("button", { name: "Edit Vet" }).click();
    await expect(page.locator(".selected-specialties")).toHaveText('surgery');
    await page.locator(".selected-specialties").click()

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check()
        expect(await box.isChecked()).toBeTruthy()
    }
    // Assert AFTER all checkboxes are checked
    await expect(page.locator(".selected-specialties")).toHaveText('surgery, radiology, denistry')
})

test("Unselect all specialities", async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole("link", { name: 'All' }).click();
    await page.getByRole('row', { name: 'Linda Douglas' }).getByRole("button", { name: "Edit Vet" }).click();
    await expect(page.locator(".selected-specialties")).toHaveText('denistry, surgery');
    await page.locator("div.dropdown-display").click()
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.uncheck()
        expect(await box.isChecked()).toBeFalsy()
    }

    await expect(page.locator(".selected-specialties")).toBeEmpty();
})
