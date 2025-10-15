import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthKeys } from "./keys"
import * as api from "./api"
import * as validators from "./validators"
import * as transformers from "./transformers"
import type { LoginCredentials, RegisterData, Customer } from "./types"

// Read-only server-backed queries
export const useCurrentCustomer = (token: string | null) => {
  return useQuery({
    queryKey: [AuthKeys.Customer, token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided")
      const raw = await api.getCurrentCustomer(token)
      const validated = validators.validateMedusaCustomer(raw)
      return transformers.transformCustomer(validated)
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}

// Mutation hooks for auth operations
export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => api.loginCustomer(credentials),
    onSuccess: () => {
      // Invalidate customer query when login succeeds
      queryClient.invalidateQueries({ queryKey: [AuthKeys.Customer] })
    },
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      // Step 1: Get registration token
      const { token } = await api.getRegistrationToken({
        email: data.email,
        password: data.password,
      })

      // Step 2: Create customer with token
      const { customer } = await api.createCustomer(token, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      })

      return { token, customer }
    },
    onSuccess: () => {
      // Invalidate customer query when registration succeeds
      queryClient.invalidateQueries({ queryKey: [AuthKeys.Customer] })
    },
  })
}

// Backwards compatibility: expose mock hook under the old name
export { useAuthServiceMock as useAuthService } from "./hooks.mock"
