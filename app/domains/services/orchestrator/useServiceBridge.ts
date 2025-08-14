import { useCallback } from "react"
import { useAuthService } from "@/domains/data/auth/hooks"
import { useCart } from "@/domains/data/cart/hooks"
import { useOrders } from "@/domains/data/orders/hooks"
import { useUserProfile } from "@/domains/data/membership/hooks"

export const useServiceBridge = () => {
  const { isAuthenticated, user } = useAuthService()
  const { cart, addToCart, clearCart } = useCart()
  const { createOrder } = useOrders()
  const { profile } = useUserProfile()

  // Bridge: Auth → Cart (when user logs in, sync cart)
  const syncCartOnLogin = useCallback(async () => {
    if (isAuthenticated && user) {
      console.log("🔄 Syncing cart for authenticated user...")
      // Mock: Sync user's saved cart from server
      // In real app: fetch user's cart from backend
      return true
    }
    return false
  }, [isAuthenticated, user])

  // Bridge: Cart → Orders (when placing order, clear cart)
  const placeOrderFromCart = useCallback(async () => {
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty")
    }

    if (!isAuthenticated) {
      throw new Error("User must be authenticated to place order")
    }

    try {
      console.log("🔄 Placing order from cart...")

      // Convert cart items to order request
      const orderRequest = {
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        deliveryAddressId: "default", // Mock: would come from user selection
        shippingMethodId: "standard", // Mock: would come from user selection
        paymentMethodId: "default", // Mock: would come from user selection
      }

      // Create order
      const order = await createOrder(orderRequest)

      if (order) {
        // Clear cart after successful order
        await clearCart()
        console.log("✅ Order placed successfully, cart cleared")
        return order
      }
    } catch (error) {
      console.error("❌ Error placing order:", error)
      throw error
    }
  }, [cart, isAuthenticated, createOrder, clearCart])

  // Bridge: Auth → Membership (when user logs in, fetch profile)
  const syncUserProfile = useCallback(async () => {
    if (isAuthenticated && user) {
      console.log("🔄 Syncing user profile...")
      // Mock: Profile is already fetched by useUserProfile hook
      // In real app: ensure profile is up to date
    }
  }, [isAuthenticated, user])

  // Bridge: Products → Cart (add product to cart)
  const addProductToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (!isAuthenticated) {
        console.log("⚠️ User not authenticated, adding to guest cart")
      }

      try {
        console.log(`🔄 Adding product ${productId} to cart...`)
        await addToCart({ productId, quantity })
        console.log("✅ Product added to cart successfully")
      } catch (error) {
        console.error("❌ Error adding product to cart:", error)
        throw error
      }
    },
    [isAuthenticated, addToCart],
  )

  // Bridge: Orders → Membership (update user stats after order)
  const updateUserStatsAfterOrder = useCallback(
    async (orderId: string) => {
      if (isAuthenticated && user) {
        console.log("🔄 Updating user stats after order...")
        // Mock: Stats would be updated by backend
        // In real app: trigger stats update
      }
    },
    [isAuthenticated, user],
  )

  return {
    // Cross-service operations
    syncCartOnLogin,
    placeOrderFromCart,
    syncUserProfile,
    addProductToCart,
    updateUserStatsAfterOrder,

    // Service state
    isAuthenticated,
    user,
    cart,
    profile,
  }
}
