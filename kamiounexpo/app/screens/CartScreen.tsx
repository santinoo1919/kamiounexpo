import React from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { VendorSubCart } from "@/components/cart/VendorSubCart"
import { CartFooter } from "@/components/cart/CartFooter"
import { ShopContainer } from "@/components/checkout/ShopContainer"

import { useCart } from "@/stores/cartStore"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"

export const CartScreen = () => {
  const navigation = useNavigation<AppStackScreenProps<"Cart">["navigation"]>()
  const { theme } = useAppTheme()
  const { items, totalPrice, totalItems, removeFromCart } = useCart()

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

  if (totalItems === 0) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]}>
        <Header
          title="Cart"
          LeftActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="←" size="md" style={{ color: theme.colors.palette.neutral600 }} />
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
    <View className="flex-1">
      <Header
        title="Cart"
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
        {/* Vendor Sub-Carts */}
        {Object.entries(cartByShopWithDetails).map(([shopId, shopData]) => (
          <View key={shopId} className="mb-sm">
            <ShopContainer
              shop={shopData.shop}
              cartInfo={{
                itemCount: shopData.items.length,
                amount: shopData.subtotal,
              }}
            >
              <VendorSubCart
                shop={shopData.shop}
                items={shopData.items}
                minCartAmount={shopData.minAmount}
                subtotal={shopData.subtotal}
              />
            </ShopContainer>
          </View>
        ))}
      </ScrollView>

      {/* Footer at bottom */}
      <CartFooter
        totalItems={totalItems}
        totalPrice={totalPrice}
        buttonText="Go to Checkout"
        disabled={!allShopsMeetMinimum}
        onButtonPress={() => {
          if (allShopsMeetMinimum) {
            navigation.navigate("Checkout")
          }
        }}
      />
    </View>
  )
}
