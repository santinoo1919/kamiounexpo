import React from "react"
import { View, RefreshControl } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { ListView } from "@/components/ListView"
import { OrderCard } from "@/components/orders/OrderCard"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { useOrdersQuery } from "@/domains/data/orders/hooks"
import { useAuth } from "@/stores/authStore"

const OrdersScreenComponent = () => {
  const { theme } = useAppTheme()
  const { token, isAuthenticated } = useAuth()
  const { data: orders, isLoading, error, refetch } = useOrdersQuery(token)

  if (!isAuthenticated) {
    return (
      <View className="flex-1">
        <Header title="My Orders" />
        <Screen preset="scroll" className="flex-1">
          <View className="px-md py-lg">
            <Text text="Please log in to view your orders" className="text-center text-gray-600" />
          </View>
        </Screen>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1">
        <Header title="My Orders" />
        <Screen preset="scroll" className="flex-1">
          <View className="px-md py-lg">
            <Text text="Loading orders..." className="text-center text-gray-600" />
          </View>
        </Screen>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1">
        <Header title="My Orders" />
        <Screen preset="scroll" className="flex-1">
          <View className="px-md py-lg">
            <Text text="Error loading orders" className="text-center text-red-600" />
          </View>
        </Screen>
      </View>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1">
        <Header title="My Orders" />
        <Screen preset="scroll" className="flex-1">
          <View className="px-md py-lg">
            <Text text="No orders found" className="text-center text-gray-600" />
            <Text
              text="Your orders will appear here once you make a purchase"
              className="text-center text-gray-500 mt-2"
            />
          </View>
        </Screen>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <Header title="My Orders" />

      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="px-md">
          <ListView
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <OrderCard order={item} />}
            estimatedItemSize={400}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                tintColor={theme.colors.primary}
              />
            }
          />
        </View>
      </Screen>
    </View>
  )
}

export const OrdersScreen = OrdersScreenComponent
