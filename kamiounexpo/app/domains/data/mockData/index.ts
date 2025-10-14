// Centralized mock data configuration
// Individual services should import directly from their specific files:
// import { MOCK_USER } from "@/services/data/mockData/auth"
// import { MOCK_PRODUCTS } from "@/services/data/mockData/products"
// etc.

// Mock data configuration
export const MOCK_CONFIG = {
  // Simulate network delays
  delays: {
    fast: 200,
    normal: 500,
    slow: 1000,
  },

  // Mock user session
  session: {
    userId: "user-1",
    token: "mock-jwt-token-12345",
    expiresAt: "2024-12-31T23:59:59Z",
  },

  // Mock app settings
  app: {
    currency: "USD",
    language: "en",
    timezone: "America/New_York",
  },
}
