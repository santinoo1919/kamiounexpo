// Products query keys for React Query
export const ProductKeys = {
  List: "products-list",
  Detail: "product-detail",
  Categories: "products-categories",
  Shops: "products-shops",
} as const

export type ProductQueryKey = (typeof ProductKeys)[keyof typeof ProductKeys]
