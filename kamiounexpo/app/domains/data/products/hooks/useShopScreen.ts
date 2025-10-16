import { useState, useMemo } from "react"
import { useProducts, useCategories } from "../hooks"
import { Product, Shop } from "../types"
import { useCart } from "@/context/CartContext"

export const useShopScreen = (shop: Shop) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch products filtered by category and shop
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(selectedCategory || undefined)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { addToCart, removeFromCart } = useCart()

  // Filter products by shop supplier only
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.supplier === shop.supplier)
  }, [products, shop.supplier])

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
    selectedCategory,
    addToCart,
    removeFromCart,
    handleCategoryPress,
  }
}
