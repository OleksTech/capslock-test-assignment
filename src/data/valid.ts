export const ValidData = {
  user: {
    zipCode: '90210',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
  },

  edgeCases: {
    zipCode: '00001',
    phone: '0001234567',
    email: 'test+filter@example.com',
  },

  nameFormats: {
    withApostrophe: "O'Connor Smith",
    withHyphen: 'Mary-Jane Watson',
    withDot: 'J. Robert Oppenheimer',
    withUnderscore: 'John_Doe Test',
    withMultipleSpecials: "Mary-Jane O'Brien",
  },

  serviceArea: {
    available: '90210',
    unavailable: '12345',
  },

  defaults: {
    interest: 'safety' as const,
    propertyType: 'owned' as const,
  },
} as const;

export const FormOptions = {
  interests: {
    independence: 'Independence',
    safety: 'Safety',
    therapy: 'Therapy',
    other: 'Other',
  },

  propertyTypes: {
    owned: 'Owned House / Condo',
    rental: 'Rental Property',
    mobile: 'Mobile Home',
  },
} as const;

export type ValidUserData = typeof ValidData.user;
