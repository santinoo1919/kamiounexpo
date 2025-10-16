import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CartKeys } from "./keys"
import * as api from "./api"
import * as validators from "./validators"
import * as transformers from "./transformers"
import { useAuth } from "@/stores/authStore"
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  CartSummary,
} from "./types"

// Shipping options hook
export const useShippingOptionsQuery = () => {
  const { data: cart } = useCartQuery()

  return useQuery({
    queryKey: [CartKeys.ShippingOptions, cart?.id],
    queryFn: async () => {
      if (!cart?.id) {
        throw new Error("No cart ID available")
      }
      return api.getShippingOptions(cart.id)
    },
    enabled: !!cart?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// React Query hooks for cart operations
export const useCartQuery = () => {
  const { token } = useAuth()

  return useQuery({
    queryKey: [CartKeys.Cart, token],
    queryFn: async () => {
      const raw = await api.fetchCart(token)
      return transformers.transformCart(validators.validateMedusaCart(raw))
    },
    staleTime: 60 * 1000,
    retry: 3,
  })
}

export const useCartSummaryQuery = () => {
  const { token } = useAuth()

  return useQuery({
    queryKey: [CartKeys.Summary, token],
    queryFn: async () => {
      const raw = await api.fetchCart(token)
      return transformers.transformCartSummary(validators.validateMedusaCart(raw))
    },
    staleTime: 60 * 1000,
    retry: 3,
  })
}

// Mutation hooks for cart operations
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  return useMutation({
    mutationFn: (request: AddToCartRequest) => api.addToCart(request, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CartKeys.Cart] })
      queryClient.invalidateQueries({ queryKey: [CartKeys.Summary] })
    },
  })
}

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      cartId,
      lineItemId,
      quantity,
    }: {
      cartId: string
      lineItemId: string
      quantity: number
    }) => api.updateCartItem(cartId, lineItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CartKeys.Cart] })
      queryClient.invalidateQueries({ queryKey: [CartKeys.Summary] })
    },
  })
}

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartId, lineItemId }: { cartId: string; lineItemId: string }) =>
      api.removeFromCart(cartId, lineItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CartKeys.Cart] })
      queryClient.invalidateQueries({ queryKey: [CartKeys.Summary] })
    },
  })
}
