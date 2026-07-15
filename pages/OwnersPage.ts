import { Page, Locator } from '@playwright/test';

export class OwnersPage {
    readonly page: Page;
    readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Owners' });
    }

    async goto() {
        await this.page.getByRole('button', { name: 'Owners' }).click();
        await this.page.getByRole('link', { name: 'Search' }).click();
    }

    ownerLink(name: string): Locator {
        return this.page.getByRole('link', { name });
    }

    async openOwner(name: string) {
        await this.ownerLink(name).click();
    }
}