import { test, expect } from '@playwright/test';

/**
 * BEFORE EACH HOOK: Common test setup
 * Establishes a predictable starting state by navigating to Pet Types list and waiting for data load.
 * This prevents race conditions where tests execute before the backend API responds.
 */
test.beforeEach(async ({ page }) => {
    await page.goto('https://petclinic.bondaracademy.com/');


    await expect(page.locator('app-loading-spinner')).toBeHidden();

    // Wait for API response before proceeding to avoid race conditions
    const petTypesResponse = page.waitForResponse(response =>
        response.url().includes('/pettypes') && response.status() === 200
    );

    await page.getByRole("link", { name: "Pet Types" }).click();
    await petTypesResponse;
});

/**
 * TEST: Update Pet Type
 * Purpose: Verify that pet type updates persist and test data restoration for cleanup
 * Strategy: Capture original value → Update → Verify → Restore original → Verify restoration
 */
test("Update Pet type", async ({ page }) => {
    const HEADER_ROW_INDEX = 0;
    const FIRST_DATA_ROW_INDEX = 1;
    const TEST_VALUE = "rabbit";

    // ========== STEP 1: Initial State - Capture Original Value ==========
    const header = page.getByRole("heading", { name: "Pet Types", level: 2 });
    await expect(header).toBeVisible();

    const firstRow = page.getByRole('row').nth(FIRST_DATA_ROW_INDEX);
    await expect(firstRow).toBeVisible();

    const originalValue = await firstRow.locator('input[name="pettype_name"]').inputValue();

    // ========== STEP 2: Navigate to Edit Form ==========
    const editViewResponse = page.waitForResponse(response =>
        response.url().includes('/pettypes') && response.status() === 200
    );

    await firstRow.getByRole('button', { name: 'Edit' }).click();
    await editViewResponse;

    // ========== STEP 3: Update Pet Type ==========
    const editPetTypeHeading = page.getByRole("heading", { name: "Edit Pet Type", level: 2 });
    await expect(editPetTypeHeading).toBeVisible();

    const editInput = page.locator('#name');
    await editInput.waitFor({ state: 'visible' });
    await editInput.clear();
    await editInput.fill(TEST_VALUE);

    // ========== STEP 4: Submit Update and Verify Persistence ==========
    const saveResponse = page.waitForResponse(response =>
        response.url().includes('/pettypes') && (response.status() === 200 || response.status() === 204)
    );

    await page.getByRole("button", { name: "Update" }).click();
    await saveResponse;

    // 10s timeout allows for server processing and re-render
    await expect(header).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('row').nth(FIRST_DATA_ROW_INDEX).locator('input[name="pettype_name"]')).toHaveValue(TEST_VALUE);

    // ========== STEP 5: Restore Original Value (Cleanup) ==========
    const cleanupEditResponse = page.waitForResponse(response =>
        response.url().includes('/pettypes') && response.status() === 200
    );

    await page.getByRole('row').nth(FIRST_DATA_ROW_INDEX).getByRole('button', { name: 'Edit' }).click();
    await cleanupEditResponse;

    await expect(editPetTypeHeading).toBeVisible();
    await editInput.clear();
    await editInput.fill(originalValue);

    const revertResponse = page.waitForResponse(response =>
        response.url().includes('/pettypes') && (response.status() === 200 || response.status() === 204)
    );

    await page.getByRole("button", { name: "Update" }).click();
    await revertResponse;

    // ========== STEP 6: Verify Restoration Complete ==========
    await expect(header).toBeVisible();
    await expect(page.getByRole('row').nth(FIRST_DATA_ROW_INDEX).locator('input[name="pettype_name"]')).toHaveValue(originalValue);
});
/**
 * TEST: Cancel Pet Type Update
 * Purpose: Verify that Cancel button discards changes without persisting them
 * Strategy: Capture original → Modify → Cancel → Verify original unchanged
 */
test("Cancel Pet type update", async ({ page }) => {
    const SECOND_DATA_ROW_INDEX = 2;
    const EXPECTED_ORIGINAL = 'dog';
    const TEST_VALUE = "moose";

    // ========== STEP 1: Initial State - Capture Original Value ==========
    const header = page.getByRole("heading", { name: "Pet Types", level: 2 })
    await expect(header).toBeVisible()

    const secondRow = page.getByRole('row').nth(SECOND_DATA_ROW_INDEX)
    await expect(secondRow).toBeVisible()

    const originalValue = await secondRow.locator('input[name="pettype_name"]').inputValue()

    // ========== STEP 2: Open Edit Form ==========
    await secondRow.getByRole('button', { name: 'Edit' }).click()

    // ========== STEP 3: Make Changes (Without Saving) ==========
    const editPetTypeHeading = page.getByRole("heading", { name: "Edit Pet Type", level: 2 })
    await expect(editPetTypeHeading).toBeVisible()

    const nameInput = page.locator("#name")
    await nameInput.waitFor({ state: 'visible' });
    await nameInput.clear()
    await nameInput.press('Control+A')
    await nameInput.pressSequentially(TEST_VALUE)
    await expect(nameInput).toHaveValue(TEST_VALUE)

    // ========== STEP 4: Discard Changes via Cancel ==========
    await page.getByRole("button", { name: "Cancel" }).click()

    // 1s timeout sufficient since we're just verifying UI navigation
    await expect(header).toBeVisible({ timeout: 1000 })

    // ========== STEP 5: Verify Changes Were Not Persisted ==========
    // If Cancel worked correctly, the original value remains in the list
    expect(originalValue).toEqual(EXPECTED_ORIGINAL)
    await expect(secondRow.locator('input[name="pettype_name"]')).toHaveValue(originalValue)
});

/**
 * TEST: Validation of Pet Type Name (Required Field)
 * Purpose: Verify that the system prevents empty pet type names with a validation error
 * Strategy: Open edit form → Clear field → Submit → Verify error message → Cancel
 */
test("Validation of Pet type name is required", async ({ page }) => {
    const THIRD_DATA_ROW_INDEX = 3;
    const ERROR_MESSAGE = 'Name is required';

    // ========== STEP 1: Initial State ==========
    const header = page.getByRole("heading", { name: "Pet Types", level: 2 })
    await expect(header).toBeVisible()

    const thirdRow = page.getByRole('row').nth(THIRD_DATA_ROW_INDEX)
    await expect(thirdRow).toBeVisible()

    // ========== STEP 2: Open Edit Form ==========
    await thirdRow.getByRole('button', { name: 'Edit' }).click();

    // 10s timeout allows for form to fully render
    const editPetTypeHeading = page.getByRole("heading", { name: "Edit Pet Type", level: 2 });
    await expect(editPetTypeHeading).toBeVisible({ timeout: 10000 });

    // ========== STEP 3: Clear Required Field ==========
    const nameInput = page.locator("#name")
    await nameInput.waitFor({ state: 'visible' });
    await nameInput.clear()
    await nameInput.press('Control+A')
    await nameInput.press('Delete')
    // ========== STEP 4: Attempt Submit and Verify Validation Error ==========
    await page.getByRole("button", { name: "Update" }).click();

    const errorMessage = page.locator(".help-block").getByText(ERROR_MESSAGE, { exact: false })
    // 5s timeout for validation error to appear
    await expect(errorMessage).toBeVisible({ timeout: 5000 })

    // ========== STEP 5: Cancel Form ==========
    await page.getByRole("button", { name: "Cancel" }).click()

    // 3s timeout sufficient for navigation back to list
    await expect(header).toBeVisible({ timeout: 3000 })
})