import { expect } from '@playwright/test';

import { FormStep, Step } from '../constants/form-steps';
import { FormAssertions } from '../pages/form-assertions';
import { FormPage } from '../pages/form-page';
import { getFlowSteps } from './flow-definition';

export { FormStep, Step };

const stepLocators: Record<
  Step,
  (formPage: FormPage) => ReturnType<FormPage['zipCodeInput']['first']>
> = {
  [FormStep.ZIP_CODE]: (fp) => fp.zipCodeInput,
  [FormStep.INTERESTS]: (fp) => fp.independenceOption,
  [FormStep.PROPERTY_TYPE]: (fp) => fp.ownedHouseOption,
  [FormStep.CONTACT_INFO]: (fp) => fp.emailInput,
  [FormStep.PHONE]: (fp) => fp.phoneInput,
};

export async function goToStep(formPage: FormPage, step: Step): Promise<void> {
  // Single source of flow ordering
  const flow = getFlowSteps(formPage.landing);
  if (!flow.includes(step)) {
    throw new Error(`Step ${step} not in flow for landing ${formPage.landing.id}`);
  }
  await formPage.navigateToStep(step);
}

export async function completeValidFlow(
  formPage: FormPage,
  data: Parameters<FormPage['completeFormWithData']>[0]
): Promise<void> {
  await formPage.completeFormWithData(data);
}

export async function expectStayOnStep(
  formPage: FormPage,
  formAssertions: FormAssertions,
  step: Step
): Promise<void> {
  await formAssertions.expectNotOnThankYouPage();
  const locator = stepLocators[step](formPage);
  await expect(locator).toBeVisible();
}
