import { Page } from '@playwright/test';

import { LandingConfig } from '../config/landing';
import { FormStep, Step } from '../constants/form-steps';
import { Selectors, TestIds } from '../selectors';
import { locatorWithFallback } from '../utils/locators';

export const DEFAULT_FLOW_STEPS: Step[] = [
  FormStep.ZIP_CODE,
  FormStep.INTERESTS,
  FormStep.PROPERTY_TYPE,
  FormStep.CONTACT_INFO,
  FormStep.PHONE,
];

export function getFlowSteps(_landing: LandingConfig): Step[] {
  return DEFAULT_FLOW_STEPS;
}

export function getSubmitLocator(page: Page): ReturnType<Page['locator']> {
  return locatorWithFallback(page, TestIds.formSubmitButton, Selectors.submitButton)
    .or(page.getByRole('button', { name: /submit/i }))
    .first();
}
