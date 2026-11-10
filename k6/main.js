/**
 * Main Entry Point for Grafana k6 API Performance Testing
 *
 * Application: ShopLab E-Commerce Platform
 * Covered API Endpoints:
 *   - GET    /api/products
 *   - GET    /api/products/:id
 *   - GET    /api/products/p999 (404 boundary)
 *   - GET    /api/cart
 *   - POST   /api/cart
 *   - PATCH  /api/cart/:productId
 *   - DELETE /api/cart/:productId
 *   - DELETE /api/cart
 *   - POST   /api/chat
 *
 * Scenarios:
 *   - smoke  : Baseline sanity check (1 VU, 30s)
 *   - load   : Realistic traffic progression (up to 20 VUs, ~4m)
 *   - stress : Spike and saturation limit test (up to 50 VUs, ~4m)
 *   - all    : Sequential multi-scenario execution
 *
 * Live Web Dashboard:
 *   npm run test:k6:dashboard
 *   (or: k6 run -o web-dashboard k6/main.js)
 *
 * Exporting Reports:
 *   k6 run --web-dashboard=export=reports/k6/k6-report.html --summary-export=reports/k6/k6-summary.json k6/main.js
 *
 * Grafana Cloud k6:
 *   k6 cloud k6/main.js
 */

import { sleep } from 'k6';
import { getOptions } from './config/options.js';
import { getBaseUrl } from './config/environments.js';
import { customHandleSummary } from './helpers/reporter.js';
import { runProductsTests } from './tests/products.test.js';
import { runCartTests } from './tests/cart.test.js';
import { runChatTests } from './tests/chat.test.js';
import { runEcommerceUserJourney } from './tests/ecommerce-flow.test.js';

// Load scenario configuration & thresholds
const baseOptions = getOptions();

// Cloud project metadata (supports both v1.x loadimpact and v2.x cloud schema)
const cloudConfig = {
  projectID: __ENV.K6_CLOUD_PROJECT_ID ? parseInt(__ENV.K6_CLOUD_PROJECT_ID, 10) : undefined,
  name: `ShopLab API Performance [${__ENV.SCENARIO || 'smoke'}]`,
};

export const options = Object.assign({}, baseOptions, {
  cloud: cloudConfig,
  ext: {
    loadimpact: cloudConfig,
  },
});

const baseUrl = getBaseUrl();

export default function () {
  const mode = (__ENV.TEST_MODE || 'all').toLowerCase();

  switch (mode) {
    case 'products':
      runProductsTests(baseUrl);
      break;

    case 'cart':
      runCartTests(baseUrl);
      break;

    case 'chat':
      runChatTests(baseUrl);
      break;

    case 'flow':
    case 'journey':
      runEcommerceUserJourney(baseUrl);
      break;

    case 'all':
    default:
      // Execute endpoint suites
      runProductsTests(baseUrl);
      runCartTests(baseUrl);
      runChatTests(baseUrl);

      // Execute realistic user journey
      runEcommerceUserJourney(baseUrl);
      break;
  }

  // Realistic pacing between iterations
  sleep(1);
}

// Custom summary exports (HTML report + JSON metrics)
export function handleSummary(data) {
  return customHandleSummary(data);
}
