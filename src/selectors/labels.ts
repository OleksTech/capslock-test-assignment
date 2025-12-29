/**
 * Checkbox/Radio selectors using label association
 * Pattern: label[for*="key"] where key matches the input ID pattern
 */
export const LabelSelectors = {
  // Interests (checkboxes) - IDs: why-interested-{type}-{n}
  interestIndependence: 'label[for*="why-interested-independence"]',
  interestSafety: 'label[for*="why-interested-safety"]',
  interestTherapy: 'label[for*="why-interested-therapy"]',
  interestOther: 'label[for*="why-interested-other"]',

  // Property type (radios) - IDs: homeowner-{type}-{n}
  propertyOwned: 'label[for*="homeowner-owned"]',
  propertyRental: 'label[for*="homeowner-rental"]',
  propertyMobile: 'label[for*="homeowner-mobile"]',
} as const;

export type LabelSelectorKey = keyof typeof LabelSelectors;
