import { Page, Locator } from "@playwright/test";

/**
 * ProductsPage — Page Object for /products
 *
 * Covers:
 *  - Navigation header (logo, nav links)
 *  - Search input
 *  - Product cards (title, price, rating, category, Add to Cart, Details)
 *  - Product count label
 */
export class ProductsPage {
  readonly page: Page;

  // ─── Navigation ───────────────────────────────────────────────────────────
  readonly logo: Locator;
  readonly navProducts: Locator;
  readonly navCart: Locator;
  readonly navChat: Locator;

  // ─── Search ───────────────────────────────────────────────────────────────
  readonly searchInput: Locator;

  // ─── Product Grid ─────────────────────────────────────────────────────────
  readonly productCountLabel: Locator;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.logo         = page.locator('[data-testid="brand-logo"]');
    this.navProducts  = page.locator('[data-testid="nav-link-products"]');
    this.navCart      = page.locator('[data-testid="nav-link-cart"]');
    this.navChat      = page.locator('[data-testid="nav-link-ai-chat"]');

    // Search
    this.searchInput  = page.locator('input[type="search"]');

    // Products
    this.productCountLabel = page.locator('main').getByText(/products available|results? for/i).first();
    this.productCards      = page.locator('main a[href^="/products/p"]').locator("..");
    this.addToCartButtons  = page.locator('button:has-text("Add to Cart")');
  }

  // ─── Navigation Helpers ───────────────────────────────────────────────────

  async goto() {
    await this.page.goto("/products");
  }

  // ─── Search Helpers ───────────────────────────────────────────────────────

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(400); // debounce
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(400);
  }

  // ─── Product Helpers ──────────────────────────────────────────────────────

  /** Returns the locator for a "Details" link for the nth product card (0-based) */
  detailsLinkAt(index: number): Locator {
    return this.page
      .locator('main a[href^="/products/p"]:has-text("Details")')
      .nth(index);
  }

  /** Returns the "Add to Cart" button for the nth product card (0-based) */
  addToCartButtonAt(index: number): Locator {
    return this.addToCartButtons.nth(index);
  }

  /** Clicks "Add to Cart" for the nth product card (0-based) */
  async addToCartAt(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  /** Navigates to the Details page for the nth product (0-based) */
  async goToDetailsAt(index: number) {
    await this.detailsLinkAt(index).click();
  }

  /** Gets the visible text of the main content area */
  async getMainText(): Promise<string> {
    return this.page.locator("main").innerText();
  }
}

