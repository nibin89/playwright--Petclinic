import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class VeterinariansPage extends BasePage {
    readonly heading: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Veterinarians' });
    }

    rowByName(name: string): Locator {
        return this.page.locator('table tbody tr', { has: this.page.locator('td', { hasText: name }) });
    }

    async clickEditVet(row: Locator) {
        await this.click(row.getByRole('button', { name: 'Edit Vet' }));
    }

    specialtyCell(row: Locator, specialtyName: string): Locator {
        return row.getByRole('cell', { name: specialtyName });
    }

    specialtyCellAt(row: Locator, index: number): Locator {
        return row.getByRole('cell').nth(index);
    }

    async openSpecialtiesDropdown() {
        await this.click(this.page.locator('div.dropdown'));
    }

    async checkSpecialtyByLabel(name: string) {
        await this.page.getByLabel(name).check();
    }

    async uncheckSpecialtyByLabel(name: string) {
        await this.page.getByLabel(name).uncheck();
    }

    async saveVet() {
        await this.click(this.page.getByRole('button', { name: 'Save Vet' }));
    }
}