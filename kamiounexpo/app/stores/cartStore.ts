import { create } from "zustand"
import { Product } from "@/domains/data/products/types"
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCartQuery,
} from "@/domains/data/cart/hooks"

interface CartItem {
  productId: string
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number

  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id)

      let newItems: CartItem[]
      if (existing) {
        // Increment quantity if item exists
        newItems = state.items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            productId: product.id,
            product: product,
            quantity: 1,
          },
        ]
      }

      // Calculate totals
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.productId !== productId)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      let newItems: CartItem[]

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        newItems = state.items.filter((item) => item.productId !== productId)
      } else {
        // Update quantity
        newItems = state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        )
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  },

  clearCart: () => {
    set({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })
  },
}))

// Enhanced hook that combines Zustand + Medusa sync
export const useCart = () => {
  // Zustand store state (fast, local)
  const items = useCartStore((state) => state.items)
  const totalItems = useCartStore((state) => state.totalItems)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)

  // Medusa hooks (server sync)
  const { data: medusaCart } = useCartQuery()
  const addToCartMutation = useAddToCartMutation()
  const updateCartItemMutation = useUpdateCartItemMutation()
  const removeFromCartMutation = useRemoveFromCartMutation()

  // Enhanced actions with Medusa sync
  const addToCart = (product: Product) => {
    // 1. Update Zustand immediately (instant UI)
    addItem(product)

    // 2. Sync to Medusa (background)
    addToCartMutation.mutate(
      {
        productId: product.id,
        quantity: 1,
      },
      {
        onError: (error) => {
          console.error("Failed to sync to Medusa:", error)
          // Note: UI already updated optimistically
          // Could show a toast notification here
        },
      },
    )
  }

  const removeFromCart = (productId: string) => {
    // 1. Update Zustand immediately
    removeItem(productId)

    // 2. Find line item and remove from Medusa
    const lineItem = medusaCart?.items?.find((item: any) => item.variant_id === productId)
    if (lineItem && medusaCart?.id) {
      removeFromCartMutation.mutate(
        {
          cartId: medusaCart.id,
          lineItemId: lineItem.id,
        },
        {
          onError: (error) => {
            console.error("Failed to remove from Medusa:", error)
            // Note: UI already updated optimistically
          },
        },
      )
    }
  }

  const updateQuantityAction = (productId: string, quantity: number) => {
    // 1. Update Zustand immediately
    updateQuantity(productId, quantity)

    // 2. Find line item and update in Medusa
    const lineItem = medusaCart?.items?.find((item: any) => item.variant_id === productId)
    if (lineItem && medusaCart?.id) {
      updateCartItemMutation.mutate(
        {
          cartId: medusaCart.id,
          lineItemId: lineItem.id,
          quantity: quantity,
        },
        {
          onError: (error) => {
            console.error("Failed to update quantity in Medusa:", error)
            // Note: UI already updated optimistically
          },
        },
      )
    }
  }

  const clearCartAction = () => {
    // 1. Update Zustand immediately
    clearCart()

    // 2. Clear Medusa cart by removing all items
    if (medusaCart?.id) {
      medusaCart.items?.forEach((item: any) => {
        removeFromCartMutation.mutate({
          cartId: medusaCart.id,
          lineItemId: item.id,
        })
      })
    }
  }

  // Function to create a fresh Medusa cart with exact Zustand data for checkout
  const createCheckoutCart = async () => {
    console.log("=== CREATING FRESH CART FOR CHECKOUT ===")
    console.log("Zustand items:", items)

    try {
      // Clear any existing cart ID so a fresh one gets created
      const { clearStoredCartId } = await import("@/domains/data/cart/api")
      clearStoredCartId()

      // Create fresh Medusa cart with exact Zustand items
      for (const item of items) {
        console.log(`Adding to Medusa: ${item.productId} x${item.quantity}`)
        await addToCartMutation.mutateAsync({
          productId: item.productId,
          quantity: item.quantity,
        })
      }

      console.log("Fresh Medusa cart created with Zustand data")
      console.log("===========================================")
      return true
    } catch (error) {
      console.error("Failed to create checkout cart:", error)
      throw error
    }
  }

  return {
    // Zustand state (fast, local)
    items,
    totalItems,
    totalPrice,

    // Enhanced actions with Medusa sync
    addToCart,
    removeFromCart,
    updateQuantity: updateQuantityAction,
    clearCart: clearCartAction,

    // Medusa data for checkout
    medusaCart,
    createCheckoutCart, // New function for checkout

    // Loading and error states
    isLoading:
      addToCartMutation.isPending ||
      updateCartItemMutation.isPending ||
      removeFromCartMutation.isPending,
    error: addToCartMutation.error || updateCartItemMutation.error || removeFromCartMutation.error,

    // Individual mutation states for granular control
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingQuantity: updateCartItemMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  }
}
