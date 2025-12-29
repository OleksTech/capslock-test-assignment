import { Locator, Page } from '@playwright/test';

import { PropertyType } from '../../constants/form-options';
import { Selectors } from '../../selectors';

export type PropertyTypeOption = PropertyType;

export class PropertyStep {
  private readonly ownedHouseOption: Locator;
  private readonly rentalOption: Locator;
  private readonly mobileHomeOption: Locator;
  getOwnedOption(): Locator {
    return this.ownedHouseOption;
  }

  getRentalOption(): Locator {
    return this.rentalOption;
  }

  getMobileOption(): Locator {
    return this.mobileHomeOption;
  }

  constructor(private readonly page: Page) {
    this.ownedHouseOption = page.locator(Selectors.propertyOwned).first();
    this.rentalOption = page.locator(Selectors.propertyRental).first();
    this.mobileHomeOption = page.locator(Selectors.propertyMobile).first();
  }

  async selectPropertyType(type: PropertyTypeOption): Promise<void> {
    const optionMap = {
      owned: this.ownedHouseOption,
      rental: this.rentalOption,
      mobile: this.mobileHomeOption,
    };
    await optionMap[type].click();
  }

  async submitPropertyType(): Promise<void> {
    await this.page.locator(Selectors.submitButton).first().click();
  }

  async selectPropertyTypeAndProceed(type: PropertyTypeOption): Promise<void> {
    await this.selectPropertyType(type);
    await this.submitPropertyType();
  }
}
