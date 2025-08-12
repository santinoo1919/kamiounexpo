import React from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { CartFooter } from "@/components/cart/CartFooter"
import { ShopContainer } from "@/components/checkout/ShopContainer"
import { useCart } from "@/context/CartContext"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Ionicons } from "@expo/vector-icons"
import { useAppTheme } from "@/theme/context"

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false)
  const { theme } = useAppTheme()

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
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 px-md">
        {/* Delivery Date Selection */}
        <View className="mb-lg">
          {Object.entries(cartByShopWithDetails).map(([shopId, shopData]) => (
            <ShopContainer
              key={shopId}
              shop={shopData.shop}
              cartInfo={{
                itemCount: shopData.items.length,
                amount: shopData.subtotal,
              }}
              deliveryStatus={
                deliveryDates[shopId] ? (
                  <Text
                    text={`Delivery: ${deliveryDates[shopId]?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}`}
                    size="xs"
                    className="text-blue-800 font-semibold"
                  />
                ) : (
                  <Text text="No date selected yet" size="xs" className="text-blue-600" />
                )
              }
            >
              {/* Delivery Date Selection */}
              <View className="h-28">
                {/* Day Cards Row - Horizontal Scrollable */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                  className="flex-1"
                >
                  <View className="flex-row gap-3 px-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() + i)
                      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                      const dayNumber = date.getDate()
                      const isSelected = deliveryDates[shopId]?.getTime() === date.getTime()

                      // Debug selection state
                      console.log(
                        `Date ${dayNumber}: isSelected=${isSelected}, deliveryDates[${shopId}]=`,
                        deliveryDates[shopId],
                      )

                      return (
                        <TouchableOpacity
                          key={i}
                          className="w-20 h-24 rounded-lg border-2 items-center justify-center"
                          style={{
                            backgroundColor: isSelected
                              ? theme.colors.palette.primary500
                              : "#FFFFFF",
                            borderColor: isSelected ? theme.colors.palette.primary400 : "#E5E7EB",
                          }}
                          onPress={() => {
                            console.log(
                              `Tapping date ${dayNumber}, current isSelected: ${isSelected}`,
                            )
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
                            style={{
                              color: isSelected ? theme.colors.palette.accent100 : "#6B7280",
                              marginBottom: 4,
                            }}
                          />
                          <Text
                            text={dayNumber.toString()}
                            size="xl"
                            weight="bold"
                            style={{
                              color: isSelected ? theme.colors.palette.accent100 : "#1F2937",
                            }}
                          />
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>
              </View>
            </ShopContainer>
          ))}
        </View>

        {!allDeliveryDatesSelected && (
          <View className="mb-md">
            <Text
              text="Please select delivery dates for all shops to continue"
              size="xs"
              className="text-red-600 text-center"
            />
          </View>
        )}

        {/* Use CartFooter component */}
        <CartFooter
          totalItems={totalItems}
          totalPrice={totalPrice}
          buttonText={isPlacingOrder ? "Placing Order..." : "Place Order"}
          disabled={!allDeliveryDatesSelected || isPlacingOrder}
          onButtonPress={() => {
            if (allDeliveryDatesSelected && !isPlacingOrder) {
              setIsPlacingOrder(true)
              // Simulate order processing
              setTimeout(() => {
                setIsPlacingOrder(false)
                // Clear cart and navigate to success screen
                clearCart()
                const orderId = `ORD-${Date.now().toString().slice(-6)}`
                navigation.navigate("OrderSuccess", { orderId })
              }, 1000)
            }
          }}
        />
      </ScrollView>
    </Screen>
  )
}
