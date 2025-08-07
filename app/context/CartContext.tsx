import React, { createContext, useContext, useState, ReactNode } from "react"
import { Product } from "@/domains/data/products/types"

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
