import { Page, Locator } from '@playwright/test';
import { formatInputDate } from '../utils/dateUtils';
import { BasePage } from './BasePage';

export class Datepicker extends BasePage {
    readonly openButton: Locator;
    readonly periodButton: Locator;
    readonly calendarOverlay: Locator;
    readonly overlayBackdrop: Locator;

    constructor(page: Page) {
        super(page);
        this.openButton = page.getByRole('button', { name: 'Open calendar' });
        this.periodButton = page.locator('.mat-calendar-period-button');
        this.calendarOverlay = page.locator('.cdk-overlay-container .mat-datepicker-content, .cdk-overlay-container .mat-calendar');
        this.overlayBackdrop = page.locator('.cdk-overlay-backdrop');
    }

    async open() {
        await this.openButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.openButton.click({ force: true });
        await this.calendarOverlay.waitFor({ state: 'visible', timeout: 15000 });
    }

    async openMonthYearPicker() {
        const button = this.periodButton.first();
        await button.waitFor({ state: 'visible', timeout: 15000 });
        await button.click({ force: true });
        await this.page.locator('.mat-calendar-body-cell').first().waitFor({ state: 'visible', timeout: 15000 });
    }

    async clickPreviousYearRange() {
        const button = this.page.getByRole('button', { name: /Previous \d+ years/ }).first();
        await button.waitFor({ state: 'visible', timeout: 15000 });
        await button.click({ force: true });
        await this.page.locator('.mat-calendar-body-cell').first().waitFor({ state: 'visible', timeout: 15000 });
    }

    async selectYear(year: string) {
        const yearButton = this.page.locator('.mat-calendar-body-cell').filter({ hasText: year }).first();
        await yearButton.waitFor({ state: 'visible', timeout: 15000 });
        await yearButton.click({ force: true });
        await this.waitForMonthView();
    }

    async waitForMonthView() {
        await this.page.locator('.mat-calendar-body-cell').filter({ hasText: /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/i }).first().waitFor({ state: 'visible', timeout: 15000 });
    }

    async selectMonth(monthShort: string) {
        const monthButton = this.page.locator('.mat-calendar-body-cell').filter({ hasText: new RegExp(`^${monthShort}$`, 'i') }).first();
        await monthButton.waitFor({ state: 'visible', timeout: 15000 });
        await monthButton.click({ force: true });
    }

    async selectDay(day: string) {
        const dayButton = this.page.locator('.mat-calendar-body-cell').filter({ hasText: new RegExp(`^${day}$`) }).first();
        await dayButton.waitFor({ state: 'visible', timeout: 15000 });
        await dayButton.click({ force: true });
        await this.closeCalendar();
    }

    async selectDateByButtonName(dateString: string) {
        const dateButton = this.page.getByRole('button', { name: dateString }).first();
        await dateButton.waitFor({ state: 'visible', timeout: 15000 });
        await dateButton.click({ force: true });
        await this.closeCalendar();
    }

    async closeCalendar() {
        await this.overlayBackdrop.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
        await this.calendarOverlay.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
        await this.page.waitForTimeout(100);
    }

    async selectDate(date: Date) {
        const input = formatInputDate(date);
        await this.open();
        await this.selectDateByButtonName(input);
    }
}
