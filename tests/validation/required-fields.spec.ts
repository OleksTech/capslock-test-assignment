import { ErrorMessages } from '../../src/constants/copy';
import { ValidData } from '../../src/data';
import { expect, test } from '../../src/fixtures/test-fixtures';
import { expectStayOnStep, FormStep, goToStep } from '../../src/flows/form-flows';
import { skipIfFeatureMissing } from '../../src/utils/test-skips';

test.describe('Required Fields Validation @validation', () => {
  test.beforeEach(({ landing }) => {
    skipIfFeatureMissing(test, landing, 'hasZipCode', 'Landing has no ZIP step');
  });

  test('should not proceed without entering ZIP code', async ({
    formPage,
    formAssertions,
    landing,
  }) => {
    skipIfFeatureMissing(test, landing, 'hasZipCode', 'Landing has no ZIP code step');
    await formPage.fillZipCode('');
    await formPage.submitZipCode();

    await expectStayOnStep(formPage, formAssertions, FormStep.ZIP_CODE);
  });

  test('should not proceed without selecting interest', async ({
    formPage,
    formAssertions,
    landing,
  }) => {
    skipIfFeatureMissing(test, landing, 'hasInterests', 'Landing has no interests step');
    await goToStep(formPage, FormStep.INTERESTS);

    await formPage.submitInterests();

    await expectStayOnStep(formPage, formAssertions, FormStep.INTERESTS);
    await expect(
      formPage.formContainer.getByText(ErrorMessages.selection.required, { exact: false })
    ).toBeVisible();
  });

  test('should not proceed without entering name', async ({
    formPage,
    formAssertions,
    landing,
  }) => {
    skipIfFeatureMissing(test, landing, 'hasContactInfo', 'Landing has no contact info step');
    await goToStep(formPage, FormStep.CONTACT_INFO);

    await formPage.fillName('');
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should not proceed without entering email', async ({
    formPage,
    formAssertions,
    landing,
  }) => {
    skipIfFeatureMissing(test, landing, 'hasContactInfo', 'Landing has no contact info step');
    await goToStep(formPage, FormStep.CONTACT_INFO);

    await formPage.fillName(ValidData.user.name);
    await formPage.fillEmail('');
    await formPage.submitContactInfo();

    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should not submit without entering phone number', async ({
    formPage,
    formAssertions,
    landing,
  }) => {
    skipIfFeatureMissing(test, landing, 'hasPhone', 'Landing has no phone step');
    await goToStep(formPage, FormStep.PHONE);

    await formPage.fillPhone('');
    await formPage.submitForm();

    await expectStayOnStep(formPage, formAssertions, FormStep.PHONE);
  });

  test('should not proceed without selecting property type', async ({
    formPage,
    formAssertions,
    landing,
  }) => {
    skipIfFeatureMissing(test, landing, 'hasPropertyType', 'Landing has no property type step');
    await goToStep(formPage, FormStep.PROPERTY_TYPE);

    await formPage.submitPropertyType();

    await expectStayOnStep(formPage, formAssertions, FormStep.PROPERTY_TYPE);
    await expect(formPage.formContainer.getByText(ErrorMessages.selection.required)).toBeVisible();
  });
});
