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
  }, [])

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value * (1 + checkmarkBump.value * 0.2) }],
  }))

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }))

  const handleViewOrders = () => {
    ;(navigation as any).navigate("Main", { screen: "Orders" })
  }

  const handleBackToHome = () => {
    ;(navigation as any).navigate("Main", { screen: "Home" })
  }

  return (
    <View className="flex-1">
      {/* Content */}
      <View className="flex-1 justify-center items-center px-md">
        {/* Success Section */}
        <Animated.View style={cardAnimatedStyle}>
          <View className="items-center">
            {/* Success Icon */}
            <Animated.View
              className="w-16 h-16 rounded-full items-center justify-center mb-lg"
              style={[{ backgroundColor: theme.colors.palette.accent100 }, checkmarkAnimatedStyle]}
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
              className="mb-lg text-center"
            />

            {/* View Order Button */}
            <Button preset="secondary" text="View Order" onPress={handleViewOrders} />
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

export const OrderSuccessScreen = OrderSuccessScreenComponent
