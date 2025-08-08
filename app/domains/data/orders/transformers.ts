import type {
  Order,
  DeliveryAddress,
  ShippingMethod,
  OrderItem,
  OrderTracking,
  TrackingEvent,
} from "./types"

interface MagentoOrderItem {
  item_id: number
  product_id: number
  name: string
  image_url: string
  price: number
  qty_ordered: number
  row_total: number
}

interface MagentoOrder {
  entity_id: number
  customer_id: number
  increment_id: string
  status: string
  items: MagentoOrderItem[]
  subtotal: number
  tax_amount: number
  shipping_amount: number
  grand_total: number
  currency_code: string
  shipping_address: MagentoDeliveryAddress
  shipping_method: MagentoShippingMethod
  payment: { method: string }
  created_at: string
  updated_at: string
  delivery_eta?: string
}

interface MagentoDeliveryAddress {
  entity_id: number
  customer_id: number
  firstname: string
  lastname: string
  street: string[]
  city: string
  region: string
  postcode: string
  country_id: string
  telephone?: string
  default_shipping?: boolean
  created_at: string
  updated_at: string
}

interface MagentoShippingMethod {
  method_id: string
  method_title: string
  price_incl_tax: number
  estimated_days?: number
  is_express?: boolean
  available?: boolean
}

interface MagentoTrackingEvent {
  id: number
  status: string
  description: string
  location?: string
  timestamp: string
}

interface MagentoOrderTracking {
  order_id: number
  status: string
  tracking_number?: string
  estimated_delivery: string
  events: MagentoTrackingEvent[]
}

export const transformOrderItem = (i: MagentoOrderItem): OrderItem => ({
  id: i.item_id.toString(),
  productId: i.product_id.toString(),
  productName: i.name,
  productImage: i.image_url,
  price: i.price,
  quantity: i.qty_ordered,
  total: i.row_total,
})

export const transformDeliveryAddress = (a: MagentoDeliveryAddress): DeliveryAddress => ({
  id: a.entity_id.toString(),
  userId: a.customer_id.toString(),
  name: `${a.firstname} ${a.lastname}`.trim(),
  street: a.street.join(", "),
  city: a.city,
  state: a.region,
  zipCode: a.postcode,
  country: a.country_id,
  phone: a.telephone,
  isDefault: !!a.default_shipping,
  createdAt: a.created_at,
  updatedAt: a.updated_at,
})

export const transformShippingMethod = (m: MagentoShippingMethod): ShippingMethod => ({
  id: m.method_id,
  name: m.method_title,
  description: m.method_title,
  price: m.price_incl_tax,
  estimatedDays: m.estimated_days ?? 0,
  isAvailable: m.available ?? true,
  isExpress: m.is_express ?? false,
})

export const transformOrder = (o: MagentoOrder): Order => ({
  id: o.entity_id.toString(),
  userId: o.customer_id.toString(),
  orderNumber: o.increment_id,
  status: (o.status as any) ?? "pending",
  items: o.items.map(transformOrderItem),
  subtotal: o.subtotal,
  tax: o.tax_amount,
  shipping: o.shipping_amount,
  total: o.grand_total,
  currency: o.currency_code,
  deliveryAddress: transformDeliveryAddress(o.shipping_address),
  shippingMethod: transformShippingMethod(o.shipping_method),
  paymentMethod: o.payment.method,
  estimatedDelivery: o.delivery_eta ?? "",
  createdAt: o.created_at,
  updatedAt: o.updated_at,
})

export const transformTrackingEvent = (e: MagentoTrackingEvent): TrackingEvent => ({
  id: e.id.toString(),
  status: e.status,
  description: e.description,
  location: e.location,
  timestamp: e.timestamp,
})

export const transformOrderTracking = (t: MagentoOrderTracking): OrderTracking => ({
  orderId: t.order_id.toString(),
  status: t.status as any,
  trackingNumber: t.tracking_number,
  estimatedDelivery: t.estimated_delivery,
  events: t.events.map(transformTrackingEvent),
})
