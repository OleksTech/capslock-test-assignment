import type AxeBuilder from '@axe-core/playwright';

import type { LandingConfig } from '../config/landing';
import type { FormAssertions } from '../pages/form-assertions';
import type { FormPage } from '../pages/form-page';

export interface BaseFixtures {
  landing: LandingConfig;
}

export interface TestFixtures extends BaseFixtures {
  formPage: FormPage;
  formAssertions: FormAssertions;
  a11y: AxeBuilder;
}
