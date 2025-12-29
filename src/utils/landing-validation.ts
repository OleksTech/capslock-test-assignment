import { LandingConfig } from '../config/landing';

/**
 * Lightweight runtime validation for landing configuration.
 * Intent: catch misconfigured landings early (before tests start).
 */
export function ensureLandingIsValid(landing: LandingConfig): void {
  if (!landing.id || !landing.name) {
    throw new Error('Landing config must include id and name.');
  }

  if (!landing.path) {
    throw new Error(`Landing "${landing.id}" must define a path.`);
  }

  const { features, validation, copy } = landing;

  if (!features || typeof features !== 'object') {
    throw new Error(`Landing "${landing.id}" must define features.`);
  }

  const requiredFeatureKeys: Array<keyof LandingConfig['features']> = [
    'hasZipCode',
    'hasInterests',
    'hasPropertyType',
    'hasPhone',
  ];

  requiredFeatureKeys.forEach((key) => {
    if (typeof features[key] !== 'boolean') {
      throw new Error(`Landing "${landing.id}" feature "${key}" must be boolean.`);
    }
  });

  if (!validation || typeof validation !== 'object') {
    throw new Error(`Landing "${landing.id}" must define validation rules.`);
  }

  if (!Number.isInteger(validation.zipCodeLength) || validation.zipCodeLength <= 0) {
    throw new Error(`Landing "${landing.id}" validation.zipCodeLength must be a positive integer.`);
  }

  if (!Number.isInteger(validation.phoneLength) || validation.phoneLength <= 0) {
    throw new Error(`Landing "${landing.id}" validation.phoneLength must be a positive integer.`);
  }

  if (!(validation.emailPattern instanceof RegExp)) {
    throw new Error(`Landing "${landing.id}" validation.emailPattern must be a RegExp.`);
  }

  if (!copy || typeof copy !== 'object') {
    throw new Error(`Landing "${landing.id}" must define copy block.`);
  }

  if (!copy.serviceUnavailableMessage) {
    throw new Error(`Landing "${landing.id}" copy.serviceUnavailableMessage is required.`);
  }

  if (!copy.thankYouHeading) {
    throw new Error(`Landing "${landing.id}" copy.thankYouHeading is required.`);
  }
}
