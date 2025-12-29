# Scenario Selection Rationale

The test suite was designed to cover the most critical business paths while ensuring high lead quality and a seamless user experience.

## 1. Critical Path (The "Happy Path")

- **Form Submission Flow**: The primary goal of a landing page is lead generation. We test the full multi-step funnel (ZIP to Phone) to ensure the conversion path is never broken.
- **Service Availability**: Validating that users outside service areas are handled correctly (showing appropriate messaging) protects the business from low-quality leads.

## 2. Input Validation (Data Integrity)

- **Validation Rules**: We selected scenarios for Email, Phone, and ZIP code validation to ensure data entering the CRM is formatted correctly.
- **Error Feedback**: Testing that error messages appear (and disappear) correctly is vital for UX and reducing form abandonment.

## 3. Accessibility (A11y)

- **WCAG 2.0 Compliance**: Automated axe-core scans are included to ensure the pages are usable by everyone and to mitigate legal risks/SEO penalties associated with poor accessibility.

## 4. Visual Integrity

- **Cross-Resolution Visuals**: Using Percy to catch CSS regressions that don't necessarily break functionality but damage brand trust (e.g., overlapping elements on mobile).

## 5. Performance & Reliability

- **Service Availability**: Lightweight checks to ensure the landing page and its critical assets are reachable across different environments.
