import { Page, Locator } from '@playwright/test';

export class OwnerInformationPage {
    readonly page: Page;
    readonly ownerFullName: Locator;
    readonly petsAndVisitsHeading: Locator;
    readonly telephoneCell: Locator;
    readonly firstPetName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ownerFullName = page.locator('.ownerFullName');
        this.petsAndVisitsHeading = page.getByRole('heading', { name: 'Pets and Visits' });
        this.telephoneCell = page.getByRole('row', { name: 'Telephone' }).getByRole('cell');
        this.firstPetName = page.locator('app-pet-list dd').first();
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