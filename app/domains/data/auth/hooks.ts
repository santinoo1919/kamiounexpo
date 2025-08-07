import { useState, useEffect, useCallback } from "react"
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthState,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
} from "./types"
import { MOCK_USER } from "@/domains/data/mockData/auth"

// Mock tokens
const MOCK_TOKENS: AuthTokens = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiresIn: 3600,
}

// Auth service hook
export const useAuthService = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock login - always succeeds
      setAuthState({
        user: MOCK_USER,
        tokens: MOCK_TOKENS,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration - always succeeds
      setAuthState({
        user: { ...MOCK_USER, ...data },
        tokens: MOCK_TOKENS,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAuthState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock token refresh - always succeeds
      setAuthState((prev) => ({
        ...prev,
        tokens: MOCK_TOKENS,
      }))

      return true
    } catch (err) {
      return false
    }
  }, [])

  const requestPasswordReset = useCallback(async (data: PasswordResetRequest): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock password reset request - always succeeds
      return true
    } catch (err) {
      return false
    }
  }, [])

  const confirmPasswordReset = useCallback(async (data: PasswordResetConfirm): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock password reset confirmation - always succeeds
      return true
    } catch (err) {
      return false
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock password change - always succeeds
      setAuthState((prev) => ({ ...prev, isLoading: false }))

      return true
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }, [])

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    requestPasswordReset,
    confirmPasswordReset,
    changePassword,
  }
}
