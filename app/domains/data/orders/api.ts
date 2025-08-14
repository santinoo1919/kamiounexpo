import { getAxiosInstance } from "./http"
import type { Order, DeliveryAddress, ShippingMethod, OrderTracking } from "./types"

const ENDPOINTS = {
  ORDERS: "/sales/orders",
  ORDER: (id: string) => `/sales/orders/${id}`,
  TRACKING: (id: string) => `/sales/orders/${id}/tracking`,
  ADDRESSES: "/customer/addresses",
  SHIPPING_METHODS: "/shipping/methods",
}

export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.ORDERS)
  return data
}

export const fetchOrder = async (id: string): Promise<Order> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.ORDER(id))
  return data
}

export const fetchOrderTracking = async (id: string): Promise<OrderTracking> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.TRACKING(id))
  return data
}

export const fetchDeliveryAddresses = async (): Promise<DeliveryAddress[]> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.ADDRESSES)
  return data
}

export const fetchShippingMethods = async (): Promise<ShippingMethod[]> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.SHIPPING_METHODS)
  return data
}
