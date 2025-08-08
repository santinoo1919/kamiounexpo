// Orders query keys for React Query
export const OrderKeys = {
  List: "orders-list",
  Detail: "order-detail",
  Tracking: "order-tracking",
  Addresses: "delivery-addresses",
  ShippingMethods: "shipping-methods",
} as const

export type OrderQueryKey = (typeof OrderKeys)[keyof typeof OrderKeys]
