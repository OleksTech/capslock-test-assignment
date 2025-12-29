import { getLanding } from '../../src/config/landing';
import { FormStep } from '../../src/constants/form-steps';
import { InvalidData, ValidData } from '../../src/data';
import { forEachLanding, test } from '../../src/fixtures/test-fixtures';
import { expectStayOnStep, goToStep } from '../../src/flows/form-flows';

const landingIds = (process.env.LANDING_IDS ?? process.env.LANDING_ID ?? 'walk-in-bath')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const landings = landingIds.map((id) => getLanding(id));

forEachLanding(landings, (landing) => {
  test.describe(`[${landing.id}] ${landing.name}`, () => {
    test(`should validate ZIP code length (${landing.validation.zipCodeLength} digits) @smoke`, async ({
      formPage,
      formAssertions,
    }) => {
      await formPage.fillZipCode(InvalidData.zipCode.tooShort);
      await formPage.submitZipCode();

      await expectStayOnStep(formPage, formAssertions, FormStep.ZIP_CODE);
    });

    test(`should validate phone length (${landing.validation.phoneLength} digits) @validation`, async ({
      formPage,
      formAssertions,
    }) => {
      await goToStep(formPage, FormStep.PHONE);

      await formPage.fillPhone(InvalidData.phone.tooShort);
      await formPage.submitForm();

      await expectStayOnStep(formPage, formAssertions, FormStep.PHONE);
    });

    test(`should accept valid data and submit @smoke`, async ({ formPage, formAssertions }) => {
      await formPage.completeFormWithData({
        zipCode: ValidData.serviceArea.available,
        name: ValidData.user.name,
        email: ValidData.user.email,
        phone: ValidData.user.phone,
      });

      await formAssertions.expectThankYouPage();
    });
  });
});
