import type { Cart, CartItem, CartSummary } from "./types"

// Medusa cart types
interface MedusaLineItem {
  id: string
  title: string
  variant_id: string
  quantity: number
  unit_price: number
  subtotal: number
  thumbnail?: string | null
  variant?: {
    id: string
    title: string
    product?: {
      id: string
      title: string
      thumbnail?: string | null
    }
  }
  created_at: string
}

interface MedusaCart {
  id: string
  customer_id?: string | null
  items: MedusaLineItem[]
  subtotal?: number
  tax_total?: number
  shipping_total?: number
  total?: number
  currency_code: string
  created_at: string
  updated_at: string
}

export const transformCartItem = (item: MedusaLineItem): CartItem => {
  // Get product details from variant or line item
  const productName = item.variant?.product?.title || item.title
  const productImage = item.variant?.product?.thumbnail || item.thumbnail || ""

  return {
    id: item.id,
    productId: item.variant_id,
    productName,
    productImage,
    price: item.unit_price / 100, // Convert from cents to dollars
    promoPrice: undefined,
    quantity: item.quantity,
    maxQuantity: 999, // Medusa doesn't return max quantity
    inStock: true, // If in cart, assume in stock
    addedAt: item.created_at,
  }
}

export const transformCart = (cart: MedusaCart): Cart => ({
  id: cart.id,
  userId: cart.customer_id || "guest",
  items: cart.items?.map(transformCartItem) || [],
  itemCount: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
  subtotal: (cart.subtotal || 0) / 100, // Convert from cents
  tax: (cart.tax_total || 0) / 100,
  shipping: (cart.shipping_total || 0) / 100,
  total: (cart.total || 0) / 100,
  currency: cart.currency_code || "usd",
  updatedAt: cart.updated_at,
})

export const transformCartSummary = (cart: MedusaCart): CartSummary => ({
  itemCount: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
  subtotal: (cart.subtotal || 0) / 100,
  tax: (cart.tax_total || 0) / 100,
  shipping: (cart.shipping_total || 0) / 100,
  total: (cart.total || 0) / 100,
  currency: cart.currency_code || "usd",
})
