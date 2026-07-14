import { Page, Locator } from '@playwright/test';

export class EditPetTypePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly nameInput: Locator;
    readonly errorMessage: Locator;
    readonly updateButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Edit Pet Type' });
        this.nameInput = page.locator('#name');
        this.errorMessage = page.locator('.help-block').filter({ hasText: 'Name is required' });
        this.updateButton = page.getByRole('button', { name: 'Update' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async fillName(value: string) {
        await this.nameInput.fill(value);
    }

    async clearName() {
        await this.nameInput.clear()


    }

    async clickUpdate() {
        await this.updateButton.click();
    }

    async clickCancel() {
        await this.cancelButton.click();
    }
}