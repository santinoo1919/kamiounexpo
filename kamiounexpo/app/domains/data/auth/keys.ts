// Auth query keys for React Query
export const AuthKeys = {
  Customer: "auth-customer",
  MeQuery: "auth-me", // Backwards compatibility
  StatusQuery: "auth-status", // Backwards compatibility
} as const

export type AuthQueryKey = (typeof AuthKeys)[keyof typeof AuthKeys]
