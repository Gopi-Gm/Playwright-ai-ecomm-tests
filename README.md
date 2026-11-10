# ShopLab E-Commerce Playwright Test Automation Framework

A production-ready, hybrid test automation and performance framework designed for the **ShopLab E-Commerce Platform** ([Application URL](https://shoplab-platform-399284160033.us-east1.run.app/)).

Built with **Playwright**, **TypeScript**, **Ajv (JSON Schema Validation)**, **Faker.js**, **Allure**, and **Grafana k6**, this framework provides end-to-end coverage across Web UI, REST APIs, data-driven workflows, and load testing.

---

## Table of Contents
- [Architecture & Design](#architecture--design)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
  - [Web UI Testing (POM & Fixture Injection)](#1-web-ui-testing-pom--fixture-injection)
  - [REST API & Contract Testing](#2-rest-api--contract-testing)
  - [Data-Driven Testing](#3-data-driven-testing)
  - [Performance Testing with k6](#4-performance-testing-with-k6)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites & Installation](#prerequisites--installation)
- [Configuration & Environment Setup](#configuration--environment-setup)
- [Running Tests](#running-tests)
  - [Test Suite Commands (Tag-Based)](#test-suite-commands-tag-based)
  - [Headed & Debug Execution](#headed--debug-execution)
  - [Performance Testing (k6)](#performance-testing-k6)
- [Reporting](#reporting)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Architecture & Design

```
                       ┌──────────────────────────────────────────────┐
                       │          ShopLab E-Commerce App              │
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

The framework is decoupled into modular layers:
1. **Pages Layer (`pages/`)**: Encapsulates UI selectors, web interactions, and business assertions using the Page Object Model (POM).
2. **Fixtures Layer (`fixtures/`)**: Leverages Playwright's dependency injection (`test.extend`) to initialize and clean up Page Objects automatically, eliminating boilerplate setup in test specs.
3. **API & Contract Layer (`api/`)**: Centralizes API endpoints and validates HTTP response payloads against formal Ajv JSON Schemas.
4. **Data & Utilities Layer (`utils/`, `testdata/`)**: Provides dynamic fake data generation (`@faker-js/faker`), multi-format data readers (CSV, JSON, Excel), database helpers, and custom report generators.
5. **Performance Layer (`k6/`)**: Standalone k6 test suites simulating realistic e-commerce user journeys (Smoke, Load, and Stress profiles).

---

## Key Features

- **Page Object Model (POM)**: High maintainability with clean separation of selectors and page logic.
- **Fixture Dependency Injection**: Automatic instantiation of Page Objects directly inside test signatures.
- **REST API & Schema Validation**: Automated contract verification using Ajv and Draft-07 JSON schemas.
- **Data-Driven Testing (DDT)**: Parameterized test runs reading from CSV (`csv-parse`) and JSON datasets.
- **Performance & Load Testing**: k6 load scripts measuring P95/P99 latency, request rates, and throughput under concurrent virtual users (VUs).
- **Comprehensive Reporting**: Multi-reporter setup combining standard Playwright HTML reports, Allure Reports, JUnit XML for CI, and a custom branded HTML dashboard.
- **CI/CD Ready**: Preconfigured GitHub Actions workflow running on pull requests and pushes with artifact archiving.
- **Flexible Environment Configuration**: Central `config.json` supporting multiple environments (`dev`, `integration`, `preprod`) toggled via `.env`.

---

## How It Works

### 1. Web UI Testing (POM & Fixture Injection)
- Each page of the ShopLab application (`ProductsPage`, `ProductDetailPage`, `CartPage`, `ChatPage`) is represented by a TypeScript class in `pages/`.
- `fixtures/pageFixtures.ts` extends Playwright's base test to register these pages as fixtures:
  ```typescript
  import { test, expect } from '../../fixtures/pageFixtures';

  test('Add product to cart @sanity @web', async ({ productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.searchProduct('Laptop');
    await productsPage.addToCart('Laptop');
    await cartPage.goto();
    await cartPage.verifyItemPresent('Laptop');
  });
  ```
- No manual `new ProductsPage(page)` is required—Playwright initializes and tears down fixtures per test.

### 2. REST API & Contract Testing
- Endpoints are centrally declared in `api/endpoints/routes.ts`.
- Responses are verified against JSON schema definitions located in `api/schemas/` using `Ajv`.
- Tests validate HTTP status codes, headers, response timing, payload schemas, and data integrity.

### 3. Data-Driven Testing
- `utils/DataReader.ts` reads data from `testdata/shoplab_search_data.csv` or `testdata/shoplab_products.json`.
- Tests in `tests/web/search-data-driven.spec.ts` loop through datasets dynamically, executing separate test cases for each row with unique assertions.

### 4. Performance Testing with k6
- `k6/main.js` defines virtual user (VU) scenarios against product catalog, shopping cart, and search endpoints.
- Tests can run under different profiles: **Smoke** (sanity), **Load** (normal traffic), and **Stress** (breaking point).
- Summaries and threshold metrics (e.g., `http_req_duration: ['p(95)<500']`) are logged and exported to HTML/JSON reports.

---

## Project Directory Structure

```
playwright-ai-ecomm-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI/CD GitHub Actions workflow
├── api/
│   ├── endpoints/
│   │   └── routes.ts                 # REST API routes and URL builders
│   └── schemas/                      # Ajv JSON Schemas for API contracts
│       ├── cart_add_response_schema.json
│       ├── cart_api_schema.json
│       └── product_api_schema.json
├── docs/                             # Test strategy, API specs & UI test plans
│   ├── ecomm-app-apitests.md
│   ├── ecomm-app-performance.md
│   └── ecomm-app-uitests.md
├── fixtures/
│   └── pageFixtures.ts               # Custom Playwright test fixture with POM injection
├── k6/                               # k6 performance & load testing suite
│   ├── config/                       # Environments & VU stages configuration
│   ├── helpers/                      # HTTP clients & HTML report formatters
│   ├── tests/                        # Individual k6 test modules
│   ├── main.js                       # Entry point for k6 scenarios
│   └── README.md                     # k6 documentation & usage guide
├── pages/                            # Page Object Model (POM) classes
│   ├── CartPage.ts
│   ├── ChatPage.ts
│   ├── ProductDetailPage.ts
│   └── ProductsPage.ts
├── prompts/                          # AI instructions & framework architecture notes
├── reports/                          # Standard Playwright HTML & JUnit reports
├── custom-report/                    # Branded HTML reports
├── testdata/                         # Data-driven inputs
│   ├── shoplab_products.json
│   └── shoplab_search_data.csv
├── tests/
│   ├── api/                          # Automated API test specs
│   │   ├── cart-api.spec.ts
│   │   ├── chat-api.spec.ts
│   │   └── products-api.spec.ts
│   ├── web/                          # Automated Web UI test specs
│   │   ├── cart.spec.ts
│   │   ├── chat.spec.ts
│   │   ├── product-detail.spec.ts
│   │   ├── products.spec.ts
│   │   └── search-data-driven.spec.ts
│   └── manual-test-cases.md          # Manual baseline test suite
├── utils/                            # Reusable helper utilities
│   ├── CustomReporter.ts             # Custom execution reporter
│   ├── DataReader.ts                 # CSV / JSON / Excel data parsers
│   ├── dataGenerator.ts              # Faker.js data generators
│   ├── dbClient.ts                   # Database integration helper
│   └── helper.ts                     # Common string & timing utilities
├── .env.example                      # Environment variables template
├── config.json                       # Multi-environment target URLs and credentials
├── package.json                      # Project metadata, scripts, and dependencies
├── playwright.config.ts              # Playwright configuration
└── tsconfig.json                     # TypeScript compiler configuration
```

---

## Prerequisites & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [Git](https://git-scm.com/)
- (Optional) [k6](https://k6.io/docs/get-started/installation/) for performance testing
- (Optional) [Allure CLI](https://allurereport.org/docs/install/) for viewing Allure reports locally

### 2. Installation
Clone the repository and install all npm dependencies:

```bash
git clone https://github.com/Gopi-Gm/Playwright-ai-ecomm-tests.git
cd Playwright-ai-ecomm-tests
npm install
```

Install Playwright browsers and system dependencies:

```bash
npx playwright install --with-deps
```

---

## Configuration & Environment Setup

Copy `.env.example` to `.env` and adjust the variables to your target environment:

```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ENV` | Target environment (`dev`, `integration`, `preprod`) | `dev` |
| `BASE_URL` | Base URL of the ShopLab web application | `https://shoplab-platform-399284160033.us-east1.run.app/` |
| `API_BASE_URL` | Base endpoint for REST APIs | `https://shoplab-platform-399284160033.us-east1.run.app/api` |
| `HEADLESS` | Launch browser in headless mode (`true`/`false`) | `true` |
| `DB_*` | Database connection credentials (if DB validation is used) | Optional |

Multi-environment base URLs are defined in `config.json`.

---

## Running Tests

### Test Suite Commands (Tag-Based)
Tests are annotated with `@tags` (`@sanity`, `@regression`, `@api`, `@web`, `@datadriven`, `@e2e`, `@master`) to allow flexible filtering:

```bash
# Run all tests (Master suite)
npm run test:master

# Run only Web UI tests
npm run test:web

# Run only REST API tests
npm run test:api

# Run Sanity tests
npm run test:sanity

# Run Regression tests
npm run test:regression

# Run Data-Driven tests
npm run test:datadriven

# Run End-to-End user journeys
npm run test:e2e
```

### Headed & Debug Execution
```bash
# Run sanity tests with a visible browser
npm run test:sanity:headed

# Run master suite with a visible browser
npm run test:master:headed

# Launch tests in Playwright interactive debug mode (Playwright Inspector)
npm run test:sanity:debug
```

### Performance Testing (k6)
```bash
# Run default performance test
npm run test:k6

# Run Smoke test (low load validation)
npm run test:k6:smoke

# Run Load test (sustained concurrent VUs)
npm run test:k6:load

# Run Stress test (high load / peak stress)
npm run test:k6:stress

# Run with k6 live web dashboard
npm run test:k6:dashboard
```

---

## Reporting

The framework produces multiple report formats after each test run:

1. **Playwright Standard HTML Report**:
   ```bash
   npx playwright show-report
   ```
2. **Allure Report**:
   ```bash
   # Generate and open the Allure interactive dashboard
   npm run allure:report
   ```
3. **Custom Branded HTML Report**:
   Generated automatically in `custom-report/index.html` after test runs.
4. **JUnit XML Report**:
   Stored at `reports/junit/results.xml` for CI pipeline integration.

---

## CI/CD Pipeline

The framework includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) configured to:
- Trigger automatically on `push` and `pull_request` against `main`.
- Install Node.js, project dependencies, and Playwright browsers.
- Execute the test suite in headless mode.
- Collect and upload Playwright test traces, screenshots, and HTML reports as build artifacts.

