import { getAxiosInstance } from "./http"
import type { Product, ProductCategory, Shop, Collection } from "./types"
import { transformMedusaProduct } from "./transformers"
import Config from "@/config"

// Medusa Store API endpoints
const ENDPOINTS = {
  PRODUCTS: "/store/products",
  PRODUCT: (id: string) => `/store/products/${id}`,
  // Categories and shops will need custom backend endpoints
  CATEGORIES: "/catalog/categories",
  SHOPS: "/catalog/shops",
  COLLECTIONS: "/store/collections",
}

export const fetchProducts = async (
  categoryId?: string,
  collectionId?: string,
): Promise<Product[]> => {
  const instance = getAxiosInstance()

  // Add Medusa publishable key header
  const headers = {
    "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
  }

  // Include calculated_price in variants, inventory, and metadata for supplier info
  const params: any = {
    fields: "+variants.calculated_price,+variants.inventory_quantity,+metadata",
    region_id: (Config as any).MEDUSA_DEFAULT_REGION_ID, // Use config region
  }

  // Add category filter if provided
  if (categoryId) {
    params.category_id = categoryId
  }

  // Add collection filter if provided
  if (collectionId) {
    params.collection_id = collectionId
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

  // Include calculated_price in variants, inventory, and metadata for supplier info
  const params = {
    fields: "+variants.calculated_price,+variants.inventory_quantity,+metadata",
    region_id: (Config as any).MEDUSA_DEFAULT_REGION_ID, // Use config region
  }

  const { data } = await instance.get(ENDPOINTS.PRODUCT(id), { headers, params })
  return transformMedusaProduct(data.product)
}

export const fetchCategories = async (): Promise<ProductCategory[]> => {
  try {
    const instance = getAxiosInstance()

    const headers = {
      "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
    }

    const { data } = await instance.get("/store/product-categories", { headers })

    // Transform Medusa categories to app format
    return data.product_categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      icon: category.metadata?.icon || "📦", // Default icon if none provided
      description: category.description || "",
      productCount: 0, // Will be populated when products are loaded
    }))
  } catch (error) {
    console.error("Error fetching categories from Medusa:", error)
    return [] // This will trigger mock data fallback
  }
}

export const fetchShops = async (): Promise<Shop[]> => {
  // For now, return empty array until custom backend endpoint is ready
  // TODO: Implement custom /catalog/shops endpoint in backend
  return []
}

export const fetchCollections = async (): Promise<Collection[]> => {
  try {
    const instance = getAxiosInstance()

    const headers = {
      "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
    }

    const { data } = await instance.get(ENDPOINTS.COLLECTIONS, { headers })

    // Transform Medusa collections to app format
    return data.collections.map((collection: any) => ({
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description || "",
      metadata: collection.metadata || {},
      created_at: collection.created_at,
      updated_at: collection.updated_at,
      productCount: 0, // Will be populated when products are loaded
    }))
  } catch (error) {
    console.error("Error fetching collections from Medusa:", error)
    return [] // This will trigger mock data fallback
  }
}
