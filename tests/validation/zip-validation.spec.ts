import { InvalidData, ValidData } from '../../src/data';
import { expect, test } from '../../src/fixtures/test-fixtures';
import { expectStayOnStep, FormStep } from '../../src/flows/form-flows';
import { skipIfFeatureMissing } from '../../src/utils/test-skips';

test.describe('ZIP Code Validation @validation', () => {
  test.beforeEach(({ landing }) => {
    skipIfFeatureMissing(test, landing, 'hasZipCode', 'Landing has no ZIP code step');
  });

  test('should not proceed with ZIP code shorter than 5 digits', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillZipCode(InvalidData.zipCode.tooShort);
    await formPage.submitZipCode();

    await expectStayOnStep(formPage, formAssertions, FormStep.ZIP_CODE);
  });

  test('should not proceed with ZIP code longer than 5 digits', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillZipCode(InvalidData.zipCode.tooLong);
    await formPage.submitZipCode();

    await expectStayOnStep(formPage, formAssertions, FormStep.ZIP_CODE);
  });

  test('should not proceed with ZIP code containing non-digit characters', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillZipCode(InvalidData.zipCode.withLetters);
    await formPage.submitZipCode();

    await expectStayOnStep(formPage, formAssertions, FormStep.ZIP_CODE);
  });

  test('should proceed to next step with valid 5-digit ZIP code @smoke', async ({ formPage }) => {
    await formPage.fillAndSubmitZipCode(ValidData.user.zipCode);

    await expect(formPage.independenceOption).toBeVisible();
  });
});
