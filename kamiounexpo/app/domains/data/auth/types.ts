// Auth service specific types for Medusa v2
export interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export interface AuthToken {
  token: string
}

export interface AuthState {
  customer: Customer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// API Response types for Medusa v2
export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  customer: Customer
}

export interface RegistrationTokenResponse {
  token: string
}

// Error types
export interface AuthError {
  message: string
  code: string
  field?: string
}
