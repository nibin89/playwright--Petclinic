import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Owners' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
});

test("Select the desired state in calendar", async({page})=> {

  await page.getByRole('link', { name: "Harold Davis" }).click();
  await page.getByRole('button', {name:"Add New Pet"}).click()
  await expect(page.getByRole('heading', { name: 'Add Pet' })).toBeVisible();
  await expect(page.locator('.glyphicon.form-control-feedback.glyphicon-remove').first()).toBeVisible();
  await page.getByRole('textbox', {name: "Name"}).fill("Tom")
  await expect(page.locator('.glyphicon.form-control-feedback.glyphicon-ok')).toBeVisible();
  await page.getByRole('button', { name: 'Open calendar' }).click();

  const expectedDate="May 2, 2014"
  const date = new Date(expectedDate)
  const month = String(date.getMonth()+1).padStart(2, '0') 
  //const monthName = String(date.toLocaleString('en-US', { month: 'short' }).toUpperCase()) //to remove  not reused
  const year = String(date.getFullYear())
  const day = String(date.getDate()).padStart(2,'0') 
  const dateToAssert = `${year}/${month}/${day}`
  const expectedDateShort = `${month} ${year}`
 
await page.getByRole('button', { name: 'Choose month and year' }).click();

while (!await page.getByRole('button', { name: year }).isVisible()) {
  await page.locator('.mat-calendar-previous-button').click();
}

await page.getByRole('button', { name: year}).click();
await page.getByRole('button', { name: expectedDateShort }).click();
await page.getByRole('button', { name: dateToAssert }).click();
await expect(page.locator('input[name="birthDate"]')).toHaveValue(dateToAssert);


await page.getByRole('combobox', { name: 'Type' }).selectOption('dog');
await page.getByRole('button', { name: 'Save Pet' }).click();
const tomspetSection = page.locator('app-pet-list').filter({ hasText: 'Tom' })
await expect(tomspetSection.locator('dd').filter({ hasText: 'Tom' })).toBeVisible();
await expect(tomspetSection.locator('dd').filter({ hasText: '2014-05-02' })).toBeVisible();
await expect(tomspetSection.locator('dd').filter({ hasText: 'dog' })).toBeVisible();
await(tomspetSection.getByRole('button', { name: 'Delete Pet'})).click()
await expect(page.locator('app-pet-list').filter({ hasText: 'Tom' })).toHaveCount(0);

})


test("Select the dates of visits and validate dates order",async({page}) => {
await page.getByRole('link', { name: "Jean Coleman" }).click();

})
