import type { Page } from '@playwright/test';

import type { LandingConfig } from '../config/landing';
import { FormPage } from '../pages/form-page';

/**
 * Form page fixture: constructs FormPage + navigates + waits for readiness.
 */
export const formPage = async (
  { page, landing }: { page: Page; landing: LandingConfig },
  use: (value: FormPage) => Promise<void>
) => {
  const formPage = new FormPage(page, landing);
  await formPage.open();
  await formPage.waitForReady();
  await use(formPage);
};
