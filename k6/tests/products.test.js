import http from 'k6/http';
import { check, group } from 'k6';
import { getBaseUrl, ENDPOINTS } from '../config/environments.js';
import { createParams } from '../helpers/http.js';

const PRODUCT_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];

export function runProductsTests(baseUrl = getBaseUrl()) {
  group('Products API - Catalog & Detail', () => {
    // 1. GET /api/products (List all products)
    const listRes = http.get(
      `${baseUrl}${ENDPOINTS.products.list}`,
      createParams('products_list')
    );

    check(listRes, {
      'GET /api/products status is 200': (r) => r.status === 200,
      'GET /api/products content-type is JSON': (r) =>
        r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
      'GET /api/products returns product array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body) && body.length === 8;
        } catch {
          return false;
        }
      },
      'GET /api/products response time < 800ms': (r) => r.timings.duration < 800,
    });

    // 2. GET /api/products/:id (Single product by ID)
    const randomId = PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)];
    const detailRes = http.get(
      `${baseUrl}${ENDPOINTS.products.byId(randomId)}`,
      createParams('product_detail')
    );

    check(detailRes, {
      'GET /api/products/:id status is 200': (r) => r.status === 200,
      'GET /api/products/:id returns correct id': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id === randomId && body.name && body.price !== undefined;
        } catch {
          return false;
        }
      },
      'GET /api/products/:id response time < 800ms': (r) => r.timings.duration < 800,
    });

    // 3. GET /api/products/p999 (Invalid product ID returns 404)
    const notFoundRes = http.get(
      `${baseUrl}${ENDPOINTS.products.byId('p999')}`,
      createParams('product_not_found', {}, {
        responseCallback: http.expectedStatuses(404),
      })
    );

    check(notFoundRes, {
      'GET /api/products/p999 status is 404': (r) => r.status === 404,
      'GET /api/products/p999 returns error property': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body && !!body.error;
        } catch {
          return false;
        }
      },
    });
  });
}
