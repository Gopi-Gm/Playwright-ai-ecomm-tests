import http from 'k6/http';
import { check, group } from 'k6';
import { getBaseUrl, ENDPOINTS } from '../config/environments.js';
import { createParams } from '../helpers/http.js';

const PROMPTS = [
  'What products are currently on sale?',
  'Recommend the best wireless headphones.',
  'Do you have mechanical keyboards in stock?',
  'What is the price of the gaming controller?',
];

export function runChatTests(baseUrl = getBaseUrl()) {
  group('Chat API - AI Assistant', () => {
    const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const payload = JSON.stringify({
      message: prompt,
      history: [],
    });

    const res = http.post(
      `${baseUrl}${ENDPOINTS.chat.send}`,
      payload,
      createParams('chat_assistant', {}, {
        responseCallback: http.expectedStatuses(200, 503),
      })
    );

    // Note: The Ollama backend may return 503 if unavailable, but 200 when active.
    // Both confirm the application route handled the request appropriately.
    check(res, {
      'POST /api/chat responds with 200 or 503': (r) => r.status === 200 || r.status === 503,
      'POST /api/chat returns JSON response': (r) => {
        try {
          const body = JSON.parse(r.body);
          return typeof body === 'object';
        } catch {
          return false;
        }
      },
    });
  });
}
