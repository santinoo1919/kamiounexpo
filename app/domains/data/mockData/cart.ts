import type { Cart, CartItem } from "@/domains/data/cart/types"

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    productId: "1",
    productName: "Coca-Cola Classic",
    productImage:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    price: 1.99,
    promoPrice: 1.49,
    quantity: 2,
    maxQuantity: 10,
    inStock: true,
    addedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    productId: "3",
    productName: "Lay's Classic Chips",
    productImage:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop",
    price: 2.49,
    promoPrice: 1.99,
    quantity: 1,
    maxQuantity: 5,
    inStock: true,
    addedAt: "2024-01-15T10:30:00Z",
  },
]

export const MOCK_CART: Cart = {
  id: "cart-1",
  userId: "user-1",
  items: MOCK_CART_ITEMS,
  itemCount: 3,
  subtotal: 4.97,
  tax: 0.5,
  shipping: 2.99,
  total: 8.46,
  currency: "USD",
  updatedAt: "2024-01-15T10:30:00Z",
}
