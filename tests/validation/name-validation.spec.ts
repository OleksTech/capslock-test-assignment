import { InvalidData, ValidData } from '../../src/data';
import { test } from '../../src/fixtures/test-fixtures';
import { expectStayOnStep, FormStep, goToStep } from '../../src/flows/form-flows';
import { skipIfFeatureMissing } from '../../src/utils/test-skips';

test.describe('Name Validation @validation', () => {
  test.beforeEach(async ({ formPage, landing }) => {
    skipIfFeatureMissing(test, landing, 'hasPhone', 'Landing has no contact info step');
    await goToStep(formPage, FormStep.CONTACT_INFO);
  });

  test('should show error and block submission with single name (missing last name)', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(InvalidData.name.firstName);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.validation.expectNameError('fullName');
    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should show error and block submission with only first name', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(InvalidData.name.onlyFirstName);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.validation.expectNameError('fullName');
    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should show error when name contains only numbers', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(InvalidData.name.withNumbers);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.validation.expectNameError('invalidChars');
    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should show error when name contains numbers mixed with letters', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(InvalidData.name.numbersAndLetters);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.validation.expectNameError('invalidChars');
    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should show error when name contains invalid special characters', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(InvalidData.name.specialChars);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.validation.expectNameError('invalidChars');
    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should not proceed with only spaces as name', async ({ formPage, formAssertions }) => {
    await formPage.fillName(InvalidData.name.onlySpaces);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should proceed with valid full name (first and last) @smoke', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(ValidData.user.name);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.steps.expectVisible(FormStep.PHONE);
  });

  test("should accept name with apostrophe (O'Connor)", async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.nameFormats.withApostrophe);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.steps.expectVisible(FormStep.PHONE);
  });

  test('should accept name with hyphen (Mary-Jane)', async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.nameFormats.withHyphen);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.steps.expectVisible(FormStep.PHONE);
  });

  test('should accept name with dot (J. Robert)', async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.nameFormats.withDot);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.steps.expectVisible(FormStep.PHONE);
  });

  test('should accept name with underscore', async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.nameFormats.withUnderscore);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.steps.expectVisible(FormStep.PHONE);
  });

  test('should accept name with multiple special characters', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillName(ValidData.nameFormats.withMultipleSpecials);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.steps.expectVisible(FormStep.PHONE);
  });
});
