# Defects Found During Testing

## Summary

During automated testing of the form at https://test-qa.capslock.global, the following defects were identified. Tests have been implemented according to the **requirements**, not the current (buggy) behavior.

| ID         | Summary                              | Severity | Status |
| ---------- | ------------------------------------ | -------- | ------ |
| DEFECT-001 | Phone accepts >10 digits             | Medium   | Open   |
| DEFECT-002 | Missing HTML5 required attrs         | Low      | Open   |
| DEFECT-003 | Proceeds without selecting interests | Medium   | Open   |

---

## DEFECT-001: Phone Number Validation Accepts More Than 10 Digits

**Severity**: Medium  
**Component**: Phone Number Validation (Step 5)  
**Status**: Open

### Description

The phone number field accepts and submits phone numbers with more than 10 digits, violating the requirement that phone numbers must contain **exactly 10 digits**.

### Steps to Reproduce

1. Navigate to https://test-qa.capslock.global
2. Complete steps 1-4 with valid data:
   - ZIP Code: `90210`
   - Interest: Any selection
   - Property Type: Any selection
   - Name: `John Doe`
   - Email: `john@example.com`
3. On step 5, enter phone number with 11 digits: `12345678901`
4. Click "Submit Your Request"

### Expected Behavior

- Form should **reject** the submission
- User should see a validation error indicating phone must be exactly 10 digits
- Form should remain on step 5

### Actual Behavior

- Form **accepts** the 11-digit phone number
- User is redirected to the "Thank You" page
- No validation error is displayed

### Requirement Reference

> "Phone number: must contain exactly 10 digits."

### Affected Test

`tests/validation/phone-validation.spec.ts` - "should not submit with phone number longer than 10 digits"

---

## DEFECT-002: Missing HTML5 Required Attributes on Form Fields

**Severity**: Low  
**Component**: Form Field Attributes  
**Status**: Open

### Description

According to the requirements, "All fields are required." However, inspection of the HTML shows that the `required` attribute is only set on the email field, not on other mandatory fields (name, phone, zip code).

### Evidence

From page exploration:

```
Name required: null
Email required: [empty string - means attribute is present]
Phone required: null
ZIP Code required: null
```

### Expected Behavior

All required form fields should have the HTML5 `required` attribute for proper browser-native validation and accessibility.

### Actual Behavior

Only the email field has the `required` attribute.

### Impact

- Reduced accessibility (screen readers may not announce fields as required)
- Browser-native validation is not fully utilized
- Inconsistent validation behavior

### Note

Despite the missing attributes, the form does appear to validate required fields server-side or via JavaScript, preventing empty submissions in most cases.

---

## DEFECT-003: Interests Step Allows Progress Without Selection

**Severity**: Medium  
**Component**: Interests (Step 2) Validation  
**Status**: Open

### Description

On the interests step, clicking "Next" with no options selected still advances to the next step, despite the requirement that at least one interest must be chosen.

### Steps to Reproduce

1. Navigate to https://test-qa.capslock.global
2. Enter a valid ZIP code (e.g., `90210`) and click Next
3. On the interests step, click Next without selecting any option

### Expected Behavior

- Form should stay on the interests step
- An error message should be shown (e.g., "Choose one of the variants")
- Progress indicator should remain on step 2/5

### Actual Behavior

- Form advances to the next step without any selection
- No validation error is displayed

### Requirement Reference

> "All fields are required."

### Affected Test

`tests/validation/required-fields.spec.ts` — "should not proceed without selecting interest"

---

## Notes on Test Implementation

Tests have been written to verify the **requirements** as specified:

- ZIP code: exactly 5 digits
- Email: valid email pattern (user@example.com)
- Phone number: exactly 10 digits
- All fields: required
- Successful submission: redirect to "Thank you" page

The following tests are expected to fail until the corresponding defects are fixed:

| Test                                                        | Defect     |
| ----------------------------------------------------------- | ---------- |
| `should not submit with phone number longer than 10 digits` | DEFECT-001 |
| `should not proceed without selecting interest`             | DEFECT-003 |
