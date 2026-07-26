import { Page, Locator } from '@playwright/test';

export class EditVeterinarianPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly selectedSpecialties: Locator;
    readonly dropdownDisplay: Locator;
    readonly dropdownLabels: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Edit Veterinarian' });
        this.selectedSpecialties = page.locator('.selected-specialties');
        this.dropdownDisplay = page.locator('div.dropdown-display');
        this.dropdownLabels = page.locator('div.dropdown-content label');
        this.saveButton = page.getByRole('button', { name: 'Save Vet' });
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

    async toggleSpecialty(name: string) {
        await this.page.getByLabel(name).click();
    }

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

    async getDropdownLabelTexts(): Promise<string[]> {
        const texts: string[] = [];
        for (const label of await this.dropdownLabels.all()) {
            texts.push((await label.textContent())!.trim());
        }
        return texts;
    }

    async save() {
        await this.saveButton.click();
    }
}