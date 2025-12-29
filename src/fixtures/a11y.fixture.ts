import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/**
 * Accessibility fixture: provides an AxeBuilder instance bound to the current page.
 */
export const a11y = async ({ page }: { page: Page }, use: (value: AxeBuilder) => Promise<void>) => {
  const axe = new AxeBuilder({ page });
  await use(axe);
};
