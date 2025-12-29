import { Locator, Page } from '@playwright/test';

import { Selectors, TestIds } from '../../selectors';
import { locatorWithFallback } from '../../utils/locators';

export class PhoneStep {
  private readonly phoneInput: Locator;

  constructor(
    private readonly page: Page,
    private readonly submitButton: Locator
  ) {
    this.phoneInput = locatorWithFallback(page, TestIds.phoneInput, Selectors.phoneInput).first();
  }

  getPhoneInput(): Locator {
    return this.phoneInput;
  }

  getSubmitButton(): Locator {
    return this.submitButton;
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.waitFor({ state: 'visible' });
    await this.phoneInput.click();
    await this.phoneInput.pressSequentially(phone, { delay: 50 });
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }

  async fillPhoneAndSubmit(phone: string): Promise<void> {
    await this.fillPhone(phone);
    await this.submitForm();
  }
}
