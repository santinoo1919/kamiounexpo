import axios from "axios"
import type { Cart, CartSummary, AddToCartRequest } from "./types"
import Config from "@/config"
import { loadString, saveString } from "@/utils/storage"

// Create axios instance for cart
const getAxiosInstance = () => {
  return axios.create({
    baseURL: (Config as any).CART_API_URL || (Config as any).MEDUSA_BACKEND_URL,
    timeout: 30000,
  })
}

// Medusa Store Cart API endpoints
const ENDPOINTS = {
  CREATE_CART: "/store/carts",
  GET_CART: (cartId: string) => `/store/carts/${cartId}`,
  ADD_LINE_ITEM: (cartId: string) => `/store/carts/${cartId}/line-items`,
  UPDATE_LINE_ITEM: (cartId: string, lineItemId: string) =>
    `/store/carts/${cartId}/line-items/${lineItemId}`,
  REMOVE_LINE_ITEM: (cartId: string, lineItemId: string) =>
    `/store/carts/${cartId}/line-items/${lineItemId}`,
}

const CART_ID_STORAGE_KEY = "medusa_cart_id"

// Singleton pattern to prevent multiple cart creation
let cartCreationPromise: Promise<string> | null = null

// Clear stored cart ID (useful for debugging)
export const clearStoredCartId = () => {
  saveString(CART_ID_STORAGE_KEY, "")
  cartCreationPromise = null // Reset singleton
}

// Get or create cart ID with singleton pattern
async function getOrCreateCartId(): Promise<string> {
  // If cart creation is already in progress, wait for it
  if (cartCreationPromise) {
    console.log("Cart creation already in progress, waiting...")
    return await cartCreationPromise
  }

  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }

  // Check if we have a stored cart ID
  let cartId: string | undefined = loadString(CART_ID_STORAGE_KEY) || undefined
  console.log("=== CART ID DEBUG ===")
  console.log("Stored cart ID:", cartId)
  console.log("Storage key:", CART_ID_STORAGE_KEY)
  console.log("Raw storage value:", loadString(CART_ID_STORAGE_KEY))

  if (cartId) {
    // Verify cart still exists
    try {
      await instance.get(ENDPOINTS.GET_CART(cartId), { headers })
      console.log("Using existing cart:", cartId)
      return cartId
    } catch (error) {
      console.log("Cart doesn't exist, creating new one")
      // Cart doesn't exist anymore, create new one
      cartId = undefined
    }
  }

  // Create new cart with singleton pattern
  console.log("Creating new cart...")
  cartCreationPromise = (async () => {
    const { data } = await instance.post(
      ENDPOINTS.CREATE_CART,
      {
        region_id: "reg_01K7KC4V4R0QGP4WMXXQR0BGJJ", // Europe region for pricing
      },
      { headers },
    )

    const newCartId = data.cart.id
    console.log("Saving cart ID to storage:", newCartId)
    saveString(CART_ID_STORAGE_KEY, newCartId)
    console.log("Verifying save - stored value:", loadString(CART_ID_STORAGE_KEY))
    console.log("Created new cart:", newCartId)
    console.log("===================")

    // Clear the promise after completion
    cartCreationPromise = null
    return newCartId
  })()

  return await cartCreationPromise
}

export const fetchCart = async (): Promise<any> => {
  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }
  const cartId = await getOrCreateCartId()

  const { data } = await instance.get(ENDPOINTS.GET_CART(cartId), { headers })
  return data.cart
}

export const addToCart = async (request: AddToCartRequest): Promise<any> => {
  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }
  const cartId = await getOrCreateCartId()

  const { data } = await instance.post(
    ENDPOINTS.ADD_LINE_ITEM(cartId),
    {
      variant_id: request.productId, // Using productId as variant_id
      quantity: request.quantity,
    },
    { headers },
  )

  return data.cart
}

export const updateCartItem = async (
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<any> => {
  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }

  const { data } = await instance.post(
    ENDPOINTS.UPDATE_LINE_ITEM(cartId, lineItemId),
    { quantity },
    { headers },
  )

  return data.cart
}

export const removeFromCart = async (cartId: string, lineItemId: string): Promise<any> => {
  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }

  const { data } = await instance.delete(ENDPOINTS.REMOVE_LINE_ITEM(cartId, lineItemId), {
    headers,
  })

  return data.cart
}

export const fetchCartSummary = async (): Promise<CartSummary> => {
  const cart = await fetchCart()

  // Transform Medusa cart to your CartSummary format
  return {
    itemCount: cart.items?.length || 0,
    subtotal: cart.subtotal || 0,
    tax: cart.tax_total || 0,
    shipping: cart.shipping_total || 0,
    total: cart.total || 0,
    currency: cart.currency_code || "usd",
  }
}
