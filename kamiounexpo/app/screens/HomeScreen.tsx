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
import {
  SupplierSelectionBottomSheet,
  SupplierSelectionBottomSheetRef,
} from "@/components/product/SupplierSelectionBottomSheet"
import { useAppTheme } from "@/theme/context"
import { useProducts, useCategories, useShops } from "@/domains/data/products/hooks"
import { Product, ProductCategory, Shop } from "@/domains/data/products/types"
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
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { shops, loading: shopsLoading, error: shopsError } = useShops()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { totalItems, addToCart, removeFromCart } = useCart()

  // Supplier selection bottom sheet ref
  const supplierBottomSheetRef = React.useRef<SupplierSelectionBottomSheetRef>(null)

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
          {/* Banners Row */}
          <View className="mb-sm">
            <Text preset="subheading2" text="Special Offers" className="mb-md px-xs" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
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
            </ScrollView>
          </View>

          {/* Test Supplier Selection Button */}
          <View className="mb-sm">
            <TouchableOpacity
              onPress={() => supplierBottomSheetRef.current?.show()}
              className="mx-xs p-sm bg-blue-500 rounded-lg items-center"
            >
              <Text text="Test Supplier Selection" preset="bold" style={{ color: "white" }} />
            </TouchableOpacity>
          </View>

          <View className="w-full">
            <Text preset="subheading2" text="Shops" className="mb-xs px-xs" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {shops.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  onPress={() => handleShopPress(shop)}
                  className="mr-sm w-24 items-center p-sm bg-white rounded-lg border border-neutral-200"
                >
                  <Text text={shop.icon} size="xl" className="mb-xs" />
                  <Text
                    text={shop.name}
                    size="xs"
                    weight="medium"
                    numberOfLines={2}
                    style={{ textAlign: "center" }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-xs mt-xl">
          <Text preset="subheading2" text="Products" className="mb-md px-xs" />
          <ProductList
            products={filteredProducts}
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

      {/* Supplier Selection Bottom Sheet */}
      <SupplierSelectionBottomSheet
        ref={supplierBottomSheetRef}
        productName="Test Product"
        productImage="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
        currentSupplier="supplier1"
        availableSuppliers={[
          {
            id: "supplier1",
            name: "Fresh Market",
            storeName: "Fresh Market Store",
            minCartAmount: 25,
          },
          {
            id: "supplier2",
            name: "Organic Foods",
            storeName: "Organic Foods Co.",
            minCartAmount: 30,
          },
          {
            id: "supplier3",
            name: "Local Grocery",
            storeName: "Local Grocery Shop",
            minCartAmount: 20,
          },
        ]}
        onSupplierSelect={(supplier) => {
          console.log("Selected supplier:", supplier)
          // You can add more logic here
        }}
      />
    </View>
  )
}
