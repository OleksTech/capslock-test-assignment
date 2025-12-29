import { test as base } from '@playwright/test';

import { LandingConfig } from '../config/landing';

type FeatureKey = keyof LandingConfig['features'];

/**
 * Skip the current test when a landing is missing a required feature.
 * Usage: skipIfFeatureMissing(test, landing, 'hasPhone', 'Landing has no phone step');
 */
export function skipIfFeatureMissing(
  testObj: typeof base,
  landing: LandingConfig,
  feature: FeatureKey,
  reason?: string
): void {
  if (!landing.features[feature]) {
    testObj.skip(true, reason ?? `Landing "${landing.id}" missing feature "${feature}"`);
  }
}

/**
 * Check if a landing has a feature.
 * Future-looking function for future features.
 * Usage: if (hasFeature(landing, 'hasPhone')) { ... }
 * @param landing - The landing config.
 * @param feature - The feature to check for.
 * @returns True if the landing has the feature, false otherwise.
 */

export function hasFeature(landing: LandingConfig, feature: FeatureKey): boolean {
  return !!landing.features[feature];
}
