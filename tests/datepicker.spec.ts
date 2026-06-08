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

const today = new Date()
const todaydateInput  = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`   // "2026/06/07"
const todayOnPage = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

const pastDate = new Date()
  pastDate.setDate(today.getDate() - 45)
  const pastYear       = String(pastDate.getFullYear())
  const pastMonth      = String(pastDate.getMonth()+1).padStart(2,'0')
  const pastDay        = String(pastDate.getDate()).padStart(2,'0')
  const pastDateInput  = `${pastYear}/${pastMonth}/${pastDay}`
  const pastDateOnPage = `${pastYear}-${pastMonth}-${pastDay}`
  const pastMonthShort = `${pastMonth} ${pastYear}`




await page.getByRole('link', { name: "Jean Coleman" }).click();
const samanthaSection = page.locator('app-pet-list').filter({ hasText: 'Samantha' })
await samanthaSection.getByRole('button', { name: 'Add Visit' }).click()
await expect(page.getByRole('heading', { name: 'New Visit' })).toBeVisible()
await expect(page.getByRole('cell', { name: 'Samantha' })).toBeVisible()
await expect(page.getByRole('cell', { name: 'Jean Coleman' })).toBeVisible()
await page.getByRole('button', { name: 'Open calendar' }).click()
await page.getByRole('button', { name: todaydateInput }).click()
await expect(page.locator('input[name="date"]')).toHaveValue(todaydateInput)
await page.locator('input[name="description"]').fill("dermatologists visit")
await page.getByRole('button',  { name: 'Add Visit' }).click()
await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
const samanthaVisits = samanthaSection.locator('app-visit-list').getByRole('row').filter({ has: page.getByRole('cell') })
await expect(samanthaVisits.first().getByRole('cell').first()).toHaveText(todayOnPage)
await samanthaSection.getByRole('button', { name: 'Add Visit' }).click()
await page.getByRole('button', { name: 'Open calendar' }).click()
let calendarMonthandYear = await page.getByRole('button', {name:"Choose month and year"}).textContent()||""

while (!calendarMonthandYear.includes(pastMonthShort)) {
  await page.getByRole('button', { name: 'Previous month' }).click()
  calendarMonthandYear = await page.getByRole('button', { name: 'Choose month and year' }).textContent() || ""
}

await page.getByRole('button', { name: pastDateInput }).click()
await expect(page.locator('input[name="date"]')).toHaveValue(pastDateInput)
await page.locator('input[name="description"]').fill("massage therapy")
await page.getByRole('button',  { name: 'Add Visit' }).click()
await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
const firstVisitdate  = await samanthaVisits.first().getByRole('cell').first().innerText()
const secondVisitdate = await samanthaVisits.nth(1).getByRole('cell').first().innerText()
const firstVisitDate  = new Date(firstVisitdate)
const secondVisitDate = new Date(secondVisitdate)
expect(firstVisitDate > secondVisitDate).toBeTruthy()
await samanthaVisits.filter({ hasText: 'dermatologists visit' }).getByRole('button', { name: 'Delete Visit' }).click()
await samanthaVisits.filter({ hasText: 'massage therapy' }).getByRole('button', { name: 'Delete Visit' }).click()
await expect(samanthaVisits.filter({ hasText: 'dermatologists visit' })).toHaveCount(0)
await expect(samanthaVisits.filter({ hasText: 'massage therapy' })).toHaveCount(0)
})