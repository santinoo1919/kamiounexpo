import { getAxiosInstance } from "./http"
import type { Cart, CartSummary, AddToCartRequest } from "./types"
import Config from "@/config"
import { loadString, saveString } from "@/utils/storage"

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

// Get or create cart ID
async function getOrCreateCartId(): Promise<string> {
  const instance = getAxiosInstance()
  const headers = { "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY }

  // Check if we have a stored cart ID
  let cartId: string | undefined = loadString(CART_ID_STORAGE_KEY) || undefined

  if (cartId) {
    // Verify cart still exists
    try {
      await instance.get(ENDPOINTS.GET_CART(cartId), { headers })
      return cartId
    } catch (error) {
      // Cart doesn't exist anymore, create new one
      cartId = undefined
    }
  }

  // Create new cart
  const { data } = await instance.post(
    ENDPOINTS.CREATE_CART,
    {
      region_id: null, // Will use default region
    },
    { headers },
  )

  const newCartId = data.cart.id
  saveString(CART_ID_STORAGE_KEY, newCartId)

  return newCartId
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
