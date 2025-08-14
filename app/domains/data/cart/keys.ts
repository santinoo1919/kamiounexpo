// Cart query keys for React Query
export const CartKeys = {
  Cart: "cart",
  Summary: "cart-summary",
} as const

export type CartQueryKey = (typeof CartKeys)[keyof typeof CartKeys]
