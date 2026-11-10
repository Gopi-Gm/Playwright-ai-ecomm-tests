# Claude Code - ShopLab E-Commerce Test Automation

This project is a Playwright + TypeScript automation framework for the **ShopLab e-commerce application**. Follow the guidance below when working in this repository.

## Project Structure

```
pages/                          # Page Object Models (POM)
├── base.page.ts                # Base page class
├── home.page.ts                # Products listing page
├── product-detail.page.ts      # Product detail page
├── cart.page.ts                # Shopping cart page
└── components/
    └── navbar.page.ts          # Navbar component

tests/
├── manual-test-cases.md        # Manual test cases documentation
├── web/                        # UI tests
│   ├── products.spec.ts
│   ├── product-detail.spec.ts
│   ├── cart.spec.ts
│   ├── chat.spec.ts
│   └── search-data-driven.spec.ts
└── api/                        # API tests
    ├── products-api.spec.ts
    ├── cart-api.spec.ts
    └── chat-api.spec.ts

fixtures/                       # Playwright test fixtures
api/                            # API helper clients
utils/                          # Custom reporter, helpers
k6/                             # k6 performance tests
reports/, allure-results/       # Test output (gitignored)
```

## Key Conventions

- **Page Object Model (POM):** All selectors live in page objects under `pages/`. Tests contain only business logic and assertions.
- **Tags:** Tests are tagged `@web`, `@api`, `@master`, `@sanity`, `@regression`, `@e2e`, `@datadriven`. Filter with `--grep`.
- **Strict TypeScript:** `tsconfig.json` uses `strict: true`. Keep code type-safe.
- **Environment:** Base URL comes from `config.json` (`activeEnvironment`). Secrets/vars go in `.env` (gitignored; see `.env.example`).
- **Test data:** Use `@faker-js/faker` for generated data; static data under `testdata/`.

## Common Commands

Run from repo root (`d:\playwright-ai-ecomm-tests`):

```bash
# Install
npm install
npx playwright install

# All tests
npx playwright test

# By tag
npx playwright test --grep @web
npx playwright test --grep @api
npx playwright test --grep @sanity
npx playwright test --grep @regression
npx playwright test --grep @master
npx playwright test --grep @e2e
npx playwright test --grep @datadriven

# Via npm scripts
npm run test:web        # --grep @web
npm run test:api        # --grep @api
npm run test:sanity     # --grep @sanity
npm run test:regression # --grep @regression
npm run test:master     # --grep @master
npm run test:e2e        # --grep @e2e

# Headed / debug / UI mode
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui

# Specific file
npx playwright test tests/web/products.spec.ts

# Allure report
npm run allure:report   # generate + open

# k6 performance
npm run test:k6:smoke
npm run test:k6:load
npm run test:k6:stress
```

## When Adding or Changing Tests

1. Create page objects in `pages/` following existing class patterns (extend `BasePage` where applicable).
2. Put UI specs in `tests/web/`, API specs in `tests/api/`.
3. Add appropriate tags (`@web`/`@api` + `@sanity`/`@regression`/`@master`/`@e2e` as relevant).
4. Keep selectors out of test files; use page object methods.
5. Run the affected tests locally before completing: `npx playwright test <file>`.
6. Do not commit artifacts under `reports/`, `allure-results/`, `playwright-report/`, `test-results/`, or `.env` (see `.gitignore`).

## CI

GitHub Actions (`.github/workflows/playwright.yml`) runs on push/PR to `main`/`master`: installs deps, installs Playwright browsers, runs `npx playwright test`, uploads `playwright-report/` artifact.
