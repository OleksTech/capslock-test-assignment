export const InvalidData = {
  zipCode: {
    tooShort: '1234',
    tooLong: '123456',
    withLetters: '1234a',
    empty: '',
    withSpaces: '123 45',
    withDash: '12345-6789',
  },

  name: {
    firstName: 'Oleksii',
    empty: '',
    onlySpaces: '   ',
    onlyFirstName: 'John',
    withNumbers: '12312321312',
    numbersAndLetters: 'John123',
    specialChars: 'John@Doe!',
  },

  email: {
    noAtSymbol: 'johndoe.example.com',
    noDomain: 'john@',
    noUsername: '@example.com',
    noTLD: 'john@example',
    empty: '',
    withSpaces: 'john doe@example.com',
  },

  phone: {
    tooShort: '123456789',
    tooLong: '12345678901',
    withLetters: '555123456a',
    empty: '',
    withDashes: '555-123-4567',
    withParens: '(555)1234567',
  },
} as const;
