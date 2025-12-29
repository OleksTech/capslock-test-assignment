import { Locator, Page } from '@playwright/test';

import { Timeouts } from '../config/timeouts';

/**
 * Centralized wait utilities following Playwright best practices
 *
 * PHILOSOPHY:
 * 1. Rely on Playwright's built-in auto-waiting where possible
 * 2. Use web-first assertions (toBeVisible) over manual waits
 * 3. Combine waits intelligently for complex scenarios
 * 4. Always use timeouts to prevent infinite hangs
 *
 * @see https://playwright.dev/docs/actionability
 */
export class Waits {
  /**
   * Wait for element to be visible and ready for interaction
   *
   * @example
   * await Waits.forElement(formPage.submitButton);
   * await Waits.forElement(formPage.nameInput, { timeout: 5000 });
   */
  static async forElement(
    locator: Locator,
    options?: {
      timeout?: number;
      state?: 'visible' | 'hidden' | 'attached' | 'detached';
    }
  ): Promise<void> {
    await locator.waitFor({
      state: options?.state ?? 'visible',
      timeout: options?.timeout ?? Timeouts.elementVisible,
    });
  }

  /**
   * Wait for element to be visible AND interactable (not disabled/readonly)   *
   * @example
   * await Waits.forInteractable(formPage.submitButton);
   * await formPage.submitButton.click(); // Safe to click now
   */
  static async forInteractable(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await Promise.all([
      locator.waitFor({
        state: 'visible',
        timeout: options?.timeout ?? Timeouts.elementVisible,
      }),
      // Ensure element is enabled (not disabled)
      locator.isEnabled().then((enabled) => {
        if (!enabled) {
          throw new Error('Element is visible but disabled');
        }
      }),
    ]);
  }

  /**
   * Wait for element to be hidden/removed from DOM
   *
   * @example
   * await Waits.forElementHidden(page.locator('.loading-spinner'));
   */
  static async forElementHidden(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({
      state: 'hidden',
      timeout: options?.timeout ?? Timeouts.elementVisible,
    });
  }

  /**
   * Wait for form step transition
   *
   * NOTE: Avoids 'networkidle' as it's unreliable on Firefox/WebKit.
   * Uses element visibility as the primary signal.
   *
   * @example
   * await formPage.submitZipCode();
   * await Waits.forStepTransition(page, formPage.independenceOption);
   */
  static async forStepTransition(
    page: Page,
    stepLocator: Locator,
    options?: { timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout ?? Timeouts.pageStateChange;

    // Wait for DOM to be ready, then for element visibility
    // Avoid 'networkidle' - unreliable on Firefox/WebKit
    await page.waitForLoadState('domcontentloaded', { timeout });
    await stepLocator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for page navigation to complete
   *
   * NOTE: Defaults to 'load' instead of 'networkidle' for cross-browser reliability.
   *
   * @example
   * await formPage.submitForm();
   * await Waits.forNavigation(page);
   */
  static async forNavigation(
    page: Page,
    options?: {
      timeout?: number;
      waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    }
  ): Promise<void> {
    await page.waitForLoadState(options?.waitUntil ?? 'load', {
      timeout: options?.timeout ?? Timeouts.pageNavigation,
    });
  }

  /**
   * Wait for URL to match a pattern
   *
   * NOTE: Uses 'load' instead of 'networkidle' for Firefox/WebKit compatibility.
   *
   * @example
   * await Waits.forUrlPattern(page, /\/thank-you/);
   */
  static async forUrlPattern(
    page: Page,
    pattern: RegExp | string,
    options?: { timeout?: number }
  ): Promise<void> {
    // Use 'load' instead of 'networkidle' - more reliable across browsers
    await page.waitForURL(pattern, {
      timeout: options?.timeout ?? Timeouts.pageNavigation,
      waitUntil: 'load',
    });
  }

  /**
   * Wait for specific text to appear on page
   *
   * @example
   * await Waits.forText(page, 'Thank you for your submission');
   */
  static async forText(
    page: Page,
    text: string | RegExp,
    options?: { timeout?: number }
  ): Promise<void> {
    await page.getByText(text).waitFor({
      state: 'visible',
      timeout: options?.timeout ?? Timeouts.elementVisible,
    });
  }

  /**
   * Wait for multiple elements to be visible
   * BEST PRACTICE: Use when a section with multiple elements loads
   *
   * @example
   * await Waits.forMultipleElements([
   *   formPage.nameInput,
   *   formPage.emailInput,
   *   formPage.phoneInput
   * ]);
   */
  static async forMultipleElements(
    locators: Locator[],
    options?: { timeout?: number }
  ): Promise<void> {
    await Promise.all(
      locators.map((locator) =>
        locator.waitFor({
          state: 'visible',
          timeout: options?.timeout ?? Timeouts.elementVisible,
        })
      )
    );
  }

  /**
   * Wait for API response
   * BEST PRACTICE: Use for validating network requests
   *
   * @example
   * const response = await Waits.forApiResponse(page, '/api/submit');
   * expect(response.status()).toBe(200);
   */
  static async forApiResponse(
    page: Page,
    urlPattern: string | RegExp,
    options?: { timeout?: number }
  ): Promise<Response> {
    const response = await page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout: options?.timeout ?? Timeouts.apiResponse }
    );
    return response;
  }

  /**
   * Wait for condition with retry logic
   * BEST PRACTICE: Use for complex conditions that might be flaky
   *
   * @example
   * await Waits.forCondition(async () => {
   *   const text = await element.textContent();
   *   return text?.includes('Success');
   * }, { timeout: 5000, interval: 500 });
   */
  static async forCondition(
    condition: () => Promise<boolean>,
    options?: {
      timeout?: number;
      interval?: number;
      errorMessage?: string;
    }
  ): Promise<void> {
    const timeout = options?.timeout ?? Timeouts.elementVisible;
    const interval = options?.interval ?? 100;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(options?.errorMessage ?? `Condition not met within ${timeout}ms timeout`);
  }

  /**
   * Smart wait: Combines element visibility + page load + fonts ready
   *
   * NOTE: Uses 'load' instead of 'networkidle' for cross-browser reliability.
   *
   * @example
   * await Waits.forStable(page, formPage.submitButton);
   */
  static async forStable(
    page: Page,
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<void> {
    const timeout = options?.timeout ?? Timeouts.pageStateChange;

    // Wait for element visibility and page load (avoid networkidle)
    await Promise.all([
      locator.waitFor({ state: 'visible', timeout }),
      page.waitForLoadState('load', { timeout }),
      // Wait for web fonts to be ready
      page.evaluate(() => document.fonts.ready),
    ]);

    // Small buffer for layout stability
    await page.waitForTimeout(100);
  }

  /**
   * No-op wait for specific duration (USE SPARINGLY!)
   * ⚠️ WARNING: Avoid this unless absolutely necessary
   * Prefer auto-waiting or condition-based waits
   *
   * @example
   * await Waits.forDuration(1000); // Last resort only!
   */
  static async forDuration(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Response type alias for better type safety
 */
type Response = Awaited<ReturnType<Page['waitForResponse']>>;
