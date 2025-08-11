import React from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { Carousel } from "@/components/product"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { ShopProductList } from "@/components/shop/ShopProductList"
import { Shop, ProductCategory } from "@/domains/data/products/types"
import { useShopScreen } from "@/domains/data/products/hooks/useShopScreen"

// Main Shop Screen
export const ShopScreen = ({ route }: { route: { params: { shop: Shop } } }) => {
  const { shop } = route.params
  const navigation = useNavigation()
  const {
    products,
    categories,
    loading,
    error,
    cart,
    selectedCategory,
    addToCart,
    removeFromCart,
    handleCategoryPress,
  } = useShopScreen(shop)

  if (loading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title={shop.name}
          RightActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="✕" size="md" />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text text="Loading shop products..." />
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title={shop.name}
          RightActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="✕" size="md" />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text text={`Error: ${error}`} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} className="flex-1">
      <Header
        title={shop.name}
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="✕" size="md" />
          </TouchableOpacity>
        }
      />

      <ShopHeader shop={shop} />

      <View className="px-md">
        <Text preset="heading" text="Categories" className="mb-md" />
        <Carousel>
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mb-xs ${
              selectedCategory === null ? "bg-primary-600" : "bg-neutral-200"
            }`}
          >
            <TouchableOpacity onPress={() => handleCategoryPress("all")}>
              <Text text="🏠" size="lg" />
            </TouchableOpacity>
          </View>
          {categories.map((category: ProductCategory) => (
            <View
              key={category.id}
              className={`w-12 h-12 rounded-full items-center justify-center mb-xs ${
                selectedCategory === category.id ? "bg-primary-600" : "bg-neutral-200"
              }`}
            >
              <TouchableOpacity onPress={() => handleCategoryPress(category.id)}>
                <Text text={category.icon} size="lg" />
              </TouchableOpacity>
            </View>
          ))}
        </Carousel>
      </View>

      <View className="px-md">
        <Text preset="heading" text="Products" className="mb-md" />
        <ShopProductList
          products={products}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          cart={cart}
          shopId={shop.id}
          numColumns={2}
        />
      </View>
    </Screen>
  )
}
