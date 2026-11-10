/**
 * Environment configuration for k6 performance tests.
 * Resolves base URL dynamically from:
 * 1. CLI flag: __ENV.BASE_URL (e.g. -e BASE_URL=https://...)
 * 2. CLI environment selector: __ENV.TARGET_ENV (e.g. -e TARGET_ENV=dev)
 * 3. Default fallback matching config.json dev environment
 */

const ENVIRONMENTS = {
  dev: 'https://shoplab-platform-399284160033.us-east1.run.app',
  integration: 'https://shoplab-platform-399284160033.us-east1.run.app',
  preprod: 'https://www.shoplab-preprod.com',
};

export function getBaseUrl() {
  if (__ENV.BASE_URL) {
    return __ENV.BASE_URL.replace(/\/+$/, '');
  }

  const envKey = (__ENV.TARGET_ENV || __ENV.APP_ENV || 'dev').toLowerCase();
  const url = ENVIRONMENTS[envKey] || ENVIRONMENTS.dev;
  return url.replace(/\/+$/, '');
}

export const ENDPOINTS = {
  products: {
    list: '/api/products',
    byId: (id) => `/api/products/${id}`,
  },
  cart: {
    base: '/api/cart',
    item: (id) => `/api/cart/${id}`,
  },
  chat: {
    send: '/api/chat',
  },
};
