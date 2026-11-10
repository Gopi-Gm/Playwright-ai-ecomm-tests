import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { getBaseUrl, ENDPOINTS } from '../config/environments.js';
import { createParams } from '../helpers/http.js';

const PRODUCT_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
const CHAT_QUESTIONS = [
  'Can you suggest wireless headphones under $100?',
  'What accessories work with USB-C laptops?',
  'Do you have gaming gear?',
];

export function runEcommerceUserJourney(baseUrl = getBaseUrl()) {
  const chosenProductId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];

  // 1. Browse catalog
  group('Step 1: Browse Products Catalog', () => {
    const res = http.get(
      `${baseUrl}${ENDPOINTS.products.list}`,
      createParams('products_list')
    );
    check(res, {
      'Browse catalog status 200': (r) => r.status === 200,
      'Catalog contains 8 items': (r) => {
        try {
          return JSON.parse(r.body).length === 8;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1); // Realistic user thinking / browsing delay

  // 2. View product details
  group('Step 2: View Product Details', () => {
    const res = http.get(
      `${baseUrl}${ENDPOINTS.products.byId(chosenProductId)}`,
      createParams('product_detail')
    );
    check(res, {
      'View product status 200': (r) => r.status === 200,
      'Product details matches ID': (r) => {
        try {
          return JSON.parse(r.body).id === chosenProductId;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1);

  // 3. Add product to cart
  group('Step 3: Add Item to Cart', () => {
    const payload = JSON.stringify({ productId: chosenProductId, quantity: 1 });
    const res = http.post(
      `${baseUrl}${ENDPOINTS.cart.base}`,
      payload,
      createParams('cart_operations')
    );
    check(res, {
      'Add to cart status 201': (r) => r.status === 201,
      'Item added successfully': (r) => {
        try {
          return JSON.parse(r.body).product.id === chosenProductId;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(0.5);

  // 4. View Cart
  group('Step 4: View Cart', () => {
    const res = http.get(
      `${baseUrl}${ENDPOINTS.cart.base}`,
      createParams('cart_operations')
    );
    check(res, {
      'View cart status 200': (r) => r.status === 200,
      'Cart has items': (r) => {
        try {
          return JSON.parse(r.body).items.length > 0;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1);

  // 5. Update Quantity in Cart
  group('Step 5: Update Cart Item Quantity', () => {
    const payload = JSON.stringify({ quantity: 3 });
    const res = http.patch(
      `${baseUrl}${ENDPOINTS.cart.item(chosenProductId)}`,
      payload,
      createParams('cart_operations')
    );
    check(res, {
      'Update quantity status 200': (r) => r.status === 200,
    });
  });

  sleep(0.5);

  // 6. Consult AI Shopping Assistant
  group('Step 6: Chat with AI Assistant', () => {
    const question = CHAT_QUESTIONS[Math.floor(Math.random() * CHAT_QUESTIONS.length)];
    const payload = JSON.stringify({ message: question, history: [] });
    const res = http.post(
      `${baseUrl}${ENDPOINTS.chat.send}`,
      payload,
      createParams('chat_assistant', {}, {
        responseCallback: http.expectedStatuses(200, 503),
      })
    );
    check(res, {
      'Chat responds with 200 or 503': (r) => r.status === 200 || r.status === 503,
    });
  });

  sleep(0.5);

  // 7. Clear Cart
  group('Step 7: Clear Cart', () => {
    const res = http.del(
      `${baseUrl}${ENDPOINTS.cart.base}`,
      null,
      createParams('cart_operations')
    );
    check(res, {
      'Clear cart status 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}
