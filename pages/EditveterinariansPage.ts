import { Page, Locator } from '@playwright/test';

export class EditVeterinarianPage {
    readonly page: Page;
    readonly selectedSpecialties: Locator;
    readonly dropdownDisplay: Locator;

    constructor(page: Page) {
        this.page = page;
        this.selectedSpecialties = page.locator('.selected-specialties');
        this.dropdownDisplay = page.locator('div.dropdown-display');
    }

    async openSpecialtiesDropdown() {
        await this.dropdownDisplay.click();
    }

    specialtyCheckbox(name: string): Locator {
        return this.page.getByRole('checkbox', { name });
    }

    async checkSpecialty(name: string) {
        await this.specialtyCheckbox(name).check();
    }

    async uncheckSpecialty(name: string) {
        await this.specialtyCheckbox(name).uncheck();
    }

    // Reused by "select all" and "unselect all" tests - avoids duplicating the loop
    async checkAllSpecialties() {
        for (const box of await this.page.getByRole('checkbox').all()) {
            await box.check();
        }
    }

    async uncheckAllSpecialties() {
        for (const box of await this.page.getByRole('checkbox').all()) {
            await box.uncheck();
        }
    }
}