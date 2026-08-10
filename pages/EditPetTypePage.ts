import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditPetTypePage extends BasePage {
    readonly heading: Locator;
    readonly nameInput: Locator;
    readonly errorMessage: Locator;
    readonly updateButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Edit Pet Type' });
        this.nameInput = page.locator('#name');
        this.errorMessage = page.locator('.help-block').filter({ hasText: 'Name is required' });
        this.updateButton = page.getByRole('button', { name: 'Update' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async fillName(value: string) {
        await this.fill(this.nameInput, value);
    }

    async clearName() {
        await this.nameInput.clear();
    }

    async clickUpdate() {
        await this.click(this.updateButton);
    }

    async clickCancel() {
        await this.click(this.cancelButton);
    }
}