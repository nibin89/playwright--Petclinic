import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPetTypePage extends BasePage {
  readonly heading: Locator;
  readonly nameLabel: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 2 }).nth(1);
    this.nameLabel = page.locator('label', { hasText: 'Name' });
    this.nameInput = page.locator('#name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async fillName(value: string) {
    await this.fill(this.nameInput, value);
  }

  async save() {
    await this.click(this.saveButton);
  }
}