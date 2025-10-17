import React from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { ProductList } from "@/components/product"
import { Collection } from "@/domains/data/products/types"
import { useProducts } from "@/domains/data/products/hooks"
import { useCart } from "@/stores/cartStore"
import { CartIcon } from "@/components/cart"
import { useAppTheme } from "@/theme/context"

// Main Collection Screen
export const CollectionScreen = ({ route }: { route: { params: { collection: Collection } } }) => {
  const { collection } = route.params
  const navigation = useNavigation()
  const { theme } = useAppTheme()
  const { totalItems } = useCart()

  // Fetch products for this collection
  const { products, loading, error } = useProducts(undefined, collection.id)

  // Create wrapper functions to match ProductList expected signatures
  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      // Use the cart store directly
      const { addToCart } = useCart()
      addToCart(product)
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    const { removeFromCart } = useCart()
    removeFromCart(productId)
  }

  if (loading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title={collection.title}
          LeftActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="←" size="md" style={{ color: theme.colors.palette.neutral100 }} />
            </TouchableOpacity>
          }
          RightActionComponent={
            <CartIcon
              count={totalItems}
              onPress={() => navigation.navigate("Cart" as never)}
              iconColor={theme.colors.palette.neutral100}
            />
          }
          containerStyle={{
            backgroundColor: theme.colors.palette.primary600,
          }}
          titleStyle={{ color: theme.colors.palette.neutral100 }}
        />
        <View className="flex-1 justify-center items-center">
          <Text text="Loading collection products..." />
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title={collection.title}
          LeftActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="←" size="md" style={{ color: theme.colors.palette.neutral100 }} />
            </TouchableOpacity>
          }
          RightActionComponent={
            <CartIcon
              count={totalItems}
              onPress={() => navigation.navigate("Cart" as never)}
              iconColor={theme.colors.palette.neutral100}
            />
          }
          containerStyle={{
            backgroundColor: theme.colors.palette.primary600,
          }}
          titleStyle={{ color: theme.colors.palette.neutral100 }}
        />
        <View className="flex-1 justify-center items-center">
          <Text text={`Error: ${error}`} />
        </View>
      </Screen>
    )
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <Header
        title={collection.title}
        LeftActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="←" size="md" style={{ color: theme.colors.palette.neutral100 }} />
          </TouchableOpacity>
        }
        RightActionComponent={
          <CartIcon
            count={totalItems}
            onPress={() => navigation.navigate("Cart" as never)}
            iconColor={theme.colors.palette.neutral100}
          />
        }
        containerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 8,
          backgroundColor: theme.colors.palette.primary600,
        }}
        titleStyle={{ color: theme.colors.palette.neutral100 }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Collection Description */}
        {collection.description && (
          <View
            className="px-sm py-md"
            style={{ backgroundColor: theme.colors.palette.neutral100 }}
          >
            <Text text={collection.description} preset="default" size="sm" />
          </View>
        )}

        {/* Products */}
        <View className="px-xs">
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
