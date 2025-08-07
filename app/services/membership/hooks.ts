import { useState, useEffect, useCallback } from "react"
import type {
  UserProfile,
  UserMembership,
  UserPreferences,
  UserStats,
  UserActivity,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  MembershipTier,
} from "./types"

// Mock data
const MOCK_USER_PROFILE: UserProfile = {
  id: "user-1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  dateOfBirth: "1990-01-15",
  gender: "male",
  isEmailVerified: true,
  isPhoneVerified: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
}

const MOCK_MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    description: "Basic membership tier",
    level: 1,
    benefits: ["5% discount on orders", "Standard shipping"],
    minimumSpend: 0,
    discountPercentage: 5,
    freeShipping: false,
    prioritySupport: false,
  },
  {
    id: "silver",
    name: "Silver",
    description: "Premium membership tier",
    level: 2,
    benefits: ["10% discount on orders", "Free shipping", "Priority support"],
    minimumSpend: 500,
    discountPercentage: 10,
    freeShipping: true,
    prioritySupport: true,
  },
  {
    id: "gold",
    name: "Gold",
    description: "Elite membership tier",
    level: 3,
    benefits: [
      "15% discount on orders",
      "Free express shipping",
      "VIP support",
      "Exclusive offers",
    ],
    minimumSpend: 1000,
    discountPercentage: 15,
    freeShipping: true,
    prioritySupport: true,
  },
]

const MOCK_USER_MEMBERSHIP: UserMembership = {
  userId: "user-1",
  tier: MOCK_MEMBERSHIP_TIERS[1], // Silver tier
  currentSpend: 750,
  points: 1250,
  joinedAt: "2024-01-01T00:00:00Z",
  expiresAt: "2024-12-31T23:59:59Z",
}

const MOCK_USER_PREFERENCES: UserPreferences = {
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
    profileVisibility: "private",
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

const MOCK_USER_STATS: UserStats = {
  userId: "user-1",
  totalOrders: 12,
  totalSpent: 750.5,
  averageOrderValue: 62.54,
  lastOrderDate: "2024-01-10T15:30:00Z",
  favoriteCategories: ["beverages", "snacks", "household"],
  reviewCount: 8,
}

const MOCK_USER_ACTIVITIES: UserActivity[] = [
  {
    id: "1",
    userId: "user-1",
    type: "login",
    description: "User logged in",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    type: "order",
    description: "Placed order #ORD-2024-002",
    metadata: { orderId: "2", orderNumber: "ORD-2024-002" },
    timestamp: "2024-01-10T15:30:00Z",
  },
  {
    id: "3",
    userId: "user-1",
    type: "review",
    description: "Reviewed Coca-Cola Classic",
    metadata: { productId: "1", rating: 5 },
    timestamp: "2024-01-08T12:00:00Z",
  },
]

// Membership service hooks
export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProfile(MOCK_USER_PROFILE)
    } catch (err) {
      setError("Failed to fetch profile")
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (request: UpdateProfileRequest): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock profile update
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...request,
              updatedAt: new Date().toISOString(),
            }
          : null,
      )

      setLoading(false)
      return true
    } catch (err) {
      setError("Failed to update profile")
      setLoading(false)
      return false
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  }
}

export const useUserMembership = () => {
  const [membership, setMembership] = useState<UserMembership | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembership = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600))

      setMembership(MOCK_USER_MEMBERSHIP)
    } catch (err) {
      setError("Failed to fetch membership")
      console.error("Error fetching membership:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembership()
  }, [fetchMembership])

  return {
    membership,
    loading,
    error,
    refetch: fetchMembership,
  }
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400))

      setPreferences(MOCK_USER_PREFERENCES)
    } catch (err) {
      setError("Failed to fetch preferences")
      console.error("Error fetching preferences:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePreferences = useCallback(
    async (request: UpdatePreferencesRequest): Promise<boolean> => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600))

        // Mock preferences update
        setPreferences((prev) =>
          prev
            ? {
                ...prev,
                ...request,
                notifications: { ...prev.notifications, ...request.notifications },
                privacy: { ...prev.privacy, ...request.privacy },
                marketing: { ...prev.marketing, ...request.marketing },
              }
            : null,
        )

        setLoading(false)
        return true
      } catch (err) {
        setError("Failed to update preferences")
        setLoading(false)
        return false
      }
    },
    [],
  )

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  }
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 700))

      setStats(MOCK_USER_STATS)
    } catch (err) {
      setError("Failed to fetch stats")
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

export const useUserActivity = () => {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setActivities(MOCK_USER_ACTIVITIES)
    } catch (err) {
      setError("Failed to fetch activities")
      console.error("Error fetching activities:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  }
}
