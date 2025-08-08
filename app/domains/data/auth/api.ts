import { getAxiosInstance } from "./http"
import type { User } from "./types"

const ENDPOINTS = {
  ME: "/customer/me", // Adjust to Magento/BFF later
  STATUS: "/auth/status",
}

export const getMe = async (): Promise<User> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.ME)
  return data
}

export const getAuthStatus = async (): Promise<{ isAuthenticated: boolean }> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.STATUS)
  return data
}
