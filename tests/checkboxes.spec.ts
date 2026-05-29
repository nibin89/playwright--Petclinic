import { test, expect } from '@playwright/test';

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

     await page.getByLabel("Surgery").uncheck()
     await page.getByLabel("dentistry").uncheck()

     await page.getByLabel("Radiology").uncheck()
     await page.getByLabel("Surgery").check()

     await expect(page.getByLabel("Surgery")).toBeVisible()

     await page.getByLabel("dentistry").check()

     await expect(page.locator("span.selected-specialties")).toContainText('Surgery, Dentistry');
 })