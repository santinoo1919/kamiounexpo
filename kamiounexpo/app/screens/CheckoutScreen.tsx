import React from "react"
import { View, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { CartFooter } from "@/components/cart/CartFooter"
import { ShopContainer } from "@/components/checkout/ShopContainer"
import { DayCard } from "@/components/checkout/DayCard"
import { useCart } from "@/stores/cartStore"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useCompleteCheckoutMutation } from "@/domains/data/orders/hooks"
import { clearStoredCartId } from "@/domains/data/cart/api"

import { useAppTheme } from "@/theme/context"
import { addDays, isSameDay } from "date-fns"

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const [deliveryComment, setDeliveryComment] = React.useState("")
  const { theme } = useAppTheme()

  const { items, totalPrice, totalItems, clearCart, medusaCart } = useCart()

  // Group items by shop for display
  const cartByShopWithDetails = React.useMemo(() => {
    const grouped: { [shopId: string]: any } = {}

    items.forEach((item) => {
      if (!grouped[item.product.shopId]) {
        grouped[item.product.shopId] = {
          items: [],
          shop: { id: item.product.shopId, name: "Shop" }, // TODO: Get real shop data
          subtotal: 0,
          minAmount: 50, // TODO: Get real min amount
          canProceed: false,
          remaining: 0,
        }
      }
      grouped[item.product.shopId].items.push(item)
      grouped[item.product.shopId].subtotal += item.product.price * item.quantity
    })

    // Calculate shop details
    Object.values(grouped).forEach((shopData: any) => {
      shopData.canProceed = shopData.subtotal >= shopData.minAmount
      shopData.remaining = Math.max(0, shopData.minAmount - shopData.subtotal)
    })

    return grouped
  }, [items])

  const allShopsMeetMinimum = Object.values(cartByShopWithDetails).every(
    (shop: any) => shop.canProceed,
  )

  // Delivery date state management
  const [deliveryDates, setDeliveryDates] = React.useState<{ [shopId: string]: Date | null }>({})

  const allDeliveryDatesSelected = React.useMemo(() => {
    const shopIds = Object.keys(cartByShopWithDetails)
    if (shopIds.length === 0) return true
    return shopIds.every(
      (shopId) => deliveryDates[shopId] !== null && deliveryDates[shopId] !== undefined,
    )
  }, [cartByShopWithDetails, deliveryDates])

  const selectDeliveryDate = (shopId: string, date: Date) => {
    setDeliveryDates((prev) => ({ ...prev, [shopId]: date }))
  }

  const clearDeliveryDate = (shopId: string) => {
    setDeliveryDates((prev) => ({ ...prev, [shopId]: null }))
  }

  // Check if cart has items before allowing checkout
  const hasCartItems = totalItems > 0

  // Debug: Log cart state
  React.useEffect(() => {
    console.log("=== CHECKOUT DEBUG ===")
    console.log("Total items:", totalItems)
    console.log("Medusa cart ID:", medusaCart?.id)
    console.log("All delivery dates selected:", allDeliveryDatesSelected)
    console.log("Has cart items:", hasCartItems)
    console.log("Button should be enabled:", allDeliveryDatesSelected && hasCartItems)
    console.log("=====================")
  }, [totalItems, medusaCart, allDeliveryDatesSelected, hasCartItems])

  const completeCheckoutMutation = useCompleteCheckoutMutation()

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

  // Real checkout handler - Creates order in Medusa
  const handlePlaceOrder = React.useCallback(async () => {
    if (!allDeliveryDatesSelected || completeCheckoutMutation.isPending || !hasCartItems) return

    try {
      const result = await completeCheckoutMutation.mutateAsync({
        email: "guest@customer.com", // TODO: Get from auth context
        cartId: medusaCart?.id, // Pass the current Medusa cart ID
      })

      // Success - Clear cart and navigate
      clearCart()
      clearStoredCartId() // Clear the stored cart ID so a new cart is created next time
      const orderId = result.id || `ORD-${Date.now().toString().slice(-6)}`
      navigation.navigate("OrderSuccess", { orderId })
    } catch (error) {
      console.error("Checkout failed:", error)
      Alert.alert("Checkout Failed", "Unable to complete your order. Please try again.", [
        { text: "OK" },
      ])
    }
  }, [allDeliveryDatesSelected, completeCheckoutMutation, clearCart, navigation])

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
                            key={`${shopId}-${date.toISOString()}`}
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
        buttonText={completeCheckoutMutation.isPending ? "Placing Order..." : "Place Order"}
        disabled={!allDeliveryDatesSelected || completeCheckoutMutation.isPending || !hasCartItems}
        onButtonPress={handlePlaceOrder}
      />
    </View>
  )
}
