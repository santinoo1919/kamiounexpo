import React from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "../components/Screen"
import { Header } from "../components/Header"
import { Text } from "../components/Text"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { ListView } from "../components/ListView"
import { CartItem } from "../components/cart"
import { useCart } from "../context/CartContext"
import { useAppTheme } from "../theme/context"

interface CartScreenProps extends AppStackScreenProps<"Cart"> {}

export const CartScreen = ({}: CartScreenProps) => {
  const navigation = useNavigation()
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart()
  const { theme } = useAppTheme()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    console.log("Checkout pressed")
    // TODO: Implement checkout logic
  }

  if (totalItems === 0) {
    return (
      <View className="flex-1">
        {/* Sticky Header */}
        <Header
          title="Cart"
          RightActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="✕" size="md" />
            </TouchableOpacity>
          }
        />

        {/* Scrollable Content */}
        <Screen preset="scroll" safeAreaEdges={["bottom"]} className="flex-1">
          <View className="flex-1 items-center justify-center px-md py-xl">
            <Text text="Your cart is empty" size="lg" style={{ color: theme.colors.textDim }} />
            <Text
              text="Add some products to get started!"
              size="sm"
              style={{ color: theme.colors.textDim }}
              className="mt-xs"
            />
          </View>
        </Screen>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {/* Sticky Header */}
      <Header
        title="Cart"
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="✕" size="md" />
          </TouchableOpacity>
        }
      />

      {/* Scrollable Content */}
      <Screen preset="scroll" safeAreaEdges={["bottom"]} className="flex-1">
        <View className="flex-1 px-md">
          {/* Cart Items List */}
          <ListView
            data={items}
            keyExtractor={(item) => item.productId}
            renderItem={({ item }) => (
              <CartItem
                product={item.product}
                quantity={item.quantity}
                onIncreaseQuantity={() => handleQuantityChange(item.productId, item.quantity + 1)}
                onDecreaseQuantity={() => handleQuantityChange(item.productId, item.quantity - 1)}
                onRemove={() => removeFromCart(item.productId)}
              />
            )}
            estimatedItemSize={120}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          {/* Summary */}
          <Card
            className="mb-lg"
            ContentComponent={
              <View>
                <View className="flex-row justify-between items-center mb-xs">
                  <Text text="Total Items:" size="sm" style={{ color: theme.colors.textDim }} />
                  <Text
                    text={totalItems.toString()}
                    size="sm"
                    weight="bold"
                    style={{ color: theme.colors.text }}
                  />
                </View>
                <View className="flex-row justify-between items-center">
                  <Text
                    text="Total Price:"
                    size="lg"
                    weight="bold"
                    style={{ color: theme.colors.text }}
                  />
                  <Text
                    text={`$${totalPrice.toFixed(2)}`}
                    size="lg"
                    weight="bold"
                    style={{ color: theme.colors.palette.primary600 }}
                  />
                </View>
              </View>
            }
          />

          {/* Action Buttons */}
          <View className="mb-lg">
            <Button preset="primary" text="Checkout" onPress={handleCheckout} className="mb-sm" />
            <Button preset="secondary" text="Clear Cart" onPress={clearCart} />
          </View>
        </View>
      </Screen>
    </View>
  )
}
