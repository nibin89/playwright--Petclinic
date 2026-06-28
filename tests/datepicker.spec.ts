import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Owners' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
});

test("Select the desired state in calendar", async ({ page }) => {

  await page.getByRole('link', { name: "Harold Davis" }).click();
  await page.getByRole('button', { name: "Add New Pet" }).click()
  await page.waitForURL('**/pets/add', { timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'Add Pet' })).toBeVisible();
  await expect(page.locator('input#name + span')).toHaveClass(/glyphicon-remove/);
  await page.getByRole('textbox', { name: "Name" }).fill("Tom")
  await expect(page.locator('input#name + span')).toHaveClass(/glyphicon-ok/)
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await page.getByRole('button', { name: 'Choose month and year' }).click()
  await page.locator('.mat-calendar-previous-button').click();
  await page.getByText('2014', { exact: true }).click();
  await page.getByText('MAY', { exact: true }).click();
  await page.getByText('2', { exact: true }).click();

  await expect(page.locator('input[name="birthDate"]')).toHaveValue('2014/05/02');


  await page.getByRole('combobox', { name: 'Type' }).selectOption('dog');
  await page.getByRole('button', { name: 'Save Pet' }).click();
  const tomsPetSection = page.locator('app-pet-list', { hasText: 'Tom' })
  await expect(tomsPetSection.getByRole('term').filter({ hasText: 'Name' }).locator('+ dd')).toHaveText('Tom')
  await expect(tomsPetSection.getByRole('term').filter({ hasText: 'Birth Date' }).locator('+ dd')).toHaveText('2014-05-02')
  await expect(tomsPetSection.getByRole('term').filter({ hasText: 'Type' }).locator('+ dd')).toHaveText('dog')
  await tomsPetSection.getByRole('button', { name: 'Delete Pet' }).click()
  await expect(page.locator('app-pet-list', { hasText: 'Tom' })).toHaveCount(0);

})


test("Select the dates of visits and validate dates order", async ({ page }) => {

  const today = new Date()
  const todayInput = `${today.getFullYear()}/${today.toLocaleString('en-US', { month: '2-digit' })}/${today.toLocaleString('en-US', { day: '2-digit' })}`
  const todayFormatted = `${today.getFullYear()}-${today.toLocaleString('en-US', { month: '2-digit' })}-${today.toLocaleString('en-US', { day: '2-digit' })}`

  today.setDate(today.getDate() - 45)
  const pastInput = `${today.getFullYear()}/${today.toLocaleString('en-US', { month: '2-digit' })}/${today.toLocaleString('en-US', { day: '2-digit' })}`
  const pastMonthShort = `${today.toLocaleString('en-US', { month: '2-digit' })} ${today.getFullYear()}`




  await page.getByRole('link', { name: "Jean Coleman" }).click();
  const samanthaSection = page.locator('app-pet-list', { hasText: 'Samantha' })
  await samanthaSection.getByRole('button', { name: 'Add Visit' }).click()
  const samanthaVisitsTable = page.locator('table').filter({ hasText: 'Samantha' })
  await expect(samanthaVisitsTable.getByRole('cell').nth(0)).toHaveText('Samantha')
  await expect(samanthaVisitsTable.getByRole('cell').nth(3)).toHaveText('Jean Coleman')
  await page.getByRole('button', { name: 'Open calendar' }).click()
  await page.getByRole('button', { name: todayInput }).click()
  await expect(page.locator('input[name="date"]')).toHaveValue(todayInput)
  await page.locator('input[name="description"]').fill("dermatologists visit")
  await page.getByRole('button', { name: 'Add Visit' }).click()
  await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
  const samanthaVisits = samanthaSection.locator('app-visit-list').getByRole('row').filter({ has: page.getByRole('cell') })
  await expect(samanthaVisits.first().getByRole('cell').first()).toHaveText(todayFormatted)
  await samanthaSection.getByRole('button', { name: 'Add Visit' }).click()
  await page.getByRole('button', { name: 'Open calendar' }).click()
  let calendarMonthandYear = (await page.getByRole('button', { name: "Choose month and year" }).textContent())!
  while (!calendarMonthandYear.includes(pastMonthShort)) {
    await page.getByRole('button', { name: 'Previous month' }).click()
    calendarMonthandYear = (await page.getByRole('button', { name: 'Choose month and year' }).textContent())!
  }

  await page.getByRole('button', { name: pastInput }).click()
  await expect(page.locator('input[name="date"]')).toHaveValue(pastInput)
  await page.locator('input[name="description"]').fill("massage therapy")
  await page.getByRole('button', { name: 'Add Visit' }).click()
  await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible()
  const firstVisitdate = await samanthaVisits.first().getByRole('cell').first().innerText()
  const secondVisitdate = await samanthaVisits.nth(1).getByRole('cell').first().innerText()
  const firstVisitDate = new Date(firstVisitdate)
  const secondVisitDate = new Date(secondVisitdate)
  expect(firstVisitDate > secondVisitDate).toBeTruthy()
  await samanthaVisits.filter({ hasText: 'dermatologists visit' }).getByRole('button', { name: 'Delete Visit' }).click()
  await samanthaVisits.filter({ hasText: 'massage therapy' }).getByRole('button', { name: 'Delete Visit' }).click()
  await expect(samanthaVisits.filter({ hasText: 'dermatologists visit' })).toHaveCount(0)
  await expect(samanthaVisits.filter({ hasText: 'massage therapy' })).toHaveCount(0)
})