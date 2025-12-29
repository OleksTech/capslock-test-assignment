/**
 * Environment configuration for multi-environment support
 *
 * Each landing config provides its own baseURL.
 * This module handles environment detection and settings like ignoreHTTPSErrors.
 */

export type Environment = 'staging' | 'production' | 'development';

export interface EnvironmentConfig {
  ignoreHTTPSErrors: boolean;
}

const environments: Record<Environment, EnvironmentConfig> = {
  staging: {
    ignoreHTTPSErrors: true,
  },
  production: {
    ignoreHTTPSErrors: false,
  },
  development: {
    ignoreHTTPSErrors: true,
  },
};

export { environments };

export function getEnvironment(): Environment {
  const env = process.env.TEST_ENV as Environment;
  return env && environments[env] ? env : 'staging';
}

export function getConfig(): EnvironmentConfig {
  return environments[getEnvironment()];
}

/**
 * Resolves the baseURL for a specific landing page.
 *
 * Priority:
 * 1. ENV variable override (BASE_URL or LANDING_URL)
 * 2. Landing-specific baseURL for current environment
 */
export function resolveBaseURL(landing: { baseURL: string | Record<string, string> }): string {
  const envOverride = process.env.BASE_URL || process.env.LANDING_URL;
  if (envOverride) return envOverride;

  const env = getEnvironment();

  if (typeof landing.baseURL === 'string') {
    return landing.baseURL;
  }

  const url = landing.baseURL[env];
  if (!url) {
    throw new Error(`No baseURL defined for environment "${env}" in landing config`);
  }

  return url;
}
