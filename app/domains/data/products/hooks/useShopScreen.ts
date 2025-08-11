import { useState, useEffect, useMemo } from "react"
import { useProducts, useCategories } from "./index"
import { Product, Shop } from "../types"
import { MockProductRepository } from "@/services/data/repositories/MockProductRepository"

export const useShopScreen = (shop: Shop) => {
  const { products: allProducts, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  // Filter products by shop supplier
  const shopProducts = useMemo(() => {
    return allProducts.filter((product) => product.supplier === shop.supplier)
  }, [allProducts, shop.supplier])

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const filtered = shopProducts.filter((product) => product.category === selectedCategory)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(shopProducts)
    }
  }, [selectedCategory, shopProducts])

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[productId] > 0) {
        newCart[productId] -= 1
        if (newCart[productId] === 0) {
          delete newCart[productId]
        }
      }
      return newCart
    })
  }

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    }
  }

  const loading = productsLoading || categoriesLoading
  const error = productsError || categoriesError

  return {
    products: filteredProducts,
    categories,
    loading,
    error,
    cart,
    selectedCategory,
    addToCart,
    removeFromCart,
    handleCategoryPress,
  }
}
