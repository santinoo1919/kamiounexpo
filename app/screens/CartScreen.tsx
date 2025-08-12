import React from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { Button } from "@/components/Button"
import { VendorSubCart } from "@/components/cart/VendorSubCart"
import { useCart } from "@/context/CartContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export const CartScreen = () => {
  const navigation = useNavigation()
  const { cartByShopWithDetails, allShopsMeetMinimum, totalPrice, totalItems } = useCart()

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
          <VendorSubCart
            key={shopId}
            shop={shopData.shop}
            items={shopData.items}
            minCartAmount={shopData.minAmount}
            subtotal={shopData.subtotal}
          />
        ))}

        {/* Main Cart Summary */}
        <View className="mt-lg p-md bg-gray-50 rounded-lg mb-md">
          <View className="flex-row justify-between items-center mb-md">
            <Text text={`${totalItems} items`} size="lg" weight="bold" />
            <Text text={`$${totalPrice.toFixed(2)}`} preset="heading" />
          </View>

          <Button
            text="Proceed to Checkout"
            preset="primary"
            disabled={!allShopsMeetMinimum}
            onPress={() => {
              // TODO: Implement checkout logic
              console.log("Proceeding to checkout...")
            }}
          />

          {!allShopsMeetMinimum && (
            <Text
              text="All shops must meet minimum order requirements"
              size="xs"
              className="text-red-600 mt-sm text-center"
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}
