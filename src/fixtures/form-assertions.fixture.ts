import { FormAssertions } from '../pages/form-assertions';
import type { FormPage } from '../pages/form-page';

/**
 * Assertions fixture: provides `formAssertions` bound to the active FormPage.
 */
export const formAssertions = async (
  { formPage }: { formPage: FormPage },
  use: (value: FormAssertions) => Promise<void>
) => {
  const assertions = new FormAssertions(formPage);
  await use(assertions);
};
