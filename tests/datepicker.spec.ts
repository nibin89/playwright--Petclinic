import { test, expect } from './fixtures';
import { Datepicker } from '../pages/Datepicker';

test.beforeEach(async ({ page, ownersPage }) => {
    await page.goto('/');
    await ownersPage.goto();
});

test("Select the desired state in calendar", async ({ ownersPage, ownerInformationPage, addPetPage }) => {

    await ownersPage.openOwner('George Franklin');
    await ownerInformationPage.addNewPet();
    await expect(addPetPage.heading).toBeVisible();
    await expect(addPetPage.nameValidationIcon).toHaveClass(/glyphicon-remove/);
    await addPetPage.fillName('Tom');
    await expect(addPetPage.nameValidationIcon).toHaveClass(/glyphicon-ok/);
    await addPetPage.openCalendar();
    await addPetPage.selectDateByComponents('2014', 'MAY', '2');

    await expect(addPetPage.birthDateValue()).toHaveValue('2014/05/02');

    await addPetPage.selectType('dog');
    await addPetPage.save();

    const tomsPetSection = ownerInformationPage.petSection('Tom');
    await expect(tomsPetSection.getByRole('term').filter({ hasText: 'Name' }).locator('+ dd')).toHaveText('Tom');
    await expect(tomsPetSection.getByRole('term').filter({ hasText: 'Birth Date' }).locator('+ dd')).toHaveText('2014-05-02');
    await expect(tomsPetSection.getByRole('term').filter({ hasText: 'Type' }).locator('+ dd')).toHaveText('dog');
    await tomsPetSection.getByRole('button', { name: 'Delete Pet' }).click();
    await expect(ownerInformationPage.page.locator('app-pet-list', { hasText: 'Tom' })).toHaveCount(0);

});


test("Select the dates of visits and validate dates order", async ({ ownersPage, ownerInformationPage }) => {

    const today = new Date();
    const todayInput = `${today.getFullYear()}/${today.toLocaleString('en-US', { month: '2-digit' })}/${today.toLocaleString('en-US', { day: '2-digit' })}`;
    const todayFormatted = `${today.getFullYear()}-${today.toLocaleString('en-US', { month: '2-digit' })}-${today.toLocaleString('en-US', { day: '2-digit' })}`;

    today.setDate(today.getDate() - 45);
    const pastInput = `${today.getFullYear()}/${today.toLocaleString('en-US', { month: '2-digit' })}/${today.toLocaleString('en-US', { day: '2-digit' })}`;
    const pastMonthShort = `${today.toLocaleString('en-US', { month: '2-digit' })} ${today.getFullYear()}`;

    await ownersPage.openOwner('Jean Coleman');
    const samanthaSection = ownerInformationPage.petSection('Samantha');
    await samanthaSection.getByRole('button', { name: 'Add Visit' }).click();

    const samanthaVisitsTable = ownerInformationPage.page.locator('table').filter({ hasText: 'Samantha' });
    await expect(samanthaVisitsTable.getByRole('cell').nth(0)).toHaveText('Samantha');
    await expect(samanthaVisitsTable.getByRole('cell').nth(3)).toHaveText('Jean Coleman');

    const datepicker = new Datepicker(ownerInformationPage.page);
    await datepicker.open();
    await datepicker.selectDateByButtonName(todayInput);
    await expect(ownerInformationPage.page.locator('input[name="date"]')).toHaveValue(todayInput);
    await ownerInformationPage.page.locator('input[name="description"]').fill('dermatologists visit');
    await ownerInformationPage.page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(ownerInformationPage.page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();

    const samanthaVisits = samanthaSection.locator('app-visit-list').getByRole('row').filter({ has: ownerInformationPage.page.getByRole('cell') });
    await expect(samanthaVisits.first().getByRole('cell').first()).toHaveText(todayFormatted);

    await samanthaSection.getByRole('button', { name: 'Add Visit' }).click();
    await datepicker.open();
    await datepicker.openMonthYearPicker();

    let calendarMonthandYear = (await datepicker.chooseMonthAndYearButton.textContent())!;
    while (!calendarMonthandYear.includes(pastMonthShort)) {
        await datepicker.clickPreviousYearRange();
        calendarMonthandYear = (await datepicker.chooseMonthAndYearButton.textContent())!;
    }

    await datepicker.selectDateByButtonName(pastInput);
    await expect(ownerInformationPage.page.locator('input[name="date"]')).toHaveValue(pastInput);
    await ownerInformationPage.page.locator('input[name="description"]').fill('massage therapy');
    await ownerInformationPage.page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(ownerInformationPage.page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();

    const firstVisitdate = await samanthaVisits.first().getByRole('cell').first().innerText();
    const secondVisitdate = await samanthaVisits.nth(1).getByRole('cell').first().innerText();
    const firstVisitDate = new Date(firstVisitdate);
    const secondVisitDate = new Date(secondVisitdate);
    expect(firstVisitDate > secondVisitDate).toBeTruthy();
    await samanthaVisits.filter({ hasText: 'dermatologists visit' }).getByRole('button', { name: 'Delete Visit' }).click();
    await samanthaVisits.filter({ hasText: 'massage therapy' }).getByRole('button', { name: 'Delete Visit' }).click();
    await expect(samanthaVisits.filter({ hasText: 'dermatologists visit' })).toHaveCount(0);
    await expect(samanthaVisits.filter({ hasText: 'massage therapy' })).toHaveCount(0);
});
