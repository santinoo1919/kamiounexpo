import type { Cart, CartItem, CartSummary } from "./types"

interface MagentoCartItem {
  item_id: number
  product_id: number
  name: string
  image_url: string
  price: number
  special_price?: number
  qty: number
  max_qty?: number
  in_stock: boolean
  added_at: string
}

interface MagentoCart {
  id: number
  customer_id: number
  items: MagentoCartItem[]
  items_count: number
  subtotal: number
  tax_amount: number
  shipping_amount: number
  grand_total: number
  currency_code: string
  updated_at: string
}

export const transformCartItem = (i: MagentoCartItem): CartItem => ({
  id: i.item_id.toString(),
  productId: i.product_id.toString(),
  productName: i.name,
  productImage: i.image_url,
  price: i.price,
  promoPrice: i.special_price,
  quantity: i.qty,
  maxQuantity: i.max_qty,
  inStock: i.in_stock,
  addedAt: i.added_at,
})

export const transformCart = (c: MagentoCart): Cart => ({
  id: c.id.toString(),
  userId: c.customer_id.toString(),
  items: c.items.map(transformCartItem),
  itemCount: c.items_count,
  subtotal: c.subtotal,
  tax: c.tax_amount,
  shipping: c.shipping_amount,
  total: c.grand_total,
  currency: c.currency_code,
  updatedAt: c.updated_at,
})

export const transformCartSummary = (c: MagentoCart): CartSummary => ({
  itemCount: c.items_count,
  subtotal: c.subtotal,
  tax: c.tax_amount,
  shipping: c.shipping_amount,
  total: c.grand_total,
  currency: c.currency_code,
})
