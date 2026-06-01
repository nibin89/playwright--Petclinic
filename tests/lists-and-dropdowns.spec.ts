import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Navigate to Owners search page - reused across all tests in this file
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByRole("link", { name: "Search" }).click();
});

test("Validate selected Pet  types from the list", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Owners" })).toBeVisible();
  await page.getByRole("link", { name: "George Franklin" }).click();
  await expect(
    page.getByRole("heading", { name: "Pets and Visits" }),
  ).toBeVisible();
  await page
    .getByRole("row")
    .filter({ hasText: "Leo" })
    .getByRole("button", { name: "Edit Pet" })
    .click();
  await page.getByRole("heading", { name: " Pet " }).isVisible();
  await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
  await expect(page.locator("#type1")).toHaveValue("cat");

  const typeDropdown = page.locator("#type");
  const options = await typeDropdown.locator("option").allInnerTexts();
  const typeTextBox = page.locator("#type1");

  for (const option of options) {
    await typeDropdown.selectOption(option);
    await expect(typeTextBox).toHaveValue(option);
  }
});
test("Validate pet type update", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Owners" })).toBeVisible();
  await page.getByRole("link", { name: "Eduardo Rodriquez" }).click();
  await expect(
    page.getByRole("heading", { name: "Pets and Visits" }),
  ).toBeVisible();
  await page
    .locator("dl")
    .filter({ hasText: "Rosy" })
    .getByRole("button", { name: "Edit Pet" })
    .click();
  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(page.locator("#type1")).toHaveValue("dog");
  await page.locator("#type").selectOption("bird");
  await expect(page.locator("#type1")).toHaveValue("bird");
  await page.getByRole("button", { name: "Update Pet" }).click();
  await expect(
    page.getByRole("heading", { name: "Owner Information" }),
  ).toBeVisible();
  await expect(page.locator("dl").filter({ hasText: "Rosy" })).toContainText(
    "bird",
  );
  /* Revert the selection of the pet type "bird" to its initial value 
    "dog" */
  await page
    .locator("dl")
    .filter({ hasText: "Rosy" })
    .getByRole("button", { name: "Edit Pet" })
    .click();
  await expect(page.locator("#name")).toHaveValue("Rosy");
  await expect(page.locator("#type1")).toHaveValue("bird");
  await page.locator("#type").selectOption("dog");
  await expect(page.locator("#type1")).toHaveValue("dog");
  await page.getByRole("button", { name: "Update Pet" }).click();
  await expect(page.locator("dl").filter({ hasText: "Rosy" })).toContainText(
    "dog",
  );
});
