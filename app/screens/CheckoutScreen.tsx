import React from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useCart } from "@/context/CartContext"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Ionicons } from "@expo/vector-icons"

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false)
  const {
    cartByShopWithDetails,
    allDeliveryDatesSelected,
    totalPrice,
    totalItems,
    deliveryDates,
    selectDeliveryDate,
    clearDeliveryDate,
    clearCart,
  } = useCart()

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <Header
        title="Checkout"
        RightActionComponent={<Ionicons name="close" size={24} color="#6B7280" />}
      />

      <ScrollView className="flex-1 px-md">
        {/* Delivery Date Selection */}
        <View className="mb-lg">
          <Text text="Select Delivery Dates" preset="heading" className="mb-md" />

          {Object.entries(cartByShopWithDetails).map(([shopId, shopData]) => (
            <View key={shopId} className="bg-white p-md rounded-lg mb-sm border border-gray-200">
              {/* Shop Header */}
              <View className="flex-row items-center mb-md">
                <Text text={shopData.shop.icon} size="xl" className="mr-sm" />
                <View className="flex-1">
                  <Text text={shopData.shop.name} size="lg" weight="bold" />
                  <Text text={shopData.shop.supplier} size="sm" className="text-gray-600" />
                </View>
              </View>

              {/* Delivery Date Selection */}
              <View className="mt-md">
                <Text text="Select Delivery Date:" size="sm" weight="bold" className="mb-sm" />

                {/* Day Cards Row */}
                <View className="flex-row space-x-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                    const dayNumber = date.getDate()
                    const isSelected = deliveryDates[shopId]?.getTime() === date.getTime()

                    return (
                      <TouchableOpacity
                        key={i}
                        className={`w-14 h-16 rounded-lg border-2 items-center justify-center ${
                          isSelected ? "bg-blue-500 border-blue-600" : "bg-white border-gray-200"
                        }`}
                        onPress={() => {
                          if (isSelected) {
                            clearDeliveryDate(shopId)
                          } else {
                            selectDeliveryDate(shopId, date)
                          }
                        }}
                      >
                        <Text
                          text={dayName}
                          size="xs"
                          className={`mb-1 ${isSelected ? "text-white" : "text-gray-600"}`}
                        />
                        <Text
                          text={dayNumber.toString()}
                          size="lg"
                          weight="bold"
                          className={isSelected ? "text-white" : "text-gray-800"}
                        />
                      </TouchableOpacity>
                    )
                  })}
                </View>

                {/* Current Selection Status */}
                <View className="mt-sm bg-gray-50 p-sm rounded border border-gray-200">
                  {deliveryDates[shopId] ? (
                    <Text
                      text={`Delivery Date: ${deliveryDates[shopId]?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}`}
                      size="sm"
                      className="text-green-600"
                    />
                  ) : (
                    <>
                      <Text text="Delivery Date: TBD" size="sm" className="text-gray-600" />
                      <Text
                        text="Click a day to select delivery date"
                        size="xs"
                        className="text-gray-500 mt-xs"
                      />
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View className="bg-gray-50 p-md rounded-lg mb-md">
          <Text text="Order Summary" preset="heading" className="mb-md" />
          <View className="flex-row justify-between items-center mb-sm">
            <Text text="Total Items:" size="sm" />
            <Text text={totalItems.toString()} size="sm" weight="bold" />
          </View>
          <View className="flex-row justify-between items-center mb-md">
            <Text text="Total Amount:" size="lg" weight="bold" />
            <Text
              text={`$${totalPrice.toFixed(2)}`}
              size="lg"
              weight="bold"
              className="text-blue-600"
            />
          </View>
        </View>

        {/* Place Order Button */}
        <View className="mb-lg">
          <Button
            text={isPlacingOrder ? "Placing Order..." : "Place Order"}
            preset="primary"
            disabled={!allDeliveryDatesSelected || isPlacingOrder}
            onPress={() => {
              setIsPlacingOrder(true)
              // Simulate order processing
              setTimeout(() => {
                setIsPlacingOrder(false)
                // Clear cart and navigate to success screen
                clearCart()
                const orderId = `ORD-${Date.now().toString().slice(-6)}`
                navigation.navigate("OrderSuccess", { orderId })
              }, 1000)
            }}
          />

          {!allDeliveryDatesSelected && (
            <Text
              text="Please select delivery dates for all shops to continue"
              size="xs"
              className="text-red-600 mt-sm text-center"
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}
