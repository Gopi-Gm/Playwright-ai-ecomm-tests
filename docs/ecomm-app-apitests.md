# ShopLab E-Commerce Platform — API Test Cases Specification

## Document Overview
- **Application Name**: ShopLab E-Commerce Platform REST API
- **Base URL**: `https://shoplab-platform-399284160033.us-east1.run.app`
- **API Base Path**: `/api`
- **Default Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Automation Framework**: Playwright Test (`@playwright/test` `APIRequestContext`) & Ajv Schema Validator
- **Document Version**: 1.0.0
- **Scope**: REST API endpoints under `/api` including Products Catalog (`/api/products`), Shopping Cart (`/api/cart`), and AI Chatbot Assistant (`/api/chat`).

---

## API Test Execution Matrix & Summary

| Test Case ID | Endpoint | Method | Test Summary | Category | Priority | Expected Status | Automated Test Spec |
|---|---|---|---|---|---|---|---|
| **TC-API-01** | `/api/products` | `GET` | Retrieve complete list of products | Sanity / Smoke | P1 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-02** | `/api/products` | `GET` | Verify array length and count of catalog items | Functional | P1 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-03** | `/api/products` | `GET` | Validate product list JSON Schema compliance | Contract | P1 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-04** | `/api/products` | `GET` | Validate mandatory attributes across all products | Functional | P2 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-05** | `/api/products` | `GET` | Verify `Content-Type` response header is `application/json` | Protocol | P2 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-06** | `/api/products/{id}` | `GET` | Retrieve single product with valid ID (`p1`) | Sanity | P1 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-07** | `/api/products/{id}` | `GET` | Verify field values for specific product (`p1`) | Regression | P2 | `200 OK` | `tests/api/products-api.spec.ts` |
| **TC-API-08** | `/api/products/{id}` | `GET` | Request non-existent product ID (`p999` / `does-not-exist`) | Negative | P1 | `404 Not Found` | `tests/api/products-api.spec.ts` |
| **TC-API-09** | `/api/products/{id}` | `GET` | Error payload verification for invalid product ID | Contract | P2 | `404 Not Found` | `tests/api/products-api.spec.ts` |
| **TC-API-10** | `/api/cart` | `GET` | Retrieve empty shopping cart | Sanity | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-11** | `/api/cart` | `GET` | Validate empty cart response structure (`items: []`, `total: 0`) | Contract | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-12** | `/api/cart` | `GET` | Validate cart response matches cart JSON schema | Schema | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-13** | `/api/cart` | `POST` | Add valid product to cart with quantity | Sanity / Smoke | P1 | `201 Created` | `tests/api/cart-api.spec.ts` |
| **TC-API-14** | `/api/cart` | `POST` | Verify add-to-cart response body matches schema | Schema | P2 | `201 Created` | `tests/api/cart-api.spec.ts` |
| **TC-API-15** | `/api/cart` | `POST` | Verify added product persists and appears in `GET /api/cart` | E2E | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-16** | `/api/cart` | `POST` | Add invalid `productId` returns 404 | Negative | P1 | `404 Not Found` | `tests/api/cart-api.spec.ts` |
| **TC-API-17** | `/api/cart` | `POST` | Empty request payload returns client error | Negative | P2 | `400+ Bad Request` | `tests/api/cart-api.spec.ts` |
| **TC-API-18** | `/api/cart/{productId}` | `PATCH` | Update existing cart item quantity | Functional | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-19** | `/api/cart/{productId}` | `PATCH` | Verify updated quantity reflects in `GET /api/cart` | E2E | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-20** | `/api/cart/{productId}` | `PATCH` | Update item quantity to `0` removes item | Functional | P2 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-21** | `/api/cart/{productId}` | `PATCH` | Update non-existent cart item returns 404 | Negative | P2 | `404 Not Found` | `tests/api/cart-api.spec.ts` |
| **TC-API-22** | `/api/cart/{productId}` | `DELETE` | Remove existing item from cart | Functional | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-23** | `/api/cart/{productId}` | `DELETE` | Verify removed item no longer appears in `GET /api/cart` | E2E | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-24** | `/api/cart/{productId}` | `DELETE` | Delete item not currently in cart returns 404 | Negative | P2 | `404 Not Found` | `tests/api/cart-api.spec.ts` |
| **TC-API-25** | `/api/cart` | `DELETE` | Clear entire shopping cart | Sanity | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-26** | `/api/cart` | `DELETE` | Verify cart total becomes 0 and items empty after clear | Functional | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-27** | `/api/cart` | `GET` | Cart total computation across multiple different products | Calculation | P1 | `200 OK` | `tests/api/cart-api.spec.ts` |
| **TC-API-28** | `/api/chat` | `POST` | Send chat prompt and verify HTTP response contract (200 or 503) | Resilience | P1 | `200 / 503` | `tests/api/chat-api.spec.ts` |
| **TC-API-29** | `/api/chat` | `POST` | Verify 503 response body contains error contract when Ollama is offline | Error Handling | P2 | `503 Unavailable` | `tests/api/chat-api.spec.ts` |
| **TC-API-30** | `/api/chat` | `POST` | Verify chat response structure when Ollama service is healthy | Contract | P1 | `200 OK` | `tests/api/chat-api.spec.ts` |
| **TC-API-31** | `/api/chat` | `POST` | Send request with empty message payload | Boundary | P3 | `200/400/503` | `tests/api/chat-api.spec.ts` |

---

## Detailed API Test Cases

### Module 1: Products API (`/api/products`)

#### TC-API-01: Retrieve Complete List of Products
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products`
- **Description**: Verifies that the endpoint is reachable and returns HTTP status 200 with JSON payload.
- **Headers**:
  ```http
  Accept: application/json
  ```
- **Execution Steps**:
  1. Send `GET` request to `/api/products`.
  2. Inspect HTTP status code and response headers.
- **Expected Results**:
  1. Status code is `200 OK`.
  2. Response body is a valid JSON array.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-02: Verify Array Length and Count of Catalog Items
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products`
- **Description**: Verifies the inventory catalogue exposes exactly 8 products.
- **Execution Steps**:
  1. Send `GET` request to `/api/products`.
  2. Parse the JSON array.
  3. Assert array length.
- **Expected Results**:
  1. Status code is `200 OK`.
  2. Array length is exactly `8`.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-03: Validate Product List JSON Schema Compliance
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products`
- **Description**: Validates that the response conforms strictly to `product_api_schema.json` via Ajv.
- **Schema Validation Rules**:
  - Root: `array`
  - Items: `object`
  - Required fields per item: `["id", "name", "description", "price", "category", "emoji", "color", "stock", "rating"]`
  - `additionalProperties: false`
- **Execution Steps**:
  1. Send `GET` request to `/api/products`.
  2. Compile `api/schemas/product_api_schema.json` with Ajv.
  3. Validate response body against schema.
- **Expected Results**:
  1. Schema validation returns `true` with zero schema errors.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-04: Validate Mandatory Attributes Across All Products
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products`
- **Description**: Iterates through each product item to confirm presence and type of attributes.
- **Execution Steps**:
  1. Send `GET` request to `/api/products`.
  2. For every product in array, verify:
     - `id`: Non-empty string (e.g., `p1`, `p2`)
     - `name`: Non-empty string
     - `price`: Number > 0
     - `category`: String (`Audio`, `Computing`, `Accessories`, `Gaming`)
     - `stock`: Integer >= 0
     - `rating`: Number between 1.0 and 5.0
     - `description`: Non-empty string
- **Expected Results**:
  1. All items satisfy data integrity rules.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-05: Verify Response Headers
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products`
- **Description**: Ensure API returns standard content-type header.
- **Expected Results**:
  1. Header `content-type` includes `application/json`.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-06: Retrieve Single Product With Valid ID
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products/p1`
- **Description**: Fetch specific product record using valid path parameter `p1`.
- **Execution Steps**:
  1. Send `GET` request to `/api/products/p1`.
- **Expected Results**:
  1. Status code is `200 OK`.
  2. Response is a single JSON object.
  3. `body.id === "p1"`.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-07: Verify Field Values for Specific Product (p1)
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products/p1`
- **Description**: Ensure specific product attributes accurately match catalog inventory.
- **Expected Response Body**:
  ```json
  {
    "id": "p1",
    "name": "Wireless Bluetooth Headphones",
    "description": "High-fidelity sound with 30-hour battery life and noise cancellation.",
    "price": 79.99,
    "category": "Audio",
    "stock": 25,
    "rating": 4.5
  }
  ```
- **Expected Results**:
  1. Attributes match expected product catalog baseline.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-08: Request Non-Existent Product ID (404 Not Found)
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products/p999` (or `/api/products/does-not-exist`)
- **Description**: Verify proper HTTP status code when requesting missing product ID.
- **Execution Steps**:
  1. Send `GET` request to `/api/products/p999`.
- **Expected Results**:
  1. HTTP Status is `404 Not Found`.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

#### TC-API-09: Error Payload Verification for Invalid Product ID
- **HTTP Method**: `GET`
- **Endpoint**: `/api/products/does-not-exist`
- **Description**: Verify error body structure on 404 response.
- **Expected Response Body**:
  ```json
  {
    "error": "Product not found"
  }
  ```
- **Expected Results**:
  1. Status code is `404`.
  2. Body contains property `error` with text `"Product not found"`.
- **Automated Mapping**: `tests/api/products-api.spec.ts`

---

### Module 2: Cart API (`/api/cart`)

#### TC-API-10: Retrieve Empty Shopping Cart
- **HTTP Method**: `GET`
- **Endpoint**: `/api/cart`
- **Description**: Verify initial state of cart after clearing.
- **Preconditions**: Execute `DELETE /api/cart` prior to request.
- **Execution Steps**:
  1. Send `GET` request to `/api/cart`.
- **Expected Results**:
  1. HTTP Status is `200 OK`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-11: Validate Empty Cart Response Structure
- **HTTP Method**: `GET`
- **Endpoint**: `/api/cart`
- **Description**: Verify empty cart JSON schema contract.
- **Expected Response Body**:
  ```json
  {
    "items": [],
    "total": 0
  }
  ```
- **Expected Results**:
  1. `body.items` is an empty array `[]`.
  2. `body.total` is numeric `0`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-12: Validate Cart Response Matches JSON Schema
- **HTTP Method**: `GET`
- **Endpoint**: `/api/cart`
- **Description**: Validate cart schema structure against `cart_api_schema.json`.
- **Execution Steps**:
  1. Send `GET` request to `/api/cart`.
  2. Validate with Ajv against `api/schemas/cart_api_schema.json`.
- **Expected Results**:
  1. Validation passes with `valid === true`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-13: Add Valid Product to Cart
- **HTTP Method**: `POST`
- **Endpoint**: `/api/cart`
- **Description**: Add product `p1` with quantity 1 into cart.
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "productId": "p1",
    "quantity": 1
  }
  ```
- **Expected Results**:
  1. Status code is `201 Created`.
  2. Response contains:
     ```json
     {
       "product": {
         "id": "p1",
         "name": "Wireless Bluetooth Headphones",
         "price": 79.99
       },
       "quantity": 1
     }
     ```
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-14: Verify Add-To-Cart Response Matches Schema
- **HTTP Method**: `POST`
- **Endpoint**: `/api/cart`
- **Description**: Verify response conforms to `cart_add_response_schema.json`.
- **Request Body**:
  ```json
  {
    "productId": "p2",
    "quantity": 2
  }
  ```
- **Expected Results**:
  1. Status is `201 Created`.
  2. Response body matches `cart_add_response_schema.json`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-15: Verify Added Product Persists in GET /api/cart
- **HTTP Method**: `POST` then `GET`
- **Endpoint**: `/api/cart`
- **Description**: End-to-end persistence validation between POST and GET.
- **Execution Steps**:
  1. `POST /api/cart` with `{ "productId": "p1", "quantity": 1 }`.
  2. `GET /api/cart`.
- **Expected Results**:
  1. `GET /api/cart` returns status `200`.
  2. `body.items` has length `1`.
  3. `body.items[0].product.id === "p1"`.
  4. `body.total === 79.99`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-16: Add Invalid Product ID to Cart (404 Not Found)
- **HTTP Method**: `POST`
- **Endpoint**: `/api/cart`
- **Description**: Ensure adding invalid product ID fails with proper error.
- **Request Body**:
  ```json
  {
    "productId": "p999",
    "quantity": 1
  }
  ```
- **Expected Results**:
  1. Status is `404 Not Found`.
  2. Body contains property `error` (e.g. `"Product not found"`).
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-17: Empty Request Payload Returns Client Error
- **HTTP Method**: `POST`
- **Endpoint**: `/api/cart`
- **Description**: Send empty JSON object `{}`.
- **Request Body**: `{}`
- **Expected Results**:
  1. Status code is `>= 400` (e.g. `400 Bad Request` or `422 Unprocessable Entity`).
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-18: Update Existing Cart Item Quantity
- **HTTP Method**: `PATCH`
- **Endpoint**: `/api/cart/p1`
- **Description**: Update quantity of item `p1` from 1 to 3.
- **Preconditions**: Item `p1` exists in cart.
- **Request Body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Expected Results**:
  1. Status code is `200 OK`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-19: Verify Updated Quantity Reflects in GET /api/cart
- **HTTP Method**: `PATCH` then `GET`
- **Endpoint**: `/api/cart/p1`
- **Description**: Check state update persistence.
- **Execution Steps**:
  1. Send `PATCH /api/cart/p1` with `{ "quantity": 3 }`.
  2. Send `GET /api/cart`.
- **Expected Results**:
  1. Status is `200 OK`.
  2. `body.items[0].quantity === 3`.
  3. Total recalculates to `239.97` (79.99 * 3).
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-20: Update Item Quantity to Zero Removes Item
- **HTTP Method**: `PATCH`
- **Endpoint**: `/api/cart/p1`
- **Description**: Update quantity to 0 removes the item from cart.
- **Request Body**:
  ```json
  {
    "quantity": 0
  }
  ```
- **Expected Results**:
  1. Status code is `200 OK`.
  2. Response indicates removal (`"Item removed"`).
  3. Subsequent `GET /api/cart` returns empty items list.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-21: Update Non-Existent Cart Item Returns 404
- **HTTP Method**: `PATCH`
- **Endpoint**: `/api/cart/p1`
- **Description**: Updating an item not present in cart returns 404.
- **Preconditions**: Cart is empty.
- **Request Body**:
  ```json
  {
    "quantity": 2
  }
  ```
- **Expected Results**:
  1. Status is `404 Not Found`.
  2. Body contains `"Item not found in cart"`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-22: Remove Existing Item From Cart
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/cart/p1`
- **Description**: Remove single item `p1` via dedicated DELETE endpoint.
- **Preconditions**: Item `p1` is in cart.
- **Execution Steps**:
  1. Send `DELETE /api/cart/p1`.
- **Expected Results**:
  1. Status is `200 OK`.
  2. Response contains message: `"Item removed"`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-23: Verify Removed Item No Longer Appears in Cart
- **HTTP Method**: `GET`
- **Endpoint**: `/api/cart`
- **Description**: Ensure GET /api/cart verifies item deletion.
- **Execution Steps**:
  1. After TC-API-22, send `GET /api/cart`.
- **Expected Results**:
  1. `body.items` has length `0`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-24: Delete Item Not Currently in Cart Returns 404
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/cart/p1`
- **Description**: Attempting to delete an item not in cart returns 404.
- **Preconditions**: Cart is empty.
- **Execution Steps**:
  1. Send `DELETE /api/cart/p1`.
- **Expected Results**:
  1. Status is `404 Not Found`.
  2. Body contains `"Item not found in cart"`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-25: Clear Entire Shopping Cart
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/cart`
- **Description**: Clears all items from cart in one operation.
- **Preconditions**: Cart has multiple items (`p1`, `p2`).
- **Execution Steps**:
  1. Send `DELETE /api/cart`.
- **Expected Results**:
  1. Status is `200 OK`.
  2. Body contains `{ "message": "Cart cleared" }`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-26: Verify Cart Total Becomes 0 and Items Empty After Clear
- **HTTP Method**: `GET`
- **Endpoint**: `/api/cart`
- **Description**: Confirm state post-clear.
- **Execution Steps**:
  1. Send `GET /api/cart` after cart clear.
- **Expected Results**:
  1. `body.items` has length `0`.
  2. `body.total === 0`.
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

#### TC-API-27: Cart Total Computation Across Multiple Products
- **HTTP Method**: `POST` (multiple) + `GET`
- **Endpoint**: `/api/cart`
- **Description**: Validates precision calculations for multi-item cart.
- **Execution Steps**:
  1. Clear cart (`DELETE /api/cart`).
  2. Add item `p1` (Price: `$79.99`, Qty: 1).
  3. Add item `p5` (Price: `$39.99`, Qty: 1).
  4. Send `GET /api/cart`.
- **Expected Results**:
  1. `body.items` length is `2`.
  2. `body.total` matches `119.98` ($79.99 + $39.99).
- **Automated Mapping**: `tests/api/cart-api.spec.ts`

---

### Module 3: Chat API (`/api/chat`)

#### TC-API-28: Send Chat Prompt and Verify HTTP Response Contract
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat`
- **Description**: Send shopping query payload and assert recognized status code (`200` if Ollama is running, `503` if backend model is offline).
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "message": "What products do you sell?",
    "history": []
  }
  ```
- **Expected Results**:
  1. Status code is either `200 OK` or `503 Service Unavailable`.
  2. Response body is an object.
- **Automated Mapping**: `tests/api/chat-api.spec.ts`

---

#### TC-API-29: Verify 503 Response Contract on Ollama Service Outage
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat`
- **Description**: Verify graceful contract response when Ollama backend is unreachable.
- **Execution Steps**:
  1. Send `POST /api/chat` with `{ "message": "Hello", "history": [] }`.
  2. When status is `503`, inspect body structure.
- **Expected Results**:
  1. Body is an object containing property `error`.
  2. Error string describes connection failure (e.g. `"Failed to connect to Ollama"`).
- **Automated Mapping**: `tests/api/chat-api.spec.ts`

---

#### TC-API-30: Verify Chat Response Structure When Service is Healthy
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat`
- **Description**: When Ollama AI is reachable, verify assistant message reply.
- **Request Body**:
  ```json
  {
    "message": "Recommend a keyboard",
    "history": []
  }
  ```
- **Expected Results**:
  1. Status is `200 OK`.
  2. Body contains `reply` object:
     - `reply.role === "assistant"`
     - `reply.content` is non-empty string.
- **Automated Mapping**: `tests/api/chat-api.spec.ts`

---

#### TC-API-31: Send Request With Empty Message Payload
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat`
- **Description**: Test boundary case with empty message string.
- **Request Body**:
  ```json
  {
    "message": "",
    "history": []
  }
  ```
- **Expected Results**:
  1. Server handles request without unhandled runtime crash (returns `200`, `400`, or `503`).
- **Automated Mapping**: `tests/api/chat-api.spec.ts`

