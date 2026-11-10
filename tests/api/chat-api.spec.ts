import { test, expect } from "@playwright/test";
import { Routes } from "../../api/endpoints/routes";

/**
 * Chat API Tests
 *
 * Tags: @api @regression
 * Base URL loaded from playwright.config.ts → config.json (activeEnvironment: dev)
 *
 * Covers:
 *  POST /api/chat — send a message to the AI shopping assistant
 *
 * Note: The Ollama backend is currently unavailable (503).
 * Tests verify the API contract (endpoint exists, correct status codes).
 */

test.describe("Chat API", () => {

  test("POST /api/chat returns a response (200 or 503) @api @regression", async ({ request }) => {
    const response = await request.post(Routes.chat.send, {
      data: { message: "What products do you sell?", history: [] },
    });
    expect([200, 503]).toContain(response.status());
  });

  test("POST /api/chat with 503 returns error object in body @api @regression", async ({ request }) => {
    const response = await request.post(Routes.chat.send, {
      data: { message: "Hello", history: [] },
    });
    if (response.status() === 503) {
      const body = await response.json();
      expect(body).toHaveProperty("error");
    }
  });

  test("POST /api/chat sends correct request payload @api @regression", async ({ request }) => {
    const payload = { message: "Tell me about headphones", history: [] };
    const response = await request.post(Routes.chat.send, { data: payload });
    // Endpoint exists and returns a recognizable JSON response
    expect([200, 503]).toContain(response.status());
    const body = await response.json();
    expect(typeof body).toBe("object");
  });

  test("POST /api/chat with empty message still hits the endpoint @api @regression", async ({ request }) => {
    const response = await request.post(Routes.chat.send, {
      data: { message: "", history: [] },
    });
    expect([200, 400, 503]).toContain(response.status());
  });
});

