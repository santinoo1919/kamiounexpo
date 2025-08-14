import { getAxiosInstance } from "./http"
import type { Cart, CartSummary } from "./types"

const ENDPOINTS = {
  CART: "/cart",
  SUMMARY: "/cart/summary",
}

export const fetchCart = async (): Promise<Cart> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.CART)
  return data
}

export const fetchCartSummary = async (): Promise<CartSummary> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.SUMMARY)
  return data
}
