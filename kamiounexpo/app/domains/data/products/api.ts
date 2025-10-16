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

  // Include calculated_price in variants and add region for pricing context
  const params = {
    fields: "+variants.calculated_price,+variants.inventory_quantity",
    region_id: (Config as any).MEDUSA_DEFAULT_REGION_ID, // Use config region
  }

  const { data } = await instance.get(ENDPOINTS.PRODUCTS, { headers, params })

  // Transform Medusa products to app format
  return data.products.map(transformMedusaProduct)
}

export const fetchProduct = async (id: string): Promise<Product> => {
  const instance = getAxiosInstance()

  const headers = {
    "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
  }

  // Include calculated_price in variants and add region for pricing context
  const params = {
    fields: "+variants.calculated_price,+variants.inventory_quantity",
    region_id: (Config as any).MEDUSA_DEFAULT_REGION_ID, // Use config region
  }

  const { data } = await instance.get(ENDPOINTS.PRODUCT(id), { headers, params })
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
