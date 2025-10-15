import axios from "axios"
import type {
  Customer,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  RegistrationTokenResponse,
} from "./types"
import Config from "@/config"

// Create axios instance for auth
const getAxiosInstance = () => {
  return axios.create({
    baseURL: (Config as any).MEDUSA_BACKEND_URL,
    timeout: 30000,
  })
}

// Medusa v2 Store API endpoints
const ENDPOINTS = {
  REGISTER_TOKEN: "/auth/customer/emailpass/register",
  LOGIN: "/auth/customer/emailpass",
  CUSTOMER: "/store/customers",
  CUSTOMER_ME: "/store/customers/me",
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
})

const getAuthHeaders = (token: string) => ({
  ...getHeaders(),
  Authorization: `Bearer ${token}`,
})

// Get registration token
export const getRegistrationToken = async (
  credentials: LoginCredentials,
): Promise<RegistrationTokenResponse> => {
  const instance = getAxiosInstance()
  const headers = getHeaders()

  console.log("=== REGISTRATION DEBUG ===")
  console.log("URL:", instance.defaults.baseURL + ENDPOINTS.REGISTER_TOKEN)
  console.log("Headers:", headers)
  console.log("Body:", credentials)

  const { data } = await instance.post(ENDPOINTS.REGISTER_TOKEN, credentials, {
    headers,
  })

  console.log("Response:", data)
  console.log("========================")

  return data
}

// Login customer
export const loginCustomer = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const instance = getAxiosInstance()
  const { data } = await instance.post(ENDPOINTS.LOGIN, credentials, {
    headers: getHeaders(),
  })
  return data
}

// Create customer with registration token
export const createCustomer = async (
  token: string,
  customerData: Omit<RegisterData, "email" | "password">,
  email: string,
): Promise<RegisterResponse> => {
  const instance = getAxiosInstance()

  console.log("=== CREATE CUSTOMER DEBUG ===")
  console.log("URL:", instance.defaults.baseURL + ENDPOINTS.CUSTOMER)
  console.log("Headers:", getAuthHeaders(token))
  console.log("Body:", { ...customerData, email })

  const { data } = await instance.post(
    ENDPOINTS.CUSTOMER,
    {
      ...customerData,
      email,
    },
    {
      headers: getAuthHeaders(token),
    },
  )

  console.log("Create Customer Response:", data)
  console.log("=============================")

  return data
}

// Get current customer
export const getCurrentCustomer = async (token: string): Promise<Customer> => {
  const instance = getAxiosInstance()
  const { data } = await instance.get(ENDPOINTS.CUSTOMER_ME, {
    headers: getAuthHeaders(token),
  })
  return data.customer
}
