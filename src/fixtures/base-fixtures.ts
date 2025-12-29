import { expect, test as base } from '@playwright/test';

import { landing } from './landing.fixture';
import type { BaseFixtures } from './types';

/**
 * Base fixtures that are global (shared across all domains).
 * Domain fixtures (form flow, a11y, etc.) should extend this.
 */
export const baseTest = base.extend<BaseFixtures>({
  landing,
});

export { expect };
