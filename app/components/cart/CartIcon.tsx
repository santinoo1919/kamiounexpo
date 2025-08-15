import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface CartIconProps {
  count?: number
  onPress?: () => void
  size?: number
  iconColor?: string
}

export const CartIcon = ({ count = 0, onPress, size = 24, iconColor }: CartIconProps) => {
  const { theme } = useAppTheme()

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="relative items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Cart Icon */}
      <View className="items-center justify-center">
        <Ionicons
          name="cart-outline"
          size={20}
          color={iconColor || theme.colors.palette.primary600}
        />
      </View>

      {/* Cart Count Badge */}
      {count > 0 && (
        <View
          className="absolute -top-1 -right-1 rounded-full items-center justify-center min-w-5 h-5"
          style={{
            backgroundColor: theme.colors.palette.accent100,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
          }}
        >
          <Text
            text={count > 99 ? "99+" : count.toString()}
            size="xxs"
            style={{
              color: theme.colors.palette.primary600,
              fontWeight: "bold",
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  )
}
