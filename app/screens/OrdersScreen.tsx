import React from "react"
import { View } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { ListView } from "@/components/ListView"
import { OrderItem } from "@/components/orders/OrderItem"
import { useAppTheme } from "@/theme/context"
import { MOCK_ORDERS } from "@/domains/data/mockData/orders"

const OrdersScreenComponent = () => {
  const { theme } = useAppTheme()

  return (
    <View className="flex-1">
      {/* Header */}
      <Header title="My Orders" />

      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="px-md">
          <ListView
            data={MOCK_ORDERS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <OrderItem order={item} />}
            estimatedItemSize={300}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Screen>
    </View>
  )
}

export const OrdersScreen = OrdersScreenComponent
