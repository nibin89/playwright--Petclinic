import { Page, Locator } from '@playwright/test';

export class SpecialtiesPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly addButton: Locator;
    readonly addNameInput: Locator;
    readonly saveButton: Locator;
    readonly editHeading: Locator;
    readonly updateButton: Locator;
    /** All specialty name inputs, including disabled/read-only rows */
    readonly allNameInputs: Locator;
    /** The single input currently enabled for editing (disabled rows are excluded from this role query) */
    readonly activeEditInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Specialties' });
        this.addButton = page.getByRole('button', { name: ' Add ' });
        this.addNameInput = page.locator('#name');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.editHeading = page.getByRole('heading', { name: 'Edit Specialty' });
        this.updateButton = page.getByRole('button', { name: 'Update' });
        this.allNameInputs = page.locator('#specialties input');
        this.activeEditInput = page.getByRole('textbox');
    }

    rowByName(name: string): Locator {
        return this.page.getByRole('row', { name });
    }

    async clickEdit(row: Locator) {
        await row.getByRole('button', { name: 'Edit' }).click();
    }

    async clickDelete(row: Locator) {
        await row.getByRole('button', { name: 'Delete' }).click();
    }

    async fillActiveEditInput(value: string) {
        await this.activeEditInput.fill(value);
    }

    async clickUpdate() {
        await this.updateButton.click();
    }

    async addSpecialty(name: string) {
        await this.addButton.click();
        await this.addNameInput.fill(name);
        await this.saveButton.click();
    }

    async getAllSpecialtyNames(): Promise<string[]> {
        const names: string[] = [];
        for (const input of await this.allNameInputs.all()) {
            names.push((await input.inputValue()).trim());
        }
        return names;
    }
}