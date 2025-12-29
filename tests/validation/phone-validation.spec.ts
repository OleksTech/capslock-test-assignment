import { InvalidData, ValidData } from '../../src/data';
import { test } from '../../src/fixtures/test-fixtures';
import { expectStayOnStep, FormStep, goToStep } from '../../src/flows/form-flows';
import { skipIfFeatureMissing } from '../../src/utils/test-skips';

test.describe('Phone Number Validation @validation', () => {
  test.beforeEach(async ({ formPage, landing }) => {
    skipIfFeatureMissing(test, landing, 'hasPhone', 'Landing has no phone field');
    await goToStep(formPage, FormStep.PHONE);
  });

  test('should not submit with phone number shorter than 10 digits', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillPhone(InvalidData.phone.tooShort);
    await formPage.submitForm();

    await expectStayOnStep(formPage, formAssertions, FormStep.PHONE);
  });

  test('should not submit with phone number longer than 10 digits', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillPhone(InvalidData.phone.tooLong);
    await formPage.submitForm();

    await expectStayOnStep(formPage, formAssertions, FormStep.PHONE);
  });

  test('should not submit with phone number containing non-digit characters', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillPhone(InvalidData.phone.withLetters);
    await formPage.submitForm();

    await expectStayOnStep(formPage, formAssertions, FormStep.PHONE);
  });

  test('should submit successfully with valid 10-digit phone number @smoke', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillPhone(ValidData.user.phone);
    await formPage.submitForm();

    await formAssertions.expectThankYouPage();
  });
});
