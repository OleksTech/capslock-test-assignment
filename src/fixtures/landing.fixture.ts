import type { LandingConfig } from '../config/landing';
import { getLanding } from '../config/landing';
import { ensureLandingIsValid } from '../utils/landing-validation';

/**
 * Landing fixture: resolves `LANDING_ID` → LandingConfig and validates it.
 */
// eslint-disable-next-line no-empty-pattern
export const landing = async ({}, use: (value: LandingConfig) => Promise<void>) => {
  const landingId = process.env.LANDING_ID || 'walk-in-bath';
  const landing = getLanding(landingId);
  ensureLandingIsValid(landing);
  await use(landing);
};
