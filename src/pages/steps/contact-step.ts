import { Locator, Page } from '@playwright/test';

import { Selectors, TestIds } from '../../selectors';
import { locatorWithFallback } from '../../utils/locators';

export class ContactStep {
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly goToEstimateButton: Locator;
  getNameInput(): Locator {
    return this.nameInput;
  }

  getEmailInput(): Locator {
    return this.emailInput;
  }

  getSubmitButton(): Locator {
    return this.goToEstimateButton;
  }

  constructor(private readonly page: Page) {
    this.nameInput = locatorWithFallback(page, TestIds.nameInput, Selectors.nameInput).first();
    this.emailInput = locatorWithFallback(page, TestIds.emailInput, Selectors.emailInput).first();
    this.goToEstimateButton = page.getByRole('button', { name: /go to estimate/i }).first();
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.waitFor({ state: 'visible' });
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
    // Tab to blur and commit value (Firefox fix)
    await this.emailInput.press('Tab');
  }

  async fillContactInfo(name: string, email: string): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
  }

  async submitContactInfo(): Promise<void> {
    await this.goToEstimateButton.click();
  }

  async fillContactInfoAndProceed(name: string, email: string): Promise<void> {
    await this.fillContactInfo(name, email);
    await this.submitContactInfo();
  }
}
