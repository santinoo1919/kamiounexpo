// Membership service specific types
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface MembershipTier {
  id: string
  name: string
  description: string
  level: number
  benefits: string[]
  minimumSpend: number
  discountPercentage: number
  freeShipping: boolean
  prioritySupport: boolean
}

export interface UserMembership {
  userId: string
  tier: MembershipTier
  currentSpend: number
  points: number
  joinedAt: string
  expiresAt?: string
}

export interface UserPreferences {
  userId: string
  language: string
  currency: string
  timezone: string
  notifications: NotificationPreferences
  privacy: PrivacySettings
  marketing: MarketingPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  orderUpdates: boolean
  promotions: boolean
  newsletter: boolean
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  showEmail: boolean
  showPhone: boolean
  allowTracking: boolean
}

export interface MarketingPreferences {
  emailMarketing: boolean
  smsMarketing: boolean
  pushMarketing: boolean
  personalizedAds: boolean
}

export interface UserActivity {
  id: string
  userId: string
  type: "login" | "order" | "review" | "wishlist" | "search"
  description: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface UserStats {
  userId: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  favoriteCategories: string[]
  reviewCount: number
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
}

export interface UpdatePreferencesRequest {
  language?: string
  currency?: string
  timezone?: string
  notifications?: Partial<NotificationPreferences>
  privacy?: Partial<PrivacySettings>
  marketing?: Partial<MarketingPreferences>
}

// API Response types
export interface UserProfileResponse {
  profile: UserProfile
}

export interface UserMembershipResponse {
  membership: UserMembership
}

export interface UserPreferencesResponse {
  preferences: UserPreferences
}

export interface UserStatsResponse {
  stats: UserStats
}

export interface UserActivityResponse {
  activities: UserActivity[]
  total: number
  hasMore: boolean
}

// Error types
export interface MembershipError {
  message: string
  code: string
  field?: string
}
