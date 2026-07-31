import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditVeterinarianPage extends BasePage {
    readonly heading: Locator;
    readonly selectedSpecialties: Locator;
    readonly dropdownDisplay: Locator;
    readonly dropdownContent: Locator;
    readonly dropdownLabels: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Edit Veterinarian' });
        this.selectedSpecialties = page.locator('.selected-specialties');
        this.dropdownDisplay = page.locator('div.dropdown-display');
        this.dropdownContent = page.locator('div.dropdown-content');
        this.dropdownLabels = this.dropdownContent.locator('label');
        this.saveButton = page.getByRole('button', { name: 'Save Vet' });
    }

    async openSpecialtiesDropdown() {
        await this.click(this.dropdownDisplay);
        await this.dropdownContent.waitFor({ state: 'visible', timeout: 15000 });
    }

    specialtyCheckbox(name: string): Locator {
        return this.dropdownContent.getByRole('checkbox', { name });
    }

    async checkSpecialty(name: string) {
        await this.specialtyCheckbox(name).check();
    }

    async uncheckSpecialty(name: string) {
        await this.specialtyCheckbox(name).uncheck();
    }

    async toggleSpecialty(name: string) {
        await this.dropdownContent.getByLabel(name).click();
    }

    async checkAllSpecialties() {
        for (const box of await this.dropdownContent.getByRole('checkbox', { includeHidden: false }).all()) {
            if (await box.isEnabled()) {
                await box.check();
            }
        }
    }

    async uncheckAllSpecialties() {
        for (const box of await this.dropdownContent.getByRole('checkbox', { includeHidden: false }).all()) {
            if (await box.isEnabled()) {
                await box.uncheck();
            }
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
        await this.click(this.saveButton);
    }
}