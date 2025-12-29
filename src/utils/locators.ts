import { Locator, Page } from '@playwright/test';

/**
 * Prefer data-testid; fall back to a CSS locator when missing.
 * Uses Locator.or() so either locator works at runtime.
 */
export function locatorWithFallback(page: Page, testId: string, fallbackSelector: string): Locator {
  return page.getByTestId(testId).or(page.locator(fallbackSelector));
}
