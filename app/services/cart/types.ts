// Cart service specific types
export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  promoPrice?: number
  quantity: number
  maxQuantity?: number
  inStock: boolean
  addedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  updatedAt: string
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  itemId: string
  quantity: number
}

export interface RemoveFromCartRequest {
  itemId: string
}

export interface CartSummary {
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
}

export interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

// API Response types
export interface CartResponse {
  cart: Cart
}

export interface CartItemResponse {
  item: CartItem
}

export interface CartSummaryResponse {
  summary: CartSummary
}

// Error types
export interface CartError {
  message: string
  code: string
  field?: string
}
