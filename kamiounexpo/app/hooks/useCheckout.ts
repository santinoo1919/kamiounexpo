import { useState, useCallback } from "react"
import { Alert } from "react-native"
import { useCart } from "@/stores/cartStore"
import { useCompleteCheckoutMutation } from "@/domains/data/orders/hooks"
import { useAddToCartMutation } from "@/domains/data/cart/hooks"
import { clearStoredCartId, associateCartWithCustomer } from "@/domains/data/cart/api"
import { useAuth } from "@/stores/authStore"
import axios from "axios"
import Config from "@/config"
import { loadString } from "@/utils/storage"

export const useCheckout = () => {
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | null>(null)
  const [deliveryComment, setDeliveryComment] = useState("")

  const { items, totalPrice, totalItems, clearCart, createCheckoutCart } = useCart()
  const { customer, isAuthenticated, token } = useAuth()
  const completeCheckoutMutation = useCompleteCheckoutMutation()
  const addToCartMutation = useAddToCartMutation()

  // Validation
  const hasCartItems = totalItems > 0
  const isShippingSelected = selectedShippingOption !== null
  const canProceed = hasCartItems && isShippingSelected

  // Handle shipping option selection
  const handleShippingOptionSelect = useCallback((optionId: string) => {
    setSelectedShippingOption(optionId)
  }, [])

  // Handle delivery comment change
  const handleDeliveryCommentChange = useCallback((comment: string) => {
    setDeliveryComment(comment)
  }, [])

  // Main checkout handler
  const handlePlaceOrder = useCallback(async () => {
    if (completeCheckoutMutation.isPending || !canProceed) return

    try {
      // Apply shipping method to current cart
      if (selectedShippingOption) {
        console.log("Applying shipping method to current cart...")
        const { loadString } = await import("@/utils/storage")
        const cartId = await loadString("medusa_cart_id")

        if (cartId) {
          const axios = (await import("axios")).default
          const Config = (await import("@/config")).default

          const instance = axios.create({
            baseURL: (Config as any).MEDUSA_BACKEND_URL,
            timeout: 30000,
          })

          const headers = {
            "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
          }

          await instance.post(
            `/store/carts/${cartId}/shipping-methods`,
            { option_id: selectedShippingOption },
            { headers },
          )

          console.log("Shipping method applied to current cart successfully")
        }
      }

      // Sync Zustand items to current cart instead of creating fresh cart
      console.log("Syncing Zustand items to current cart...")
      for (const item of items) {
        console.log(`Syncing item: ${item.productId} x${item.quantity}`)
        await addToCartMutation.mutateAsync({
          productId: item.productId,
          quantity: item.quantity,
        })
      }

      // Associate cart with customer if authenticated
      if (isAuthenticated && token) {
        const { loadString } = await import("@/utils/storage")
        const cartId = await loadString("medusa_cart_id")

        if (cartId) {
          await associateCartWithCustomer(cartId, token)
        }
      }

      // Complete checkout
      const userEmail = isAuthenticated && customer?.email ? customer.email : "guest@customer.com"

      const result = await completeCheckoutMutation.mutateAsync({
        email: userEmail,
        authToken: token || undefined,
      })

      // Success - Clear cart and return order ID
      clearCart()
      clearStoredCartId()
      const orderId = result.id || `ORD-${Date.now().toString().slice(-6)}`

      return orderId
    } catch (error) {
      console.error("Checkout failed:", error)
      Alert.alert("Checkout Failed", "Unable to complete your order. Please try again.", [
        { text: "OK" },
      ])
      throw error
    }
  }, [
    completeCheckoutMutation,
    canProceed,
    selectedShippingOption,
    isAuthenticated,
    customer,
    token,
    items,
    addToCartMutation,
    clearCart,
  ])

  return {
    // State
    selectedShippingOption,
    deliveryComment,
    hasCartItems,
    isShippingSelected,
    canProceed,
    isProcessing: completeCheckoutMutation.isPending,

    // Actions
    handleShippingOptionSelect,
    handleDeliveryCommentChange,
    handlePlaceOrder,
  }
}
