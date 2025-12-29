import { expect } from '@playwright/test';

import { ErrorMessages } from '../constants/copy';
import { FormStep, Step } from '../constants/form-steps';
import { Waits } from '../utils/waits';
import { FormPage } from './form-page';

/**
 * Sub-assertion class for form step visibility.
 * Works for any form as long as the page implements getStepLocator.
 */
class StepAssertions {
  constructor(private readonly formPage: FormPage) {}

  /**
   * Universal step validator.
   */
  async expectVisible(step: Step): Promise<void> {
    const locator = this.formPage.getStepLocator(step);

    if (!locator) {
      throw new Error(`Step ${step} is not defined for this form type.`);
    }

    await expect(locator.first()).toBeVisible();
  }
}

/**
 * Sub-assertion class for field-level validation errors.
 */
class ValidationAssertions {
  constructor(private readonly formPage: FormPage) {}

  async expectZipCodeError(): Promise<void> {
    await expect(
      this.formPage.formContainer.getByText(ErrorMessages.zipCode.invalid, { exact: false }).first()
    ).toBeVisible();
  }

  async expectNameError(type: 'fullName' | 'invalidChars'): Promise<void> {
    const errorText = ErrorMessages.name[type];

    await expect(
      this.formPage.formContainer.getByText(errorText, { exact: false }).first()
    ).toBeVisible();
  }
}

/**
 * Main Assertion Entry Point.
 * Organized into sub-classes for better separation of concerns.
 */
export class FormAssertions {
  readonly steps: StepAssertions;
  readonly validation: ValidationAssertions;

  constructor(private readonly formPage: FormPage) {
    this.steps = new StepAssertions(formPage);
    this.validation = new ValidationAssertions(formPage);
  }

  /**
   * Verifies redirect to thank-you page.
   * BEST PRACTICE: Use centralized wait for URL pattern matching
   */
  async expectThankYouPage(): Promise<void> {
    const pattern = this.formPage.landing.validation.thankYouUrlPattern;

    // Wait for URL to match pattern with network stability
    await Waits.forUrlPattern(this.formPage.page, pattern);

    // Verify heading is visible
    await expect(this.formPage.thankYouHeading).toBeVisible();
  }

  /**
   * Verifies we're still on the form (not redirected).
   */
  async expectNotOnThankYouPage(): Promise<void> {
    const page = this.formPage.page;
    const pattern = this.formPage.landing.validation.thankYouUrlPattern;

    await page.waitForLoadState('load');
    const url = page.url();
    expect(url).not.toMatch(pattern);
    await expect(this.formPage.thankYouHeading).not.toBeVisible();
  }

  async expectServiceUnavailableMessage(): Promise<void> {
    await expect(this.formPage.serviceUnavailableMessage).toBeVisible();
  }

  // ============ Step Assertion Aliases ============

  async expectOnInterestsStep() {
    await this.steps.expectVisible(FormStep.INTERESTS);
  }

  async expectOnPhoneStep() {
    await this.steps.expectVisible(FormStep.PHONE);
  }

  // ============ Validation Error Aliases ============

  async expectNameErrorFullName() {
    await this.validation.expectNameError('fullName');
  }

  async expectNameErrorInvalidChars() {
    await this.validation.expectNameError('invalidChars');
  }
}
