import { test, expect } from "@playwright/test";
import { Routes } from "../../api/endpoints/routes";
import Ajv from "ajv";
import cartSchema from "../../api/schemas/cart_api_schema.json";
import cartAddSchema from "../../api/schemas/cart_add_response_schema.json";

/**
 * Cart API Tests
 *
 * Tags: @api @master @sanity @regression @e2e
 * Base URL is loaded from playwright.config.ts → config.json (activeEnvironment: dev)
 *
 * Covers:
 *  GET    /api/cart            — get current cart
 *  POST   /api/cart            — add item to cart
 *  PATCH  /api/cart/:productId — update item quantity
 *  DELETE /api/cart/:productId — remove single item
 *  DELETE /api/cart            — clear entire cart
 */

const ajv = new Ajv();

test.describe("Cart API", () => {

  // Clear cart before each test to ensure a clean slate
  test.beforeEach(async ({ request }) => {
    await request.delete(Routes.cart.clear);
  });

  // ─── GET /api/cart ────────────────────────────────────────────────────────

  test("GET /api/cart returns 200 for empty cart @api @master @sanity", async ({ request }) => {
    const response = await request.get(Routes.cart.get);
    expect(response.status()).toBe(200);
  });

  test("GET /api/cart returns empty items array when cart is empty @api @sanity", async ({ request }) => {
    const response = await request.get(Routes.cart.get);
    const body = await response.json();
    expect(body.items).toEqual([]);
    expect(body.total).toBe(0);
  });

  test("GET /api/cart response matches cart JSON schema @api @regression", async ({ request }) => {
    const response = await request.get(Routes.cart.get);
    const body = await response.json();
    const validate = ajv.compile(cartSchema);
    const valid = validate(body);
    if (!valid) console.error("Schema errors:", validate.errors);
    expect(valid).toBeTruthy();
  });

  // ─── POST /api/cart ───────────────────────────────────────────────────────

  test("POST /api/cart returns 201 when adding a valid product @api @master @sanity", async ({ request }) => {
    const response = await request.post(Routes.cart.add, {
      data: { productId: "p1", quantity: 1 },
    });
    expect(response.status()).toBe(201);
  });

  test("POST /api/cart returns product and quantity in response body @api @sanity", async ({ request }) => {
    const response = await request.post(Routes.cart.add, {
      data: { productId: "p1", quantity: 1 },
    });
    const body = await response.json();
    expect(body).toHaveProperty("product");
    expect(body).toHaveProperty("quantity");
    expect(body.product.id).toBe("p1");
    expect(body.quantity).toBe(1);
  });

  test("POST /api/cart add response matches schema @api @regression", async ({ request }) => {
    const response = await request.post(Routes.cart.add, {
      data: { productId: "p2", quantity: 2 },
    });
    const body = await response.json();
    const validate = ajv.compile(cartAddSchema);
    expect(validate(body)).toBeTruthy();
  });

  test("POST /api/cart with invalid productId returns 404 @api @regression", async ({ request }) => {
    const response = await request.post(Routes.cart.add, {
      data: { productId: "p999", quantity: 1 },
    });
    expect(response.status()).toBe(404);
  });

  test("POST /api/cart with invalid productId returns error in body @api @regression", async ({ request }) => {
    const response = await request.post(Routes.cart.add, {
      data: { productId: "p999", quantity: 1 },
    });
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("POST /api/cart with empty body returns error response @api @regression", async ({ request }) => {
    const response = await request.post(Routes.cart.add, {
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test("GET /api/cart shows added product after POST @api @master @e2e", async ({ request }) => {
    await request.post(Routes.cart.add, {
      data: { productId: "p1", quantity: 1 },
    });
    const response = await request.get(Routes.cart.get);
    const body = await response.json();
    expect(body.items).toHaveLength(1);
    expect(body.items[0].product.id).toBe("p1");
  });

  // ─── PATCH /api/cart/:productId ───────────────────────────────────────────

  test("PATCH /api/cart/:productId returns 200 when updating quantity @api @regression", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } });
    const response = await request.patch(Routes.cart.updateItem("p1"), {
      data: { quantity: 3 },
    });
    expect(response.status()).toBe(200);
  });

  test("PATCH /api/cart/:productId — updated quantity is reflected in GET /api/cart @api @regression", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } });
    await request.patch(Routes.cart.updateItem("p1"), { data: { quantity: 3 } });
    const response = await request.get(Routes.cart.get);
    const body = await response.json();
    expect(body.items[0].quantity).toBe(3);
  });

  // ─── DELETE /api/cart/:productId ──────────────────────────────────────────

  test("DELETE /api/cart/:productId returns 200 when removing an item @api @regression", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } });
    const response = await request.delete(Routes.cart.removeItem("p1"));
    expect(response.status()).toBe(200);
  });

  test("DELETE /api/cart/:productId removes the item from cart @api @regression", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } });
    await request.delete(Routes.cart.removeItem("p1"));
    const cartResponse = await request.get(Routes.cart.get);
    const body = await cartResponse.json();
    expect(body.items).toHaveLength(0);
  });

  // ─── DELETE /api/cart (clear) ─────────────────────────────────────────────

  test("DELETE /api/cart returns 200 when clearing the cart @api @master @sanity", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } });
    const response = await request.delete(Routes.cart.clear);
    expect(response.status()).toBe(200);
  });

  test("DELETE /api/cart clears all items and total becomes 0 @api @regression", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } });
    await request.post(Routes.cart.add, { data: { productId: "p2", quantity: 1 } });
    await request.delete(Routes.cart.clear);
    const cartResponse = await request.get(Routes.cart.get);
    const body = await cartResponse.json();
    expect(body.items).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  test("DELETE /api/cart returns message in response body @api @regression", async ({ request }) => {
    const response = await request.delete(Routes.cart.clear);
    const body = await response.json();
    expect(body).toHaveProperty("message");
  });

  // ─── Multi-item cart ──────────────────────────────────────────────────────

  test("Cart total is correct when multiple items are added @api @e2e @regression", async ({ request }) => {
    await request.post(Routes.cart.add, { data: { productId: "p1", quantity: 1 } }); // $79.99
    await request.post(Routes.cart.add, { data: { productId: "p5", quantity: 1 } }); // $39.99
    const response = await request.get(Routes.cart.get);
    const body = await response.json();
    expect(body.items).toHaveLength(2);
    // Total should be 79.99 + 39.99 = 119.98
    expect(parseFloat(body.total.toFixed(2))).toBeCloseTo(119.98, 1);
  });
});

