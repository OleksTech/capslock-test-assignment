/**
 * Landing configuration access (file-backed + cached).
 *
 * Replaces `landings.ts` so we don't imply "all landings live in one TS file".
 */

import fs from 'node:fs';
import path from 'node:path';

import { ValidData } from '../data';

export interface LandingConfig {
  id: string;
  name: string;
  path: string;
  baseURL: string | Record<string, string>;
  features: {
    hasZipCode: boolean;
    hasInterests: boolean;
    hasPropertyType: boolean;
    hasContactInfo: boolean;
    hasPhone: boolean;
  };
  validation: {
    zipCodeLength: number;
    phoneLength: number;
    emailPattern: RegExp;
    thankYouUrlPattern: RegExp;
  };
  /**
   * Landing-specific copy/text content
   */
  copy: {
    serviceUnavailableMessage: string;
    thankYouHeading: string;
    thankYouSubtext?: string;
    formTitle?: string;
  };
}

type RawLandingConfig = Omit<LandingConfig, 'validation'> & {
  validation: Omit<LandingConfig['validation'], 'emailPattern' | 'thankYouUrlPattern'> & {
    emailPattern: string;
    thankYouUrlPattern?: string;
  };
};

const DEFAULT_THANK_YOU_PATTERN = /\/thank[-_]?you/i;

const CONFIG_DIR = path.join(__dirname, 'landing-configs');
const landingCache = new Map<string, LandingConfig>();

function loadLandingFromFile(id: string): LandingConfig {
  const filePath = path.join(CONFIG_DIR, `${id}.json`);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawLandingConfig;

  return {
    ...raw,
    validation: {
      ...raw.validation,
      emailPattern: new RegExp(raw.validation.emailPattern),
      thankYouUrlPattern: raw.validation.thankYouUrlPattern
        ? new RegExp(raw.validation.thankYouUrlPattern)
        : DEFAULT_THANK_YOU_PATTERN,
    },
  };
}

export function getLanding(id: string): LandingConfig {
  const cached = landingCache.get(id);
  if (cached) return cached;

  try {
    const landing = loadLandingFromFile(id);
    landingCache.set(id, landing);
    return landing;
  } catch {
    throw new Error(
      `Landing "${id}" not found. Expected config file at ${path.join(CONFIG_DIR, `${id}.json`)}`
    );
  }
}

export function getAllLandings(): LandingConfig[] {
  const files = fs.readdirSync(CONFIG_DIR).filter((f) => f.endsWith('.json'));
  return files.map((f) => getLanding(path.basename(f, '.json')));
}

export function getDefaultLanding(): LandingConfig {
  return getLanding('walk-in-bath');
}

export function getTestData(_landingId?: string) {
  return {
    validZipCode: ValidData.serviceArea.available,
    invalidZipCode: ValidData.serviceArea.unavailable,
    validUser: ValidData.user,
  };
}
