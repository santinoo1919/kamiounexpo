import type {
  Order,
  ShippingMethod,
  OrderItem,
  OrderTracking,
  TrackingEvent,
  OrderStatus,
  FulfillmentStatus,
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

export const transformShippingMethod = (method: any): ShippingMethod => ({
  id: method?.id || "default",
  name: method?.name || "Standard Shipping",
  description: method?.description || "",
  price: method?.amount ? method.amount / 100 : 0,
  estimatedDays: 3,
  isAvailable: true,
  isExpress: false,
})

// Map Medusa fulfillment status to our FulfillmentStatus
const mapMedusaFulfillmentStatus = (fulfillmentStatus: string): FulfillmentStatus => {
  switch (fulfillmentStatus) {
    case "not_fulfilled":
      return "not_fulfilled"
    case "fulfilled":
      return "fulfilled"
    case "shipped":
    case "partially_shipped":
      return "shipped"
    case "delivered":
    case "partially_delivered":
      return "delivered"
    case "canceled":
      return "canceled"
    default:
      return "not_fulfilled"
  }
}

export const transformOrder = (order: MedusaOrder): Order => {
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
    status: mapMedusaFulfillmentStatus(order.fulfillment_status),
    items: order.items.map(transformOrderItem),
    subtotal,
    tax,
    shipping,
    total,
    currency: order.currency_code,
    shippingMethod: transformShippingMethod(shippingMethod),
    paymentMethod: order.payment_status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }
}

export const transformOrderTracking = (order: MedusaOrder): OrderTracking => ({
  orderId: order.id,
  status: mapMedusaFulfillmentStatus(order.fulfillment_status),
  trackingNumber: undefined,
  estimatedDelivery: "",
  events: [],
})
