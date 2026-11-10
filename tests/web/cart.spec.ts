import { test, expect } from "../../fixtures/pageFixtures";

/**
 * Cart Page — UI Tests
 *
 * Tags: @web @master @sanity @regression @e2e
 * Covers:
 *  - Empty cart state
 *  - Add item → verify in cart
 *  - Quantity increment (+)
 *  - Quantity decrement (−)
 *  - Remove single item
 *  - Clear Cart
 *  - Checkout flow → success message
 *  - Continue Shopping link
 */

test.describe("Cart Page — UI", () => {

  test("should show empty cart message when cart has no items @web @master @sanity", async ({
    cartPage,
  }) => {
    await cartPage.goto();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test("should show Continue Shopping link in empty cart @web @sanity", async ({
    cartPage,
  }) => {
    await cartPage.goto();
    await expect(cartPage.continueShoppingLink).toBeVisible();
  });

  test("should display item in cart after adding from products page @web @master @e2e", async ({
    cartPage, productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0); // Wireless Bluetooth Headphones
    await cartPage.goto();
    const cartText = await cartPage.getMainText();
    expect(cartText).toContain("Wireless Bluetooth Headphones");
    expect(cartText).toContain("$79.99");
  });

  test("should display quantity controls and Remove button for cart item @web @sanity", async ({
    cartPage, productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    await expect(cartPage.incrementButton).toBeVisible();
    await expect(cartPage.decrementButton).toBeVisible();
    await expect(cartPage.removeButton).toBeVisible();
  });

  test("should display Order Total section in cart @web @sanity", async ({
    cartPage, productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    const cartText = await cartPage.getMainText();
    expect(cartText).toContain("Order Total");
  });

  test("should display Clear Cart and Checkout buttons when cart has items @web @sanity", async ({
    cartPage, productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    await expect(cartPage.clearCartButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test("should increment item quantity when + button is clicked @web @regression", async ({
    cartPage, productsPage, page,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    await Promise.all([
      page.waitForResponse(res => res.url().includes("/api/cart") && res.request().method() === "PATCH"),
      cartPage.clickIncrement(),
    ]);
    await expect(page.locator("main")).toContainText("2");
  });

  test("should decrement item quantity when − button is clicked @web @regression", async ({
    cartPage, productsPage, page,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    // Increment to 2 first
    await cartPage.clickIncrement();
    // Now decrement back to 1
    await cartPage.clickDecrement();
    const cartText = await cartPage.getMainText();
    expect(cartText).toContain("1");
  });

  test("should empty cart when Clear Cart button is clicked @web @regression", async ({
    cartPage, productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    await cartPage.clickClearCart();
    await cartPage.page.waitForTimeout(500);
    const cartText = await cartPage.getMainText();
    expect(cartText).toContain("Your cart is empty");
  });

  test("should show success message after clicking Checkout @web @master @e2e", async ({
    cartPage, productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    await cartPage.clickCheckout();
    const cartText = await cartPage.getMainText();
    expect(cartText).toContain("Order Placed Successfully");
  });

  test("should clear cart after successful checkout @web @e2e", async ({
    cartPage, productsPage, page,
  }) => {
    await productsPage.goto();
    await productsPage.addToCartAt(0);
    await cartPage.goto();
    await cartPage.clickCheckout();
    // Navigate back to cart to confirm it's cleared
    await page.goto("/cart");
    await page.waitForTimeout(500);
    const cartText = await page.locator("main").innerText();
    expect(cartText).toContain("Your cart is empty");
  });

  test("should not display Checkout button when cart is empty @web @regression", async ({
    cartPage,
  }) => {
    await cartPage.goto();
    await expect(cartPage.checkoutButton).not.toBeVisible();
  });
});

