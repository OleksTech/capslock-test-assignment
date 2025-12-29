/**
 * Centralized timeout configuration for tests.
 * Avoids magic numbers scattered throughout the codebase.
 */

export const Timeouts = {
  assertion: 10_000,

  /** Polling timeout for page state changes (navigation, form submission) */
  pageStateChange: 10_000,

  /** Network idle timeout for form submissions */
  networkIdle: 5_000,

  /** Visual regression - wait for animations */
  animationSettle: 2_000,

  /** Wait for landing page to be ready for interactions */
  pageReady: 15_000,

  /** Element visibility timeout */
  elementVisible: 10_000,

  /** Page navigation timeout */
  pageNavigation: 30_000,

  /** API response timeout */
  apiResponse: 15_000,
} as const;
