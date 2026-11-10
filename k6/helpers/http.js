/**
 * HTTP helper utilities for k6 tests.
 * Standardizes headers, tagging, and JSON handling.
 */

export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Creates tagged request params for k6 http calls.
 * Tagging allows granular threshold evaluation per endpoint.
 *
 * @param {string} endpointName - Logical endpoint identifier (e.g. 'products_list')
 * @param {object} customHeaders - Optional additional headers
 * @param {object} extraOptions - Optional additional k6 params (e.g. responseCallback)
 * @returns {object} k6 request params
 */
export function createParams(endpointName, customHeaders = {}, extraOptions = {}) {
  return Object.assign(
    {
      headers: Object.assign({}, JSON_HEADERS, customHeaders),
      tags: {
        endpoint: endpointName,
      },
    },
    extraOptions
  );
}

