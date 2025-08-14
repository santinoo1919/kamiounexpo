import { getAxiosInstance } from "./http"
import type { UserProfile, UpdateProfileRequest } from "./types"

// Magento API endpoints for membership
const ENDPOINTS = {
  // Profile
  GET_PROFILE: "/customer/profile",
  UPDATE_PROFILE: "/customer/profile",
}

// Profile API functions
export const getProfile = async (): Promise<UserProfile> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.GET_PROFILE)
  return data
}

export const updateProfile = async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
  const { data } = await getAxiosInstance().put(ENDPOINTS.UPDATE_PROFILE, profileData)
  return data
}
