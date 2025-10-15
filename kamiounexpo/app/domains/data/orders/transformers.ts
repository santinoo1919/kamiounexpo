import type {
  Order,
  DeliveryAddress,
  ShippingMethod,
  OrderItem,
  OrderTracking,
  TrackingEvent,
  OrderStatus,
} from "./types"

// Medusa order types
interface MedusaLineItem {
  id: string
  title: string
  variant_id: string
  variant_sku?: string
  quantity: number
  unit_price: number
  subtotal: number
  total: number
  tax_total?: number
  thumbnail?: string
  product_id?: string
  product_title?: string
}

interface MedusaAddress {
  id?: string
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  country_code: string
  province?: string
  postal_code: string
  phone?: string
  created_at?: string
  updated_at?: string
}

interface MedusaOrder {
  id: string
  display_id: number
  customer_id?: string | null
  email?: string
  status: string
  fulfillment_status: string
  payment_status: string
  items: MedusaLineItem[]
  subtotal?: number
  tax_total?: number
  shipping_total?: number
  total: number
  currency_code: string
  shipping_address?: MedusaAddress
  billing_address?: MedusaAddress
  shipping_methods?: any[]
  payments?: any[]
  metadata?: any
  created_at: string
  updated_at: string
  summary?: {
    accounting_total?: number
    current_order_total?: number
  }
}

export const transformOrderItem = (item: MedusaLineItem): OrderItem => {
  const price = Number(item.unit_price) / 100
  const total = Number(item.subtotal) / 100
  const quantity = Number(item.quantity)

  return {
    id: item.id,
    productId: item.variant_id,
    productName: item.product_title || item.title,
    productImage: item.thumbnail || "",
    price,
    quantity,
    total,
    supplier: undefined,
  }
}

export const transformDeliveryAddress = (address: MedusaAddress): DeliveryAddress => ({
  id: address.id || "guest",
  userId: "guest",
  name: `${address.first_name} ${address.last_name}`.trim(),
  street: [address.address_1, address.address_2].filter(Boolean).join(", "),
  city: address.city,
  state: address.province || "",
  zipCode: address.postal_code,
  country: address.country_code,
  phone: address.phone,
  isDefault: false,
  createdAt: address.created_at || new Date().toISOString(),
  updatedAt: address.updated_at || new Date().toISOString(),
})

export const transformShippingMethod = (method: any): ShippingMethod => ({
  id: method?.id || "default",
  name: method?.name || "Standard Shipping",
  description: method?.description || "",
  price: method?.amount ? method.amount / 100 : 0,
  estimatedDays: 3,
  isAvailable: true,
  isExpress: false,
})

const mapMedusaStatusToOrderStatus = (status: string, fulfillmentStatus: string): OrderStatus => {
  if (status === "completed") return "delivered"
  if (status === "canceled") return "cancelled"
  if (fulfillmentStatus === "shipped") return "shipped"
  if (fulfillmentStatus === "partially_shipped") return "shipped"
  if (fulfillmentStatus === "fulfilled") return "delivered"
  if (status === "pending") return "confirmed"
  return "pending"
}

export const transformOrder = (order: MedusaOrder): Order => {
  const shippingAddress = order.shipping_address || {
    first_name: "Guest",
    last_name: "Customer",
    address_1: "N/A",
    city: "N/A",
    country_code: "us",
    postal_code: "00000",
  }

  const shippingMethod = order.shipping_methods?.[0]

  // Calculate subtotal and tax from items since they're missing at order level
  const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  const itemsTaxTotal = order.items.reduce((sum, item) => sum + (item.tax_total || 0), 0)

  // Use calculated values from items or summary fields
  const subtotal =
    Number(order.subtotal || order.summary?.accounting_total || itemsSubtotal || 0) / 100
  const tax = Number(order.tax_total || itemsTaxTotal || 0) / 100
  const shipping = Number(order.shipping_total || 0) / 100
  const total = Number(order.total || order.summary?.current_order_total || 0) / 100

  return {
    id: order.id,
    userId: order.customer_id || "guest",
    orderNumber: `#${order.display_id}`,
    status: mapMedusaStatusToOrderStatus(order.status, order.fulfillment_status),
    items: order.items.map(transformOrderItem),
    subtotal,
    tax,
    shipping,
    total,
    currency: order.currency_code,
    deliveryAddress: transformDeliveryAddress(shippingAddress),
    shippingMethod: transformShippingMethod(shippingMethod),
    paymentMethod: order.payment_status,
    estimatedDelivery: "", // Medusa doesn't provide this by default
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }
}

export const transformOrderTracking = (order: MedusaOrder): OrderTracking => ({
  orderId: order.id,
  status: mapMedusaStatusToOrderStatus(order.status, order.fulfillment_status),
  trackingNumber: undefined,
  estimatedDelivery: "",
  events: [],
})
