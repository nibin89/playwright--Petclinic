import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole("link", { name: "Pet Types" }).click();
});

test("Update Pet type", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

    await page.getByRole('row', { name: 'cat' }).getByRole('button', { name: 'Edit' }).click()

    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    await expect(page.locator('#name')).toHaveValue('cat')
    await page.locator('#name').fill('rabbit');

    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.locator('[id="0"]')).toHaveValue('rabbit')

    await page.getByRole('row').nth(1).getByRole('button', { name: 'Edit' }).click();

    await expect(page.locator('#name')).toHaveValue('rabbit')
    await page.locator('#name').fill('cat');

    await page.getByRole("button", { name: "Update" }).click();

    await expect(page.locator('[id="0"]')).toHaveValue('cat');
});

test("Cancel Pet type update", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

<<<<<<< HEAD
    await page.locator('tr').filter({ has: page.locator('[id="1"]') }).getByRole('button', { name: 'Edit' }).click()

    await expect(page.locator("#name")).toHaveValue("dog");
=======
    await page.getByRole('row', { name: 'dog' }).getByRole('button', { name: 'Edit' }).click()

    await expect(page.locator("#name")).toHaveValue("dog")
>>>>>>> 0d0f3ff140ae04cd2b73617b6e8062f3b88f00cf
    await page.locator("#name").fill("moose")

    await page.getByRole("button", { name: "Cancel" }).click()

<<<<<<< HEAD
    await expect(page.locator('tr').filter({ has: page.locator('[id="1"]') }).getByRole('textbox')).toHaveValue("dog");
});

test("Validation of Pet type name is required", async ({ page }) => {


    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

    await page.locator('tr').filter({ has: page.locator('[id="2"]') }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    
    await page.locator("#name").clear()
=======
    await expect(page.locator('[id="1"]')).toHaveValue("dog")
});

test("Validation of Pet type name is required", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

    await page.getByRole('row', { name: 'lizar' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    await expect(page.getByRole("textbox")).toHaveValue("lizar")
    await page.locator("#name").clear()

>>>>>>> 0d0f3ff140ae04cd2b73617b6e8062f3b88f00cf
    await expect(page.locator(".help-block", { hasText: 'Name is required' })).toBeVisible()
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click()
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible()
})