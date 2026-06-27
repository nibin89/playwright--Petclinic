import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

    await page.goto('/')
    await page.getByRole('button', { name: 'Owners' }).click();
    await page.getByRole('link', { name: " Add New" }).click()

})


test('visual testing', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add Owner' })).toHaveScreenshot('add-owner-inactive.png');
    // Step 3: Fill out the form
    await page.getByLabel('First Name').fill('Nibin');
    await page.getByLabel('Last Name').fill('Test');
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByLabel('City').fill('Oshawa');
    await page.getByLabel('Telephone').fill('1234567890');
    await expect(page.getByRole('button', { name: 'Add Owner' })).toHaveScreenshot('add-owner-active.png')
})