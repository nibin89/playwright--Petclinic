import { Page, Locator } from '@playwright/test';

export class VeterinariansPage {
    readonly page: Page;
    readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Veterinarians' });
    }

    rowByName(name: string): Locator {
        return this.page.getByRole('row', { name });
    }

    async clickEditVet(row: Locator) {
        await row.getByRole('button', { name: 'Edit Vet' }).click();
    }

    specialtyCell(row: Locator, specialtyName: string): Locator {
        return row.getByRole('cell', { name: specialtyName });
    }

    specialtyCellAt(row: Locator, index: number): Locator {
        return row.getByRole('cell').nth(index);
    }
}