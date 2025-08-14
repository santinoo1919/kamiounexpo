import React from "react"
import { View } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface ShopContainerProps {
  shop: {
    icon: string
    name: string
    supplier: string
    minCartAmount?: number
  }
  children: React.ReactNode
  deliveryStatus?: React.ReactNode
  cartInfo?: {
    itemCount: number
    amount: number
  }
}

export const ShopContainer: React.FC<ShopContainerProps> = ({
  shop,
  children,
  deliveryStatus,
  cartInfo,
}) => {
  const { theme } = useAppTheme()

  // Calculate minimum cart information
  const minAmount = shop.minCartAmount || 0
  const currentAmount = cartInfo?.amount || 0
  const remaining = Math.max(0, minAmount - currentAmount)
  const meetsMinimum = currentAmount >= minAmount

  return (
    <View className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Shop Header */}
      <View className="flex-row items-center p-sm" style={{ backgroundColor: "white" }}>
        <Text text={shop.icon} size="xl" className="mr-sm" style={{ color: theme.colors.text }} />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              text={shop.supplier}
              size="xs"
              weight="bold"
              style={{ color: theme.colors.text }}
            />
            {/* Delivery Status or Cart Info */}
            {deliveryStatus && (
              <View className="bg-blue-50 px-2 py-1 rounded border border-blue-200">
                {deliveryStatus}
              </View>
            )}
          </View>
          {/* Show items count + delivery date as subtitle for cart, or shop name for checkout */}
          {cartInfo ? (
            <View className="flex-row items-center">
              <Text
                text={`${cartInfo.itemCount} items`}
                size="xs"
                style={{ color: theme.colors.textDim }}
              />
              <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
              <Text text="Tomorrow" size="xs" style={{ color: theme.colors.palette.neutral500 }} />
            </View>
          ) : (
            <Text text={shop.name} size="sm" style={{ color: theme.colors.textDim }} />
          )}
        </View>
      </View>

      {/* Content */}
      <View className="px-md py-sm">{children}</View>
    </View>
  )
}
