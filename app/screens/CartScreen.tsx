import React from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { VendorSubCart } from "@/components/cart/VendorSubCart"
import { CartFooter } from "@/components/cart/CartFooter"
import { ShopContainer } from "@/components/checkout/ShopContainer"

import { useCart } from "@/context/CartContext"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Ionicons } from "@expo/vector-icons"

export const CartScreen = () => {
  const navigation = useNavigation<AppStackScreenProps<"Cart">["navigation"]>()
  const { cartByShopWithDetails, allShopsMeetMinimum, totalPrice, totalItems, removeFromCart } =
    useCart()

  if (totalItems === 0) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]}>
        <Header
          title="Cart"
          RightActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text text="Your cart is empty" preset="heading" />
          <Text text="Add some products to get started!" className="mt-sm text-gray-600" />
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <Header
        title="Cart"
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 px-md">
        {/* Vendor Sub-Carts */}
        {Object.entries(cartByShopWithDetails).map(([shopId, shopData]) => (
          <ShopContainer
            key={shopId}
            shop={shopData.shop}
            cartInfo={{
              itemCount: shopData.items.length,
              amount: shopData.subtotal,
            }}
            onClearAll={() => shopData.items.forEach((item) => removeFromCart(item.productId))}
          >
            <VendorSubCart
              shop={shopData.shop}
              items={shopData.items}
              minCartAmount={shopData.minAmount}
              subtotal={shopData.subtotal}
            />
          </ShopContainer>
        ))}

        {/* Validation Message */}
        {!allShopsMeetMinimum && (
          <View className="mt-lg p-md bg-red-50 rounded-lg mb-md">
            <Text
              text="All shops must meet minimum order requirements"
              size="xs"
              className="text-red-600 text-center"
            />
          </View>
        )}

        {/* Use CartFooter component */}
        <CartFooter
          totalItems={totalItems}
          totalPrice={totalPrice}
          buttonText="Checkout"
          disabled={!allShopsMeetMinimum}
          onButtonPress={() => {
            if (allShopsMeetMinimum) {
              navigation.navigate("Checkout")
            }
          }}
        />
      </ScrollView>
    </Screen>
  )
}
