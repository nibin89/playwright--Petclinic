import { Page, Locator } from '@playwright/test';

export class EditPetPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly nameInput: Locator;
    readonly ownerNameField: Locator;
    readonly typeDropdown: Locator;
    readonly typeReadOnlyField: Locator;
    readonly updatePetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: ' Pet ' });
        this.nameInput = page.locator('#name');
        this.ownerNameField = page.locator('#owner_name');
        this.typeDropdown = page.locator('#type');
        this.typeReadOnlyField = page.locator('#type1');
        this.updatePetButton = page.getByRole('button', { name: 'Update Pet' });
    }

    async getTypeOptions(): Promise<string[]> {
        return this.typeDropdown.locator('option').allInnerTexts();
    }

    async selectType(type: string) {
        await this.typeDropdown.selectOption(type);
    }

    async clickUpdate() {
        await this.updatePetButton.click();
    }
}