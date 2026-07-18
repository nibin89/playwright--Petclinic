import { Page, Locator } from '@playwright/test';

export class PetTypesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addButton: Locator;

  private lastDialogMessage: string | null = null;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 2 }).first();
    this.addButton = page.getByRole('button', { name: 'Add' });
  }

  rowByName(name: string): Locator {
    return this.page.getByRole('row', { name });
  }

  rowById(id: string): Locator {
    return this.page.locator('tr').filter({ has: this.page.locator(`[id="${id}"]`) });
  }

  rowByIndex(index: number): Locator {
    return this.page.getByRole('row').nth(index);
  }

  lastRow(): Locator {
    return this.page.getByRole('row').last();
  }

  inputById(id: string): Locator {
    return this.page.locator(`[id="${id}"]`);
  }

  async clickEdit(row: Locator) {
    await row.getByRole('button', { name: 'Edit' }).click();
  }

  async clickAdd() {
    await this.addButton.click();
  }

  /**
   * Deletes a pet type row, capturing the native confirm dialog's message
   * (accepted automatically) so the test can assert on it afterward.
   */
  async deleteRow(row: Locator) {
    this.page.once('dialog', (dialog) => {
      this.lastDialogMessage = dialog.message();
      dialog.accept();
    });

    await row.getByRole('button', { name: 'Delete' }).click();
    await this.page.waitForResponse('**/pettypes/*');
  }

  getLastDialogMessage(): string | null {
    return this.lastDialogMessage;
  }
}