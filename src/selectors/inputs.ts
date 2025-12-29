export const InputSelectors = {
  zipCode: 'input[name="zipCode"]',
  name: 'input[name="name"]',
  email: 'input[name="email"]',
  phone: 'input[name="phone"]',
} as const;

export type InputSelectorKey = keyof typeof InputSelectors;
