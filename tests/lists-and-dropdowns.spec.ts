import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')

})

test('Validate selected Pet  types from the list', async ({ page }) => {

    const dropDown = page.locator(".nav.navbar-nav")
    await dropDown.getByRole("button", { name: " Owners" }).click()
    await dropDown.getByText(" Search").click()
    await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible()
    await page.getByRole('link', { name: 'George Franklin' }).click()
    await expect(page.getByRole('heading', { name: 'Pets and Visits' })).toBeVisible()
    await page.getByRole('row').filter({ hasText: 'Leo' })
        .getByRole('button', { name: 'Edit Pet' }).click();
    await page.getByRole("heading", { name: " Pet " }).isVisible()
    await expect(page.locator("#owner_name")).toHaveValue("George Franklin")
    await expect(page.locator("#type1")).toHaveValue("cat")

    const typeDropdown = page.locator('#type');
    const options = await typeDropdown.locator('option').allInnerTexts()
    const typeTextBox = page.locator('#type1');

    for (const option of options) {
        await typeDropdown.selectOption(option)
        await expect(typeTextBox).toHaveValue(option)

    }

});