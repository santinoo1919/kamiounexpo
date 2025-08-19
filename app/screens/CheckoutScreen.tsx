import React from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { CartFooter } from "@/components/cart/CartFooter"
import { ShopContainer } from "@/components/checkout/ShopContainer"
import { DayCard } from "@/components/checkout/DayCard"
import { useCart } from "@/context/CartContext"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"

import { useAppTheme } from "@/theme/context"
import { addDays, isSameDay } from "date-fns"

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false)
  const [deliveryComment, setDeliveryComment] = React.useState("")
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

  // Memoized date array using date-fns for optimal performance
  const dateArray = React.useMemo(() => {
    const baseDate = new Date()
    return Array.from({ length: 7 }, (_, i) => addDays(baseDate, i))
  }, [])

  // Memoized date selection logic using date-fns
  const getDateSelectionState = React.useCallback(
    (shopId: string, date: Date) => {
      const selectedDate = deliveryDates[shopId]
      if (!selectedDate) return false

      // Use toDateString() for more reliable comparison
      return selectedDate.toDateString() === date.toDateString()
    },
    [deliveryDates],
  )

  // Memoized order placement handler
  const handlePlaceOrder = React.useCallback(() => {
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
  }, [allDeliveryDatesSelected, isPlacingOrder, clearCart, navigation])

  return (
    <View className="flex-1">
      <Header
        title="Checkout"
        LeftActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="←" size="md" style={{ color: theme.colors.palette.neutral600 }} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1 px-md"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Delivery Date Selection */}
        <View className="mb-lg">
          {Object.entries(cartByShopWithDetails).map(([shopId, shopData], index) => (
            <View key={shopId} className={index > 0 ? "mt-md" : ""}>
              <ShopContainer
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
                    <Text text="No date" size="xs" className="text-blue-600" />
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
                      {dateArray.map((date, i) => {
                        const isSelected = getDateSelectionState(shopId, date)

                        return (
                          <DayCard
                            key={i}
                            date={date}
                            isSelected={isSelected}
                            onPress={() => {
                              if (isSelected) {
                                // Clear the current selection
                                clearDeliveryDate(shopId)
                              } else {
                                // Clear any existing selection first, then select new date
                                clearDeliveryDate(shopId)
                                selectDeliveryDate(shopId, date)
                              }
                            }}
                          />
                        )
                      })}
                    </View>
                  </ScrollView>
                </View>
              </ShopContainer>
            </View>
          ))}
        </View>

        {/* Delivery Comment */}
        <View className="mb-lg">
          <Text text="Delivery Instructions" preset="subheading2" className="mb-sm" />
          <View className="h-32 w-full rounded-lg">
            <TextField
              value={deliveryComment}
              onChangeText={setDeliveryComment}
              placeholder="Add any special delivery instructions, notes, or comments..."
              multiline
              numberOfLines={3}
              className="rounded-lg w-full"
              style={{
                color: theme.colors.palette.neutral400,
              }}
            />
          </View>
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
      </ScrollView>

      {/* Sticky Footer outside ScrollView */}
      <CartFooter
        totalItems={totalItems}
        totalPrice={totalPrice}
        buttonText={isPlacingOrder ? "Placing Order..." : "Place Order"}
        disabled={!allDeliveryDatesSelected || isPlacingOrder}
        onButtonPress={handlePlaceOrder}
      />
    </View>
  )
}
