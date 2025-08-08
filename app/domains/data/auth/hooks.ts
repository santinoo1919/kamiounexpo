import { useQuery } from "@tanstack/react-query"
import { AuthKeys } from "./keys"
import * as api from "./api"
import * as validators from "./validators"
import * as transformers from "./transformers"

// Read-only server-backed queries
export const useAuthMe = () => {
  return useQuery({
    queryKey: [AuthKeys.MeQuery],
    queryFn: async () => {
      const raw = await api.getMe()
      const validated = validators.validateMagentoUser(raw)
      return transformers.transformUser(validated)
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}

export const useAuthStatus = () => {
  return useQuery({
    queryKey: [AuthKeys.StatusQuery],
    queryFn: api.getAuthStatus,
    staleTime: 60 * 1000,
    retry: 3,
  })
}

// Backwards compatibility: expose mock hook under the old name
export { useAuthServiceMock as useAuthService } from "./hooks.mock"
