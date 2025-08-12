import React, { createContext, useContext, useState, ReactNode, useMemo } from "react"
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

  // ENHANCED: Shop grouping with full details
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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Mock data for testing - will be replaced with actual products
  const [items, setItems] = useState<CartItem[]>([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // ENHANCED: Shop grouping with full details
  const cartByShopWithDetails = useMemo(() => {
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
    const cartByShop: { [shopId: string]: CartItem[] } = {}
    items.forEach((item) => {
      const shopId = item.product.shopId
      if (!cartByShop[shopId]) cartByShop[shopId] = []
      cartByShop[shopId].push(item)
    })

    // Calculate details for each shop
    Object.entries(cartByShop).forEach(([shopId, shopItems]) => {
      const shop = MOCK_SHOPS.find((s) => s.id === shopId)
      if (!shop) return

      const subtotal = shopItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const minAmount = shop.minCartAmount || 0
      const canProceed = subtotal >= minAmount
      const remaining = Math.max(0, minAmount - subtotal)

      grouped[shopId] = {
        items: shopItems,
        shop,
        subtotal,
        minAmount,
        canProceed,
        remaining,
      }
    })

    return grouped
  }, [items])

  // ENHANCED: Check if all shops meet minimum
  const allShopsMeetMinimum = useMemo(() => {
    return Object.values(cartByShopWithDetails).every((shopData) => shopData.canProceed)
  }, [cartByShopWithDetails])

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
  }

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // ENHANCED: Shop grouping with full details
    cartByShopWithDetails,
    allShopsMeetMinimum,
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
