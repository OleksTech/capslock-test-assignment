/**
 * Test ID constants for data-testid attributes
 * Used with locatorWithFallback for consistent test-id usage
 */
export const TestIds = {
  // Step 1: ZIP Code
  zipCodeInput: 'input-zip-code',
  zipSubmitButton: 'btn-zip-submit',

  // Step 4: Contact Info
  nameInput: 'input-name',
  emailInput: 'input-email',

  // Step 5: Phone
  phoneInput: 'input-phone',
  formSubmitButton: 'btn-form-submit',
} as const;

export type TestIdKey = keyof typeof TestIds;
