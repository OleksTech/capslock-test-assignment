import { Locator, Page } from '@playwright/test';

import { getDefaultLanding, getTestData, LandingConfig } from '../config/landing';
import { Interest, INTERESTS, PROPERTY_TYPES, PropertyType } from '../constants/form-options';
import { FormStep, Step } from '../constants/form-steps';
import { ValidData } from '../data/valid';
import { getFlowSteps, getSubmitLocator } from '../flows/flow-definition';
import { MessageSelectors } from '../selectors';
import { randomPick } from '../utils/random';
import { Waits } from '../utils/waits';
import { CurrentLandingPage } from './current-landing-page';
import { ContactStep } from './steps/contact-step';
import { InterestStep } from './steps/interest-step';
import { PhoneStep } from './steps/phone-step';
import { PropertyStep } from './steps/property-step';
import { ZipStep } from './steps/zip-step';

const SERVICE_UNAVAILABLE_LOCATOR_TEXT = 'Sorry, unfortunately';

/**
 * Generic Form Page Object
 *
 * Contains reusable form elements (zip code, name, email, phone, submit buttons)
 * that are common across landing pages. Some step-specific methods (e.g., selectPropertyType,
 * selectInterest) are landing-specific and may need overriding for other form types.
 *
 * Accepts optional landing config for page-specific copy/behavior.
 */
export class FormPage extends CurrentLandingPage {
  private readonly zipStep: ZipStep;
  private readonly interestStep: InterestStep;
  private readonly propertyStep: PropertyStep;
  private readonly contactStep: ContactStep;
  private readonly phoneStep: PhoneStep;

  readonly zipCodeInput: Locator;
  readonly zipSubmitButton: Locator;

  readonly independenceOption: Locator;
  readonly safetyOption: Locator;
  readonly therapyOption: Locator;
  readonly otherOption: Locator;

  readonly ownedHouseOption: Locator;
  readonly rentalOption: Locator;
  readonly mobileHomeOption: Locator;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly goToEstimateButton: Locator;

  readonly phoneInput: Locator;
  readonly submitButton: Locator;

  readonly serviceUnavailableMessage: Locator;
  readonly thankYouHeading: Locator;

  constructor(page: Page, landing?: LandingConfig) {
    super(page, landing ?? getDefaultLanding());

    this.zipStep = new ZipStep(page);
    this.interestStep = new InterestStep(page);
    this.propertyStep = new PropertyStep(page);
    this.contactStep = new ContactStep(page);
    const submitButton = getSubmitLocator(page);
    this.phoneStep = new PhoneStep(page, submitButton);

    this.zipCodeInput = this.zipStep.getZipCodeInput();
    this.zipSubmitButton = this.zipStep.getSubmitButton();

    this.independenceOption = this.interestStep.getIndependenceOption();
    this.safetyOption = this.interestStep.getSafetyOption();
    this.therapyOption = this.interestStep.getTherapyOption();
    this.otherOption = this.interestStep.getOtherOption();

    this.ownedHouseOption = this.propertyStep.getOwnedOption();
    this.rentalOption = this.propertyStep.getRentalOption();
    this.mobileHomeOption = this.propertyStep.getMobileOption();

    this.nameInput = this.contactStep.getNameInput();
    this.emailInput = this.contactStep.getEmailInput();
    this.goToEstimateButton = this.contactStep.getSubmitButton();

    this.phoneInput = this.phoneStep.getPhoneInput();
    this.submitButton = submitButton;

    this.serviceUnavailableMessage = page.getByText(SERVICE_UNAVAILABLE_LOCATOR_TEXT).first();
    this.thankYouHeading = page
      .locator(MessageSelectors.thankYouHeading)
      .filter({ hasText: new RegExp(this.landing.copy.thankYouHeading, 'i') })
      .first();
  }

  getStepLocator(step: Step): Locator {
    const map: Record<Step, Locator> = {
      [FormStep.ZIP_CODE]: this.zipCodeInput,
      [FormStep.INTERESTS]: this.independenceOption,
      [FormStep.PROPERTY_TYPE]: this.ownedHouseOption,
      [FormStep.CONTACT_INFO]: this.emailInput,
      [FormStep.PHONE]: this.phoneInput,
    };
    return map[step];
  }

  // ============ Step 1: ZIP Code ============

  async fillZipCode(zipCode: string): Promise<void> {
    await this.zipStep.fillZipCode(zipCode);
  }

  async submitZipCode(): Promise<void> {
    await this.zipStep.submitZipCode();
  }

  async fillAndSubmitZipCode(zipCode: string): Promise<void> {
    await this.zipStep.fillAndSubmitZipCode(zipCode);
  }

  // ============ Step 2: Interests ============

  async selectInterest(interest: Interest): Promise<void> {
    await this.interestStep.selectInterest(interest);
  }

  async submitInterests(): Promise<void> {
    await this.interestStep.submitInterests();
  }

  async selectInterestAndProceed(interest: Interest): Promise<void> {
    await this.interestStep.selectInterestAndProceed(interest);
  }

  // ============ Step 3: Property Type ============

  async selectPropertyType(type: PropertyType): Promise<void> {
    await this.propertyStep.selectPropertyType(type);
  }

  async submitPropertyType(): Promise<void> {
    await this.propertyStep.submitPropertyType();
  }

  async selectPropertyTypeAndProceed(type: PropertyType): Promise<void> {
    await this.propertyStep.selectPropertyTypeAndProceed(type);
  }

  // ============ Step 4: Contact Info ============

  async fillName(name: string): Promise<void> {
    await this.contactStep.fillName(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.contactStep.fillEmail(email);
  }

  async fillContactInfo(name: string, email: string): Promise<void> {
    await this.contactStep.fillContactInfo(name, email);
  }

  async submitContactInfo(): Promise<void> {
    await this.contactStep.submitContactInfo();
  }

  async fillContactInfoAndProceed(name: string, email: string): Promise<void> {
    await this.contactStep.fillContactInfoAndProceed(name, email);
  }

  // ============ Step 5: Phone & Submit ============

  async fillPhone(phone: string): Promise<void> {
    await this.phoneStep.fillPhone(phone);
  }

  async submitForm(): Promise<void> {
    await this.phoneStep.submitForm();
  }

  async fillPhoneAndSubmit(phone: string): Promise<void> {
    await this.phoneStep.fillPhoneAndSubmit(phone);
  }

  // ============ Complete Flow ============

  async completeFormWithData(data: {
    zipCode: string;
    interest?: Interest;
    propertyType?: PropertyType;
    name: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.fillAndSubmitZipCode(data.zipCode);

    await Waits.forStepTransition(this.page, this.independenceOption);
    await this.selectInterestAndProceed(data.interest ?? ValidData.defaults.interest);

    await Waits.forStepTransition(this.page, this.ownedHouseOption);
    await this.selectPropertyTypeAndProceed(data.propertyType ?? ValidData.defaults.propertyType);

    await Waits.forStepTransition(this.page, this.nameInput);
    await this.fillContactInfoAndProceed(data.name, data.email);

    await Waits.forStepTransition(this.page, this.phoneInput);
    await this.fillPhoneAndSubmit(data.phone);
  }

  async navigateToStep(step: Step): Promise<void> {
    const steps = getFlowSteps(this.landing);
    const targetIndex = steps.indexOf(step);
    if (targetIndex <= 0) return;

    for (let i = 0; i < targetIndex; i += 1) {
      const currentStep = steps[i];
      switch (currentStep) {
        case FormStep.ZIP_CODE:
          await this.fillAndSubmitZipCode(getTestData().validZipCode);
          await Waits.forStepTransition(this.page, this.independenceOption);
          break;
        case FormStep.INTERESTS:
          await this.selectInterestAndProceed(randomPick(INTERESTS));
          await Waits.forStepTransition(this.page, this.ownedHouseOption);
          break;
        case FormStep.PROPERTY_TYPE:
          await this.selectPropertyTypeAndProceed(randomPick(PROPERTY_TYPES));
          await Waits.forStepTransition(this.page, this.nameInput);
          break;
        case FormStep.CONTACT_INFO:
          await this.fillContactInfoAndProceed(ValidData.user.name, ValidData.user.email);
          await Waits.forStepTransition(this.page, this.phoneInput);
          break;
        default:
          break;
      }
    }
  }
}
