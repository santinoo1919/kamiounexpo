import { create } from "zustand"
import { loadString, saveString } from "@/utils/storage"
import type { Customer, AuthState, LoginCredentials, RegisterData } from "@/domains/data/auth/types"
import * as api from "@/domains/data/auth/api"

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
  updateCustomer: (customerData: {
    first_name?: string
    last_name?: string
    phone?: string
    company_name?: string
    metadata?: Record<string, unknown>
  }) => Promise<void>
  setLoading: (loading: boolean) => void
}

const AUTH_TOKEN_KEY = "auth_token"

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  customer: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true })

      // Call Medusa login API
      const { token } = await api.loginCustomer(credentials)

      // Store token
      saveString(AUTH_TOKEN_KEY, token)

      // Get customer data
      const customer = await api.getCurrentCustomer(token)

      set({
        customer,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true })

      // Step 1: Try to get registration token
      let token: string
      try {
        const { token: regToken } = await api.getRegistrationToken({
          email: data.email,
          password: data.password,
        })
        token = regToken
        console.log("Got registration token")
      } catch (regError: any) {
        // If identity already exists, try to login instead
        if (regError.response?.data?.message?.includes("already exists")) {
          console.log("Identity exists, trying login...")
          const { token: loginToken } = await api.loginCustomer({
            email: data.email,
            password: data.password,
          })
          token = loginToken
          console.log("Got login token")
        } else {
          throw regError
        }
      }

      // Step 2: Try to create customer, but if it fails, just get current customer
      let customer: any
      try {
        const result = await api.createCustomer(
          token,
          {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
          },
          data.email,
        )
        customer = result.customer
      } catch (createError) {
        console.log("Customer creation failed, trying to get current customer...")
        // If customer creation fails, try to get the current customer
        customer = await api.getCurrentCustomer(token)
      }

      // Store token
      saveString(AUTH_TOKEN_KEY, token)

      set({
        customer,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      // Remove token from storage
      saveString(AUTH_TOKEN_KEY, "")

      set({
        customer: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear local state even if storage fails
      set({
        customer: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true })

      // Check for existing token
      const token = loadString(AUTH_TOKEN_KEY) || null

      if (!token) {
        set({ isLoading: false })
        return
      }

      // Verify token by getting customer data
      const customer = await api.getCurrentCustomer(token)

      set({
        customer,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      console.error("Auth initialization error:", error)
      // Clear invalid token
      saveString(AUTH_TOKEN_KEY, "")
      set({
        customer: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  updateCustomer: async (customerData) => {
    try {
      set({ isLoading: true })

      const { token } = get()
      if (!token) {
        throw new Error("No authentication token available")
      }

      // Update customer via Medusa API
      const updatedCustomer = await api.updateCustomer(token, customerData)

      set({
        customer: updatedCustomer,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
}))

// Helper hook for easy access to auth state
export const useAuth = () => {
  const store = useAuthStore()

  return {
    // State
    customer: store.customer,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,

    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    initializeAuth: store.initializeAuth,
    updateCustomer: store.updateCustomer,
  }
}
