// Membership query keys for React Query
export const Membership = {
  // Profile queries
  ProfileQuery: "membership-profile",
} as const

// Query key types for better type safety
export type MembershipQueryKey = (typeof Membership)[keyof typeof Membership]
