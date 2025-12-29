/**
 * Message element SELECTORS only - structural locators
 * Text content belongs in landing config, not here
 */
export const MessageSelectors = {
  // Structural selectors - how to FIND elements
  serviceUnavailableContainer: '[data-sorry-fade-in]',
  thankYouHeading: 'h1, h2, h3', // Structure only, text matching done via landing config
} as const;

export type MessageSelectorKey = keyof typeof MessageSelectors;
