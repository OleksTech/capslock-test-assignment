export const INTERESTS = ['independence', 'safety', 'therapy', 'other'] as const;
export const PROPERTY_TYPES = ['owned', 'rental', 'mobile'] as const;

export type Interest = (typeof INTERESTS)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
