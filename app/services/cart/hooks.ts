import { useState, useEffect, useCallback } from "react"
import type {
  Cart,
  CartItem,
  CartState,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  CartSummary,
} from "./types"
import { MOCK_CART, MOCK_CART_ITEMS } from "@/services/data/mockData/cart"

// Cart service hook
export const useCart = () => {
  const [cartState, setCartState] = useState<CartState>({
    cart: null,
    isLoading: false,
    error: null,
  })

  const fetchCart = useCallback(async (): Promise<void> => {
    try {
      setCartState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCartState({
        cart: MOCK_CART,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to fetch cart",
      }))
    }
  }, [])

  const addToCart = useCallback(async (request: AddToCartRequest): Promise<boolean> => {
    try {
      setCartState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Mock add to cart - always succeeds
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: request.productId,
        productName: "Mock Product",
        productImage:
          "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
        price: 9.99,
        quantity: request.quantity,
        maxQuantity: 10,
        inStock: true,
        addedAt: new Date().toISOString(),
      }

      setCartState((prev) => ({
        ...prev,
        cart: prev.cart
          ? {
              ...prev.cart,
              items: [...prev.cart.items, newItem],
              itemCount: prev.cart.itemCount + request.quantity,
              updatedAt: new Date().toISOString(),
            }
          : null,
        isLoading: false,
      }))

      return true
    } catch (err) {
      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to add item to cart",
      }))
      return false
    }
  }, [])

  const updateCartItem = useCallback(async (request: UpdateCartItemRequest): Promise<boolean> => {
    try {
      setCartState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Mock update cart item - always succeeds
      setCartState((prev) => ({
        ...prev,
        cart: prev.cart
          ? {
              ...prev.cart,
              items: prev.cart.items.map((item) =>
                item.id === request.itemId ? { ...item, quantity: request.quantity } : item,
              ),
              updatedAt: new Date().toISOString(),
            }
          : null,
        isLoading: false,
      }))

      return true
    } catch (err) {
      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to update cart item",
      }))
      return false
    }
  }, [])

  const removeFromCart = useCallback(async (request: RemoveFromCartRequest): Promise<boolean> => {
    try {
      setCartState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Mock remove from cart - always succeeds
      setCartState((prev) => ({
        ...prev,
        cart: prev.cart
          ? {
              ...prev.cart,
              items: prev.cart.items.filter((item) => item.id !== request.itemId),
              updatedAt: new Date().toISOString(),
            }
          : null,
        isLoading: false,
      }))

      return true
    } catch (err) {
      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to remove item from cart",
      }))
      return false
    }
  }, [])

  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      setCartState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Mock clear cart - always succeeds
      setCartState((prev) => ({
        ...prev,
        cart: prev.cart
          ? {
              ...prev.cart,
              items: [],
              itemCount: 0,
              subtotal: 0,
              tax: 0,
              shipping: 0,
              total: 0,
              updatedAt: new Date().toISOString(),
            }
          : null,
        isLoading: false,
      }))

      return true
    } catch (err) {
      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to clear cart",
      }))
      return false
    }
  }, [])

  const getCartSummary = useCallback((): CartSummary | null => {
    if (!cartState.cart) return null

    return {
      itemCount: cartState.cart.itemCount,
      subtotal: cartState.cart.subtotal,
      tax: cartState.cart.tax,
      shipping: cartState.cart.shipping,
      total: cartState.cart.total,
      currency: cartState.cart.currency,
    }
  }, [cartState.cart])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return {
    ...cartState,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    refetch: fetchCart,
  }
}
