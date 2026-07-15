import { Page, Locator } from '@playwright/test';

export class VeterinariansPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    rowByName(name: string): Locator {
        return this.page.getByRole('row', { name });
    }

    async clickEditVet(row: Locator) {
        await row.getByRole('button', { name: 'Edit Vet' }).click();
    }
}