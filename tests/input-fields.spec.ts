import { test, expect } from '@playwright/test';

/**
 * BEFORE EACH HOOK: Common test setup
 * Establishes a predictable starting state by navigating to Pet Types list and waiting for data load.
 */
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole("link", { name: "Pet Types" }).click();
});

/**
 * TEST: Update Pet Type
 * Purpose: Verify that pet type updates are successfully saved and persisted in the system
 * Strategy: Open edit form → Modify value → Submit → Verify persistence → Modify again → Verify final state
 * This validates both the update functionality and data persistence across multiple edit cycles
 */
test("Update Pet type", async ({ page }) => {
    // ========== STEP 1: Initial State - Verify Pet Types List ==========
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

    // ========== STEP 2: Open Edit Form for 'cat' Pet Type ==========
    await page.getByRole('row', { name: 'cat' }).getByRole('button', { name: 'Edit' }).click()

    // ========== STEP 3: Update Pet Type to 'rabbit' ==========
    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    await expect(page.locator('#name')).toHaveValue('cat')
    await page.locator('#name').fill('rabbit');

    // ========== STEP 4: Submit Update and Verify Persistence ==========
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByRole('row', { name: 'rabbit' }).getByRole('textbox')).toHaveValue('rabbit');

    // ========== STEP 5: Verify Second Update Cycle - Open Edit Form Again ==========
    await page.getByRole('row').nth(1).getByRole('button', { name: 'Edit' }).click();

    // ========== STEP 6: Update Pet Type Back to 'cat' ==========
    await expect(page.locator('#name')).toHaveValue('rabbit')
    await page.locator('#name').fill('cat');

    // ========== STEP 7: Submit Final Update and Verify Persistence ==========
    await page.getByRole("button", { name: "Update" }).click();

    await expect(page.getByRole('row').nth(1).locator('[id="0"]')).toHaveValue("cat");
});

/**
 * TEST: Cancel Pet Type Update
 * Purpose: Verify that Cancel button discards changes without persisting them
 * Strategy: Capture original → Modify → Cancel → Verify original unchanged
 */
test("Cancel Pet type update", async ({ page }) => {
    // ========== STEP 1: Initial State - Verify Pet Types List ==========
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

    // ========== STEP 2: Open Edit Form for 'dog' Pet Type ==========
    await page.getByRole('row', { name: 'dog' }).getByRole('button', { name: 'Edit' }).click()

    // ========== STEP 3: Make Changes Without Saving ==========
    await page.locator("#name").fill("moose")
    await expect(page.locator("#name")).toHaveValue("moose")

    // ========== STEP 4: Discard Changes via Cancel ==========
    await page.getByRole("button", { name: "Cancel" }).click()

    // ========== STEP 5: Verify Changes Were Not Persisted ==========
    await expect(page.getByRole('row', { name: 'dog' }).getByRole('textbox')).toHaveValue("dog")
});

/**
 * TEST: Validation of Pet Type Name (Required Field)
 * Purpose: Verify that the system prevents empty pet type names with a validation error
 * Strategy: Open edit form → Clear field → Submit → Verify error message → Cancel
 */
test("Validation of Pet type name is required", async ({ page }) => {


    // ========== STEP 1: Initial State - Verify Pet Types List ==========
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible();

    // ========== STEP 2: Open Edit Form for 'lizard' Pet Type ==========
    await page.getByRole('row', { name: 'lizar' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    // ========== STEP 3: Clear Required Field ==========
    await page.locator("#name").click()
    await page.locator("#name").fill("")
    await expect(page.locator(".help-block", { hasText: 'Name is required' })).toBeVisible()
    // ========== STEP 4: Attempt Submit and Verify Validation Error ==========
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByRole("heading", { name: "Edit Pet Type" })).toBeVisible();

    // ========== STEP 5: Cancel Form and Return to List ==========
    await page.getByRole("button", { name: "Cancel" }).click()
    await expect(page.getByRole("heading", { name: "Pet Types" })).toBeVisible()
})