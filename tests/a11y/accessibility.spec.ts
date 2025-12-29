import { ValidData } from '../../src/data';
import { test } from '../../src/fixtures/test-fixtures';
import { checkAccessibility, checkFormAccessibility } from '../../src/helpers/accessibility';

test.describe('Accessibility @a11y', () => {
  test('form should meet WCAG 2.0 AA standards', async ({ page, formPage }) => {
    void formPage;
    await checkFormAccessibility(page);
  });

  test('step 2 should have accessible form controls', async ({
    page,
    formPage,
    formAssertions,
  }) => {
    await formPage.fillAndSubmitZipCode(ValidData.serviceArea.available);
    await formAssertions.expectOnInterestsStep();

    await checkAccessibility(page);
  });

  test('error states should be accessible', async ({ page, formPage }) => {
    await formPage.submitZipCode();

    await checkAccessibility(page);
  });
});
