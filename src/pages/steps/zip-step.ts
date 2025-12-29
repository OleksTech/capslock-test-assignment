import { Locator, Page } from '@playwright/test';

import { Selectors, TestIds } from '../../selectors';
import { locatorWithFallback } from '../../utils/locators';

export class ZipStep {
  private readonly zipCodeInput: Locator;
  private readonly zipSubmitButton: Locator;

  constructor(private readonly page: Page) {
    this.zipCodeInput = locatorWithFallback(
      page,
      TestIds.zipCodeInput,
      Selectors.zipCodeInput
    ).first();
    this.zipSubmitButton = locatorWithFallback(
      page,
      TestIds.zipSubmitButton,
      Selectors.submitButton
    ).first();
  }

  getZipCodeInput(): Locator {
    return this.zipCodeInput;
  }

  getSubmitButton(): Locator {
    return this.zipSubmitButton;
  }

  async fillZipCode(zipCode: string): Promise<void> {
    await this.zipCodeInput.waitFor({ state: 'visible' });
    await this.zipCodeInput.fill(zipCode);
  }

  async submitZipCode(): Promise<void> {
    await this.zipSubmitButton.click();
  }

  async fillAndSubmitZipCode(zipCode: string): Promise<void> {
    await this.fillZipCode(zipCode);
    await this.submitZipCode();
  }
}
