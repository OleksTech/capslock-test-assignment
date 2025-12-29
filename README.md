# Capslock QA Test Framework

Automated E2E testing framework for landing pages using Playwright + TypeScript.

## Features

- **Data-driven testing** - Scale to multiple landings with JSON config files
- **Page Object Model** - Clean separation of concerns with fixtures
- **Accessibility testing** - WCAG 2.0 AA compliance with axe-core
- **Visual regression** - Screenshot comparison with configurable thresholds
- **Multi-environment** - Staging, production, development configs
- **CI/CD ready** - GitHub Actions workflow with Allure reporting

## Requirements

- Node.js 24+
- npm 11+

## Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npm test

# Run by tag
npm run test:smoke       # Critical path tests
npm run test:validation  # Input validation tests
npm run test:a11y        # Accessibility tests
npm run test:percy       # Percy visual tests
```

## Project Structure

```
├── tests/
│   ├── a11y/
│   │   └── accessibility.spec.ts
│   ├── data/
│   │   └── data-driven.spec.ts
│   ├── flows/
│   │   ├── form-submission.spec.ts
│   │   └── reviews-toggle.spec.ts
│   ├── service/
│   │   └── service-availability.spec.ts
│   ├── validation/
│   │   ├── email-validation.spec.ts
│   │   ├── name-validation.spec.ts
│   │   ├── phone-validation.spec.ts
│   │   ├── required-fields.spec.ts
│   │   └── zip-validation.spec.ts
│   └── visual/
│       └── percy.spec.ts
├── src/
│   ├── components/
│   │   ├── abstract-component.ts
│   │   └── reviews.component.ts
│   ├── config/
│   │   ├── environments.ts
│   │   ├── landing.ts
│   │   ├── landing-configs/
│   │   │   └── walk-in-bath.json
│   │   └── timeouts.ts
│   ├── constants/
│   │   ├── copy.ts
│   │   ├── form-options.ts
│   │   └── form-steps.ts
│   ├── data/
│   │   ├── index.ts
│   │   ├── invalid.ts
│   │   └── valid.ts
│   ├── fixtures/
│   │   ├── a11y.fixture.ts
│   │   ├── base-fixtures.ts
│   │   ├── form-assertions.fixture.ts
│   │   ├── form-page.fixture.ts
│   │   ├── landing.fixture.ts
│   │   ├── test-fixtures.ts
│   │   └── types.ts
│   ├── flows/
│   │   ├── flow-definition.ts
│   │   └── form-flows.ts
│   ├── helpers/
│   │   └── accessibility.ts
│   ├── pages/
│   │   ├── abstract-page.ts
│   │   ├── current-landing-page.ts
│   │   ├── form-assertions.ts
│   │   ├── form-page.ts
│   │   └── steps/
│   │       ├── contact-step.ts
│   │       ├── interest-step.ts
│   │       ├── phone-step.ts
│   │       ├── property-step.ts
│   │       └── zip-step.ts
│   ├── scripts/
│   ├── selectors/
│   │   ├── buttons.ts
│   │   ├── data-attributes.ts
│   │   ├── index.ts
│   │   ├── inputs.ts
│   │   ├── labels.ts
│   │   ├── messages.ts
│   │   └── test-ids.ts
│   └── utils/
│       ├── landing-validation.ts
│       ├── locators.ts
│       ├── logger.ts
│       ├── random.ts
│       ├── test-skips.ts
│       └── waits.ts
├── .github/workflows/
│   └── playwright.yml
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Test Tags

| Tag              | Description            | Count |
| ---------------- | ---------------------- | ----- |
| `@smoke`         | Critical path tests    | ~10   |
| `@validation`    | Input validation tests | ~25   |
| `@a11y`          | Accessibility tests    | 3     |
| `@percy`         | Percy visual tests     | 4     |
| `@cross-browser` | Multi-browser tests    | 3     |
| `@mobile`        | Mobile viewport tests  | 3     |

Total: **45 tests**

## Commands

```bash
# Test execution
npm test                    # All tests
npm run test:headed         # With browser UI
npm run test:ui             # Playwright UI mode
npm run test:debug          # Debug mode

# By tag
npm run test:smoke          # @smoke
npm run test:validation     # @validation
npm run test:a11y           # @a11y
npm run test:percy          # @percy (requires PERCY_TOKEN)

# By environment
npm run test:staging        # TEST_ENV=staging
npm run test:prod           # TEST_ENV=production

# Reports
npm run report              # Playwright HTML report
npm run report:allure       # Allure report

# Code quality
npm run lint                # ESLint check
npm run lint:fix            # ESLint fix
npm run format              # Prettier format
npm run format:check        # Prettier check

# Docker
npm run docker:build
npm run docker:test
```

## Configuration

### Environment Variables

| Variable     | Description                      | Default      |
| ------------ | -------------------------------- | ------------ |
| `TEST_ENV`   | Environment (staging/production) | staging      |
| `LANDING_ID` | Specific landing to test         | walk-in-bath |
| `CI`         | CI mode (disables retries)       | false        |

### Landing Configs

Add new landings as JSON files in `src/config/landing-configs/`:

```json
{
  "id": "my-landing",
  "name": "My Landing Page",
  "path": "/my-landing",
  "features": {
    "hasZipCode": true,
    "hasPhone": true,
    "hasReviews": true
  },
  "validation": {
    "zipCodeLength": 5,
    "phoneLength": 10,
    "emailPattern": "^[^@]+@[^@]+\\.[^@]+$",
    "thankYouUrlPattern": "\\/thank[-_]?you"
  },
  "copy": {
    "serviceUnavailableMessage": "Sorry, we don't service your area",
    "nameErrorFullName": "Full name should contain both first and last name",
    "nameErrorInvalidChars": "Name should consist only of latin letters"
  }
}
```

## Architecture

### Selector Strategy

Priority order:

1. `data-testid` - Most stable
2. `getByRole()` - Accessibility-friendly
3. `:visible` pseudo-selector - Handles multiple matches
4. CSS fallbacks - Last resort

### Page Objects

- **FormPage** - UI interactions only
- **FormAssertions** - Assertions (Single Responsibility)
- **CurrentLandingPage** - Landing readiness logic

### Fixtures

Custom Playwright fixtures provide dependency injection:

```typescript
test('example', async ({ formPage, formAssertions, landing }) => {
  await formPage.fillZipCode('90210');
  await formAssertions.expectOnInterestsStep();
});
```

### Flow Helpers

Reusable navigation and assertion patterns:

```typescript
import { goToStep, expectStayOnStep, FormStep } from '../src/flows/form-flows';

await goToStep(formPage, FormStep.PHONE);
await expectStayOnStep(formPage, formAssertions, FormStep.PHONE);
```

## Code Quality

- **ESLint** - Linting with TypeScript support
  - Import sorting (`simple-import-sort`)
  - No floating promises (critical for Playwright)
  - Unused variable detection
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks via lint-staged
- **EditorConfig** - Cross-editor consistency

## Tech Stack

| Tool       | Version | Purpose       |
| ---------- | ------- | ------------- |
| Node.js    | 24+     | Runtime       |
| Playwright | 1.57    | E2E testing   |
| TypeScript | 5.7     | Type safety   |
| axe-core   | 4.10    | Accessibility |
| Faker.js   | 10.1    | Test data     |
| Pino       | 10.1    | Logging       |
| Allure     | 3.0     | Reporting     |
| ESLint     | 9.0     | Linting       |
| Prettier   | 3.0     | Formatting    |
| Husky      | 9.0     | Git hooks     |

## Known Defects

| ID         | Summary                              | Severity |
| ---------- | ------------------------------------ | -------- |
| DEFECT-001 | Phone accepts >10 digits             | Medium   |
| DEFECT-002 | Missing HTML5 required attrs         | Low      |
| DEFECT-003 | Proceeds without selecting interests | Medium   |

See [DEFECTS.md](./DEFECTS.md) for details.

## Documentation

| Document                                                     | Description                             |
| ------------------------------------------------------------ | --------------------------------------- |
| [Scenario Selection](./docs/SCENARIO-SELECTION.md)           | Why these test scenarios were chosen    |
| [Improvements](./docs/IMPROVEMENTS.md)                       | Scalability & maintainability decisions |
| [Additional Improvements](./docs/ADDITIONAL-IMPROVEMENTS.md) | Extra enhancements beyond requirements  |
| [Defects](./DEFECTS.md)                                      | Bugs found during testing               |

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`):

1. Install dependencies
2. Run linting
3. Execute tests (excluding visual on CI)
4. Upload artifacts (reports, screenshots)
5. Publish Allure report

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run lint && npm test`
4. Commit (husky will run lint-staged)
5. Open PR
