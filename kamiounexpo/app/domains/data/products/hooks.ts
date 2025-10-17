import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProductKeys } from "./keys"
import * as api from "./api"
import * as validators from "./validators"
import * as transformers from "./transformers"
// Mock data removed - using real API only
import type {
  Product,
  ProductCategory,
  Shop,
  Collection,
  ProductSearchParams,
  ProductSearchResult,
} from "./types"

// Products service hook using React Query for auto-refetch
export const useProducts = (categoryId?: string, collectionId?: string) => {
  const query = useQuery({
    queryKey: [ProductKeys.List, categoryId, collectionId],
    queryFn: async () => {
      try {
        return await api.fetchProducts(categoryId, collectionId)
      } catch (err) {
        console.error("Error fetching products:", err)
        // Return empty array on error - no mock data fallback
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
    retry: 3,
  })

  const products = query.data || []
  const loading = query.isFetching && !query.data // Only show loading if no cached data
  const error = query.error ? "Failed to fetch products" : null

  const searchProducts = useCallback(
    async (params: ProductSearchParams): Promise<ProductSearchResult> => {
      try {
        // Use cached products from React Query
        const allProducts = products

        const filtered = allProducts.filter((product) => {
          const matchesSearch =
            !params.query ||
            product.name.toLowerCase().includes(params.query.toLowerCase()) ||
            product.description.toLowerCase().includes(params.query.toLowerCase())

          const matchesCategory = !params.category || product.category === params.category
          const matchesPriceRange =
            !params.minPrice ||
            !params.maxPrice ||
            (product.price >= params.minPrice && product.price <= params.maxPrice)

          return matchesSearch && matchesCategory && matchesPriceRange
        })

        const total = filtered.length
        const offset = params.offset || 0
        const limit = params.limit || total
        const paginatedProducts = filtered.slice(offset, offset + limit)

        return {
          products: paginatedProducts,
          total,
          hasMore: offset + limit < total,
        }
      } catch (err) {
        console.error("Error searching products:", err)
        return {
          products: [],
          total: 0,
          hasMore: false,
        }
      }
    },
    [products],
  )

  const getProductById = useCallback(async (productId: string): Promise<Product | null> => {
    try {
      const product = await api.fetchProduct(productId)
      return product
    } catch (err) {
      console.error("Error fetching product:", err)
      return null
    }
  }, [])

  const getProductsByCategory = useCallback(
    async (categoryId: string): Promise<Product[]> => {
      try {
        // Use cached products from React Query
        const categoryProducts = products.filter((product) => product.category === categoryId)
        return categoryProducts
      } catch (err) {
        console.error("Error fetching category products:", err)
        return []
      }
    },
    [products],
  )

  const getProductsByShop = useCallback(
    async (shopId: string): Promise<Product[]> => {
      try {
        // Use cached products from React Query
        const shopProducts = products.filter((product) => product.shopId === shopId)
        return shopProducts
      } catch (err) {
        console.error("Error fetching shop products:", err)
        return []
      }
    },
    [products],
  )

  return {
    products,
    loading,
    error,
    searchProducts,
    getProductById,
    getProductsByCategory,
    getProductsByShop,
    refetch: query.refetch,
    refreshNow: query.refetch, // Alias for immediate refresh
  }
}

// Categories service hook using React Query
export const useCategories = () => {
  const query = useQuery({
    queryKey: [ProductKeys.Categories],
    queryFn: async () => {
      try {
        return await api.fetchCategories()
      } catch (err) {
        console.error("Error fetching categories:", err)
        // Return empty array on error - no mock data fallback
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
    retry: 3,
  })

  const categories = query.data || []
  const loading = query.isLoading
  const error = query.error ? "Failed to fetch categories" : null

  return {
    categories,
    loading,
    error,
    fetchCategories: query.refetch,
  }
}

// Shops service hook using React Query
export const useShops = () => {
  const query = useQuery({
    queryKey: [ProductKeys.Shops],
    queryFn: async () => {
      try {
        return await api.fetchShops()
      } catch (err) {
        console.error("Error fetching shops:", err)
        // Return empty array on error - no mock data fallback
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - shops don't change often
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
    retry: 3,
  })

  const shops = query.data || []
  const loading = query.isLoading
  const error = query.error ? "Failed to fetch shops" : null

  return {
    shops,
    loading,
    error,
    fetchShops: query.refetch,
  }
}

// Collections service hook using React Query for auto-refetch
export const useCollections = () => {
  const query = useQuery({
    queryKey: ["products-collections"],
    queryFn: async () => {
      try {
        return await api.fetchCollections()
      } catch (err) {
        console.error("Error fetching collections:", err)
        // Fallback to empty array on error
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - collections don't change often
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
    retry: 3,
  })

  const collections = query.data || []
  const loading = query.isLoading
  const error = query.error ? "Failed to fetch collections" : null

  return {
    collections,
    loading,
    error,
    fetchCollections: query.refetch,
  }
}
