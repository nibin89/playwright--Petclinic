import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Navigate to Owners search page - reused across all tests in this file
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: "Search" }).click();
});

test("Validate selected Pet  types from the list", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Owners" })).toHaveText(
    "Owners",
  );
  await page.getByRole("link", { name: "George Franklin" }).click();
  await expect(page.locator(".ownerFullName")).toHaveText("George Franklin");
  await page
    .locator("app-pet-list", { hasText: "Leo" })
    .getByRole("button", { name: "Edit Pet" })
    .click();
  await expect(page.getByRole("heading", { name: " Pet " })).toHaveText("Pet");
  await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
  await expect(page.locator("#type1")).toHaveValue("cat");

  const petTypeDropdown = page.locator("#type");
  const options = await petTypeDropdown.locator("option").allInnerTexts();
  const petTypeReadOnlyField = page.locator("#type1");

  for (const option of options) {
    await petTypeDropdown.selectOption(option);
    await expect(petTypeReadOnlyField).toHaveValue(option);
  }
});
test("Validate pet type update", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Owners" })).toHaveText(
    "Owners",
  );
  await page.getByRole("link", { name: "Eduardo Rodriquez" }).click();
  await expect(
    page.getByRole("heading", { name: "Pets and Visits" }),
  ).toBeVisible();
  const rosyPetSection = page.locator("app-pet-list", { hasText: "Rosy" });
  await rosyPetSection.getByRole("button", { name: "Edit Pet" }).click();
  const petTypeReadOnlyField = page.locator("#type1");
  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(petTypeReadOnlyField).toHaveValue("dog");
  await page.locator("#type").selectOption("bird");
  await expect(petTypeReadOnlyField).toHaveValue("bird");
  await page.getByRole("button", { name: "Update Pet" }).click();
  await expect(
    page.getByRole("heading", { name: "Owner Information" }),
  ).toBeVisible();
  await expect(rosyPetSection.locator('dt:has-text("Type") + dd')).toHaveText(
    "bird",
  );
  /* Revert the selection of the pet type "bird" to its initial value 
    "dog" */
  await rosyPetSection.getByRole("button", { name: "Edit Pet" }).click();
  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(petTypeReadOnlyField).toHaveValue("bird");
  await page.locator("#type").selectOption("dog");
  await expect(petTypeReadOnlyField).toHaveValue("dog");
  await page.getByRole("button", { name: "Update Pet" }).click();
  await expect(rosyPetSection.locator('dt:has-text("Type") + dd')).toHaveText(
    "dog",
  );
});
