import React from "react"
import { View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"

interface CartFooterProps {
  totalItems: number
  totalPrice: number
  buttonText?: string
  onButtonPress?: () => void
}

export const CartFooter = ({
  totalItems,
  totalPrice,
  buttonText = "Checkout",
  onButtonPress,
}: CartFooterProps) => {
  const navigation = useNavigation<AppStackScreenProps<"Cart">["navigation"]>()
  const { theme } = useAppTheme()

  return (
    <View
      className="px-md py-sm border-t border-neutral-200"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="flex-row items-center justify-between">
        {/* Summary */}
        <View>
          <View className="flex-row items-center mb-xxs">
            <Text text="Total Items:" size="sm" style={{ color: theme.colors.textDim }} />
            <Text
              text={totalItems.toString()}
              size="sm"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="ml-xs"
            />
          </View>
          <View className="flex-row items-center">
            <Text
              text="Total Price:"
              size="lg"
              weight="bold"
              style={{ color: theme.colors.text }}
            />
            <Text
              text={`$${totalPrice.toFixed(2)}`}
              size="lg"
              weight="bold"
              style={{ color: theme.colors.palette.primary600 }}
              className="ml-xs"
            />
          </View>
        </View>

        {/* Checkout Button */}
        <Button
          preset="primary"
          text={buttonText}
          onPress={onButtonPress || (() => navigation.navigate("Checkout"))}
          className="flex-1 ml-md"
        />
      </View>
    </View>
  )
}
