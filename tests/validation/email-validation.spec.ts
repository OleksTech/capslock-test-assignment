import { InvalidData, ValidData } from '../../src/data';
import { test } from '../../src/fixtures/test-fixtures';
import { expectStayOnStep, FormStep, goToStep } from '../../src/flows/form-flows';
import { skipIfFeatureMissing } from '../../src/utils/test-skips';

test.describe('Email Validation @validation', () => {
  test.beforeEach(async ({ formPage, landing }) => {
    skipIfFeatureMissing(test, landing, 'hasPhone', 'Landing has no contact info step');
    await goToStep(formPage, FormStep.CONTACT_INFO);
  });

  test('should not proceed with email without @ symbol', async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.user.name);
    await formPage.fillEmail(InvalidData.email.noAtSymbol);
    await formPage.submitContactInfo();

    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should not proceed with email without domain', async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.user.name);
    await formPage.fillEmail(InvalidData.email.noDomain);
    await formPage.submitContactInfo();

    await expectStayOnStep(formPage, formAssertions, FormStep.CONTACT_INFO);
  });

  test('should proceed to next step with valid email', async ({ formPage, formAssertions }) => {
    await formPage.fillName(ValidData.user.name);
    await formPage.fillEmail(ValidData.user.email);
    await formPage.submitContactInfo();

    await formAssertions.expectOnPhoneStep();
  });
});
