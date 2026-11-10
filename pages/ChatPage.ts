import { Page, Locator } from "@playwright/test";

/**
 * ChatPage — Page Object for /chat
 *
 * Covers:
 *  - Page heading "AI Shopping Assistant"
 *  - Message input (textarea)
 *  - Send button
 *  - Chat message bubbles (user messages and AI responses)
 *  - Error state ("Failed to connect to Ollama")
 */
export class ChatPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly chatMessages: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading      = page.locator("main").getByText(/AI Shopping Assistant/i).first();
    this.messageInput = page.locator("textarea");
    this.sendButton   = page.locator('button:has-text("Send")');
    this.chatMessages = page.locator("main p, main div").filter({ hasText: /./i });
    this.errorMessage = page.locator("main").getByText(/failed to connect/i);
  }

  async goto() {
    await this.page.goto("/chat");
  }

  async sendMessage(message: string) {
    await this.messageInput.fill(message);
    await this.sendButton.click();
    await this.page.waitForTimeout(2000);
  }

  async getPageText(): Promise<string> {
    return this.page.locator("main").innerText();
  }
}

