import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { MainTabScreenProps } from "@/navigators/MainTabNavigator"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { ProductList, IconCard, Carousel } from "@/components/product"
import { CartIcon } from "@/components/cart"
import { Banner } from "@/components/Banner"
import { useAppTheme } from "@/theme/context"
import { useProducts, useCategories, useCollections } from "@/domains/data/products/hooks"
import { Product, ProductCategory, Collection } from "@/domains/data/products/types"
import { useCart } from "@/stores/cartStore"

// Banner background images
const flashSaleBg = require("@assets/images/flashsales.jpg")
const newArrivalsBg = require("@assets/images/new-arrivals.jpg")
const freeShippingBg = require("@assets/images/freedelivery.jpg")

interface HomeScreenProps extends MainTabScreenProps<"Home"> {}

// Main Home Screen
export const HomeScreen = ({}: HomeScreenProps) => {
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(selectedCategory || undefined)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections()
  const { totalItems, addToCart, removeFromCart } = useCart()

  const loading = productsLoading || categoriesLoading || collectionsLoading
  const error = productsError || categoriesError || collectionsError

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

  const handleCollectionPress = (collection: Collection) => {
    console.log("Collection pressed:", collection.title)
    ;(navigation as any).navigate("Collection", { collection })
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
      {/* Compact Header */}
      <Header
        title="Home"
        RightActionComponent={
          <CartIcon count={totalItems} onPress={() => navigation.navigate("Cart" as never)} />
        }
        containerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
      />

      {/* Categories in Header Area - Neutral100 Background */}
      <View className="px-sm" style={{ backgroundColor: theme.colors.palette.neutral100 }}>
        <Carousel
          activeIndex={
            selectedCategory ? categories.findIndex((c) => c.id === selectedCategory) + 1 : 0
          }
          snapToActive={true}
        >
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

      {/* Scrollable Content */}
      <Screen preset="scroll" safeAreaEdges={["bottom"]} className="flex-1 mt-md">
        <View className="px-xs">
          {/* Collections Row */}
          <View className="mb-sm">
            <Text preset="subheading2" text="Special Offers" className="mb-md px-xs" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {collections.map((collection) => (
                <View key={collection.id} className="mr-sm">
                  <Banner
                    title={collection.title}
                    backgroundImage={flashSaleBg} // Use flash sale image for all collections for now
                    onPress={() => handleCollectionPress(collection)}
                  />
                </View>
              ))}
              {collections.length === 0 && (
                <>
                  <Banner
                    title="Flash Sale"
                    backgroundImage={flashSaleBg}
                    onPress={() => console.log("Flash sale banner pressed")}
                  />
                  <View className="w-3" />
                  <Banner
                    title="New Arrivals"
                    backgroundImage={newArrivalsBg}
                    onPress={() => console.log("New arrivals banner pressed")}
                  />
                  <View className="w-3" />
                  <Banner
                    title="Free Shipping"
                    backgroundImage={freeShippingBg}
                    onPress={() => console.log("Free shipping banner pressed")}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>

        <View className="px-xs mt-xl">
          <Text preset="subheading2" text="Products" className="mb-md px-xs" />
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            scrollEnabled={false}
            masonry={true}
            optimizeItemArrangement={true}
          />
        </View>
      </Screen>
    </View>
  )
}
