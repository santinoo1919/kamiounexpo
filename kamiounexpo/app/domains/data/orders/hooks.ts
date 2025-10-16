import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { OrderKeys } from "./keys"
import { CartKeys } from "../cart/keys"
import * as api from "./api"
import * as transformers from "./transformers"
import type { Order, OrderTracking } from "./types"

// React Query hooks for orders
export const useOrdersQuery = (token: string | null) => {
  return useQuery({
    queryKey: [OrderKeys.List, token],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token provided")
      const rawOrders = await api.fetchOrders(token)
      return rawOrders.map((o: any) => transformers.transformOrder(o))
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}

export const useOrderQuery = (id: string, token: string | null) => {
  return useQuery({
    queryKey: [OrderKeys.Detail, id, token],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token provided")
      const rawOrder = await api.fetchOrder(id, token)
      return transformers.transformOrder(rawOrder)
    },
    enabled: !!id && !!token,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
}

// Checkout mutation - Complete cart and create order
export const useCompleteCheckoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (checkoutData: {
      email: string
      cartId?: string
      authToken?: string
      shipping_address?: {
        first_name: string
        last_name: string
        address_1: string
        city: string
        country_code: string
        postal_code: string
        province?: string
        phone?: string
      }
    }) => api.completeCheckout(checkoutData),
    onSuccess: (data) => {
      // Clear cart from cache
      queryClient.invalidateQueries({ queryKey: [CartKeys.Cart] })
      queryClient.invalidateQueries({ queryKey: [CartKeys.Summary] })

      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: [OrderKeys.List] })
    },
  })
}
