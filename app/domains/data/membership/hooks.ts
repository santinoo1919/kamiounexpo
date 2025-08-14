import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "./api"
import * as transformers from "./transformers"
import * as validators from "./validators"
import { Membership } from "./keys"
import type { UserProfile, UpdateProfileRequest } from "./types"

// Profile hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: [Membership.ProfileQuery],
    queryFn: async () => {
      const rawData = await api.getProfile()
      const validated = validators.validateUserProfile(rawData)
      return transformers.transformUserProfile(validated)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest) => {
      const rawData = await api.updateProfile(profileData)
      const validated = validators.validateUserProfile(rawData)
      return transformers.transformUserProfile(validated)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Membership.ProfileQuery] })
    },
  })
}
