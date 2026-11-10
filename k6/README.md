# 🚀 ShopLab API Performance Testing (Grafana k6)

Comprehensive performance, load, stress, and smoke testing suite for the ShopLab e-commerce APIs using **Grafana k6**.

---

## 📌 Table of Contents
- [Architecture & Covered Endpoints](#architecture--covered-endpoints)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Execution Profiles & Scenarios](#execution-profiles--scenarios)
- [Base URL Configuration](#base-url-configuration)
- [Checks & Performance Thresholds](#checks--performance-thresholds)
- [Live Web Dashboard](#live-web-dashboard)
- [HTML Report & JSON Summary Exports](#html-report--json-summary-exports)
- [Grafana Cloud k6 Integration](#grafana-cloud-k6-integration)
- [Project Directory Structure](#project-directory-structure)

---

## 🏗️ Architecture & Covered Endpoints

The test suite covers all primary API routes and simulates real user traffic patterns:

| Domain | Method | Endpoint | Description | SLA (p95) |
|---|---|---|---|---|
| **Products** | `GET` | `/api/products` | Retrieve catalog of 8 products | `< 800ms` |
| **Products** | `GET` | `/api/products/:id` | Retrieve single product details | `< 800ms` |
| **Products** | `GET` | `/api/products/p999` | Verify 404 handling under load | `< 800ms` |
| **Cart** | `GET` | `/api/cart` | View current user cart | `< 1000ms` |
| **Cart** | `POST` | `/api/cart` | Add product to cart | `< 1000ms` |
| **Cart** | `PATCH` | `/api/cart/:productId` | Update item quantity | `< 1000ms` |
| **Cart** | `DELETE` | `/api/cart/:productId` | Remove item from cart | `< 1000ms` |
| **Cart** | `DELETE` | `/api/cart` | Clear entire cart | `< 1000ms` |
| **AI Chat** | `POST` | `/api/chat` | AI Shopping Assistant consultation | `< 3000ms` |
| **E2E Flow** | Multiple | Multi-step User Journey | Browse ➔ Details ➔ Add Cart ➔ View ➔ Update ➔ Chat ➔ Clear | `< 1200ms` |

---

## ⚡ Prerequisites

k6 binary installed and available in PATH (or local `./node_modules/.bin/k6`).

To install k6 globally on Windows (if not already present):
```powershell
winget install GrafanaLabs.k6
# OR using Chocolatey
choco install k6
```

Verify installation:
```bash
k6 version
```

---

## 🚀 Quick Start

Run tests using the pre-configured npm scripts:

```bash
# Run smoke test (1 VU, 30s)
npm run test:k6:smoke

# Run realistic load test (ramps to 20 VUs, ~4m)
npm run test:k6:load

# Run stress test (ramps to 50 VUs, ~4m)
npm run test:k6:stress

# Run all scenarios sequentially
npm run test:k6:all

# Run with live web dashboard in browser
npm run test:k6:dashboard

# Run and export metrics report
npm run test:k6:report
```

---

## 📈 Execution Profiles & Scenarios

You can select a scenario by passing the `SCENARIO` environment variable:

```bash
# Smoke test (Quick sanity check: 1 VU for 30 seconds)
k6 run -e SCENARIO=smoke k6/main.js

# Load test (Realistic ramp: 0 ➔ 10 VUs ➔ 20 VUs ➔ ramp-down)
k6 run -e SCENARIO=load k6/main.js

# Stress test (System capacity limit: 0 ➔ 15 ➔ 30 ➔ 50 VUs ➔ ramp-down)
k6 run -e SCENARIO=stress k6/main.js

# Run only a specific test domain
k6 run -e TEST_MODE=products k6/main.js
k6 run -e TEST_MODE=cart k6/main.js
k6 run -e TEST_MODE=chat k6/main.js
k6 run -e TEST_MODE=flow k6/main.js
```

---

## 🌐 Base URL Configuration

The performance test suite supports flexible target environments:

### 1. Direct Base URL Override (Highest Priority)
```bash
k6 run -e BASE_URL=https://shoplab-platform-399284160033.us-east1.run.app k6/main.js
```

### 2. Environment Selector
```bash
# dev (default)
k6 run -e TARGET_ENV=dev k6/main.js

# integration
k6 run -e TARGET_ENV=integration k6/main.js

# preprod
k6 run -e TARGET_ENV=preprod k6/main.js
```

---

## 🎯 Checks & Performance Thresholds

Every request validates:
- **HTTP status codes** (`200 OK`, `201 Created`, `404 Not Found`, `200/503 for AI Chat`)
- **Response Headers** (`Content-Type: application/json`)
- **Body payloads** (JSON structure, array lengths, returned IDs)

### Global SLO Thresholds
```javascript
export const THRESHOLDS = {
  // Global failure rate must remain below 1%
  http_req_failed: ['rate<0.01'],

  // Global latency: 95% under 1.2s, 99% under 2.5s, average under 800ms
  http_req_duration: ['p(95)<1200', 'p(99)<2500', 'avg<800'],

  // Tagged endpoint thresholds
  'http_req_duration{endpoint:products_list}': ['p(95)<800'],
  'http_req_duration{endpoint:product_detail}': ['p(95)<800'],
  'http_req_duration{endpoint:cart_operations}': ['p(95)<1000'],
  'http_req_duration{endpoint:chat_assistant}': ['p(95)<3000'],
};
```

---

## 📊 Live Web Dashboard

k6 features an integrated web dashboard to inspect real-time metrics during execution.

### Command to run with Live Web Dashboard:
```bash
npm run test:k6:dashboard
# or directly:
k6 run -o web-dashboard k6/main.js
```

Once running, navigate to:
👉 **[http://127.0.0.1:5665](http://127.0.0.1:5665)**

To specify a custom port or auto-open browser:
```bash
k6 run -o web-dashboard=port=5665,open k6/main.js
```

---

## 📑 HTML Report & JSON Summary Exports

### 1. Unified Command (HTML Dashboard Export + JSON Summary):
```bash
k6 run --web-dashboard=export=reports/k6/k6-dashboard.html --summary-export=reports/k6/k6-summary.json k6/main.js
```
*(Or via npm script: `npm run test:k6:report`)*

### 2. Built-in Automated Summary:
Every run of `k6/main.js` automatically compiles test metrics via `handleSummary()` to:
- `reports/k6/summary.html`: Standalone HTML dashboard with KPI cards and check tables.
- `reports/k6/summary.json`: Detailed JSON metric summary for CI/CD pipelines.

> **Note**: All generated files in `reports/` and `*.summary.json` are ignored by git via `.gitignore`.

---

## ☁️ Grafana Cloud k6 Integration

Run distributed load tests directly from Grafana Cloud k6 infrastructure or stream local results live to Grafana Cloud.

### Step 1: Authenticate with Grafana Cloud
Get your API token from [Grafana Cloud k6](https://k6.io/cloud) and log in:
```bash
# Using k6 cloud login (v2.x)
k6 cloud login

# OR using token directly
k6 login cloud --token <YOUR_GRAFANA_CLOUD_TOKEN>
```
Alternatively, configure environment variables:
```bash
export K6_CLOUD_TOKEN="<YOUR_TOKEN>"
export K6_CLOUD_PROJECT_ID="<YOUR_PROJECT_ID>"
```

### Step 2: Run Load Test in Grafana Cloud
```bash
# Executes distributed load generators in Grafana Cloud
k6 cloud run k6/main.js

# Or via npm script:
npm run test:k6:cloud
```

### Step 3: Run Locally and Stream Live to Grafana Cloud
```bash
# Runs on your local machine while streaming live metrics to your Grafana dashboard
k6 cloud run --local-execution k6/main.js
```

---

## 📁 Project Directory Structure

```
k6/
├── config/
│   ├── environments.js    # Base URL configuration & endpoint mapping
│   └── options.js         # Scenarios (smoke, load, stress) and threshold rules
├── helpers/
│   ├── http.js            # Request parameter factory & tagging utilities
│   └── reporter.js        # HTML report & JSON summary generators
├── tests/
│   ├── products.test.js   # Product catalog, details, and 404 tests
│   ├── cart.test.js       # Cart add, patch, delete, and clear tests
│   ├── chat.test.js       # AI Shopping assistant performance tests
│   └── ecommerce-flow.test.js # Realistic end-to-end user shopping journey
├── main.js                # Master test orchestrator & CLI entry point
└── README.md              # k6 Performance testing documentation
```
