import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { Product, Shop } from "@/domains/data/products/types"
import { MOCK_SHOPS } from "@/domains/data/mockData/products"
import { useCartQuery, useAddToCartMutation } from "@/domains/data/cart/hooks"
import { clearStoredCartId } from "@/domains/data/cart/api"

interface CartItem {
  productId: string
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Medusa cart data
  medusaCart?: any

  // Shop grouping and validation
  cartByShopWithDetails: {
    [shopId: string]: {
      items: CartItem[]
      shop: Shop
      subtotal: number
      minAmount: number
      canProceed: boolean
      remaining: number
    }
  }
  allShopsMeetMinimum: boolean

  // Delivery date management
  deliveryDates: { [shopId: string]: Date | null }
  allDeliveryDatesSelected: boolean
  selectDeliveryDate: (shopId: string, date: Date) => void
  clearDeliveryDate: (shopId: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Use Medusa cart as source of truth, but maintain local state for UI
  const { data: medusaCart, isLoading: isLoadingCart } = useCartQuery()
  const addToCartMutation = useAddToCartMutation()

  // Local cart state for UI (synced with Medusa cart)
  const [localItems, setLocalItems] = useState<CartItem[]>([])

  // Sync local state with Medusa cart when it changes
  React.useEffect(() => {
    if (medusaCart?.items) {
      console.log("=== CART SYNC DEBUG ===")
      console.log("Medusa cart items:", medusaCart.items)

      const syncedItems: CartItem[] = medusaCart.items.map((item) => {
        console.log("Processing item:", item)
        console.log("Price field:", item.price)
        console.log("Product ID field:", item.productId)
        console.log("Product name field:", item.productName)

        return {
          productId: item.productId || item.variant_id,
          product: {
            id: item.productId || item.variant_id,
            name: item.productName || item.product_title || item.title,
            price: item.price || 0, // Price is already in dollars, not cents
            shopId: (item.product?.metadata?.shop_id as string) || "medusa_shop",
            description: "",
            brand: "",
            supplier: "",
            image: item.productImage || item.thumbnail || "",
          },
          quantity: item.quantity,
        }
      })

      console.log("Synced items:", syncedItems)
      console.log("=====================")
      setLocalItems(syncedItems)
    } else {
      setLocalItems([])
    }
  }, [medusaCart])

  // Calculate totals from local state
  const totalItems = localItems.reduce((sum, item) => {
    const quantity = item.quantity || 0
    console.log(`Item quantity: ${quantity}`)
    return sum + quantity
  }, 0)

  const totalPrice = localItems.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0 // Access price from product object
    const quantity = Number(item.quantity) || 0
    const itemTotal = price * quantity

    console.log(
      `Item ${item.product?.name || "Unknown"}: price=${price}, quantity=${quantity}, total=${itemTotal}`,
    )

    if (isNaN(itemTotal)) {
      console.error(`NaN detected for item:`, item)
    }

    return sum + itemTotal
  }, 0)

  // Cart totals are working correctly now

  // SIMPLE: Shop grouping using local items
  const cartByShopWithDetails = (() => {
    const grouped: {
      [shopId: string]: {
        items: CartItem[]
        shop: Shop
        subtotal: number
        minAmount: number
        canProceed: boolean
        remaining: number
      }
    } = {}

    // Group local cart items by shop
    localItems.forEach((item) => {
      const shopId = item.product.shopId

      if (!grouped[shopId]) {
        const shop = MOCK_SHOPS.find((s) => s.id === shopId)

        // Skip if shop not found - this prevents crashes
        if (!shop) {
          return
        }

        grouped[shopId] = {
          items: [],
          shop: shop,
          subtotal: 0,
          minAmount: 0,
          canProceed: false,
          remaining: 0,
        }
      }

      grouped[shopId].items.push(item)
      const itemPrice = Number(item.product?.price) || 0
      const itemQuantity = Number(item.quantity) || 0
      const itemTotal = itemPrice * itemQuantity
      grouped[shopId].subtotal += itemTotal

      // Shop subtotal calculation working correctly
    })

    // Calculate shop details
    Object.entries(grouped).forEach(([shopId, shopData]) => {
      const shop = MOCK_SHOPS.find((s) => s.id === shopId)
      if (shop) {
        shopData.minAmount = shop.minCartAmount || 0
        shopData.canProceed = shopData.subtotal >= shopData.minAmount
        shopData.remaining = Math.max(0, shopData.minAmount - shopData.subtotal)
      }
    })

    return grouped
  })()

  // SIMPLE: Check if all shops meet minimum
  const allShopsMeetMinimum = (() => {
    return Object.values(cartByShopWithDetails).every((shop) => shop.canProceed)
  })()

  // SIMPLE: Delivery date state management
  const [deliveryDates, setDeliveryDates] = useState<{ [shopId: string]: Date | null }>({})

  // SIMPLE: Check if all delivery dates are selected
  const allDeliveryDatesSelected = (() => {
    const shopIds = Object.keys(cartByShopWithDetails)
    if (shopIds.length === 0) return true
    return shopIds.every(
      (shopId) => deliveryDates[shopId] !== null && deliveryDates[shopId] !== undefined,
    )
  })()

  // SIMPLE: Delivery date functions
  const selectDeliveryDate = (shopId: string, date: Date) => {
    setDeliveryDates((prev) => ({ ...prev, [shopId]: date }))
  }

  const clearDeliveryDate = (shopId: string) => {
    setDeliveryDates((prev) => ({ ...prev, [shopId]: null }))
  }

  const addToCart = (product: Product) => {
    console.log("=== ADD TO CART DEBUG ===")
    console.log("Product ID:", product.id)
    console.log("Product name:", product.name)
    console.log("Current Medusa cart ID:", medusaCart?.id)
    console.log("Current local items:", localItems.length)
    console.log("addToCartMutation:", addToCartMutation)
    console.log("Mutation pending:", addToCartMutation.isPending)
    console.log("=========================")

    // Add to Medusa cart - React Query will handle UI updates
    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    })
  }

  const removeFromCart = (productId: string) => {
    // Find the line item ID from Medusa cart
    const lineItem = medusaCart?.items?.find((item) => item.variant_id === productId)
    if (lineItem && medusaCart?.id) {
      // Use Medusa API to remove item
      // This would need to be implemented in the cart hooks
      console.log("Remove from cart:", productId, "Line item:", lineItem.id)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    // Find the line item ID from Medusa cart
    const lineItem = medusaCart?.items?.find((item) => item.variant_id === productId)
    if (lineItem && medusaCart?.id) {
      // Use Medusa API to update quantity
      // This would need to be implemented in the cart hooks
      console.log("Update quantity:", productId, "to", quantity, "Line item:", lineItem.id)
    }
  }

  const clearCart = () => {
    // Clear Medusa cart by removing all items
    medusaCart?.items?.forEach((item) => {
      removeFromCart(item.variant_id)
    })
    setDeliveryDates({})
  }

  const value: CartContextType = {
    items: localItems, // Use local items for UI
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Shop grouping and validation
    cartByShopWithDetails,

    // Medusa cart data
    medusaCart,
    allShopsMeetMinimum,

    // Delivery date management
    deliveryDates,
    allDeliveryDatesSelected,
    selectDeliveryDate,
    clearDeliveryDate,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
