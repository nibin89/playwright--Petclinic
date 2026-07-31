import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SpecialtiesPage extends BasePage {
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
        super(page);
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
        return this.page.locator('table tbody tr', { has: this.page.locator('td', { hasText: name }) });
    }

    async clickEdit(row: Locator) {
        await this.click(row.getByRole('button', { name: 'Edit' }));
    }

    async clickDelete(row: Locator) {
        await this.click(row.getByRole('button', { name: 'Delete' }));
    }

    async fillActiveEditInput(value: string) {
        await this.fill(this.activeEditInput, value);
    }

    async clickUpdate() {
        await this.click(this.updateButton);
    }

    async addSpecialty(name: string) {
        await this.click(this.addButton);
        await this.fill(this.addNameInput, name);
        await this.click(this.saveButton);
    }

    async getAllSpecialtyNames(): Promise<string[]> {
        const names: string[] = [];
        for (const input of await this.allNameInputs.all()) {
            names.push((await input.inputValue()).trim());
        }
        return names;
    }
}