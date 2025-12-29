import { resolveBaseURL } from '../config/environments';
import type { LandingConfig } from '../config/landing';
import { a11y } from './a11y.fixture';
import { baseTest, expect } from './base-fixtures';
import { formAssertions } from './form-assertions.fixture';
import { formPage } from './form-page.fixture';
import type { TestFixtures } from './types';

export const test = baseTest.extend<TestFixtures>({
  formPage,
  formAssertions,
  a11y,
});

export { expect };

/**
 * Data-driven test helper for running tests across multiple landings
 */
export function forEachLanding(
  landings: LandingConfig[],
  testFn: (landing: LandingConfig) => void
) {
  for (const landing of landings) {
    test.describe(`[${landing.id}] ${landing.name}`, () => {
      test.use({
        // eslint-disable-next-line no-empty-pattern
        landing: async ({}, use) => {
          await use(landing);
        },
        baseURL: resolveBaseURL(landing),
      });
      testFn(landing);
    });
  }
}
