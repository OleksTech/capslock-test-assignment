/**
 * Data attribute selectors available in the application
 * Note: Some data-* attrs are on wrappers, not inputs directly
 */
export const DataSelectors = {
  formContainer: '[data-form-container]',

  zipCodeInput: '[data-zip-code-input]',

  nextStepButton: '[data-next-step]',
  currentStep: '[data-current-step]',

  sorryStep: '[data-sorry-step]',
  sorryFadeIn: '[data-sorry-fade-in]',
} as const;

/** Fallback selectors for landings without data attributes */
export const FallbackSelectors = {
  zipInput: 'input[placeholder*="ZIP"]:visible, input[name="zipCode"]:visible',
  anyForm: 'form:visible, [role="form"]:visible',
} as const;

export type DataSelectorKey = keyof typeof DataSelectors;
