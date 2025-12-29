import { expect, Locator, Page } from '@playwright/test';

import { AbstractComponent } from './abstract-component';

/**
 * Reviews section component
 *
 * NOTE: This component relies on CSS class selectors because the page
 * lacks data-testid attributes. Consider requesting data-testid additions:
 * - data-testid="reviews-container"
 * - data-testid="reviews-toggle"
 * - data-testid="review-card"
 */
export class ReviewsComponent extends AbstractComponent {
  readonly reviews: Locator;
  readonly showToggle: Locator;

  constructor(page: Page) {
    super(page.locator('.reviewWrap'));
    this.reviews = page.locator('.review:visible');
    this.showToggle = this.root.locator('> :last-child');
  }

  async scrollIntoView(): Promise<void> {
    await this.root.scrollIntoViewIfNeeded();
  }

  async expand(): Promise<void> {
    await this.showToggle.click();
    await expect(this.root).toHaveClass(/reviewWrap_opened/);
  }

  async collapse(): Promise<void> {
    await this.showToggle.click();
    await expect(this.root).not.toHaveClass(/reviewWrap_opened/);
  }

  async isExpanded(): Promise<boolean> {
    const className = await this.root.getAttribute('class');
    return className?.includes('reviewWrap_opened') ?? false;
  }

  async getVisibleReviewCount(): Promise<number> {
    return this.reviews.count();
  }

  async expectExpanded(): Promise<void> {
    await expect(this.root).toHaveClass(/reviewWrap_opened/);
  }

  async expectCollapsed(): Promise<void> {
    await expect(this.root).not.toHaveClass(/reviewWrap_opened/);
  }
}
