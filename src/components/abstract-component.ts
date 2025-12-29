import { Locator, Page } from '@playwright/test';

/**
 * Keeps shared, safe helpers out of individual page objects.
 */
export class AbstractComponent {
  readonly page: Page;

  constructor(readonly root: Locator) {
    this.page = root.page();
  }
}
