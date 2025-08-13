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

// Products service hook
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // No artificial delay - instant loading
      setProducts(MOCK_PRODUCTS)
    } catch (err) {
      setError("Failed to fetch products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchProducts = useCallback(
    async (params: ProductSearchParams): Promise<ProductSearchResult> => {
      try {
        setLoading(true)
        setError(null)

        // No artificial delay - instant loading
        const filtered = MOCK_PRODUCTS.filter((product) => {
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
        setError("Failed to search products")
        console.error("Error searching products:", err)
        return {
          products: [],
          total: 0,
          hasMore: false,
        }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const getProductById = useCallback(async (productId: string): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)

      // No artificial delay - instant loading
      const product = MOCK_PRODUCTS.find((p) => p.id === productId)
      return product || null
    } catch (err) {
      setError("Failed to fetch product")
      console.error("Error fetching product:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getProductsByCategory = useCallback(async (categoryId: string): Promise<Product[]> => {
    try {
      setLoading(true)
      setError(null)

      // No artificial delay - instant loading
      const categoryProducts = MOCK_PRODUCTS.filter((product) => product.category === categoryId)
      return categoryProducts
    } catch (err) {
      setError("Failed to fetch category products")
      console.error("Error fetching category products:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getProductsByShop = useCallback(async (shopId: string): Promise<Product[]> => {
    try {
      setLoading(true)
      setError(null)

      // No artificial delay - instant loading
      const shopProducts = MOCK_PRODUCTS.filter((product) => product.shopId === shopId)
      return shopProducts
    } catch (err) {
      setError("Failed to fetch shop products")
      console.error("Error fetching shop products:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    searchProducts,
    getProductById,
    getProductsByCategory,
    getProductsByShop,
    refetch: fetchProducts,
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

      // No artificial delay - instant loading
      setCategories(MOCK_CATEGORIES)
    } catch (err) {
      setError("Failed to fetch categories")
      console.error("Error fetching categories:", err)
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

      // No artificial delay - instant loading
      setShops(MOCK_SHOPS)
    } catch (err) {
      setError("Failed to fetch shops")
      console.error("Error fetching shops:", err)
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
