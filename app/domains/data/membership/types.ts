// Membership service specific types
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  shopType?: "individual" | "business"
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  vatNumber?: string
  avatar?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  shopType?: "individual" | "business"
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  vatNumber?: string
  dateOfBirth?: string
  gender?: "male" | "female" | "other"
}

// API Response types
export interface UserProfileResponse {
  profile: UserProfile
}

// Error types
export interface MembershipError {
  message: string
  code: string
  field?: string
}
