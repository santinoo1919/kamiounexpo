import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface ShopContainerProps {
  shop: {
    icon: string
    name: string
    supplier: string
  }
  children: React.ReactNode
  deliveryStatus?: React.ReactNode
  cartInfo?: {
    itemCount: number
    amount: number
  }
  onClearAll?: () => void
}

export const ShopContainer: React.FC<ShopContainerProps> = ({
  shop,
  children,
  deliveryStatus,
  cartInfo,
  onClearAll,
}) => {
  const { theme } = useAppTheme()
  return (
    <View className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Shop Header */}
      <View
        className="flex-row items-center p-sm"
        style={{ backgroundColor: theme.colors.palette.neutral100 }}
      >
        <Text text={shop.icon} size="xl" className="mr-sm" />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text text={shop.supplier} size="sm" weight="bold" />
            {/* Delivery Status or Cart Info */}
            {deliveryStatus && (
              <View className="bg-blue-50 px-2 py-1 rounded border border-blue-200">
                {deliveryStatus}
              </View>
            )}
            {cartInfo && onClearAll && (
              <TouchableOpacity
                onPress={onClearAll}
                className="px-2 py-1 bg-red-50 rounded border border-red-100"
              >
                <Text text="Clear All" size="xs" className="text-red-600" />
              </TouchableOpacity>
            )}
          </View>
          {/* Show items count + amount as subtitle for cart, or shop name for checkout */}
          {cartInfo ? (
            <View className="flex-row items-center">
              <Text text={`${cartInfo.itemCount} items`} size="xs" className="text-gray-600" />
              <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
              <Text text={`$${cartInfo.amount.toFixed(2)}`} size="xs" className="text-gray-600" />
            </View>
          ) : (
            <Text text={shop.name} size="sm" className="text-gray-600" />
          )}
        </View>
      </View>

      {/* Content */}
      <View className="px-md py-sm">{children}</View>
    </View>
  )
}
