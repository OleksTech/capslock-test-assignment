import { Page } from '@playwright/test';

import { AbstractComponent } from '../components/abstract-component';

export class AbstractPage extends AbstractComponent {
  constructor(
    readonly page: Page,
    public relativeUrl = ''
  ) {
    super(page.locator('body'));
  }

  async open(params = ''): Promise<void> {
    await this.goto(`${this.relativeUrl}${params}`);
  }

  async goto(url: string, options: Parameters<Page['goto']>[1] = {}): Promise<void> {
    await this.page.goto(url, options);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
