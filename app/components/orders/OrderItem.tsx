import React from "react"
import { View } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { Order, OrderItem as OrderItemType } from "@/domains/data/orders/types"

interface OrderItemProps {
  order: Order
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const { theme } = useAppTheme()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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
        return theme.colors.palette.accent100
      case "shipped":
        return theme.colors.palette.primary600
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
      case "shipped":
        return "Shipped"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const totalItems = order.items.reduce(
    (sum: number, item: OrderItemType) => sum + item.quantity,
    0,
  )

  return (
    <Card
      className="mb-sm"
      ContentComponent={
        <View className="p-md">
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
                text={`${totalItems} items • $${order.total.toFixed(2)}`}
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
            </View>
          </View>

          {/* Delivery Date */}
          <View className="flex-row items-center mb-sm">
            <Text text="📅" size="xs" className="mr-xs" />
            <Text
              text={`Delivery: ${formatDate(order.estimatedDelivery)}`}
              size="xs"
              style={{ color: theme.colors.textDim }}
            />
          </View>

          {/* Order Items */}
          <View className="mb-sm">
            <Text
              text="Items:"
              size="sm"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="mb-xs"
            />
            {order.items && order.items.length > 0 ? (
              order.items.map((item: OrderItemType, index: number) => (
                <View key={index} className="flex-row justify-between items-center mb-xs py-xxs">
                  <View className="flex-1">
                    <Text
                      text={`${item.productName} x${item.quantity}`}
                      size="xs"
                      weight="medium"
                      style={{ color: theme.colors.text }}
                    />
                  </View>
                  <Text
                    text={`$${item.total.toFixed(2)}`}
                    size="xs"
                    weight="bold"
                    style={{ color: theme.colors.palette.primary600 }}
                  />
                </View>
              ))
            ) : (
              <Text text="No items found" size="xs" style={{ color: theme.colors.textDim }} />
            )}
          </View>

          {/* Order Summary */}
          <View className="mb-sm">
            <Text
              text="Order Summary:"
              size="sm"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="mb-xs"
            />
            <View className="space-y-xxs">
              <View className="flex-row justify-between">
                <Text text="Subtotal:" size="xs" style={{ color: theme.colors.textDim }} />
                <Text
                  text={`$${order.subtotal.toFixed(2)}`}
                  size="xs"
                  style={{ color: theme.colors.text }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text text="Tax:" size="xs" style={{ color: theme.colors.textDim }} />
                <Text
                  text={`$${order.tax.toFixed(2)}`}
                  size="xs"
                  style={{ color: theme.colors.text }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text text="Shipping:" size="xs" style={{ color: theme.colors.textDim }} />
                <Text
                  text={`$${order.shipping.toFixed(2)}`}
                  size="xs"
                  style={{ color: theme.colors.text }}
                />
              </View>
              <View className="flex-row justify-between pt-xxs border-t border-neutral-200">
                <Text text="Total:" size="xs" weight="bold" style={{ color: theme.colors.text }} />
                <Text
                  text={`$${order.total.toFixed(2)}`}
                  size="xs"
                  weight="bold"
                  style={{ color: theme.colors.palette.primary600 }}
                />
              </View>
            </View>
          </View>

          {/* Order Date */}
          <View>
            <Text
              text={`Ordered: ${formatDate(order.createdAt)}`}
              size="xs"
              style={{ color: theme.colors.textDim }}
            />
          </View>
        </View>
      }
    />
  )
}
