import { defineConfig, devices } from '@playwright/test';

import { getConfig, getEnvironment, resolveBaseURL } from './src/config/environments';
import { getDefaultLanding } from './src/config/landing';

const envConfig = getConfig();
const defaultLanding = getDefaultLanding();
const baseURL = resolveBaseURL(defaultLanding);

/**
 * Playwright configuration for scalable multi-landing testing
 * @see https://playwright.dev/docs/test-configuration
 */
const projects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    grepInvert: /@a11y|@percy/, // Exclude tests that have dedicated projects
  },

  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 5'] },
    grep: /@mobile/,
  },

  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
    grep: /@cross-browser/,
  },

  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
    grep: /@cross-browser/,
  },

  {
    name: 'a11y',
    use: { ...devices['Desktop Chrome'] },
    grep: /@a11y/,
  },

  {
    name: 'percy',
    use: { ...devices['Desktop Chrome'] },
    grep: /@percy/,
  },
];

export default defineConfig({
  testDir: './tests',

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail on CI if test.only is left */
  forbidOnly: !!process.env.CI,

  /* Retries for stability */
  retries: process.env.CI ? 2 : 0,

  /* Worker configuration */
  workers: process.env.CI
    ? Number.isNaN(Number(process.env.CI_WORKERS))
      ? undefined
      : Number(process.env.CI_WORKERS)
    : undefined,

  /* Reporter configuration */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
    ...(process.env.CI ? [['junit', { outputFile: 'test-results/junit.xml' }] as const] : []),
  ],

  /* Shared settings */
  use: {
    baseURL,
    ignoreHTTPSErrors: envConfig.ignoreHTTPSErrors,

    /* Collect artifacts */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    /* Timeouts */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* Global test timeout */
  timeout: 60000,

  /* Assertion timeout */
  expect: {
    timeout: 10000,
  },

  /* Output folders */
  outputDir: 'test-results',

  /* Test projects for different scenarios */
  projects,

  /* Metadata for reports */
  metadata: {
    environment: getEnvironment(),
    baseURL,
  },
});
