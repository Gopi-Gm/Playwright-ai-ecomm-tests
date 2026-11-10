import http from 'k6/http';
import { check, group } from 'k6';
import { getBaseUrl, ENDPOINTS } from '../config/environments.js';
import { createParams } from '../helpers/http.js';

export function runCartTests(baseUrl = getBaseUrl()) {
  group('Cart API - Lifecycle', () => {
    // 1. GET /api/cart
    const getRes = http.get(
      `${baseUrl}${ENDPOINTS.cart.base}`,
      createParams('cart_operations')
    );

    check(getRes, {
      'GET /api/cart status is 200': (r) => r.status === 200,
      'GET /api/cart has items array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.items);
        } catch {
          return false;
        }
      },
    });

    // 2. POST /api/cart (Add product)
    const addPayload = JSON.stringify({ productId: 'p1', quantity: 2 });
    const addRes = http.post(
      `${baseUrl}${ENDPOINTS.cart.base}`,
      addPayload,
      createParams('cart_operations')
    );

    check(addRes, {
      'POST /api/cart status is 201': (r) => r.status === 201,
      'POST /api/cart returns added product': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.product && body.product.id === 'p1' && body.quantity === 2;
        } catch {
          return false;
        }
      },
    });

    // 3. PATCH /api/cart/:productId (Update quantity)
    const updatePayload = JSON.stringify({ quantity: 5 });
    const patchRes = http.patch(
      `${baseUrl}${ENDPOINTS.cart.item('p1')}`,
      updatePayload,
      createParams('cart_operations')
    );

    check(patchRes, {
      'PATCH /api/cart/:id status is 200': (r) => r.status === 200,
      'PATCH /api/cart/:id returns updated cart': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.items && body.items.some((item) => item.product.id === 'p1');
        } catch {
          return false;
        }
      },
    });

    // 4. DELETE /api/cart/:productId (Remove single item)
    const deleteItemRes = http.del(
      `${baseUrl}${ENDPOINTS.cart.item('p1')}`,
      null,
      createParams('cart_operations')
    );

    check(deleteItemRes, {
      'DELETE /api/cart/:id status is 200': (r) => r.status === 200,
    });

    // 5. DELETE /api/cart (Clear entire cart)
    const clearRes = http.del(
      `${baseUrl}${ENDPOINTS.cart.base}`,
      null,
      createParams('cart_operations')
    );

    check(clearRes, {
      'DELETE /api/cart status is 200': (r) => r.status === 200,
      'DELETE /api/cart clears all items': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.items && body.items.length === 0;
        } catch {
          return false;
        }
      },
    });
  });
}
