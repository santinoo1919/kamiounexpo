import axios from "axios"
import type { Order } from "./types"
import Config from "@/config"
import { loadString } from "@/utils/storage"

// Create axios instance for orders
const getAxiosInstance = () => {
  return axios.create({
    baseURL: (Config as any).ORDERS_API_URL || (Config as any).MEDUSA_BACKEND_URL,
    timeout: 30000,
  })
}

// Medusa Store API endpoints
const ENDPOINTS = {
  COMPLETE_CART: (cartId: string) => `/store/carts/${cartId}/complete`,
  ORDERS: "/store/orders",
  ORDER: (id: string) => `/store/orders/${id}`,
}

const CART_ID_STORAGE_KEY = "medusa_cart_id"

// Complete checkout - Convert cart to order using Medusa SDK
export const completeCheckout = async (checkoutData: {
  email: string
  cartId?: string // Optional cart ID, will use stored one if not provided
  shipping_address?: {
    first_name: string
    last_name: string
    address_1: string
    city: string
    country_code: string
    postal_code: string
    province?: string
    phone?: string
  }
}): Promise<any> => {
  // Get cart ID from parameter or storage
  const cartId = checkoutData.cartId || loadString(CART_ID_STORAGE_KEY)

  if (!cartId) {
    throw new Error("No active cart found")
  }

  // If no shipping address provided, use a default placeholder
  const shippingAddress = checkoutData.shipping_address || {
    first_name: "Guest",
    last_name: "Customer",
    address_1: "123 Main St",
    city: "New York",
    country_code: "us",
    postal_code: "10001",
  }

  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }

  try {
    // Step 1: Add shipping method to cart
    const shippingOptions = await instance.get(`/store/shipping-options?cart_id=${cartId}`, {
      headers,
    })
    if (shippingOptions.data.shipping_options?.length > 0) {
      await instance.post(
        `/store/carts/${cartId}/shipping-methods`,
        { option_id: shippingOptions.data.shipping_options[0].id },
        { headers },
      )
    }

    // Step 2: Create payment collection
    const paymentCollection = await instance.post(
      `/store/payment-collections`,
      { cart_id: cartId },
      { headers },
    )

    // Step 3: Get payment provider and create session
    const cartResponse = await instance.get(`/store/carts/${cartId}`, { headers })
    const regionId = cartResponse.data.cart.region_id

    const providersResponse = await instance.get(`/store/payment-providers?region_id=${regionId}`, {
      headers,
    })
    const providers = providersResponse.data.payment_providers || []
    const workingProvider = providers.find((p: any) => p.is_enabled === true)

    if (!workingProvider) {
      throw new Error(`No enabled payment providers found`)
    }

    // Step 4: Create payment session
    await instance.post(
      `/store/payment-collections/${paymentCollection.data.payment_collection.id}/payment-sessions`,
      { provider_id: workingProvider.id },
      { headers },
    )

    // Step 5: Complete cart
    const { data } = await instance.post(
      ENDPOINTS.COMPLETE_CART(cartId),
      {
        email: checkoutData.email,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
      },
      { headers },
    )

    // Handle Medusa's response structure
    if (data.type === "cart" && data.cart) {
      // Cart completion failed
      throw new Error(data.error || "Cart completion failed")
    } else if (data.type === "order" && data.order) {
      // Cart completed successfully
      return data.order
    } else {
      // Unexpected response structure
      throw new Error("Unexpected response from cart completion")
    }
  } catch (error: any) {
    console.error("Checkout failed:", error.message)
    if (error.response?.data) {
      console.error("Error details:", error.response.data)
    }
    throw error
  }
}

export const fetchOrders = async (token: string): Promise<any[]> => {
  const instance = getAxiosInstance()
  const headers = {
    "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
    "Authorization": `Bearer ${token}`,
  }

  const { data } = await instance.get(ENDPOINTS.ORDERS, { headers })
  return data.orders || []
}

export const fetchOrder = async (id: string, token: string): Promise<any> => {
  const instance = getAxiosInstance()
  const headers = {
    "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
    "Authorization": `Bearer ${token}`,
  }

  const { data } = await instance.get(ENDPOINTS.ORDER(id), { headers })
  return data.order
}
