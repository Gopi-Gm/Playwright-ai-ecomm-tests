import { Page, Locator } from "@playwright/test";

/**
 * ProductDetailPage — Page Object for /products/:id
 *
 * Covers:
 *  - Product name, category, description, price, rating, stock
 *  - "Add to Cart" button
 *  - "← Back to Products" link
 */
export class ProductDetailPage {
  readonly page: Page;

  readonly backLink: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productRating: Locator;
  readonly stockInfo: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.backLink           = page.locator('a:has-text("← Back to Products")');
    this.productName        = page.locator("main h1, main h2").first();
    this.productCategory    = page.locator("main").getByText(/audio|computing|gaming|accessories/i).first();
    this.productDescription = page.locator("main p").first();
    this.productPrice       = page.locator("main").getByText(/\$[\d.]+/).first();
    this.productRating      = page.locator("main").getByText(/⭐/).first();
    this.stockInfo          = page.locator("main").getByText(/in stock|out of stock/i).first();
    this.addToCartButton    = page.locator('button:has-text("Add to Cart")');
  }

  async goto(productId: string) {
    await this.page.goto(`/products/${productId}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async goBack() {
    await this.backLink.click();
  }

  async getPageText(): Promise<string> {
    return this.page.locator("main").innerText();
  }
}

