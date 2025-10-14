/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "https://api.rss2json.com/v1/",

  // Medusa Demo Backend (no local install needed!)
  MEDUSA_BACKEND_URL: "https://medusa-public-demo.herokuapp.com",
  MEDUSA_PUBLISHABLE_KEY: "pk_01HQZS2TAZWJJB0PCC77N1C3GG",

  // Use demo backend for all services
  PRODUCTS_API_URL: "https://medusa-public-demo.herokuapp.com",
  CART_API_URL: "https://medusa-public-demo.herokuapp.com",
  ORDERS_API_URL: "https://medusa-public-demo.herokuapp.com",
  AUTH_API_URL: "https://medusa-public-demo.herokuapp.com",
}
