import React, { useRef, useEffect } from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  runOnJS,
} from "react-native-reanimated"

interface OrderSuccessScreenProps extends AppStackScreenProps<"OrderSuccess"> {}

const OrderSuccessScreenComponent = ({}: OrderSuccessScreenProps) => {
  const navigation = useNavigation()
  const route = useRoute()
  const { theme } = useAppTheme()

  // Animation values
  const checkmarkScale = useSharedValue(0)
  const checkmarkOpacity = useSharedValue(0)
  const checkmarkBump = useSharedValue(0)
  const cardTranslateY = useSharedValue(50)
  const cardOpacity = useSharedValue(0)
  const orderIdScale = useSharedValue(0.8)
  const orderIdOpacity = useSharedValue(0)

  const orderId = route.params?.orderId || ""

  useEffect(() => {
    // Animate checkmark with bump effect
    checkmarkOpacity.value = withTiming(1, { duration: 600 })
    checkmarkScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 150 }))

    // Add bump animation after scale animation
    checkmarkBump.value = withDelay(
      800,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 }),
      ),
    )

    // Animate card
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 800 }))
    cardTranslateY.value = withDelay(300, withSpring(0, { damping: 20, stiffness: 100 }))

    // Animate order ID
    orderIdOpacity.value = withDelay(600, withTiming(1, { duration: 600 }))
    orderIdScale.value = withDelay(600, withSpring(1, { damping: 12, stiffness: 120 }))
  }, [])

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value * (1 + checkmarkBump.value * 0.2) }],
  }))

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }))

  const orderIdAnimatedStyle = useAnimatedStyle(() => ({
    opacity: orderIdOpacity.value,
    transform: [{ scale: orderIdScale.value }],
  }))

  const handleViewOrders = () => {
    navigation.navigate("Main", { screen: "Orders" })
  }

  const handleBackToHome = () => {
    navigation.navigate("Main", { screen: "Home" })
  }

  return (
    <View className="flex-1">
      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="flex-1 justify-center px-md py-lg pb-32">
          {/* Success Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="items-center py-lg">
              {/* Success Icon */}
              <Animated.View
                className="w-16 h-16 rounded-full items-center justify-center mb-md"
                style={[
                  { backgroundColor: theme.colors.palette.accent100 },
                  checkmarkAnimatedStyle,
                ]}
              >
                <Text text="✓" size="xl" style={{ color: theme.colors.palette.accent500 }} />
              </Animated.View>

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
              <Animated.View
                className="bg-neutral-100 px-md py-sm rounded-md"
                style={orderIdAnimatedStyle}
              >
                <Text
                  text={`Order #${orderId}`}
                  size="sm"
                  weight="bold"
                  style={{ color: theme.colors.text }}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </Screen>

      {/* Sticky Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 p-md bg-white border-t border-gray-200">
        <Button preset="primary" text="View Order" onPress={handleViewOrders} />
      </View>
    </View>
  )
}

export const OrderSuccessScreen = OrderSuccessScreenComponent
