# ShopLab E-Commerce Platform — UI Test Cases Specification

## Document Overview
- **Application Name**: ShopLab E-Commerce Platform
- **Application Type**: Single Page Application (React / Next.js Web Application)
- **Target Environment**: `dev` (`https://shoplab-platform-399284160033.us-east1.run.app/`)
- **Automation Framework**: Playwright with TypeScript & Page Object Model (POM)
- **Document Version**: 1.0.0
- **Scope**: End-to-End User Interface testing covering Navigation, Catalog Browsing, Search & Filtering, Product Details, Shopping Cart Management, Order Checkout, and AI Shopping Assistant Chatbot.

---

## Test Execution Matrix & Summary

| Test Case ID | Test Summary | Module | Priority | Severity | Test Type | Automation Status | Automated Test Spec |
|---|---|---|---|---|---|---|---|
| **TC-UI-01** | Root URL redirects to products catalog page | Navigation | P1 | Critical | Smoke | Automated | `tests/web/products.spec.ts` |
| **TC-UI-02** | Navbar navigation across all main routes | Navigation | P1 | Major | Sanity | Automated | `tests/web/products.spec.ts` |
| **TC-UI-03** | Active route highlighting in navbar | Navigation | P2 | Minor | UI/UX | Automated | `tests/web/products.spec.ts` |
| **TC-UI-04** | Products catalog page load & card rendering | Catalog | P1 | Critical | Smoke | Automated | `tests/web/products.spec.ts` |
| **TC-UI-05** | Product card metadata and action buttons | Catalog | P2 | Major | Sanity | Automated | `tests/web/products.spec.ts` |
| **TC-UI-06** | Search products with matching keyword | Search | P1 | Major | Sanity | Automated | `tests/web/products.spec.ts` |
| **TC-UI-07** | Search products with non-matching keyword | Search | P2 | Minor | Negative | Automated | `tests/web/products.spec.ts` |
| **TC-UI-08** | Data-driven search across multiple product categories | Search | P2 | Major | Data-Driven | Automated | `tests/web/search-data-driven.spec.ts` |
| **TC-UI-09** | Open product detail page via card Details action | Product Detail | P1 | Critical | Sanity | Automated | `tests/web/product-detail.spec.ts` |
| **TC-UI-10** | Verify product details metadata (rating, price, stock) | Product Detail | P2 | Major | Regression | Automated | `tests/web/product-detail.spec.ts` |
| **TC-UI-11** | Navigate back to catalog via "Back to Products" link | Product Detail | P2 | Minor | Functional | Automated | `tests/web/product-detail.spec.ts` |
| **TC-UI-12** | Direct navigation to invalid product ID displays 404 | Product Detail | P2 | Major | Negative | Automated | `tests/web/product-detail.spec.ts` |
| **TC-UI-13** | Add product to cart directly from catalog card | Cart / Catalog | P1 | Critical | E2E | Automated | `tests/web/products.spec.ts` |
| **TC-UI-14** | Add product to cart from product details page | Cart / Detail | P1 | Critical | E2E | Automated | `tests/web/product-detail.spec.ts` |
| **TC-UI-15** | Empty cart initial view and Continue Shopping action | Cart | P2 | Major | Sanity | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-16** | Cart item listing and order total calculation | Cart | P1 | Critical | E2E | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-17** | Increment item quantity updates line subtotal and total | Cart | P1 | Major | Functional | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-18** | Decrement item quantity updates line subtotal and total | Cart | P1 | Major | Functional | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-19** | Decrement item quantity to zero removes product | Cart | P2 | Major | Functional | Planned | `tests/web/cart.spec.ts` |
| **TC-UI-20** | Remove button removes specific line item from cart | Cart | P2 | Major | Functional | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-21** | Clear Cart button clears all items | Cart | P2 | Major | Functional | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-22** | Checkout flow order placement success | Checkout | P1 | Critical | E2E | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-23** | Cart automatically empties following successful checkout | Checkout | P1 | Major | E2E | Automated | `tests/web/cart.spec.ts` |
| **TC-UI-24** | AI Chat page empty state and UI components verification | AI Chat | P2 | Major | Sanity | Automated | `tests/web/chat.spec.ts` |
| **TC-UI-25** | Send chat message and verify chat transcript rendering | AI Chat | P1 | Major | Functional | Automated | `tests/web/chat.spec.ts` |
| **TC-UI-26** | Chat error notification banner on backend failure (503) | AI Chat | P2 | Major | Resilience | Automated | `tests/web/chat.spec.ts` |
| **TC-UI-27** | Navigate from AI Chat back to Products catalog | AI Chat | P3 | Minor | Functional | Automated | `tests/web/chat.spec.ts` |

---

## Detailed UI Test Cases

### Module 1: Navigation & Header Routing

#### TC-UI-01: Root URL Redirects to Products Catalog Page
- **Test Objective**: Ensure accessing the root path automatically redirects user to the main storefront product catalog.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: Smoke
- **Preconditions**: Web browser is connected to the internet.
- **Test Steps**:
  1. Open browser and navigate to Base URL (`/`).
  2. Observe the resulting URL in the address bar.
  3. Verify the page header text and product catalog counter.
- **Expected Results**:
  1. Browser redirects automatically to `/products`.
  2. Header displays `"All Products"`.
  3. Product summary indicates `"8 products available"`.
- **Automated Mapping**: `tests/web/products.spec.ts`

---

#### TC-UI-02: Navbar Navigation Across All Main Routes
- **Test Objective**: Verify header navigation links route to their respective views accurately.
- **Priority**: P1 (High) | **Severity**: Major | **Test Type**: Sanity
- **Preconditions**: User is on `/products`.
- **Test Steps**:
  1. Click on the **Cart** link in the navigation header.
  2. Verify URL and page header.
  3. Click on the **AI Chat** link in the navigation header.
  4. Verify URL and page header.
  5. Click on the **ShopLab** logo / brand title.
- **Expected Results**:
  1. Cart navigation routes to `/cart`.
  2. AI Chat navigation routes to `/chat`.
  3. Logo click navigates back to `/products`.
- **Automated Mapping**: `tests/web/products.spec.ts`, `pages/components/Navbar.ts`

---

#### TC-UI-03: Active Route Highlighting in Navbar
- **Test Objective**: Ensure the current active page has proper visual indication / active styling on its navbar link.
- **Priority**: P2 (Medium) | **Severity**: Minor | **Test Type**: UI/UX
- **Preconditions**: ShopLab website is accessible.
- **Test Steps**:
  1. Navigate to `/products`. Inspect class/state of Products nav item.
  2. Navigate to `/cart`. Inspect class/state of Cart nav item.
  3. Navigate to `/chat`. Inspect class/state of AI Chat nav item.
- **Expected Results**:
  1. When on `/products`, Products nav link contains active state indicator.
  2. When on `/cart`, Cart nav link reflects active state indicator.
  3. When on `/chat`, AI Chat nav link reflects active state indicator.

---

### Module 2: Products Catalog Page

#### TC-UI-04: Products Catalog Page Load & Card Rendering
- **Test Objective**: Validate full inventory display on the catalog page.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: Smoke / Sanity
- **Preconditions**: Server is healthy and products API is responsive.
- **Test Steps**:
  1. Navigate to `/products`.
  2. Wait for product cards to load.
  3. Count total displayed product cards in the grid.
- **Expected Results**:
  1. Products catalog loads with HTTP 200 equivalent.
  2. Exactly 8 product cards are visible in the grid.
  3. Page text reflects `"8 products available"`.
- **Automated Mapping**: `tests/web/products.spec.ts`

---

#### TC-UI-05: Product Card Metadata and Action Buttons
- **Test Objective**: Verify each product card presents complete metadata and interaction controls.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Sanity
- **Preconditions**: User is on `/products`.
- **Test Steps**:
  1. Inspect every card on the grid.
  2. Verify presence of:
     - Product Name
     - Category tag (e.g. `Audio`, `Computing`, `Gaming`, `Accessories`)
     - Product Price with currency formatting (`$XX.XX`)
     - Star rating badge (`⭐ X.X`)
     - **Add to Cart** button
     - **Details** link / button
- **Expected Results**:
  1. All 8 cards have name, category, formatted price, rating, and both buttons visible and enabled.
  2. Exactly 8 **Add to Cart** buttons are present on page.
- **Automated Mapping**: `tests/web/products.spec.ts`

---

### Module 3: Search & Filtering

#### TC-UI-06: Search Products With Matching Keyword
- **Test Objective**: Verify search filters catalog dynamically upon typing a matching term.
- **Priority**: P1 (High) | **Severity**: Major | **Test Type**: Sanity / Functional
- **Preconditions**: User is on `/products`.
- **Test Steps**:
  1. Locate the search input field.
  2. Type keyword `"keyboard"`.
  3. Observe grid changes and result count text.
- **Expected Results**:
  1. Filter status displays `"1 result for "keyboard""`.
  2. Only the `"Mechanical Keyboard"` product card is visible.
  3. Non-matching items are hidden.
- **Automated Mapping**: `tests/web/products.spec.ts`

---

#### TC-UI-07: Search Products With Non-Matching Keyword
- **Test Objective**: Verify search gracefully handles keywords yielding zero results.
- **Priority**: P2 (Medium) | **Severity**: Minor | **Test Type**: Negative / Functional
- **Preconditions**: User is on `/products`.
- **Test Steps**:
  1. Click search input field.
  2. Type `"xyz123nomatch"`.
  3. Observe catalog area.
- **Expected Results**:
  1. Counter displays `"0 results for "xyz123nomatch""`.
  2. User is shown `"No products found"`.
  3. No product cards are displayed in the grid.
- **Automated Mapping**: `tests/web/products.spec.ts`

---

#### TC-UI-08: Data-Driven Search Across Multiple Categories
- **Test Objective**: Test catalog search behavior across various terms using external test dataset.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Data-Driven
- **Preconditions**: Dataset available in `testdata/shoplab_search_data.csv`.
- **Test Steps**:
  1. Loop through each record in CSV file:
     - `Headphones` -> Expected: 1 result (`Wireless Bluetooth Headphones`)
     - `Keyboard` -> Expected: 1 result (`Mechanical Keyboard`)
     - `Mouse` -> Expected: 1 result (`Ergonomic Wireless Mouse`)
     - `Webcam` -> Expected: 1 result (`4K USB-C Webcam`)
     - `Lamp` -> Expected: 1 result (`LED Desk Lamp`)
     - `Controller` -> Expected: 1 result (`Gaming Controller`)
     - `Power Bank` -> Expected: 1 result (`Portable Power Bank 20000mAh`)
     - `Hub` -> Expected: 1 result (`USB-C Hub 7-in-1`)
     - `nonexistent` -> Expected: 0 results (`No products found`)
  2. Type each search term and assert count and product name.
- **Expected Results**:
  1. Each search term correctly matches expected count and item name.
- **Automated Mapping**: `tests/web/search-data-driven.spec.ts`

---

### Module 4: Product Detail Page

#### TC-UI-09: Open Product Detail Page via Card Details Action
- **Test Objective**: Verify clicking "Details" navigates to the dedicated product view.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: Sanity
- **Preconditions**: User is on `/products`.
- **Test Steps**:
  1. Find `"Wireless Bluetooth Headphones"` (or index 0).
  2. Click the **Details** button.
  3. Verify URL and rendered content.
- **Expected Results**:
  1. Browser navigates to `/products/p1`.
  2. Page displays product title `"Wireless Bluetooth Headphones"`.
  3. Price displays `"$79.99"`.
  4. Category displays `"Audio"`.
- **Automated Mapping**: `tests/web/product-detail.spec.ts`

---

#### TC-UI-10: Verify Product Details Metadata (Rating, Price, Stock)
- **Test Objective**: Verify all detailed specifications, description, and inventory status render properly.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Regression
- **Preconditions**: User is on `/products/p1`.
- **Test Steps**:
  1. Check product description text.
  2. Check rating score with star symbol (`⭐ 4.5`).
  3. Check stock status indicator (`In Stock` / `25 in stock`).
  4. Verify presence of **Add to Cart** button and **Back to Products** link.
- **Expected Results**:
  1. All elements render with accurate data matching catalog store.
  2. Add to Cart button is visible and clickable.
  3. Back to Products link is visible.
- **Automated Mapping**: `tests/web/product-detail.spec.ts`

---

#### TC-UI-11: Navigate Back to Catalog via "Back to Products" Link
- **Test Objective**: Verify breadcrumb/back navigation restores the catalog view.
- **Priority**: P2 (Medium) | **Severity**: Minor | **Test Type**: Functional
- **Preconditions**: User is on `/products/p1`.
- **Test Steps**:
  1. Click **Back to Products** link.
  2. Verify URL.
  3. Verify catalog list displays.
- **Expected Results**:
  1. Browser redirects back to `/products`.
  2. Products catalog view is displayed with 8 items.
- **Automated Mapping**: `tests/web/product-detail.spec.ts`

---

#### TC-UI-12: Direct Navigation to Invalid Product ID Displays 404
- **Test Objective**: Ensure non-existent product route renders friendly 404 error page.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Negative / Error Handling
- **Preconditions**: User navigates directly to URL.
- **Test Steps**:
  1. Enter URL `/products/p999` (or `/products/invalid`).
  2. Observe rendered page.
- **Expected Results**:
  1. 404 Not Found error layout is displayed.
  2. Navbar remains available for recovery navigation.
- **Automated Mapping**: `tests/web/product-detail.spec.ts`

---

### Module 5: Cart Management

#### TC-UI-13: Add Product to Cart Directly from Catalog Card
- **Test Objective**: Verify instant item addition from product grid.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: E2E / Functional
- **Preconditions**: Cart is cleared. User is on `/products`.
- **Test Steps**:
  1. Click **Add to Cart** on first product card (`p1`).
  2. Observe button state change.
  3. Navigate to `/cart`.
- **Expected Results**:
  1. Button updates to confirm addition (e.g. `"Go to Cart"` or feedback state).
  2. Cart page lists `"Wireless Bluetooth Headphones"` with quantity `1` and price `"$79.99"`.
- **Automated Mapping**: `tests/web/products.spec.ts`, `tests/web/cart.spec.ts`

---

#### TC-UI-14: Add Product to Cart from Product Details Page
- **Test Objective**: Verify item addition from detail view.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: E2E / Functional
- **Preconditions**: User is on `/products/p2`.
- **Test Steps**:
  1. Click **Add to Cart** button.
  2. Verify button feedback / Go to Cart link visibility.
  3. Navigate to `/cart`.
- **Expected Results**:
  1. Product `"Mechanical Keyboard"` is added to cart.
  2. Item quantity is `1` and subtotal is `"$129.99"`.
- **Automated Mapping**: `tests/web/product-detail.spec.ts`

---

#### TC-UI-15: Empty Cart Initial View and Continue Shopping Action
- **Test Objective**: Validate empty cart layout and call to action.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Sanity
- **Preconditions**: Cart has no items.
- **Test Steps**:
  1. Navigate to `/cart`.
  2. Verify empty state text.
  3. Verify absence of Checkout button.
  4. Click **Continue Shopping** button/link.
- **Expected Results**:
  1. Text `"Your cart is empty"` is prominently shown.
  2. Checkout button is NOT visible.
  3. Continue Shopping routes user back to `/products`.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

#### TC-UI-16: Cart Item Listing and Order Total Calculation
- **Test Objective**: Verify cart line items, pricing breakdown, and order total.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: E2E
- **Preconditions**: Cart contains item `p1` ($79.99).
- **Test Steps**:
  1. Navigate to `/cart`.
  2. Inspect product title, price, quantity controls, and subtotal.
  3. Inspect **Order Total** section.
- **Expected Results**:
  1. Product name `"Wireless Bluetooth Headphones"` is visible.
  2. Price is `"$79.99"`.
  3. Order total matches `"$79.99"`.
  4. Increment (`+`), Decrement (`-`), and Remove buttons are present.
  5. Clear Cart and Checkout buttons are enabled.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

#### TC-UI-17: Increment Item Quantity Updates Line Subtotal and Total
- **Test Objective**: Verify clicking `+` increases item count and updates financial calculations.
- **Priority**: P1 (High) | **Severity**: Major | **Test Type**: Functional / Regression
- **Preconditions**: Cart contains item `p1` (quantity 1).
- **Test Steps**:
  1. Open `/cart`.
  2. Click the `+` (Increment) button.
  3. Wait for API update response (`PATCH /api/cart/p1`).
  4. Observe displayed quantity and order total.
- **Expected Results**:
  1. Quantity increases from `1` to `2`.
  2. Total recalculates to `$159.98` ($79.99 * 2).
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

#### TC-UI-18: Decrement Item Quantity Updates Line Subtotal and Total
- **Test Objective**: Verify clicking `-` decreases item count and recalibrates total.
- **Priority**: P1 (High) | **Severity**: Major | **Test Type**: Functional / Regression
- **Preconditions**: Cart contains item `p1` with quantity 2.
- **Test Steps**:
  1. Open `/cart`.
  2. Click the `-` (Decrement) button.
  3. Wait for API update response.
  4. Observe displayed quantity and total.
- **Expected Results**:
  1. Quantity decreases to `1`.
  2. Total returns to `$79.99`.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

#### TC-UI-19: Decrement Item Quantity to Zero Removes Product
- **Test Objective**: Verify decreasing an item with quantity 1 eliminates it from cart.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Functional
- **Preconditions**: Cart contains 1 item with quantity 1.
- **Test Steps**:
  1. Open `/cart`.
  2. Click the `-` (Decrement) button.
- **Expected Results**:
  1. Line item is removed from view.
  2. Empty cart layout `"Your cart is empty"` is shown.
  3. Order total is `$0.00` or hidden.

---

#### TC-UI-20: Remove Button Removes Specific Line Item From Cart
- **Test Objective**: Verify individual line item removal via dedicated Remove action.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Functional
- **Preconditions**: Cart contains 2 items (`p1` and `p2`).
- **Test Steps**:
  1. Open `/cart`.
  2. Click **Remove** button beside item `p1`.
- **Expected Results**:
  1. Item `p1` disappears from list.
  2. Item `p2` remains in cart.
  3. Total recalculates exclusively for item `p2`.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

#### TC-UI-21: Clear Cart Button Clears All Items
- **Test Objective**: Verify bulk cart clearing via Clear Cart action.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Functional / Sanity
- **Preconditions**: Cart contains 1 or more items.
- **Test Steps**:
  1. Open `/cart`.
  2. Click **Clear Cart** button.
- **Expected Results**:
  1. All items are removed from cart.
  2. View transitions immediately to empty cart state (`"Your cart is empty"`).
  3. Checkout button is hidden.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

### Module 6: Checkout Flow

#### TC-UI-22: Checkout Flow Order Placement Success
- **Test Objective**: Validate completing checkout flow and rendering order confirmation.
- **Priority**: P1 (High) | **Severity**: Critical | **Test Type**: E2E / Smoke
- **Preconditions**: Cart contains at least 1 item.
- **Test Steps**:
  1. Navigate to `/cart`.
  2. Click **Checkout** button.
  3. Observe UI transition and button progress indicators.
- **Expected Results**:
  1. Checkout completes successfully.
  2. Screen presents `"Order Placed Successfully"` banner/card.
  3. Call-to-action button `"Continue Shopping"` is displayed.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

#### TC-UI-23: Cart Automatically Empties Following Successful Checkout
- **Test Objective**: Ensure state synchronization guarantees an empty cart post-checkout.
- **Priority**: P1 (High) | **Severity**: Major | **Test Type**: E2E / Regression
- **Preconditions**: User completed TC-UI-22 order checkout.
- **Test Steps**:
  1. Click **Continue Shopping** or re-navigate directly to `/cart`.
  2. Observe cart state.
- **Expected Results**:
  1. Cart contains no items.
  2. Text displays `"Your cart is empty"`.
- **Automated Mapping**: `tests/web/cart.spec.ts`

---

### Module 7: AI Shopping Assistant (Chatbot)

#### TC-UI-24: AI Chat Page Empty State & UI Components Verification
- **Test Objective**: Verify AI Chat interface loads necessary elements for user communication.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Sanity
- **Preconditions**: Application is running.
- **Test Steps**:
  1. Navigate to `/chat`.
  2. Check page title and heading `"AI Shopping Assistant"`.
  3. Check message input textarea.
  4. Check **Send** button.
- **Expected Results**:
  1. Page heading is visible.
  2. Textarea input is visible with suitable placeholder.
  3. Send button is visible.
- **Automated Mapping**: `tests/web/chat.spec.ts`

---

#### TC-UI-25: Send Chat Message & Verify Transcript Rendering
- **Test Objective**: Verify typed message appears in the chat transcript.
- **Priority**: P1 (High) | **Severity**: Major | **Test Type**: Functional
- **Preconditions**: User is on `/chat`.
- **Test Steps**:
  1. Enter message `"What products do you sell?"` into chat input.
  2. Click **Send** button or press **Enter**.
- **Expected Results**:
  1. Input is submitted.
  2. User's message bubble appears in conversation thread.
- **Automated Mapping**: `tests/web/chat.spec.ts`

---

#### TC-UI-26: Chat Error Notification Banner on Backend Failure (503)
- **Test Objective**: Verify resilient error reporting when AI / Ollama service is unavailable.
- **Priority**: P2 (Medium) | **Severity**: Major | **Test Type**: Resilience / Error Handling
- **Preconditions**: Ollama model service is disconnected (HTTP 503 response from `/api/chat`).
- **Test Steps**:
  1. On `/chat`, send `"Recommend a gaming controller"`.
  2. Wait for response.
- **Expected Results**:
  1. UI does not crash or freeze.
  2. Clear error message or fallback notice appears (e.g. indicates connection failure or server error).
  3. Textbox and Send button remain operable for subsequent queries.
- **Automated Mapping**: `tests/web/chat.spec.ts`

---

#### TC-UI-27: Navigate From AI Chat Back to Products Catalog
- **Test Objective**: Verify seamless return to shopping experience from chat view.
- **Priority**: P3 (Low) | **Severity**: Minor | **Test Type**: Functional
- **Preconditions**: User is on `/chat`.
- **Test Steps**:
  1. Click **Products** in navigation header.
- **Expected Results**:
  1. URL switches to `/products`.
  2. Product catalog is displayed.
- **Automated Mapping**: `tests/web/chat.spec.ts`

