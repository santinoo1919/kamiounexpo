import React, { useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { ProductList, IconCard, Carousel } from "@/components/product"
import { CartIcon } from "@/components/cart"
import { useAppTheme } from "@/theme/context"
import { useProducts, useCategories, useShops } from "@/domains/data/products/hooks"
import { Product, ProductCategory, Shop } from "@/domains/data/products/types"
import { useCart } from "@/context/CartContext"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

// Main Home Screen
export const HomeScreen = ({}: HomeScreenProps) => {
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { shops, loading: shopsLoading, error: shopsError } = useShops()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { totalItems, addToCart, removeFromCart } = useCart()

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products.filter((product) => product.category === selectedCategory)
      : products

  const loading = productsLoading || categoriesLoading || shopsLoading
  const error = productsError || categoriesError || shopsError

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      addToCart(product)
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
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
    <View className="flex-1">
      {/* Sticky Header */}
      <Header
        title="Home"
        RightActionComponent={
          <CartIcon count={totalItems} onPress={() => navigation.navigate("Cart" as never)} />
        }
        containerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Scrollable Content */}
      <Screen preset="scroll" safeAreaEdges={["bottom"]} className="flex-1">
        <View className="px-md">
          <Text preset="heading" text="Categories" className="mb-md" />
          <Carousel>
            <IconCard
              icon="🏠"
              name="All"
              isSelected={selectedCategory === null}
              onPress={() => handleCategoryPress("all")}
            />
            {categories.map((category) => (
              <IconCard
                key={category.id}
                icon={category.icon}
                name={category.name}
                isSelected={selectedCategory === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </Carousel>
        </View>

        <View className="px-md">
          <Text preset="heading" text="Shops" className="mb-md" />
          <Carousel>
            {shops.map((shop) => (
              <IconCard
                key={shop.id}
                icon={shop.icon}
                name={shop.name}
                onPress={() => handleShopPress(shop)}
              />
            ))}
          </Carousel>
        </View>

        <View className="px-md">
          <Text preset="heading" text="Featured Products" className="mb-md" />

          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            scrollEnabled={false}
          />
        </View>
      </Screen>
    </View>
  )
}
