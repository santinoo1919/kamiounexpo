import React from "react"
import { View } from "react-native"
import { Text } from "@/components/Text"
import { AutoImage } from "@/components/AutoImage"
import { useAppTheme } from "@/theme/context"
import { Order, OrderItem } from "@/domains/data/orders/types"
import { Ionicons } from "@expo/vector-icons"

interface OrderCardProps {
  order: Order
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "#10B981" // green
    case "shipped":
      return "#3B82F6" // blue
    case "processing":
      return "#F59E0B" // amber
    case "pending":
      return "#6B7280" // gray
    default:
      return "#6B7280"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return "checkmark-circle"
    case "shipped":
      return "car"
    case "processing":
      return "time"
    case "pending":
      return "hourglass"
    default:
      return "help-circle"
  }
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { theme } = useAppTheme()
  const statusColor = getStatusColor(order.status)
  const statusIcon = getStatusIcon(order.status)

  // Check if order has items from multiple shops
  const hasMultipleShops = order.items.some(
    (item) => item.supplier && item.supplier !== order.items[0]?.supplier,
  )

  return (
    <View className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-md">
      {/* Order Header */}
      <View
        className="flex-row items-center p-sm"
        style={{ backgroundColor: theme.colors.palette.neutral100 }}
      >
        {/* Shop Icon */}
        <View className="w-10 h-10 bg-gray-200 rounded-full mr-sm justify-center items-center">
          <Ionicons name="storefront" size={20} color="#6B7280" />
        </View>

        {/* Shop Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              text={hasMultipleShops ? "Multiple Shops" : "Kamioun Market"}
              size="sm"
              weight="bold"
            />
            {/* Order Status Icon */}
            <View className="flex-row items-center">
              <Ionicons name={statusIcon} size={16} color={statusColor} />
              <Text
                text={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                size="xs"
                style={{ color: statusColor }}
                className="ml-1 font-medium"
              />
            </View>
          </View>

          {/* Order Number + Items Count */}
          <View className="flex-row items-center mt-1">
            <Text text={order.orderNumber} size="xs" className="text-gray-600" />
            <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
            <Text text={`${order.items.length} items`} size="xs" className="text-blue-600" />
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View className="px-md py-sm">
        {order.items.map((item: OrderItem, index: number) => (
          <View key={item.id}>
            {/* Supplier Tag + Delivery Status */}
            <View className="flex-row items-center justify-between mb-xs">
              {item.supplier && (
                <View className="bg-blue-50 px-2 py-1 rounded">
                  <Text
                    text={item.supplier}
                    size="xxs"
                    className="text-blue-600 font-medium text-center"
                  />
                </View>
              )}
              {/* Individual Item Delivery Status */}
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text
                  text={new Date(order.estimatedDelivery).toLocaleDateString()}
                  size="xxs"
                  className="text-gray-600 ml-1"
                />
              </View>
            </View>

            {/* Item Content */}
            <View className="flex-row items-start align-middle border-b last:border-b-0 py-sm">
              {/* Product Image */}
              <View className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg mr-sm justify-center items-center overflow-hidden">
                <AutoImage
                  source={{ uri: item.productImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Product Info */}
              <View className="flex-1 mr-sm">
                <Text text={item.productName} size="xs" weight="medium" className="mb-1" />
                <View className="flex-row items-center">
                  <Text text={`$${item.price.toFixed(2)}`} size="xs" className="text-gray-500" />
                  <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                  <Text text={`Qty: ${item.quantity}`} size="xs" className="text-gray-600" />
                </View>
              </View>

              {/* Right Side: Item Total */}
              <View className="items-end">
                {/* Item Total */}
                <Text text={`$${item.total.toFixed(2)}`} size="xs" weight="medium" />
              </View>
            </View>
          </View>
        ))}

        {/* Order Summary Footer */}
        <View className="mt-sm pt-sm border-t border-gray-100">
          <View className="flex-row justify-between items-center mb-xs">
            <Text text="Subtotal:" size="xs" className="text-gray-600" />
            <Text text={`$${order.subtotal.toFixed(2)}`} size="xs" weight="medium" />
          </View>

          <View className="flex-row justify-between items-center mb-xs">
            <Text text="Tax:" size="xs" className="text-gray-600" />
            <Text text={`$${order.tax.toFixed(2)}`} size="xs" weight="medium" />
          </View>

          <View className="flex-row justify-between items-center mb-xs">
            <Text text="Shipping:" size="xs" className="text-gray-600" />
            <Text text={`$${order.shipping.toFixed(2)}`} size="xs" weight="medium" />
          </View>

          <View className="flex-row justify-between items-center pt-xs border-t border-gray-100">
            <Text text="Total:" weight="bold" />
            <Text text={`$${order.total.toFixed(2)}`} weight="bold" />
          </View>
        </View>
      </View>
    </View>
  )
}
