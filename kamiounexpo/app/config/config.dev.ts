/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "https://api.rss2json.com/v1/",

  // Local Medusa Backend
  MEDUSA_BACKEND_URL: "http://localhost:9000",
  MEDUSA_PUBLISHABLE_KEY: "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",

  // Use local Medusa for all services
  PRODUCTS_API_URL: "http://localhost:9000",
  CART_API_URL: "http://localhost:9000",
  ORDERS_API_URL: "http://localhost:9000",
  AUTH_API_URL: "http://localhost:9000",
}
