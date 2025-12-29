/**
 * Reusable copy/text constants
 * These are the same across all landings
 */

export const ErrorMessages = {
  name: {
    fullName: 'Full name should contain both first and last name',
    invalidChars:
      'Your name should consist only of latin letters, apostrophes, underscores, dots and dashes',
  },
  email: {
    invalid: 'Please enter a valid email address',
    required: 'Email is required',
  },
  phone: {
    invalid: 'Please enter a valid phone number',
    required: 'Phone number is required',
  },
  zipCode: {
    invalid: 'Wrong ZIP code',
    required: 'ZIP code is required',
  },
  selection: {
    required: 'Choose one of the variants',
  },
} as const;

export const ButtonText = {
  submit: 'Submit',
  next: 'Next',
  previous: 'Previous',
} as const;
