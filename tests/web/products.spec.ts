import { test, expect } from "../../fixtures/pageFixtures";

/**
 * Products Page — UI Tests
 *
 * Tags: @web @master @sanity @regression
 * Covers:
 *  - Page load and navigation
 *  - Product listing
 *  - Search / filter
 *  - Add to Cart from listing
 *  - Navigation to product details
 */

test.describe("Products Page — UI", () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  // ─── Page Load ──────────────────────────────────────────────────────────

  test("should load the products page and display all 8 products @web @master @sanity", async ({
    productsPage,
  }) => {
    const mainText = await productsPage.getMainText();
    expect(mainText).toContain("8 products available");
    expect(mainText).toContain("All Products");
  });

  test("should display navigation links: Products, Cart, AI Chat @web @sanity", async ({
    productsPage,
  }) => {
    await expect(productsPage.navProducts).toBeVisible();
    await expect(productsPage.navCart).toBeVisible();
    await expect(productsPage.navChat).toBeVisible();
  });

  test("should display Add to Cart button for each product @web @sanity", async ({
    productsPage,
  }) => {
    const count = await productsPage.addToCartButtons.count();
    expect(count).toBe(8);
  });

  test("should display a search input on the products page @web @sanity", async ({
    productsPage,
  }) => {
    await expect(productsPage.searchInput).toBeVisible();
  });

  // ─── Search ─────────────────────────────────────────────────────────────

  test("should filter products when searching for 'keyboard' @web @regression", async ({
    productsPage,
  }) => {
    await productsPage.search("keyboard");
    const mainText = await productsPage.getMainText();
    expect(mainText).toContain("1 result for");
    expect(mainText).toContain("Mechanical Keyboard");
  });

  test("should show no results for a non-matching search term @web @regression", async ({
    productsPage,
  }) => {
    await productsPage.search("xyz_nomatch_999");
    const mainText = await productsPage.getMainText();
    expect(mainText).toContain("0 results for");
    expect(mainText).toContain("No products found");
  });

  test("should restore all products after clearing search @web @regression", async ({
    productsPage,
  }) => {
    await productsPage.search("keyboard");
    await productsPage.clearSearch();
    const mainText = await productsPage.getMainText();
    expect(mainText).toContain("8 products available");
  });

  test("should filter products when searching for 'gaming' @web @regression", async ({
    productsPage,
  }) => {
    await productsPage.search("gaming");
    const mainText = await productsPage.getMainText();
    expect(mainText).toContain("Gaming Controller");
  });

  test("should filter products when searching for 'audio' @web @regression", async ({
    productsPage,
  }) => {
    await productsPage.search("audio");
    const mainText = await productsPage.getMainText();
    expect(mainText).toContain("Wireless Bluetooth Headphones");
  });

  // ─── Navigation ─────────────────────────────────────────────────────────

  test("should navigate to Cart page when Cart nav link is clicked @web @sanity", async ({
    productsPage,
  }) => {
    await productsPage.navCart.click();
    await productsPage.page.waitForURL("**/cart");
    expect(productsPage.page.url()).toContain("/cart");
  });

  test("should navigate to AI Chat page when AI Chat nav link is clicked @web @sanity", async ({
    productsPage,
  }) => {
    await productsPage.navChat.click();
    await productsPage.page.waitForURL("**/chat");
    expect(productsPage.page.url()).toContain("/chat");
  });

  test("should navigate to product detail page when Details link is clicked @web @regression", async ({
    productsPage,
  }) => {
    await productsPage.goToDetailsAt(0);
    await productsPage.page.waitForURL("**/products/p1");
    expect(productsPage.page.url()).toContain("/products/p1");
  });

  // ─── Add to Cart ─────────────────────────────────────────────────────────

  test("should add first product to cart from the product listing @web @master @e2e", async ({
    productsPage,
    page,
  }) => {
    await productsPage.addToCartAt(0);
    await page.waitForTimeout(500);
    // Navigate to cart to verify item was added
    await page.goto("/cart");
    await page.waitForTimeout(500);
    const cartText = await page.locator("main").innerText();
    expect(cartText).toContain("Wireless Bluetooth Headphones");
  });

  // ─── Page Title ─────────────────────────────────────────────────────────

  test("should have the correct page title @web @sanity", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveTitle(/ShopLab/i);
  });
});

