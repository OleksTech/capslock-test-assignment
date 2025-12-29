import { Locator, Page } from '@playwright/test';

import { Interest } from '../../constants/form-options';
import { Selectors } from '../../selectors';

export type InterestOption = Interest;

export class InterestStep {
  private readonly independenceOption: Locator;
  private readonly safetyOption: Locator;
  private readonly therapyOption: Locator;
  private readonly otherOption: Locator;
  getIndependenceOption(): Locator {
    return this.independenceOption;
  }

  getSafetyOption(): Locator {
    return this.safetyOption;
  }

  getTherapyOption(): Locator {
    return this.therapyOption;
  }

  getOtherOption(): Locator {
    return this.otherOption;
  }

  constructor(private readonly page: Page) {
    this.independenceOption = page.locator(Selectors.interestIndependence).first();
    this.safetyOption = page.locator(Selectors.interestSafety).first();
    this.therapyOption = page.locator(Selectors.interestTherapy).first();
    this.otherOption = page.locator(Selectors.interestOther).first();
  }

  async selectInterest(interest: InterestOption): Promise<void> {
    const optionMap = {
      independence: this.independenceOption,
      safety: this.safetyOption,
      therapy: this.therapyOption,
      other: this.otherOption,
    };
    await optionMap[interest].click();
  }

  async submitInterests(): Promise<void> {
    await this.page.locator(Selectors.submitButton).first().click();
  }

  async selectInterestAndProceed(interest: InterestOption): Promise<void> {
    await this.selectInterest(interest);
    await this.submitInterests();
  }
}
