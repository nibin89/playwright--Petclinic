import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly petTypesLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.petTypesLink = page.getByRole('link', { name: 'Pet Types' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async goToPetTypes() {
        await this.petTypesLink.click();
    }
}