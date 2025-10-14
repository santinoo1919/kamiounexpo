import { getAxiosInstance } from "./http"
import type { Product, ProductCategory, Shop } from "./types"

const ENDPOINTS = {
  PRODUCTS: "/catalog/products",
  PRODUCT: (id: string) => `/catalog/products/${id}`,
  CATEGORIES: "/catalog/categories",
  SHOPS: "/catalog/shops",
}

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.PRODUCTS)
  return data
}

export const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.PRODUCT(id))
  return data
}

export const fetchCategories = async (): Promise<ProductCategory[]> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.CATEGORIES)
  return data
}

export const fetchShops = async (): Promise<Shop[]> => {
  const { data } = await getAxiosInstance().get(ENDPOINTS.SHOPS)
  return data
}
