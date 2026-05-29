import { test, expect } from '@playwright/test';
/**
 * BEFORE EACH HOOK: Common test setup
 * Establishes a predictable starting state by navigating to Pet Types list and waiting for data load.
 */
test.beforeEach(async ({ page }) => {
     await page.goto('/');
     await page.getByRole("link", { name: "Pet Types" }).click();
});
 
test("Validate selected specialities", async ({ page }) => {
 
     const MenuDropDown = page.locator(".dropdown")
     await MenuDropDown.getByRole('button', { name: 'Veterinarians' }).click();
     await MenuDropDown.getByRole("link", { name: 'All' }).click()
 
     const vetsName = page.locator("#vets")
     await vetsName.getByRole('row', { name: 'Helen Leary' }).getByRole("button", { name: "Edit Vet" }).click()
     await expect(page.locator("span.selected-specialties", { hasText: 'Radiology' })).toBeVisible()
     await page.locator("span.selected-specialties", { hasText: 'Radiology' }).click()
     await page.getByLabel("Radiology").isChecked()
 
     // ========== STEP 4: Uncheck Initial Specialties ==========
      expect(page.getByLabel("Surgery").uncheck())
      expect(page.getByLabel("dentistry").uncheck())
 
     // ========== STEP 5: Toggle Specialty Selections ==========
        await page.getByLabel("Radiology").uncheck()
        await page.getByLabel("Surgery").check()
 
     // ========== STEP 6: Verify Surgery Checkbox State ==========
     await expect(page.getByLabel("Surgery")).toBeVisible()
 
     // ========== STEP 7: Check Dentistry Specialty ==========
     await page.getByLabel("dentistry").check()
 
     // ========== STEP 8: Verify Final Selected Specialties Display ==========
     await expect(page.locator("span.selected-specialties")).toContainText('Surgery, Dentistry');
 })