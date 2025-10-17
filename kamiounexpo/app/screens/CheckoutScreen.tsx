import React from "react"
import { View, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { CartFooter } from "@/components/cart/CartFooter"
import { ShopContainer } from "@/components/checkout/ShopContainer"
import { AddressSelector } from "@/components/checkout/AddressSelector"
import { ShippingSelector } from "@/components/checkout/ShippingSelector"
import { useCart } from "@/stores/cartStore"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useCheckout } from "@/hooks/useCheckout"
import { useAppTheme } from "@/theme/context"

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const { theme } = useAppTheme()

  const { items, totalPrice, totalItems } = useCart()
  const {
    selectedAddress,
    selectedShippingOption,
    deliveryComment,
    hasCartItems,
    isAddressSelected,
    isShippingSelected,
    canProceed,
    isProcessing,
    handleAddressSelect,
    handleShippingOptionSelect,
    handleDeliveryCommentChange,
    handlePlaceOrder,
  } = useCheckout()

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

  // Handle checkout completion
  const onCheckoutComplete = React.useCallback(async () => {
    try {
      const orderId = await handlePlaceOrder()
      navigation.navigate("OrderSuccess", { orderId })
    } catch (error) {
      // Error already handled in useCheckout
    }
  }, [handlePlaceOrder, navigation])

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
        {/* Address Selection */}
        <View className="mb-lg">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</Text>
          <AddressSelector
            selectedAddress={selectedAddress}
            onAddressSelect={handleAddressSelect}
            onError={(message) => Alert.alert("Error", message)}
          />
        </View>

        {/* Address Selection Validation */}
        {!isAddressSelected && hasCartItems && (
          <View className="mb-md">
            <Text
              text="Please select a delivery address to continue"
              size="xs"
              className="text-red-600 text-center"
            />
          </View>
        )}

        {/* Shipping Options */}
        <View className="mb-lg">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Shipping Options</Text>
          <ShippingSelector
            selectedOption={selectedShippingOption}
            onOptionSelect={handleShippingOptionSelect}
            onError={(message) => Alert.alert("Error", message)}
          />
        </View>

        {/* Shipping Selection Validation */}
        {!isShippingSelected && hasCartItems && (
          <View className="mb-md">
            <Text
              text="Please select a shipping option to continue"
              size="xs"
              className="text-red-600 text-center"
            />
          </View>
        )}

        {/* Delivery Comment */}
        <View className="mb-lg">
          <Text text="Delivery Instructions" preset="subheading2" className="mb-sm" />
          <View className="h-32 w-full rounded-lg">
            <TextField
              value={deliveryComment}
              onChangeText={handleDeliveryCommentChange}
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
      </ScrollView>

      {/* Sticky Footer outside ScrollView */}
      <CartFooter
        totalItems={totalItems}
        totalPrice={totalPrice}
        buttonText={isProcessing ? "Placing Order..." : "Place Order"}
        disabled={!canProceed || isProcessing}
        onButtonPress={onCheckoutComplete}
      />
    </View>
  )
}
