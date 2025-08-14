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
  disabled?: boolean
}

export const CartFooter = ({
  totalItems,
  totalPrice,
  buttonText = "Go to Checkout",
  onButtonPress,
  disabled = false,
}: CartFooterProps) => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const { theme } = useAppTheme()

  return (
    <View
      className="px-xl py-xs pb-lg z-10"
      style={{
        backgroundColor: theme.colors.palette.neutral100,
        shadowColor: theme.colors.palette.neutral600,
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 12,
      }}
    >
      <View className="flex-col gap-xs items-center">
        {/* Summary - Two text elements with space-between */}
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center">
            <Text
              text={totalItems.toString()}
              size="sm"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="ml-xs"
            />
            <Text text=" Items" size="xs" style={{ color: theme.colors.textDim }} />
          </View>
          <Text
            text={`$${totalPrice.toFixed(2)}`}
            size="lg"
            weight="bold"
            style={{ color: theme.colors.text }}
          />
        </View>

        {/* Checkout Button - Full width */}
        <Button
          preset="primary"
          text={buttonText}
          disabled={disabled}
          onPress={onButtonPress || (() => navigation.navigate("Checkout"))}
          className="w-full"
          textStyle={{ fontWeight: "bold", fontSize: 16 }}
        />
      </View>
    </View>
  )
}
