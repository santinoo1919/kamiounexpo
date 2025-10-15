import { create } from "zustand"
import { Product } from "@/domains/data/products/types"

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

// Simple hook that just exposes the store
export const useCart = () => {
  const items = useCartStore((state) => state.items)
  const totalItems = useCartStore((state) => state.totalItems)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: addItem,
    removeFromCart: removeItem,
    updateQuantity,
    clearCart,
  }
}
