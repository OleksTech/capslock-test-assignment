import { ReviewsComponent } from '../../src/components/reviews.component';
import { expect, test } from '../../src/fixtures/test-fixtures';

test.describe('Reviews', () => {
  test('Show more toggles expanded reviews and collapses back', async ({ page, formPage }) => {
    void formPage;

    const reviews = new ReviewsComponent(page);

    await reviews.scrollIntoView();
    await reviews.expectCollapsed();

    const initialCount = await reviews.getVisibleReviewCount();

    await reviews.expand();

    const expandedCount = await reviews.getVisibleReviewCount();
    expect(expandedCount).toBeGreaterThan(initialCount);

    await reviews.collapse();
  });
});
