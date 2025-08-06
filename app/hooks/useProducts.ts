import { useState, useEffect } from "react"
import { Product, ProductCategory } from "@/models/Product"
import { MockProductRepository } from "@/services/data/repositories/MockProductRepository"

// Create repository instance
const productRepository = new MockProductRepository()

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productRepository.getProducts()
      setProducts(data)
    } catch (err) {
      setError("Failed to fetch products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setError(null)
      const data = await productRepository.getCategories()
      setCategories(data)
    } catch (err) {
      setError("Failed to fetch categories")
      console.error("Error fetching categories:", err)
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      setError(null)
      const data = await productRepository.getFeaturedProducts()
      setFeaturedProducts(data)
    } catch (err) {
      setError("Failed to fetch featured products")
      console.error("Error fetching featured products:", err)
    }
  }

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const filtered = products.filter((product) => product.category === selectedCategory)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(featuredProducts)
    }
  }, [selectedCategory, products, featuredProducts])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchFeaturedProducts()
  }, [])

  return {
    products,
    categories,
    featuredProducts,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    refetch: fetchProducts,
  }
}
