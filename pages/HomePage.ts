import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly petTypesLink: Locator;
    readonly veterinariansMenuButton: Locator;
    readonly allVetsLink: Locator;
    readonly specialtiesLink: Locator;

    constructor(page: Page) {
        super(page);
        this.petTypesLink = page.getByRole('link', { name: 'Pet Types' });
        this.veterinariansMenuButton = page.getByRole('button', { name: 'Veterinarians' });
        this.allVetsLink = page.getByRole('link', { name: 'All' });
        this.specialtiesLink = page.getByRole('link', { name: ' Specialties' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async goToPetTypes() {
        await this.click(this.petTypesLink);
    }

    async goToVeterinarians() {
        await this.click(this.veterinariansMenuButton);
        await this.click(this.allVetsLink);
    }

    async goToSpecialties() {
        await this.click(this.specialtiesLink);
    }
}