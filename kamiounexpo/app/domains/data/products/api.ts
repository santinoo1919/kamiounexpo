import { getAxiosInstance } from "./http"
import type { Product, ProductCategory, Shop } from "./types"
import { transformMedusaProduct } from "./transformers"
import Config from "@/config"

// Medusa Store API endpoints
const ENDPOINTS = {
  PRODUCTS: "/store/products",
  PRODUCT: (id: string) => `/store/products/${id}`,
  // Categories and shops will need custom backend endpoints
  CATEGORIES: "/catalog/categories",
  SHOPS: "/catalog/shops",
}

export const fetchProducts = async (): Promise<Product[]> => {
  const instance = getAxiosInstance()
  
  // Add Medusa publishable key header
  const headers = {
    "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
  }
  
  const { data } = await instance.get(ENDPOINTS.PRODUCTS, { headers })
  
  // Transform Medusa products to app format
  return data.products.map(transformMedusaProduct)
}

export const fetchProduct = async (id: string): Promise<Product> => {
  const instance = getAxiosInstance()
  
  const headers = {
    "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
  }
  
  const { data } = await instance.get(ENDPOINTS.PRODUCT(id), { headers })
  return transformMedusaProduct(data.product)
}

export const fetchCategories = async (): Promise<ProductCategory[]> => {
  // For now, return empty array until custom backend endpoint is ready
  // TODO: Implement custom /catalog/categories endpoint in backend
  return []
}

export const fetchShops = async (): Promise<Shop[]> => {
  // For now, return empty array until custom backend endpoint is ready
  // TODO: Implement custom /catalog/shops endpoint in backend
  return []
}
