import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Owners' }).click();
    await page.getByRole('link', { name: ' Add New' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Add Owner' }).waitFor({ state: 'visible' });
});

test('visual testing', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'Add Owner' });
    await page.waitForLoadState('networkidle');
    await expect(addButton).toHaveScreenshot({ name: 'add-owner-inactive.png', maxDiffPixelRatio: 0.2 });

    // Fill out the form
    await page.getByLabel('First Name').fill('Nibin');
    await page.getByLabel('Last Name').fill('Test');
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByLabel('City').fill('Oshawa');
    await page.getByLabel('Telephone').fill('1234567890');

    await expect(addButton).toBeEnabled();
    await expect(addButton).toHaveScreenshot({ name: 'add-owner-active.png', maxDiffPixelRatio: 0.2 });
});