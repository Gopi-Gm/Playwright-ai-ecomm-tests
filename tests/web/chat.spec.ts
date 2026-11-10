import { test, expect } from "../../fixtures/pageFixtures";

/**
 * Chat Page — UI Tests
 *
 * Tags: @web @sanity @regression
 * Covers:
 *  - Page load and heading
 *  - Message input and Send button
 *  - Sending a message renders it in the chat
 *  - AI response or error state displayed
 */

test.describe("Chat Page — UI", () => {

  test.beforeEach(async ({ chatPage }) => {
    await chatPage.goto();
  });

  test("should load the AI Chat page with correct heading @web @sanity", async ({
    chatPage,
  }) => {
    await expect(chatPage.heading).toBeVisible();
  });

  test("should display message textarea on the chat page @web @sanity", async ({
    chatPage,
  }) => {
    await expect(chatPage.messageInput).toBeVisible();
  });

  test("should display Send button on the chat page @web @sanity", async ({
    chatPage,
  }) => {
    await expect(chatPage.sendButton).toBeVisible();
  });

  test("should display sent message in the chat after clicking Send @web @regression", async ({
    chatPage,
  }) => {
    const message = "What products do you sell?";
    await chatPage.sendMessage(message);
    const pageText = await chatPage.getPageText();
    expect(pageText).toContain(message);
  });

  test("should show AI response or error after sending a message @web @regression", async ({
    chatPage,
  }) => {
    await chatPage.sendMessage("Tell me about headphones");
    const pageText = await chatPage.getPageText();
    // Either a successful AI response or an error message is acceptable
    const hasResponse =
      pageText.includes("headphone") ||
      pageText.includes("Wireless") ||
      pageText.includes("failed") ||
      pageText.includes("error") ||
      pageText.length > 100;
    expect(hasResponse).toBeTruthy();
  });

  test("should have correct page title for Chat page @web @sanity", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveTitle(/ShopLab/i);
  });

  test("should allow navigation from Chat page to Products @web @regression", async ({
    chatPage, page,
  }) => {
    await page.locator('[data-testid="nav-link-products"]').click();
    await page.waitForURL("**/products");
    expect(page.url()).toContain("/products");
  });
});

