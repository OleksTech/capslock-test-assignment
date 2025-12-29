import { expect, Locator, Page } from '@playwright/test';

import { resolveBaseURL } from '../config/environments';
import { LandingConfig } from '../config/landing';
import { Timeouts } from '../config/timeouts';
import { DataSelectors, FallbackSelectors } from '../selectors/data-attributes';
import { AbstractPage } from './abstract-page';

export class CurrentLandingPage extends AbstractPage {
  readonly landing: LandingConfig;
  readonly baseURL: string;

  readonly formContainer: Locator;
  readonly sorryStep: Locator;
  readonly zipInput: Locator;
  readonly anyForm: Locator;

  constructor(page: Page, landing: LandingConfig) {
    super(page, landing.path);
    this.landing = landing;
    this.baseURL = resolveBaseURL(landing);

    this.formContainer = page.locator(`${DataSelectors.formContainer}:visible`).first();
    this.sorryStep = page.locator(`${DataSelectors.sorryStep}:visible`).first();
    this.zipInput = page.locator(FallbackSelectors.zipInput).first();
    this.anyForm = page.locator(FallbackSelectors.anyForm).first();
  }

  async open(params = ''): Promise<void> {
    const fullUrl = `${this.baseURL}${this.relativeUrl}${params}`;
    await this.goto(fullUrl);
  }

  async waitForReady(timeoutMs = Timeouts.pageReady): Promise<void> {
    await expect
      .poll(
        async () => {
          if (await this.formContainer.isVisible().catch(() => false)) return 'formContainer';
          if (await this.zipInput.isVisible().catch(() => false)) return 'zipInput';
          if (await this.anyForm.isVisible().catch(() => false)) return 'form';
          return null;
        },
        { timeout: timeoutMs }
      )
      .not.toBeNull();
  }
}
