import { test, expect } from "../../fixtures/pageFixtures";

/**
 * Product Detail Page — UI Tests
 *
 * Tags: @web @master @sanity @regression
 * Covers:
 *  - Product detail page loads with correct content
 *  - Add to Cart from detail page
 *  - Back navigation
 *  - Invalid product ID (404)
 */

test.describe("Product Detail Page — UI", () => {

  test("should load product detail page for p1 and show product info @web @master @sanity", async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto("p1");
    const pageText = await productDetailPage.getPageText();
    expect(pageText).toContain("Wireless Bluetooth Headphones");
    expect(pageText).toContain("$79.99");
    expect(pageText).toContain("Audio");
  });

  test("should display In Stock information on the detail page @web @regression", async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto("p1");
    const pageText = await productDetailPage.getPageText();
    expect(pageText).toMatch(/in stock/i);
  });

  test("should display rating on the product detail page @web @regression", async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto("p1");
    const pageText = await productDetailPage.getPageText();
    expect(pageText).toContain("⭐");
  });

  test("should display Add to Cart button on the product detail page @web @sanity", async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto("p1");
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });

  test("should display Back to Products link on the product detail page @web @sanity", async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto("p1");
    await expect(productDetailPage.backLink).toBeVisible();
  });

  test("should navigate back to products listing when Back link is clicked @web @regression", async ({
    productDetailPage, page,
  }) => {
    await productDetailPage.goto("p1");
    await productDetailPage.goBack();
    expect(page.url()).toContain("/products");
  });

  test("should add product to cart from the detail page @web @master @e2e", async ({
    productDetailPage, page,
  }) => {
    await productDetailPage.goto("p2");
    await productDetailPage.addToCart();
    await page.waitForTimeout(500);
    await page.goto("/cart");
    await page.waitForTimeout(500);
    const cartText = await page.locator("main").innerText();
    expect(cartText).toContain("Mechanical Keyboard");
  });

  test("should load product p6 (Gaming Controller) detail page @web @regression", async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto("p6");
    const pageText = await productDetailPage.getPageText();
    expect(pageText).toContain("Gaming Controller");
    expect(pageText).toContain("$59.99");
  });

  test("should show 404 for a non-existent product ID @web @regression", async ({
    page,
  }) => {
    await page.goto("/products/p999");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain("404");
  });
});

