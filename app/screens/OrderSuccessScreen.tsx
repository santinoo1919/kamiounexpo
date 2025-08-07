import React from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"

interface OrderSuccessScreenProps extends AppStackScreenProps<"OrderSuccess"> {}

const OrderSuccessScreenComponent = ({}: OrderSuccessScreenProps) => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useAppTheme()

  const orderId = route.params?.orderId || ""

  const handleViewOrders = () => {
    navigation.navigate("Orders")
  }

  const handleBackToHome = () => {
    navigation.navigate("Home")
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <Header title="Order Confirmed" />

      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="px-md py-lg">
          {/* Success Card */}
          <Card
            className="mb-lg"
            ContentComponent={
              <View className="items-center py-lg">
                {/* Success Icon */}
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-md"
                  style={{ backgroundColor: theme.colors.palette.accent100 }}
                >
                  <Text text="✓" size="xl" style={{ color: theme.colors.palette.accent600 }} />
                </View>

                {/* Success Message */}
                <Text
                  text="Order Confirmed!"
                  size="xl"
                  weight="bold"
                  style={{ color: theme.colors.text }}
                  className="mb-xs text-center"
                />

                <Text
                  text="Your order has been successfully placed and is being processed."
                  size="sm"
                  style={{ color: theme.colors.textDim }}
                  className="mb-md text-center"
                />

                {/* Order ID */}
                <View className="bg-neutral-100 px-md py-sm rounded-md">
                  <Text
                    text={`Order #${orderId}`}
                    size="sm"
                    weight="bold"
                    style={{ color: theme.colors.text }}
                  />
                </View>
              </View>
            }
          />

          {/* Action Buttons */}
          <View className="space-y-sm">
            <Button preset="primary" text="View Orders" onPress={handleViewOrders} />

            <Button preset="secondary" text="Back to Home" onPress={handleBackToHome} />
          </View>
        </View>
      </Screen>
    </View>
  )
}

export const OrderSuccessScreen = OrderSuccessScreenComponent
