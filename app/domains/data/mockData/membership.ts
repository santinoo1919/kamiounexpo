import type {
  UserProfile,
  UserMembership,
  UserPreferences,
  UserStats,
  UserActivity,
  MembershipTier,
} from "@/domains/data/membership/types"

export const MOCK_USER_PROFILE: UserProfile = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  dateOfBirth: "1990-05-15",
  gender: "male",
  isEmailVerified: true,
  isPhoneVerified: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
}

export const MOCK_MEMBERSHIP_TIER: MembershipTier = {
  id: "premium",
  name: "Premium",
  description: "Premium membership tier",
  level: 3,
  benefits: ["free_shipping", "priority_support", "exclusive_offers"],
  minimumSpend: 1000,
  discountPercentage: 15,
  freeShipping: true,
  prioritySupport: true,
}

export const MOCK_USER_MEMBERSHIP: UserMembership = {
  userId: "user-1",
  tier: MOCK_MEMBERSHIP_TIER,
  currentSpend: 1250,
  points: 1250,
  joinedAt: "2024-01-01T00:00:00Z",
  expiresAt: "2024-12-31T23:59:59Z",
}

export const MOCK_USER_PREFERENCES: UserPreferences = {
  userId: "user-1",
  language: "en",
  currency: "USD",
  timezone: "America/New_York",
  notifications: {
    email: true,
    push: true,
    sms: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowTracking: true,
  },
  marketing: {
    emailMarketing: true,
    smsMarketing: false,
    pushMarketing: true,
    personalizedAds: true,
  },
}

export const MOCK_USER_STATS: UserStats = {
  userId: "user-1",
  totalOrders: 15,
  totalSpent: 234.5,
  averageOrderValue: 15.63,
  lastOrderDate: "2024-01-10T15:30:00Z",
  favoriteCategories: ["beverages", "snacks"],
  reviewCount: 8,
}

export const MOCK_USER_ACTIVITIES: UserActivity[] = [
  {
    id: "activity-1",
    userId: "user-1",
    type: "order",
    description: "Order #ORD-2024-002 has been placed",
    metadata: { orderId: "2", orderNumber: "ORD-2024-002" },
    timestamp: "2024-01-09T14:00:00Z",
  },
  {
    id: "activity-2",
    userId: "user-1",
    type: "order",
    description: "Order #ORD-2024-001 has been delivered",
    metadata: { orderId: "1", orderNumber: "ORD-2024-001" },
    timestamp: "2024-01-08T15:30:00Z",
  },
  {
    id: "activity-3",
    userId: "user-1",
    type: "review",
    description: "You left a review for Coca-Cola Classic",
    metadata: { productId: "1", rating: 5 },
    timestamp: "2024-01-05T10:00:00Z",
  },
]
