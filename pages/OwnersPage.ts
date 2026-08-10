import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OwnerPage extends BasePage {
    readonly heading: Locator;
    readonly rows: Locator;
    readonly searchInput: Locator;
    readonly findOwnerButton: Locator;
    readonly ownerFullName: Locator;
    readonly petsAndVisitsHeading: Locator;
    readonly telephoneCell: Locator;
    readonly firstPetName: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Owners' });
        this.rows = page.locator('table tbody tr', { has: page.locator('td.ownerFullName, td:has-text("Owner")') });
        this.searchInput = page.locator('input[name="lastName"]');
        this.findOwnerButton = page.getByRole('button', { name: 'Find Owner' });
        this.ownerFullName = page.locator('.ownerFullName');
        this.petsAndVisitsHeading = page.getByRole('heading', { name: 'Pets and Visits' });
        this.telephoneCell = page.getByRole('row', { name: 'Telephone' }).getByRole('cell');
        this.firstPetName = page.locator('app-pet-list dd').first();
    }

    async goto() {
        await this.page.goto('/owners');
        await this.page.waitForLoadState('networkidle');
        await this.searchInput.waitFor({ state: 'visible' });
    }

    rowByName(name: string): Locator {
        return this.rows.filter({ has: this.page.locator('td', { hasText: name }) });
    }

    cell(row: Locator, index: number): Locator {
        return row.locator('td').nth(index);
    }

    async cellText(row: Locator, index: number): Promise<string> {
        return ((await this.cell(row, index).textContent()) ?? '').trim();
    }

    async searchByLastName(lastName: string) {
        await this.searchInput.waitFor({ state: 'visible' });
        await this.searchInput.fill(lastName);
        await this.findOwnerButton.click();
    }

    noOwnersMessage(lastName: string): Locator {
        return this.page.getByText('No owners found');
    }

    async openOwner(ownerName: string) {
        const row = this.rowByName(ownerName);
        if ((await row.count()) === 0) {
            const parts = ownerName.split(' ');
            const lastName = parts[parts.length - 1];
            await this.searchByLastName(lastName);
        }
        await this.rowByName(ownerName).getByRole('link').first().click();
    }

    petSection(petName: string): Locator {
        return this.page.locator('app-pet-list', { hasText: petName });
    }

    petType(petName: string): Locator {
        return this.petSection(petName).locator('dt:has-text("Type") + dd');
    }

    async clickEditPet(petName: string) {
        await this.petSection(petName).getByRole('button', { name: 'Edit Pet' }).click();
    }
}