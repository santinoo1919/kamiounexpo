// Orders service specific types
export interface DeliveryAddress {
  id: string
  userId: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  isAvailable: boolean
  isExpress: boolean
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  total: number
  supplier?: string
  deliveryStatus?: FulfillmentStatus
  estimatedDelivery?: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: FulfillmentStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  deliveryAddress: DeliveryAddress
  shippingMethod: ShippingMethod
  paymentMethod: string
  estimatedDelivery: string
  createdAt: string
  updatedAt: string
}

// Use Medusa's fulfillment statuses for COD business
export type FulfillmentStatus =
  | "not_fulfilled" // Order received, waiting for preparation
  | "fulfilled" // Order prepared, ready to ship
  | "shipped" // Order shipped/out for delivery
  | "delivered" // Order delivered and cash collected
  | "canceled" // Order canceled

// Keep OrderStatus as alias for backward compatibility
export type OrderStatus = FulfillmentStatus

export interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
  }>
  deliveryAddressId: string
  shippingMethodId: string
  paymentMethodId: string
}

export interface OrderHistory {
  orders: Order[]
  total: number
  hasMore: boolean
}

export interface OrderTracking {
  orderId: string
  status: FulfillmentStatus
  trackingNumber?: string
  estimatedDelivery: string
  events: TrackingEvent[]
}

export interface TrackingEvent {
  id: string
  status: string
  description: string
  location?: string
  timestamp: string
}

export interface DeliveryZone {
  id: string
  name: string
  isAvailable: boolean
  shippingMethods: ShippingMethod[]
}

// API Response types
export interface OrdersResponse {
  orders: Order[]
  total: number
  hasMore: boolean
}

export interface OrderResponse {
  order: Order
}

export interface OrderTrackingResponse {
  tracking: OrderTracking
}

export interface DeliveryAddressesResponse {
  addresses: DeliveryAddress[]
}

export interface ShippingMethodsResponse {
  methods: ShippingMethod[]
}

// Error types
export interface OrderError {
  message: string
  code: string
  field?: string
}
