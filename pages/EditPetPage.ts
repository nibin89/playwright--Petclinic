import { Page, Locator } from '@playwright/test';

export class EditPetPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly nameInput: Locator;
    readonly nameField: Locator;
    readonly ownerNameField: Locator;
    readonly typeDropdown: Locator;
    readonly typeReadOnlyField: Locator;
    readonly updatePetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: ' Pet ' });
        this.nameInput = page.locator('#name');
        this.nameField = this.nameInput;
        this.ownerNameField = page.locator('#owner_name');
        this.typeDropdown = page.locator('#type');
        this.typeReadOnlyField = page.locator('#type1');
        this.updatePetButton = page.getByRole('button', { name: 'Update Pet' });
    }

    async getTypeOptions(): Promise<string[]> {
        return this.typeDropdown.locator('option').allInnerTexts();
    }

    async getAllTypeOptions(): Promise<string[]> {
        return this.getTypeOptions();
    }

    async selectType(type: string) {
        await this.typeDropdown.selectOption(type);
    }

    async update() {
        await this.updatePetButton.click();
    }

    async clickUpdate() {
        await this.update();
    }
}