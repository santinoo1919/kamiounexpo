import React, { useState } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { ListView } from "@/components/ListView"
import { OrderItem } from "@/components/orders/OrderItem"
import { useAppTheme } from "@/theme/context"

interface OrdersScreenProps extends AppStackScreenProps<"Orders"> {}

// Mock orders data
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-001",
    status: "confirmed",
    totalItems: 3,
    totalPrice: 45.99,
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    note: "Please deliver in the morning",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    items: [
      { productId: "1", name: "Organic Bananas", price: 2.99, quantity: 2 },
      { productId: "2", name: "Fresh Milk", price: 3.99, quantity: 1 },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    status: "delivered",
    totalItems: 2,
    totalPrice: 12.5,
    deliveryDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    note: "",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    items: [
      { productId: "3", name: "Whole Grain Bread", price: 4.5, quantity: 1 },
      { productId: "4", name: "Free Range Eggs", price: 8.0, quantity: 1 },
    ],
  },
]

const OrdersScreenComponent = ({}: OrdersScreenProps) => {
  const navigation = useNavigation()
  const { theme } = useAppTheme()
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const handleOrderPress = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <Header
        title="My Orders"
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="✕" size="md" />
          </TouchableOpacity>
        }
      />

      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="px-md">
          <ListView
            data={mockOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OrderItem
                order={item}
                isExpanded={expandedOrderId === item.id}
                onPress={() => handleOrderPress(item.id)}
              />
            )}
            estimatedItemSize={120}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </View>
      </Screen>
    </View>
  )
}

export const OrdersScreen = OrdersScreenComponent
