import { Page, Locator } from '@playwright/test';

export class NewPetTypePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameLabel: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 2 }).nth(1);
    this.nameLabel = page.locator('label', { hasText: 'Name' });
    this.nameInput = page.locator('#name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async fillName(value: string) {
    await this.nameInput.fill(value);
  }

  async save() {
    await this.saveButton.click();
  }
}