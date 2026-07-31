import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OwnerInformationPage extends BasePage {
    readonly ownerFullName: Locator;
    readonly petsAndVisitsHeading: Locator;
    readonly telephoneCell: Locator;
    readonly firstPetName: Locator;

    constructor(page: Page) {
        super(page);
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
        await this.click(this.petSection(petName).getByRole('button', { name: 'Edit Pet' }));
    }

    async addNewPet() {
        await this.click(this.page.getByRole('button', { name: 'Add New Pet' }));
    }

    rowValue(label: string) {
        return this.page.getByRole('row', { name: label }).locator('td');
    }

    async gotoOwner(ownerId: number | string) {
        await this.page.goto(`/owners/${ownerId}`);
    }

    async deleteVisit(description: string) {
        const visitRow = this.page.getByRole('row', { name: description });
        await this.click(visitRow.getByRole('button', { name: 'Delete Visit' }));
    }

    async deletePet(petName: string) {
        const petSection = this.petSection(petName);
        await this.click(petSection.getByRole('button', { name: 'Delete Pet' }));
    }
}