/**
 * Selectors barrel file
 *
 * Organized by concern for scalability across 100,000+ landing pages.
 * Import individual selector groups or use the combined Selectors object.
 */

// Re-export individual selector groups
export { type ButtonSelectorKey, ButtonSelectors } from './buttons';
export { type DataSelectorKey, DataSelectors } from './data-attributes';
export { type InputSelectorKey, InputSelectors } from './inputs';
export { type LabelSelectorKey, LabelSelectors } from './labels';
export { type MessageSelectorKey, MessageSelectors } from './messages';
export { type TestIdKey, TestIds } from './test-ids';

// Import for composition
import { ButtonSelectors } from './buttons';
import { InputSelectors } from './inputs';
import { LabelSelectors } from './labels';

/**
 * Helper to add :visible pseudo-selector
 * Handles duplicate elements on page (e.g., mobile/desktop forms)
 */
export function visible(selector: string): string {
  return `${selector}:visible`;
}

/**
 * Combined selectors for page objects
 * All include :visible to handle duplicate forms on page
 */
export const Selectors = {
  // Step 1: ZIP Code
  zipCodeInput: visible(InputSelectors.zipCode),

  // Step 2: Interests
  interestIndependence: visible(LabelSelectors.interestIndependence),
  interestSafety: visible(LabelSelectors.interestSafety),
  interestTherapy: visible(LabelSelectors.interestTherapy),
  interestOther: visible(LabelSelectors.interestOther),

  // Step 3: Property Type
  propertyOwned: visible(LabelSelectors.propertyOwned),
  propertyRental: visible(LabelSelectors.propertyRental),
  propertyMobile: visible(LabelSelectors.propertyMobile),

  // Step 4: Contact Info
  nameInput: visible(InputSelectors.name),
  emailInput: visible(InputSelectors.email),

  // Step 5: Phone
  phoneInput: visible(InputSelectors.phone),

  // Buttons
  submitButton: visible(ButtonSelectors.submit),
} as const;

export type SelectorKey = keyof typeof Selectors;
