import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { useAppTheme } from "@/theme/context"

interface OrderItemProps {
  order: {
    id: string
    orderNumber: string
    status: "confirmed" | "delivered" | "cancelled"
    totalItems: number
    totalPrice: number
    deliveryDate: Date
    note: string
    createdAt: Date
    items: Array<{
      productId: string
      name: string
      price: number
      quantity: number
    }>
  }
  isExpanded: boolean
  onPress: () => void
}

export const OrderItem = ({ order, isExpanded, onPress }: OrderItemProps) => {
  const { theme } = useAppTheme()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return theme.colors.palette.primary600
      case "delivered":
        return theme.colors.palette.accent600
      case "cancelled":
        return theme.colors.error
      default:
        return theme.colors.textDim
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <Card
      className="mb-sm"
      ContentComponent={
        <TouchableOpacity onPress={onPress} className="p-md">
          {/* Header Row */}
          <View className="flex-row items-center justify-between mb-sm">
            <View className="flex-1">
              <Text
                text={order.orderNumber}
                size="sm"
                weight="bold"
                style={{ color: theme.colors.text }}
                className="mb-xxs"
              />
              <Text
                text={`${order.totalItems} items • $${order.totalPrice.toFixed(2)}`}
                size="xs"
                style={{ color: theme.colors.textDim }}
              />
            </View>

            <View className="flex-row items-center">
              <View
                className="px-xs py-xxs rounded-sm mr-sm"
                style={{ backgroundColor: getStatusColor(order.status) + "20" }}
              >
                <Text
                  text={getStatusText(order.status)}
                  size="xxs"
                  weight="bold"
                  style={{ color: getStatusColor(order.status) }}
                />
              </View>

              <Icon
                icon="caretRight"
                size={16}
                color={theme.colors.textDim}
                style={{
                  transform: [{ rotate: isExpanded ? "90deg" : "0deg" }],
                }}
              />
            </View>
          </View>

          {/* Delivery Date */}
          <View className="flex-row items-center mb-sm">
            <Text text="📅" size="xs" className="mr-xs" />
            <Text
              text={`Delivery: ${formatDate(order.deliveryDate)}`}
              size="xs"
              style={{ color: theme.colors.textDim }}
            />
          </View>

          {/* Expanded Details */}
          {isExpanded && (
            <View className="border-t border-neutral-200 pt-sm mt-sm">
              {/* Order Items */}
              <View className="mb-sm">
                <Text
                  text="Items:"
                  size="sm"
                  weight="bold"
                  style={{ color: theme.colors.text }}
                  className="mb-xs"
                />
                {order.items.map((item, index) => (
                  <View key={index} className="flex-row justify-between mb-xxs">
                    <Text
                      text={`${item.name} x${item.quantity}`}
                      size="xs"
                      style={{ color: theme.colors.text }}
                    />
                    <Text
                      text={`$${(item.price * item.quantity).toFixed(2)}`}
                      size="xs"
                      style={{ color: theme.colors.text }}
                    />
                  </View>
                ))}
              </View>

              {/* Note */}
              {order.note && (
                <View className="mb-sm">
                  <Text
                    text="Note:"
                    size="sm"
                    weight="bold"
                    style={{ color: theme.colors.text }}
                    className="mb-xs"
                  />
                  <Text text={order.note} size="xs" style={{ color: theme.colors.textDim }} />
                </View>
              )}

              {/* Order Date */}
              <View>
                <Text
                  text={`Ordered: ${formatDate(order.createdAt)}`}
                  size="xs"
                  style={{ color: theme.colors.textDim }}
                />
              </View>
            </View>
          )}
        </TouchableOpacity>
      }
    />
  )
}
