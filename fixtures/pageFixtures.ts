import { test as base } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { ChatPage } from "../pages/ChatPage";

/**
 * Custom fixture type extending Playwright's base test.
 * All page objects are exposed here so tests can destructure them directly.
 */
type PageFixtures = {
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  chatPage: ChatPage;
};

export const test = base.extend<PageFixtures>({
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartPage: async ({ page }, use) => {
    // Clear cart via API before each cart-related test to ensure a clean state
    await page.request.delete("/api/cart").catch(() => {});
    await use(new CartPage(page));
  },

  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
});

export { expect } from "@playwright/test";

