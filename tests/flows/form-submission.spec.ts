import { ValidData } from '../../src/data';
import { expect, test } from '../../src/fixtures/test-fixtures';

test.describe('Form Submission', () => {
  test('should successfully submit form with valid data and redirect to thank you page @smoke @cross-browser @mobile', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.completeFormWithData({
      zipCode: ValidData.user.zipCode,
      interest: ValidData.defaults.interest,
      propertyType: ValidData.defaults.propertyType,
      name: ValidData.user.name,
      email: ValidData.user.email,
      phone: ValidData.user.phone,
    });

    await formAssertions.expectThankYouPage();
  });

  test('should navigate through all form steps correctly @smoke', async ({ formPage }) => {
    await expect(formPage.zipCodeInput).toBeVisible();

    await formPage.fillAndSubmitZipCode(ValidData.user.zipCode);

    await expect(formPage.independenceOption).toBeVisible();
    await expect(formPage.safetyOption).toBeVisible();

    await formPage.selectInterestAndProceed(ValidData.defaults.interest);

    await expect(formPage.ownedHouseOption).toBeVisible();
    await expect(formPage.rentalOption).toBeVisible();

    await formPage.selectPropertyTypeAndProceed(ValidData.defaults.propertyType);

    await expect(formPage.nameInput).toBeVisible();
    await expect(formPage.emailInput).toBeVisible();

    await formPage.fillContactInfoAndProceed(ValidData.user.name, ValidData.user.email);

    await expect(formPage.phoneInput).toBeVisible();
    await expect(formPage.submitButton).toBeVisible();
  });
});
