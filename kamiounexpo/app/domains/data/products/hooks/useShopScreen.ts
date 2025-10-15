import { useState, useEffect, useMemo } from "react"
import { useProducts, useCategories } from "../hooks"
import { Product, Shop } from "../types"
import { useCart } from "@/stores/cartStore"

export const useShopScreen = (shop: Shop) => {
  const { products: allProducts, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { addToCart, removeFromCart } = useCart()

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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
