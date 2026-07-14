import { Page, Locator } from '@playwright/test';

export class PetTypesPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Pet Types' });
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

  inputById(id: string): Locator {
    return this.page.locator(`[id="${id}"]`);
  }

  async clickEdit(row: Locator) {
    await row.getByRole('button', { name: 'Edit' }).click();
  }
}