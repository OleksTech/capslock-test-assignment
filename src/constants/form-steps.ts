export const FormStep = {
  ZIP_CODE: 1,
  INTERESTS: 2,
  PROPERTY_TYPE: 3,
  CONTACT_INFO: 4,
  PHONE: 5,
} as const;

export type Step = (typeof FormStep)[keyof typeof FormStep];
