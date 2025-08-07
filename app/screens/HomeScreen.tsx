import React, { useState } from "react"
import { View, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { AutoImage } from "@/components/AutoImage"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"
import { useProducts, useCategories, useShops } from "@/domains/data/products/hooks"
import { Product, ProductCategory, Shop } from "@/domains/data/products/types"

// Product Card Component
const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
}: {
  product: Product
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  quantity?: number
}) => {
  const { theme } = useAppTheme()

  return (
    <Card
      className="flex-1 m-xs rounded-lg"
      onPress={() => console.log("Product pressed:", product.id)}
      HeadingComponent={
        <View className="w-full h-32 mb-xs overflow-hidden rounded-md relative">
          <AutoImage source={{ uri: product.image }} className="w-full h-full" resizeMode="cover" />
          {/* Stock Status Label */}
          <View className="absolute top-xs right-xs">
            <View
              className={`px-xs py-xxs rounded-sm ${
                product.status === "in_stock" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                text={product.status === "in_stock" ? "In Stock" : "Out of Stock"}
                size="xxs"
                className={product.status === "in_stock" ? "text-green-700" : "text-red-700"}
              />
            </View>
          </View>
        </View>
      }
      heading={product.name}
      content={product.description}
      HeadingTextProps={{ className: "px-xs py-xs", numberOfLines: 2 }}
      ContentTextProps={{ className: "px-xs py-xs" }}
      verticalAlignment="force-footer-bottom"
      FooterComponent={
        <View className="w-full px-xs py-xs">
          <View className="flex-row items-center justify-between mb-xs">
            <Text text={`$${product.price}`} weight="bold" />
            {product.promoPrice && (
              <Text
                text={`$${product.promoPrice}`}
                size="xs"
                style={{ color: theme.colors.error }}
              />
            )}
            {quantity > 0 && <Text text={`Qty: ${quantity}`} size="xs" />}
          </View>
          <View className="w-full">
            <Button
              preset="primary"
              text={quantity > 0 ? "Add More" : "Add to Cart"}
              onPress={() => onAddToCart(product.id)}
              className="w-full"
            />
          </View>
        </View>
      }
    />
  )
}

// Shop Carousel Component
const ShopCarousel = ({
  shops,
  onShopPress,
}: {
  shops: Shop[]
  onShopPress: (shop: Shop) => void
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-md py-xs">
      {shops.map((shop) => (
        <TouchableOpacity
          key={shop.id}
          onPress={() => onShopPress(shop)}
          className="items-center mr-lg"
        >
          <View className="w-12 h-12 bg-neutral-200 rounded-full items-center justify-center mb-xs">
            <Text text={shop.icon} size="lg" />
          </View>
          <Text text={shop.name} size="xs" className="text-center" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// Category Carousel Component
const CategoryCarousel = ({
  categories,
  selectedCategory,
  onCategoryPress,
}: {
  categories: ProductCategory[]
  selectedCategory: string | null
  onCategoryPress: (categoryId: string) => void
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-md py-xs">
      {/* All Categories Option */}
      <TouchableOpacity onPress={() => onCategoryPress("all")} className="items-center mr-lg">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mb-xs ${
            selectedCategory === null ? "bg-primary-600" : "bg-neutral-200"
          }`}
        >
          <Text text="🏠" size="lg" />
        </View>
        <Text
          text="All"
          size="xs"
          className={`text-center ${selectedCategory === null ? "font-bold" : ""}`}
        />
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryPress(category.id)}
          className="items-center mr-lg"
        >
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mb-xs ${
              selectedCategory === category.id ? "bg-primary-600" : "bg-neutral-200"
            }`}
          >
            <Text text={category.icon} size="lg" />
          </View>
          <Text
            text={category.name}
            size="xs"
            className={`text-center ${selectedCategory === category.id ? "font-bold" : ""}`}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// Main Home Screen
export const HomeScreen = () => {
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { shops, loading: shopsLoading, error: shopsError } = useShops()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products.filter((product) => product.category === selectedCategory)
      : products

  const loading = productsLoading || categoriesLoading || shopsLoading
  const error = productsError || categoriesError || shopsError

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

  const handleShopPress = (shop: Shop) => {
    console.log("Shop pressed:", shop.name)
    ;(navigation as any).navigate("Shop", { shop })
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onAddToCart={addToCart}
      onRemoveFromCart={removeFromCart}
      quantity={cart[item.id] || 0}
    />
  )

  if (loading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header title="Home" />
        <View className="flex-1 justify-center items-center">
          <Text text="Loading products..." />
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header title="Home" />
        <View className="flex-1 justify-center items-center">
          <Text text={`Error: ${error}`} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} className="flex-1">
      <Header title="Home" />

      <View className="px-md">
        <Text preset="heading" text="Categories" className="mb-md" />
        <CategoryCarousel
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryPress={handleCategoryPress}
        />
      </View>

      <View className="px-md">
        <Text preset="heading" text="Shops" className="mb-md" />
        <ShopCarousel shops={shops} onShopPress={handleShopPress} />
      </View>

      <View className="px-md">
        <Text preset="heading" text="Featured Products" className="mb-md" />

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          scrollEnabled={false}
        />
      </View>
    </Screen>
  )
}
