# ShopLab E-Commerce Platform — Performance Testing Specification (Grafana k6)

## Document Overview
- **Application Name**: ShopLab E-Commerce Platform
- **Base URL**: `https://shoplab-platform-399284160033.us-east1.run.app`
- **Testing Engine**: [Grafana k6](https://k6.io/) (High-performance, developer-centric load testing tool written in Go)
- **Scripting Language**: Modern ECMAScript (ES6+) with modular imports
- **Document Version**: 1.0.0
- **Scope**: REST API Performance, Capacity, Stress, Concurrency, and End-to-End User Journey Load Testing covering Products Catalog, Shopping Cart Operations, and AI Shopping Assistant.

---

## Performance Testing Architecture

The k6 test suite in this repository is built using an enterprise modular design pattern, separating configuration, HTTP client helpers, custom reporting, and endpoint test suites.

```
k6/
├── config/
│   ├── environments.js          # Dynamic multi-environment URL resolution & routes
│   └── options.js               # Scenarios (smoke, load, stress), stages & SLA thresholds
├── helpers/
│   ├── http.js                  # Request wrapper with automatic headers & tag injection
│   └── reporter.js              # Custom summary generator (Stdout, HTML & JSON exports)
├── tests/
│   ├── products.test.js         # Products catalog & details load testing
│   ├── cart.test.js             # Cart CRUD concurrency testing
│   ├── chat.test.js             # AI Shopping Assistant endpoint resilience & latency
│   └── ecommerce-flow.test.js   # 7-step realistic end-to-end user shopping journey
├── main.js                      # Central test runner entry point & scenario orchestrator
└── README.md                    # Quick-start manual and execution guide
```

---

## Covered Endpoints & Service Level Agreements (SLAs)

Every API request is instrumented with custom tags and validated against strict performance thresholds (SLAs):

| Domain | Method | Endpoint | Description | Tag | Target SLA (p95) |
|---|---|---|---|---|---|
| **Products** | `GET` | `/api/products` | Retrieve catalog of 8 products | `products_list` | `< 800ms` |
| **Products** | `GET` | `/api/products/:id` | View specific product details | `product_detail` | `< 800ms` |
| **Products** | `GET` | `/api/products/p999` | 404 error handling under load | `product_not_found` | `< 800ms` |
| **Cart** | `GET` | `/api/cart` | View shopping cart contents | `cart_operations` | `< 1000ms` |
| **Cart** | `POST` | `/api/cart` | Add product to cart | `cart_operations` | `< 1000ms` |
| **Cart** | `PATCH` | `/api/cart/:productId` | Update item quantity | `cart_operations` | `< 1000ms` |
| **Cart** | `DELETE` | `/api/cart/:productId` | Remove specific line item | `cart_operations` | `< 1000ms` |
| **Cart** | `DELETE` | `/api/cart` | Clear entire shopping cart | `cart_operations` | `< 1000ms` |
| **AI Chat** | `POST` | `/api/chat` | AI Shopping Assistant query | `chat_assistant` | `< 3000ms` |
| **E2E Flow** | Multiple | Multi-step Journey | Full purchase journey | `scenario_type` | `< 1200ms` (Overall) |

---

## Performance Thresholds (Pass/Fail Criteria)

Configured in `k6/config/options.js`, k6 evaluates these criteria dynamically during execution. If any threshold is breached, k6 marks the execution as failed:

```javascript
export const THRESHOLDS = {
  // Global failure rate must remain below 1% under normal conditions
  http_req_failed: ['rate<0.01'],

  // Global latency targets: 95% under 1.2s, 99% under 2.5s, average under 800ms
  http_req_duration: ['p(95)<1200', 'p(99)<2500', 'avg<800'],

  // Tagged endpoint thresholds
  'http_req_duration{endpoint:products_list}': ['p(95)<800'],
  'http_req_duration{endpoint:product_detail}': ['p(95)<800'],
  'http_req_duration{endpoint:cart_operations}': ['p(95)<1000'],
  'http_req_duration{endpoint:chat_assistant}': ['p(95)<3000'],
};
```

---

## Execution Profiles & Workload Scenarios

The framework provides 4 pre-configured workload scenarios toggled via the `SCENARIO` environment variable:

```
[Smoke Test]
   VU: 1 ────────────────────────────── (30s)

[Load Test]
   VUs
    20                   ┌─────────────┐
    10     ┌─────────────┘             └─────┐
     0 ────┘                                 └──── (Total: ~3m 30s)
         [30s]   [1m]     [30s]   [1m]    [30s]

[Stress Test]
   VUs
    50                           ┌───────────────────────────┐
    30             ┌─────────────┘                           │
    15 ┌───────────┘                                         └─────┐
     0 ┘                                                           └── (Total: ~4m)
      [30s]      [1m]          [1m]                       [1m]   [30s]
```

### 1. Smoke Test (`SCENARIO=smoke`)
- **Objective**: Rapid baseline verification to confirm endpoints respond correctly under minimal load before initiating large-scale tests.
- **Executor**: `constant-vus`
- **Virtual Users (VUs)**: 1 VU
- **Duration**: 30 seconds

### 2. Load Test (`SCENARIO=load`)
- **Objective**: Simulates typical day-to-day and peak promotional customer traffic to verify response times and throughput under normal conditions.
- **Executor**: `ramping-vus`
- **Stages**:
  1. Ramp-up to 10 VUs in 30 seconds.
  2. Steady state at 10 VUs for 1 minute (normal traffic).
  3. Ramp-up to 20 VUs in 30 seconds (peak burst).
  4. Steady state at 20 VUs for 1 minute (peak traffic).
  5. Cool-down ramp down to 0 VUs in 30 seconds.
- **Total Duration**: ~3 minutes 30 seconds

### 3. Stress Test (`SCENARIO=stress`)
- **Objective**: Determines the upper concurrency limits and breaking points of the backend infrastructure by pushing virtual user load well beyond peak expectations.
- **Executor**: `ramping-vus`
- **Stages**:
  1. Ramp-up to 15 VUs in 30 seconds.
  2. Ramp-up to 30 VUs in 1 minute.
  3. Push to 50 VUs in 1 minute (stress concurrency).
  4. Sustained 50 VUs for 1 minute (stability under heavy load).
  5. Cool-down recovery to 0 VUs in 30 seconds.
- **Total Duration**: ~4 minutes

### 4. Sequential Run (`SCENARIO=all`)
- Runs Smoke, Load, and Stress profiles consecutively in a single multi-stage test run.

---

## Realistic End-to-End User Shopping Journey

Implemented in `k6/tests/ecommerce-flow.test.js`, this workflow simulates a realistic customer journey across 7 chronological steps with randomized product selection and user think time pacing:

```
 Step 1: Browse Catalog   ──► GET /api/products
         │ (sleep 1s)
 Step 2: Product Details  ──► GET /api/products/:id (randomized p1–p8)
         │ (sleep 1s)
 Step 3: Add to Cart      ──► POST /api/cart { productId, quantity: 1 }
         │ (sleep 0.5s)
 Step 4: View Cart        ──► GET /api/cart
         │ (sleep 1s)
 Step 5: Update Quantity  ──► PATCH /api/cart/:productId { quantity: 3 }
         │ (sleep 0.5s)
 Step 6: Consult AI Chat  ──► POST /api/chat { message: "...", history: [] }
         │ (sleep 0.5s)
 Step 7: Clear Cart       ──► DELETE /api/cart
```

---

## Key Resilience & Fault-Tolerance Features

1. **Clean 404 Negative Testing**:
   - `k6/tests/products.test.js` tests `/api/products/p999`.
   - Uses `http.expectedStatuses(404)` via `responseCallback`.
   - Prevents intentional 404 checks from polluting the `http_req_failed` failure rate metric.

2. **Resilient AI Chatbot Fallback**:
   - When the Ollama backend service is offline, `/api/chat` responds with HTTP 503.
   - The test configures `http.expectedStatuses(200, 503)`.
   - Tests verify that the service handles queries gracefully without unhandled crashes.

3. **Multi-Environment Switching**:
   - Resolved dynamically in `k6/config/environments.js`:
     ```javascript
     // 1. Direct URL override:
     k6 run -e BASE_URL=https://staging.shoplab.com k6/main.js

     // 2. Named environment selector (dev, integration, preprod):
     k6 run -e TARGET_ENV=preprod k6/main.js
     ```

4. **Targeted Domain Testing**:
   - Isolate specific feature tests using `TEST_MODE`:
     ```bash
     k6 run -e TEST_MODE=products k6/main.js
     k6 run -e TEST_MODE=cart k6/main.js
     k6 run -e TEST_MODE=chat k6/main.js
     k6 run -e TEST_MODE=journey k6/main.js
     ```

---

## Test Execution Guide

### NPM Script Shortcuts (Defined in `package.json`)

```bash
# Run baseline smoke test (1 VU, 30s)
npm run test:k6:smoke

# Run realistic load test (up to 20 VUs, ~3.5m)
npm run test:k6:load

# Run stress test to identify saturation limits (up to 50 VUs, ~4m)
npm run test:k6:stress

# Run all scenarios sequentially
npm run test:k6:all

# Launch real-time web dashboard in browser during test run
npm run test:k6:dashboard

# Open the latest generated HTML summary report
npm run test:k6:open

# Run test and export summary metrics to reports/k6/k6-summary.json
npm run test:k6:report

# Run tests distributed on Grafana Cloud k6
npm run test:k6:cloud
```

### Direct CLI Commands

```bash
# Basic run with default scenario (smoke)
k6 run k6/main.js

# Load test against integration environment
k6 run -e SCENARIO=load -e TARGET_ENV=integration k6/main.js

# Stress test against custom deployment URL
k6 run -e SCENARIO=stress -e BASE_URL=https://shoplab-platform-399284160033.us-east1.run.app k6/main.js

# Launch with built-in real-time interactive browser dashboard
k6 run -o web-dashboard k6/main.js
```

---

## Metrics Collection & Reporting

On test completion, `k6/helpers/reporter.js` automatically exports test results into three complementary outputs:

1. **Console Summary (Stdout)**:
   Formatted terminal overview with total requests, throughput (req/s), failure rates, and latency percentiles (avg, p95, p99).
2. **Standalone HTML Report** (`reports/k6/summary.html`):
   - Interactive, styled executive dashboard.
   - Shows Pass/Fail badges for all defined SLAs.
   - Summarizes latency metrics, request counts, and individual test check results.
3. **Machine-Readable JSON Summary** (`reports/k6/summary.json`):
   - Full raw metrics payload including time series and check outcomes.
   - Designed for CI/CD metrics archiving, Grafana dashboards, or automated regression tracking.
4. **Grafana Cloud k6 Dashboard**:
   - Execute with `k6 cloud k6/main.js` (or `npm run test:k6:cloud`) to view distributed execution metrics, geo-distributed VUs, and APM correlations directly on Grafana Cloud.

