import { test, expect } from "@playwright/test";
import { Routes } from "../../api/endpoints/routes";
import Ajv from "ajv";
import productListSchema from "../../api/schemas/product_api_schema.json";
import path from "path";
import fs from "fs";

/**
 * Products API Tests
 *
 * Tags: @api @master @sanity @regression
 * Base URL is loaded from playwright.config.ts → config.json (activeEnvironment: dev)
 *
 * Covers:
 *  GET /api/products       — list all products
 *  GET /api/products/:id   — get product by ID
 *  GET /api/products/p999  — invalid product (404)
 */

const ajv = new Ajv();

test.describe("Products API", () => {

  // ─── GET /api/products ───────────────────────────────────────────────────

  test("GET /api/products returns 200 @api @master @sanity", async ({ request }) => {
    const response = await request.get(Routes.products.list);
    expect(response.status()).toBe(200);
  });

  test("GET /api/products returns an array of 8 products @api @sanity", async ({ request }) => {
    const response = await request.get(Routes.products.list);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toHaveLength(8);
  });

  test("GET /api/products response matches JSON schema @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.list);
    const body = await response.json();
    const validate = ajv.compile(productListSchema);
    const valid = validate(body);
    if (!valid) console.error("Schema validation errors:", validate.errors);
    expect(valid).toBeTruthy();
  });

  test("GET /api/products each product has required fields @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.list);
    const products = await response.json();
    for (const product of products) {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("stock");
      expect(product).toHaveProperty("rating");
      expect(product).toHaveProperty("description");
    }
  });

  test("GET /api/products returns Content-Type application/json @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.list);
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  // ─── GET /api/products/:id ───────────────────────────────────────────────

  test("GET /api/products/p1 returns 200 @api @master @sanity", async ({ request }) => {
    const response = await request.get(Routes.products.byId("p1"));
    expect(response.status()).toBe(200);
  });

  test("GET /api/products/p1 returns correct product data @api @sanity", async ({ request }) => {
    const response = await request.get(Routes.products.byId("p1"));
    const product = await response.json();
    expect(product.id).toBe("p1");
    expect(product.name).toBe("Wireless Bluetooth Headphones");
    expect(product.price).toBe(79.99);
    expect(product.category).toBe("Audio");
    expect(product.stock).toBe(25);
    expect(product.rating).toBe(4.5);
  });

  test("GET /api/products/p6 returns Gaming Controller @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.byId("p6"));
    const product = await response.json();
    expect(product.id).toBe("p6");
    expect(product.name).toBe("Gaming Controller");
    expect(product.price).toBe(59.99);
  });

  test("GET /api/products/p8 returns USB-C Hub 7-in-1 @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.byId("p8"));
    const product = await response.json();
    expect(product.name).toBe("USB-C Hub 7-in-1");
  });

  // ─── Edge Cases ──────────────────────────────────────────────────────────

  test("GET /api/products/p999 returns 404 for invalid product ID @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.byId("p999"));
    expect(response.status()).toBe(404);
  });

  test("GET /api/products/p999 returns error message in body @api @regression", async ({ request }) => {
    const response = await request.get(Routes.products.byId("p999"));
    const body = await response.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("not found");
  });

  // ─── Data-Driven: all 8 products exist ───────────────────────────────────

  const productIds = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];

  for (const id of productIds) {
    test(`GET /api/products/${id} returns 200 @api @regression`, async ({ request }) => {
      const response = await request.get(Routes.products.byId(id));
      expect(response.status()).toBe(200);
      const product = await response.json();
      expect(product.id).toBe(id);
    });
  }
});

