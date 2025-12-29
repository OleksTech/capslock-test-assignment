/**
 * Button selectors
 */
export const ButtonSelectors = {
  submit: 'button[type="submit"]',
  goToEstimate: 'button:has-text("Go To Estimate")',
  submitForm: 'button:has-text("Submit")',
} as const;

export type ButtonSelectorKey = keyof typeof ButtonSelectors;
