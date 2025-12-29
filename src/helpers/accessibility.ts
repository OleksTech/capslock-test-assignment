import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';

import { logger } from '../utils/logger';

/**
 * Accessibility testing utilities
 * Uses axe-core for WCAG compliance checks
 */

export interface A11yOptions {
  tags?: string[];
  exclude?: string[];
  include?: string[];
}

/**
 * Run accessibility audit on current page
 */
export async function checkAccessibility(page: Page, options: A11yOptions = {}): Promise<void> {
  const { tags = ['wcag2a', 'wcag2aa'], exclude = [], include } = options;

  let builder = new AxeBuilder({ page }).withTags(tags);

  if (exclude.length > 0) {
    builder = builder.exclude(exclude);
  }

  if (include) {
    builder = builder.include(include);
  }

  const results = await builder.analyze();

  if (results.violations.length > 0) {
    logger.warn('Accessibility violations found:');
    results.violations.forEach((violation) => {
      logger.warn(`  - ${violation.id}: ${violation.description}`);
      logger.warn(`    Impact: ${violation.impact}`);
      logger.warn(`    Help: ${violation.helpUrl}`);
    });
  }

  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical'
  );

  if (serious.length > 0) {
    logger.warn(`WARNING: Found ${serious.length} serious/critical accessibility violations`);
    serious.forEach((v) => {
      logger.warn(`  - ${v.id}: ${v.description} (impact: ${v.impact})`);
      logger.warn(`    Help: ${v.helpUrl}`);
    });
  }
}

export async function checkFormAccessibility(page: Page): Promise<void> {
  await checkAccessibility(page, {
    include: ['form', '[role="form"]'],
    tags: ['wcag2a', 'wcag2aa'],
  });
}
