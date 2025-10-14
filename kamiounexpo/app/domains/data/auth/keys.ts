// Auth query keys for React Query
export const AuthKeys = {
  MeQuery: "auth-me",
  StatusQuery: "auth-status",
} as const

export type AuthQueryKey = (typeof AuthKeys)[keyof typeof AuthKeys]
