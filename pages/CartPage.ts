import { Page, Locator } from "@playwright/test";

/**
 * CartPage — Page Object for /cart
 *
 * Covers:
 *  - Empty cart state ("Your cart is empty")
 *  - Cart item rows: product name, unit price, quantity controls, row total, Remove button
 *  - Order total
 *  - "Clear Cart" button
 *  - "Checkout" button
 *  - Post-checkout success message
 *  - "Continue Shopping" link
 */
export class CartPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly emptyMessage: Locator;
  readonly continueShoppingLink: Locator;

  readonly decrementButton: Locator;
  readonly incrementButton: Locator;
  readonly removeButton: Locator;
  readonly clearCartButton: Locator;
  readonly checkoutButton: Locator;

  readonly orderTotal: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading              = page.locator('[data-testid="cart-title"]');
    this.emptyMessage         = page.locator('[data-testid="empty-cart"]');
    this.continueShoppingLink = page.locator('[data-testid="continue-shopping"]');

    this.decrementButton = page.locator('button:has-text("−")').first();
    this.incrementButton = page.locator('button:has-text("+")').first();
    this.removeButton    = page.locator('button:has-text("Remove")').first();
    this.clearCartButton = page.locator('button:has-text("Clear Cart")');
    this.checkoutButton  = page.locator('button:has-text("Checkout")');

    this.orderTotal    = page.locator("main").getByText(/order total/i).locator("..").locator("..").getByText(/\$[\d.]+/).last();
    this.successMessage = page.locator("main").getByText(/order placed successfully/i);
  }

  async goto() {
    await this.page.goto("/cart");
    await this.page.waitForTimeout(500); // Allow cart to hydrate
  }

  async clickCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickClearCart() {
    await this.clearCartButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickRemove() {
    await this.removeButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickDecrement() {
    await this.decrementButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickIncrement() {
    await this.incrementButton.click();
    await this.page.waitForTimeout(500);
  }

  async getMainText(): Promise<string> {
    return this.page.locator("main").innerText();
  }

  /** Returns the displayed quantity value for the first cart item */
  async getQuantityValue(): Promise<string> {
    // Quantity is rendered between the − and + buttons
    const quantityEl = this.page.locator("main").getByText(/^\d+$/).first();
    return quantityEl.innerText();
  }
}

