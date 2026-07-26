import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly petTypesLink: Locator;
    readonly veterinariansButton: Locator;
    readonly allVetsLink: Locator;
    readonly specialtiesLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.petTypesLink = page.getByRole('link', { name: 'Pet Types' });
        this.veterinariansButton = page.getByRole('button', { name: 'Veterinarians' });
        this.allVetsLink = page.getByRole('link', { name: 'All' });
        this.specialtiesLink = page.getByRole('link', { name: ' Specialties' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async goToPetTypes() {
        await this.petTypesLink.click();
    }

    async goToVeterinarians() {
        await this.veterinariansButton.click();
        await this.allVetsLink.click();
    }

    async goToSpecialties() {
        await this.specialtiesLink.click();
    }
}