/**
 * Centralized API endpoint definitions for the ShopLab application.
 * Base URL is loaded from the environment / config.json via playwright.config.ts.
 *
 * Usage:
 *   import { Routes } from '@api/endpoints/routes';
 *   const response = await request.get(Routes.products.list);
 */

export const Routes = {
  products: {
    /** GET /api/products — returns all products */
    list: "/api/products",
    /** GET /api/products/:id — returns a single product by ID */
    byId: (id: string) => `/api/products/${id}`,
  },
  cart: {
    /** GET  /api/cart         — returns current cart */
    get: "/api/cart",
    /** POST /api/cart         — adds an item { productId, quantity } */
    add: "/api/cart",
    /** PATCH /api/cart/:id    — updates quantity of an item */
    updateItem: (productId: string) => `/api/cart/${productId}`,
    /** DELETE /api/cart/:id   — removes a single item from the cart */
    removeItem: (productId: string) => `/api/cart/${productId}`,
    /** DELETE /api/cart        — clears the entire cart */
    clear: "/api/cart",
  },
  chat: {
    /** POST /api/chat — sends a message to the AI shopping assistant */
    send: "/api/chat",
  },
};

