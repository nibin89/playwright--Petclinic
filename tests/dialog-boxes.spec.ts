import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Add and Delete Pet Types", async ({ page }) => {
  await page.getByRole("link", { name: "Pet Types" }).click();
  await expect(page.getByRole("heading", { name: "Pet Types" })).toHaveText(
    "Pet Types",
  );
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByRole("heading", { name: "New Pet Type" })).toHaveText(
    "New Pet Type",
  );
  await expect(page.locator("label").filter({ hasText: "Name" })).toBeVisible(); //getByLabel("Name") won't work because the label is not properly associated with the input.
  await expect(page.locator("#name")).toBeVisible(); //since there are multiple textbox's in the page, id is used
  await page.locator("#name").fill("pig");
  await page.getByRole("button").filter({ hasText: "Save" }).click();
  await expect(page.getByRole("row").last().getByRole("textbox")).toHaveValue(
    "pig",
  );
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Delete the pet type?");
    dialog.accept();
     });
  await page
    .getByRole("row", { name: "pig" })
    .last()
    .getByRole("button", { name: "Delete" })
    .click();
 
  await expect(page.getByRole("row").last().getByRole("textbox")).not.toHaveValue("pig");
});
