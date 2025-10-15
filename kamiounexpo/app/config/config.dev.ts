import { Platform } from "react-native"

/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */

// IMPORTANT: Update this with your computer's local IP address
// Run: ipconfig getifaddr en0 (Mac) or ipconfig (Windows) to find it
const DEV_COMPUTER_IP = "192.168.100.11"

// Auto-select localhost for iOS Simulator, IP for physical devices
const getBackendUrl = () => {
  // For Android emulator, use 10.0.2.2 (special alias for host machine)
  if (Platform.OS === "android" && __DEV__) {
    return "http://10.0.2.2:9000"
  }

  // For iOS simulator, localhost works
  // For physical devices, need the actual IP
  // You can detect simulator vs device, but for simplicity:
  // Just set DEV_COMPUTER_IP above when testing on device
  return `http://${DEV_COMPUTER_IP}:9000`
}

const BACKEND_URL = getBackendUrl()

export default {
  API_URL: "https://api.rss2json.com/v1/",

  // Local Medusa Backend
  MEDUSA_BACKEND_URL: BACKEND_URL,
  MEDUSA_PUBLISHABLE_KEY: "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",

  // Use local Medusa for all services
  PRODUCTS_API_URL: BACKEND_URL,
  CART_API_URL: BACKEND_URL,
  ORDERS_API_URL: BACKEND_URL,
  AUTH_API_URL: BACKEND_URL,
}
