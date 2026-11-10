# ShopLab Test Automation Framework Structure

## Overview
This repository contains a production-ready, hybrid test automation framework for the **ShopLab E-Commerce Platform** (`https://shoplab-platform-399284160033.us-east1.run.app/`). The framework is engineered using **Playwright with TypeScript**, implementing the **Page Object Model (POM)** pattern, custom dependency-injection fixtures, contract-driven REST API testing with **Ajv JSON Schema** validation, **data-driven testing**, and **k6 performance testing**.

---

## High-Level Architecture

```
                       ┌──────────────────────────────────────────────┐
                       │          ShopLab E-Commerce App             │
                       │    (Web Frontend  &  /api REST Backend)      │
                       └──────────────────────▲───────────────────────┘
                                              │
                   ┌──────────────────────────┴──────────────────────────┐
                   │                                                     │
        ┌──────────┴──────────┐                               ┌──────────┴──────────┐
        │   Web UI Tests      │                               │    API Tests        │
        │  (tests/web/)       │                               │   (tests/api/)      │
        └──────────▲──────────┘                               └──────────▲──────────┘
                   │                                                     │
        ┌──────────┴──────────┐                               ┌──────────┴──────────┐
        │   Page Fixtures     │                               │   Central Routes    │
        │ (fixtures/pageFixtures)                             │ (api/endpoints/routes)
        └──────────▲──────────┘                               └──────────▲──────────┘
                   │                                                     │
        ┌──────────┴──────────┐                               ┌──────────┴──────────┐
        │    Page Objects     │                               │    JSON Schemas     │
        │      (pages/)       │                               │   (api/schemas/)    │
        └──────────▲──────────┘                               └──────────▲──────────┘
                   │                                                     │
                   └──────────────────────────┬──────────────────────────┘
                                              │
                       ┌──────────────────────┴───────────────────────┐
                       │   Core Utilities, Data & Config Engine       │
                       │   - config.json (dev/integration/preprod)    │
                       │   - utils/ (CustomReporter, DataReader, ...) │
                       │   - testdata/ (products.json, search.csv)    │
                       │   - Multi-reporters (HTML, Allure, JUnit)   │
                       └──────────────────────────────────────────────┘
```

---

## Directory & File Structure

```
playwright-ai-ecomm-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI workflow
├── api/
│   ├── endpoints/
│   │   └── routes.ts                 # Centralized REST API endpoints & route builders
│   └── schemas/
│       ├── cart_add_response_schema.json  # Ajv JSON Schema for POST /api/cart
│       ├── cart_api_schema.json           # Ajv JSON Schema for GET /api/cart
│       └── product_api_schema.json        # Ajv JSON Schema for GET /api/products
├── custom-report/                    # Generated custom test execution HTML reports
├── docs/
│   ├── ecomm-app-apitests.md         # Full REST API test specifications & matrix
│   └── ecomm-app-uitests.md          # Full Web UI test specifications & matrix
├── fixtures/
│   └── pageFixtures.ts               # Custom Playwright test fixture with POM injection
├── k6/
│   ├── main.js                       # Grafana k6 performance scenarios (smoke, load, stress)
│   └── README.md                     # k6 execution and setup guidelines
├── pages/                            # Page Object Model (POM) classes
│   ├── CartPage.ts                   # Shopping cart page interactions & line-item actions
│   ├── ChatPage.ts                   # AI Shopping Assistant chat interface
│   ├── ProductDetailPage.ts          # Product detail specs, stock, and actions
│   └── ProductsPage.ts               # Catalog grid, navbar, search, and product cards
├── prompts/
│   ├── Framework-Step-By-Step.md     # Step-by-step framework construction guide
│   └── utilitis_prompt.md            # Utility generation guidelines
├── reports/                          # Standard Playwright HTML report and JUnit results.xml
├── testdata/
│   ├── shoplab_products.json         # Master product inventory test dataset
│   └── shoplab_search_data.csv       # Parameterized search queries & assertions
├── tests/
│   ├── manual-test-cases.md          # Manual baseline test scenarios
│   ├── api/                          # Automated API test specs
│   │   ├── cart-api.spec.ts          # Cart CRUD & calculation tests
│   │   ├── chat-api.spec.ts          # AI Chat endpoint resilience tests
│   │   └── products-api.spec.ts      # Product listing, lookup & schema tests
│   └── web/                          # Automated Web UI test specs
│       ├── cart.spec.ts              # Cart view, quantity updates & checkout
│       ├── chat.spec.ts              # AI Assistant chat interactions
│       ├── product-detail.spec.ts    # Product detail page & back navigation
│       ├── products.spec.ts          # Catalog browsing, search & card actions
│       └── search-data-driven.spec.ts# CSV-driven parameterized search tests
├── utils/
│   ├── CustomReporter.ts             # Custom branded HTML execution reporter
│   ├── DataReader.ts                 # CSV, JSON, and Excel file readers
│   ├── dataGenerator.ts              # Faker.js dynamic mock data generators
│   ├── dbClient.ts                   # MySQL2 database client helper
│   └── helper.ts                     # Common string, wait, and formatting helpers
├── .env                              # Active environment variables
├── .env.example                      # Environment template file
├── .gitignore                        # Git exclusion rules
├── config.json                       # Multi-environment target URLs (dev/integration/preprod)
├── package.json                      # NPM scripts and dependency definitions
├── playwright-mcp-context.md         # Playwright MCP guideline context
├── playwright.config.ts              # Central Playwright configuration
└── tsconfig.json                     # TypeScript compilation configuration
```

---

## Core Components & Implementation

### 1. Page Object Model (`pages/`)

All UI locators and page interactions are encapsulated inside dedicated page classes:

#### `ProductsPage` (`pages/ProductsPage.ts`)
- **Route**: `/products`
- **Responsibilities**:
  - Navbar links (`brand-logo`, `nav-link-products`, `nav-link-cart`, `nav-link-ai-chat`)
  - Search input with automatic debouncing (`search(term)`, `clearSearch()`)
  - Product catalog card management (`getProductCards()`, `getAddToCartButtons()`, `addToCartAt(index)`)
  - Navigation to individual product details (`clickDetailsAt(index)`)
  - Product count indicator (`getMainText()`)

#### `ProductDetailPage` (`pages/ProductDetailPage.ts`)
- **Route**: `/products/:productId` (e.g. `/products/p1`)
- **Responsibilities**:
  - Direct navigation to product by ID (`goto(productId)`)
  - Retrieval of product specifications, stock status, and ratings (`getPageText()`)
  - Adding to cart from detail view (`addToCart()`)
  - Navigating back to product catalog (`goBack()`)

#### `CartPage` (`pages/CartPage.ts`)
- **Route**: `/cart`
- **Responsibilities**:
  - Empty cart validation (`emptyMessage`, `continueShoppingLink`)
  - Line-item quantity adjustment (`clickIncrement()`, `clickDecrement()`)
  - Line-item removal (`clickRemove()`) and full cart clearing (`clickClearCart()`)
  - Order checkout execution (`clickCheckout()`) and confirmation parsing
  - Subtotal and order total parsing (`getMainText()`)

#### `ChatPage` (`pages/ChatPage.ts`)
- **Route**: `/chat`
- **Responsibilities**:
  - AI Assistant interface heading and textarea elements
  - Sending messages (`sendMessage(text)`)
  - Conversation bubble and error banner verification (`getPageText()`)

---

### 2. Custom Fixtures (`fixtures/pageFixtures.ts`)

Instead of manually instantiating page classes in every test, tests import `test` and `expect` from `fixtures/pageFixtures.ts`:

```typescript
import { test, expect } from "../../fixtures/pageFixtures";

test("example test", async ({ productsPage, cartPage }) => {
  await productsPage.goto();
  await productsPage.addToCartAt(0);
  await cartPage.goto();
});
```

**Key Advantages:**
- **Zero Boilerplate**: Injects `productsPage`, `productDetailPage`, `cartPage`, and `chatPage` automatically.
- **Automatic State Isolation**: The `cartPage` fixture executes `await page.request.delete("/api/cart").catch(() => {})` before handing over control, guaranteeing an isolated, clean shopping cart for every test run.

---

### 3. API Automation Engine (`api/`)

#### Route Centralization (`api/endpoints/routes.ts`)
Avoids hardcoding URL paths in tests:
```typescript
export const Routes = {
  products: {
    list: "/api/products",
    byId: (id: string) => `/api/products/${id}`,
  },
  cart: {
    get: "/api/cart",
    add: "/api/cart",
    updateItem: (productId: string) => `/api/cart/${productId}`,
    removeItem: (productId: string) => `/api/cart/${productId}`,
    clear: "/api/cart",
  },
  chat: {
    send: "/api/chat",
  },
};
```

#### Ajv JSON Schema Validation (`api/schemas/`)
API tests validate the contract structure and data types:
- `product_api_schema.json`: Validates product array and mandatory item properties (`id`, `name`, `price`, `stock`, `rating`, `category`).
- `cart_api_schema.json`: Validates cart state with nested items array and total price.
- `cart_add_response_schema.json`: Validates response structure returned upon item addition.

---

### 4. Utilities (`utils/`)

- **`CustomReporter.ts`**: Implements Playwright's `Reporter` interface to generate standalone, self-contained HTML test execution summaries under `custom-report/`.
- **`DataReader.ts`**: Provides `readCsv()`, `readJson()`, and `readExcel()` utility methods for parameterized testing.
- **`dataGenerator.ts`**: Uses `@faker-js/faker` to generate synthetic user data, shipping addresses, card numbers, and random strings.
- **`dbClient.ts`**: Provides a connection pool wrapper via `mysql2/promise` for database queries and teardown.
- **`helper.ts`**: Common utility functions including timestamps, string manipulation, and currency formatting.

---

## Test Suites & Tagging Strategy

Tests are tagged with `@tag` annotations to allow flexible execution filtering:

| Tag | Purpose / Scope | Target Spec Files |
|---|---|---|
| `@web` | All Web UI automated tests | `tests/web/*.spec.ts` |
| `@api` | All REST API automated tests | `tests/api/*.spec.ts` |
| `@master` | Complete critical smoke test suite (UI + API) | Core tests across web & api |
| `@sanity` | Rapid build acceptance and core functionality verification | Sanity tests across web & api |
| `@regression` | Full regression coverage across all features | Extended tests across web & api |
| `@e2e` | End-to-end user workflows spanning catalog -> cart -> checkout | `cart.spec.ts`, `cart-api.spec.ts` |
| `@datadriven` | Parameterized tests reading external files | `search-data-driven.spec.ts` |

---

## Execution Guide

### 1. Setup & Installation
```bash
# Install NPM dependencies
npm install

# Install Playwright browser binaries
npx playwright install chromium
```

### 2. Environment Configuration
The application environment is controlled via [`config.json`](file:///d:/playwright-ai-ecomm-tests/config.json):
```json
{
  "environments": {
    "dev": { "baseUrl": "https://shoplab-platform-399284160033.us-east1.run.app/" },
    "integration": { "baseUrl": "https://shoplab-platform-399284160033.us-east1.run.app/" },
    "preprod": { "baseUrl": "https://www.shoplab-preprod.com" }
  },
  "activeEnvironment": "dev"
}
```
Toggle `"activeEnvironment": "dev" | "integration" | "preprod"` to redirect test execution across stages.

### 3. NPM Test Commands

```bash
# Run All Web UI Tests
npm run test:web

# Run All REST API Tests
npm run test:api

# Run Critical Smoke Tests (Master Suite)
npm run test:master

# Run Sanity Tests
npm run test:sanity

# Run Full Regression Suite
npm run test:regression

# Run End-to-End Tests
npm run test:e2e

# Run Data-Driven Search Tests
npm run test:datadriven

# Run in Headed Browser Mode
npm run test:master:headed
npm run test:sanity:headed

# Run with Playwright Interactive Inspector / Debugger
npm run test:sanity:debug
```

### 4. Performance Testing with k6

```bash
# Run default performance test
npm run test:k6

# Run specific performance scenario
npm run test:k6:smoke
npm run test:k6:load
npm run test:k6:stress
npm run test:k6:all

# Run with real-time web dashboard
npm run test:k6:dashboard
```

---

## Test Reporting

The framework generates four complementary test reports on every run:

1. **Playwright HTML Report**:
   - Location: `reports/index.html`
   - Open command: `npx playwright show-report reports`
2. **Custom HTML Report**:
   - Location: `custom-report/*.html`
   - Open directly in any browser for executive pass/fail metrics.
3. **Allure Report**:
   - Results: `allure-results/`
   - Generate & open: `npm run allure:report`
4. **JUnit XML**:
   - Location: `reports/results.xml` (Used by CI/CD engines for test result charting).

---

## CI/CD & Containerization

### GitHub Actions (`.github/workflows/playwright.yml`)
Runs automatically on `push` and `pull_request` against `main` and `master` branches:
1. Checks out repository code.
2. Installs Node.js LTS and dependencies via `npm ci`.
3. Installs Playwright browsers with OS dependencies (`npx playwright install --with-deps`).
4. Executes the Playwright test suite.
5. Uploads `reports/` artifacts with 30-day retention.

### Docker Support
Run the suite inside an isolated Linux container matching the production CI runner:
```bash
# Build and run tests using docker-compose
docker-compose up --build --abort-on-container-exit
```
