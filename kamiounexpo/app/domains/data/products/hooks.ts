import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProductKeys } from "./keys"
import * as api from "./api"
import * as validators from "./validators"
import * as transformers from "./transformers"
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SHOPS } from "@/domains/data/mockData/products"
import type {
  Product,
  ProductCategory,
  Shop,
  ProductSearchParams,
  ProductSearchResult,
} from "./types"

// Products service hook using React Query for auto-refetch
export const useProducts = () => {
  const query = useQuery({
    queryKey: [ProductKeys.List],
    queryFn: async () => {
      try {
        return await api.fetchProducts()
      } catch (err) {
        console.error("Error fetching products:", err)
        // Fallback to mock data on error
        return MOCK_PRODUCTS
      }
    },
    staleTime: 30 * 1000, // 30 seconds - shorter than default for inventory updates
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
    retry: 3,
  })

  const products = query.data || []
  const loading = query.isLoading
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

// Categories service hook
export const useCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from API (will be empty until backend implements it)
      const fetchedCategories = await api.fetchCategories()

      // If no categories from API, use mock data
      if (fetchedCategories.length === 0) {
        setCategories(MOCK_CATEGORIES)
      } else {
        setCategories(fetchedCategories)
      }
    } catch (err) {
      setError("Failed to fetch categories")
      console.error("Error fetching categories:", err)

      // Fallback to mock data
      setCategories(MOCK_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}

// Shops service hook
export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from API (will be empty until backend implements it)
      const fetchedShops = await api.fetchShops()

      // If no shops from API, use mock data
      if (fetchedShops.length === 0) {
        setShops(MOCK_SHOPS)
      } else {
        setShops(fetchedShops)
      }
    } catch (err) {
      setError("Failed to fetch shops")
      console.error("Error fetching shops:", err)

      // Fallback to mock data
      setShops(MOCK_SHOPS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  return {
    shops,
    loading,
    error,
    fetchShops,
  }
}
