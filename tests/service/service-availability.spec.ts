import { ValidData } from '../../src/data';
import { test } from '../../src/fixtures/test-fixtures';

test.describe('Service Availability', () => {
  test('should show service unavailable message for unsupported ZIP code', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillAndSubmitZipCode(ValidData.serviceArea.unavailable);

    await formAssertions.expectServiceUnavailableMessage();
  });

  test('should proceed with form for supported ZIP code @smoke', async ({
    formPage,
    formAssertions,
  }) => {
    await formPage.fillAndSubmitZipCode(ValidData.serviceArea.available);

    await formAssertions.expectOnInterestsStep();
  });
});
