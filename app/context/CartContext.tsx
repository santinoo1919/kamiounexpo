import React, { createContext, useContext, useState, ReactNode } from "react"
import { Product, Shop } from "@/domains/data/products/types"
import { MOCK_SHOPS } from "@/domains/data/mockData/products"

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
  // Basic cart state only
  const [items, setItems] = useState<CartItem[]>([])

  // Simple calculations - no complex logic
  const totalItems = items.length > 0 ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
  const totalPrice =
    items.length > 0 ? items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) : 0

  // SIMPLE: Shop grouping using IIFE (no useMemo)
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

    // Group items by shop
    items.forEach((item) => {
      const shopId = item.product.shopId
      if (!grouped[shopId]) {
        const shop = MOCK_SHOPS.find((s) => s.id === shopId)
        grouped[shopId] = {
          items: [],
          shop: shop!,
          subtotal: 0,
          minAmount: 0,
          canProceed: false,
          remaining: 0,
        }
      }
      grouped[shopId].items.push(item)
      grouped[shopId].subtotal += item.product.price * item.quantity
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
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevItems, { productId: product.id, product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
    setDeliveryDates({})
  }

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Shop grouping and validation
    cartByShopWithDetails,
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
