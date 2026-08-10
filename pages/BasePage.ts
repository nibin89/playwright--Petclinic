import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async click(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fill(locator: Locator, value: string) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(value);
    }

    async selectOption(locator: Locator, value: string) {
        await locator.waitFor({ state: 'visible' });
        await locator.selectOption(value);
    }

    async text(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        return locator.textContent();
    }

}
