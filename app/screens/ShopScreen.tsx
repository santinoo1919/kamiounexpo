import React from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { Carousel, ProductList } from "@/components/product"
import { IconCard } from "@/components/product"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { Shop, ProductCategory } from "@/domains/data/products/types"
import { useShopScreen } from "@/domains/data/products/hooks/useShopScreen"
import { useCart } from "@/context/CartContext"
import { CartIcon } from "@/components/cart"
import { useAppTheme } from "@/theme/context"

// Main Shop Screen
export const ShopScreen = ({ route }: { route: { params: { shop: Shop } } }) => {
  const { shop } = route.params
  const navigation = useNavigation()
  const { theme } = useAppTheme()
  const { totalItems } = useCart()
  const {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    addToCart,
    removeFromCart,
    handleCategoryPress,
  } = useShopScreen(shop)

  // Create wrapper functions to match ProductList expected signatures
  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      addToCart(product)
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
  }

  if (loading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title="Shops"
          LeftActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="←" size="md" />
            </TouchableOpacity>
          }
          RightActionComponent={
            <CartIcon count={totalItems} onPress={() => navigation.navigate("Cart" as never)} />
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
          title="Shops"
          LeftActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="←" size="md" />
            </TouchableOpacity>
          }
          RightActionComponent={
            <CartIcon count={totalItems} onPress={() => navigation.navigate("Cart" as never)} />
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text text={`Error: ${error}`} />
        </View>
      </Screen>
    )
  }

  return (
    <View className="flex-1">
      {/* Header with cart and back button */}
      <Header
        title="Shops"
        LeftActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="←" size="md" />
          </TouchableOpacity>
        }
        RightActionComponent={
          <CartIcon count={totalItems} onPress={() => navigation.navigate("Cart" as never)} />
        }
        containerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ShopHeader shop={shop} />

        {/* Categories without title */}
        <View className="px-sm" style={{ backgroundColor: theme.colors.palette.neutral100 }}>
          <Carousel>
            <IconCard
              icon="🏠"
              name="All"
              isSelected={selectedCategory === null}
              onPress={() => handleCategoryPress("all")}
            />
            {categories.map((category: ProductCategory) => (
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

        {/* Products without title */}
        <View className="px-md">
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            scrollEnabled={false}
            masonry={true}
            optimizeItemArrangement={true}
          />
        </View>
      </ScrollView>
    </View>
  )
}
