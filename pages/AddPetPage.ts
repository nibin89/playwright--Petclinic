import { Page, Locator } from '@playwright/test';
import { Datepicker } from './Datepicker';
import { formatInputDate } from '../utils/dateUtils';
import { BasePage } from './BasePage';

export class AddPetPage extends BasePage {
    readonly pageHeading: Locator;
    readonly heading: Locator;
    readonly petNameInput: Locator;
    readonly petNameValidationIcon: Locator;
    readonly nameValidationIcon: Locator;
    readonly petTypeSelect: Locator;
    readonly savePetButton: Locator;
    readonly datepicker: Datepicker;

    constructor(page: Page) {
        super(page);
        this.pageHeading = page.getByRole('heading', { name: 'Add Pet' });
        this.heading = this.pageHeading;
        this.petNameInput = page.getByRole('textbox', { name: 'Name' });
        this.petNameValidationIcon = page.locator('input#name + span');
        this.nameValidationIcon = this.petNameValidationIcon;
        this.petTypeSelect = page.getByRole('combobox', { name: 'Type' });
        this.savePetButton = page.getByRole('button', { name: 'Save Pet' });
        this.datepicker = new Datepicker(page);
    }

    async fillName(name: string) {
        await this.fill(this.petNameInput, name);
    }

    async nameIsValid(): Promise<boolean> {
        const classAttr = await this.nameValidationIcon.getAttribute('class');
        return /glyphicon-ok/.test(classAttr ?? '');
    }

    async openCalendar() {
        await this.datepicker.open();
    }

    async selectDateByComponents(year: string, monthShort: string, day: string) {
        await this.datepicker.open();
        await this.datepicker.openMonthYearPicker();
        await this.datepicker.clickPreviousYearRange();
        await this.datepicker.selectYear(year);
        await this.datepicker.selectMonth(monthShort);
        await this.datepicker.selectDay(day);
    }

    async selectDateByButtonName(dateString: string) {
        await this.datepicker.open();
        await this.datepicker.selectDateByButtonName(dateString);
    }

    async selectType(value: string) {
        await this.selectOption(this.petTypeSelect, value);
    }

    async save() {
        await this.click(this.savePetButton);
    }

    birthDateValue(): Locator {
        return this.page.locator('input[name="birthDate"]');
    }
}
