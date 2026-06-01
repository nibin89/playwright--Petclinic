import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole("link", { name: "Pet Types" }).click();
});

test("Validate selected specialities", async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole("link", { name: 'All' }).click();

    await page.getByRole('row', { name: 'Helen Leary' }).getByRole("button", { name: "Edit Vet" }).click();
    await expect(page.locator("span.selected-specialties")).toHaveText('Radiology');
    await page.locator("span.selected-specialties").click();
    await expect(page.getByRole('checkbox', { name: 'Radiology' })).toBeChecked();

    await page.getByRole('checkbox', { name: 'Surgery' }).uncheck();
    await page.getByRole('checkbox', { name: 'dentistry' }).uncheck();
    await page.getByRole('checkbox', { name: 'Surgery' }).check();
    await page.getByRole('checkbox', { name: 'Radiology' }).uncheck();

    await expect(page.getByRole('checkbox', { name: 'Surgery' })).toBeChecked();

    await page.getByRole('checkbox', { name: 'dentistry' }).check();

    await expect(page.locator("span.selected-specialties")).toHaveText('Surgery, Dentistry');
})

test("Select all specialities", async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole("link", { name: 'All' }).click();
    await page.getByRole('row', { name: 'Rafael Ortega' }).getByRole("button", { name: "Edit Vet" }).click();
    await expect(page.locator("span.selected-specialties")).toHaveText('Surgery');
    await page.locator("span.selected-specialties").click()

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check()
        expect(await box.isChecked()).toBeTruthy()
    }
    // Assert AFTER all checkboxes are checked
    await expect(page.locator("span.selected-specialties")).toHaveText('Surgery, Radiology, Dentistry')
})

test("Unselect all specialities", async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole("link", { name: 'All' }).click();
    await page.getByRole('row', { name: 'Linda Douglas' }).getByRole("button", { name: "Edit Vet" }).click();
    await expect(page.locator("span.selected-specialties")).toHaveText('Dentistry, Surgery');
    await page.locator("div.dropdown-display").click()
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.uncheck()
        expect(await box.isChecked()).toBeFalsy()
    }

    await expect(page.locator("span.selected-specialties")).toBeEmpty();
})
