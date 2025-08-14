import { useState, useCallback } from "react"
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
import { MOCK_USER, MOCK_AUTH_TOKENS } from "@/domains/data/mockData/auth"

export const useAuthServiceMock = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = useCallback(async (_credentials: LoginCredentials): Promise<boolean> => {
    setAuthState({
      user: MOCK_USER,
      tokens: MOCK_AUTH_TOKENS,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }, [])

  const register = useCallback(async (_data: RegisterData): Promise<boolean> => {
    setAuthState({
      user: MOCK_USER,
      tokens: MOCK_AUTH_TOKENS,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setAuthState({ user: null, tokens: null, isAuthenticated: false, isLoading: false })
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, tokens: MOCK_AUTH_TOKENS }))
    return true
  }, [])

  const requestPasswordReset = useCallback(
    async (_data: PasswordResetRequest): Promise<boolean> => {
      return true
    },
    [],
  )

  const confirmPasswordReset = useCallback(
    async (_data: PasswordResetConfirm): Promise<boolean> => {
      return true
    },
    [],
  )

  const changePassword = useCallback(async (_data: ChangePasswordRequest): Promise<boolean> => {
    return true
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
