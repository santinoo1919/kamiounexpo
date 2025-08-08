import type { User, LoginCredentials, RegisterData, AuthTokens } from "@/domains/data/auth/types"

export const MOCK_USER: User = {
  id: "1",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  isEmailVerified: true,
  isPhoneVerified: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
}

export const MOCK_AUTH_TOKENS: AuthTokens = {
  accessToken: "mock-jwt-token-12345",
  refreshToken: "mock-refresh-token-67890",
  expiresIn: 3600,
}

export const MOCK_LOGIN_CREDENTIALS: LoginCredentials = {
  email: "user@example.com",
  password: "password123",
}

export const MOCK_REGISTER_DATA: RegisterData = {
  email: "jane.smith@example.com",
  password: "password123",
  firstName: "Jane",
  lastName: "Smith",
  phone: "+1234567891",
}
