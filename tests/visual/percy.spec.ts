import percySnapshot from '@percy/playwright';

import { InvalidData, ValidData } from '../../src/data';
import { test } from '../../src/fixtures/test-fixtures';

test.describe('Percy Visual Tests @percy', () => {
  test('ZIP code entry form', async ({ page, formPage }) => {
    await formPage.waitForReady();
    await percySnapshot(page, 'Form - ZIP Code Entry');
  });

  test('interest selection step', async ({ page, formPage, formAssertions }) => {
    await formPage.fillAndSubmitZipCode(ValidData.serviceArea.available);
    await formAssertions.expectOnInterestsStep();
    await percySnapshot(page, 'Form - Interest Selection');
  });

  test('ZIP validation error', async ({ page, formPage, formAssertions }) => {
    await formPage.fillZipCode(InvalidData.zipCode.tooShort);
    await formPage.submitZipCode();
    await formAssertions.validation.expectZipCodeError();
    await percySnapshot(page, 'Form - ZIP Validation Error');
  });

  test('service unavailable message', async ({ page, formPage, formAssertions }) => {
    await formPage.fillAndSubmitZipCode(ValidData.serviceArea.unavailable);
    await formAssertions.expectServiceUnavailableMessage();
    await percySnapshot(page, 'Form - Service Unavailable');
  });
});
