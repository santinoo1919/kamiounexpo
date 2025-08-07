import { useState, useEffect, useCallback } from "react"
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SHOPS } from "@/services/data/mockProducts"
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

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
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Simple mock search implementation
        let filteredProducts = MOCK_PRODUCTS

        if (params.query) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(params.query!.toLowerCase()) ||
              product.description.toLowerCase().includes(params.query!.toLowerCase()),
          )
        }

        if (params.category) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === params.category,
          )
        }

        return {
          products: filteredProducts,
          total: filteredProducts.length,
          hasMore: false,
        }
      } catch (err) {
        console.error("Error searching products:", err)
        throw err
      }
    },
    [],
  )

  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      const product = MOCK_PRODUCTS.find((p) => p.id === id)
      return product || null
    } catch (err) {
      console.error("Error fetching product:", err)
      return null
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
    getProduct,
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setShops(MOCK_SHOPS)
    } catch (err) {
      setError("Failed to fetch shops")
      console.error("Error fetching shops:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getProductsBySupplier = useCallback(async (supplier: string): Promise<Product[]> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      return MOCK_PRODUCTS.filter((product) => product.supplier === supplier)
    } catch (err) {
      console.error("Error fetching supplier products:", err)
      return []
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
    getProductsBySupplier,
  }
}
