import React, { useMemo } from "react"
import { View, Text } from "react-native"
import { DayCard } from "./DayCard"
import { Shop } from "@/domains/data/products/types"
import { useCart } from "@/context/CartContext"

interface DeliveryContainerProps {
  shop: Shop
  shopId: string
}

export const DeliveryContainer: React.FC<DeliveryContainerProps> = ({ shop, shopId }) => {
  const { deliveryDates, selectDeliveryDate, clearDeliveryDate } = useCart()

  const selectedDate = deliveryDates[shopId]

  // Generate next 7 days with useMemo to prevent recreation
  const availableDates = useMemo(() => {
    const dates: Date[] = []
    const today = new Date()
    const todayTime = today.getTime()

    for (let i = 0; i < 7; i++) {
      const date = new Date(todayTime + i * 24 * 60 * 60 * 1000)
      dates.push(date)
    }

    return dates
  }, []) // Empty dependency array - only generate once

  // Day names for display
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDateSelect = (date: Date) => {
    if (selectedDate && selectedDate.getTime() === date.getTime()) {
      // If same date is clicked, clear it
      clearDeliveryDate(shopId)
    } else {
      // Select new date
      selectDeliveryDate(shopId, date)
    }
  }

  const getDayName = (date: Date) => {
    return dayNames[date.getDay()]
  }

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      {/* Shop Header */}
      <View className="flex-row items-center mb-4">
        <Text className="text-2xl mr-2">{shop.icon}</Text>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{shop.name}</Text>
          <Text className="text-sm text-gray-600">{shop.supplier}</Text>
        </View>

        {/* Selection Status */}
        {selectedDate && (
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-800 text-xs font-medium">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Delivery Date Selection */}
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-3">Select Delivery Date</Text>

        {/* Day Cards Row */}
        <View className="flex-row space-x-2">
          {availableDates.map((date) => (
            <DayCard
              key={date.getTime()}
              day={getDayName(date)}
              date={date}
              isSelected={selectedDate?.getTime() === date.getTime()}
              isAvailable={true} // All dates are available for now
              onSelect={handleDateSelect}
            />
          ))}
        </View>
      </View>

      {/* Instructions */}
      <Text className="text-xs text-gray-500 mt-3">
        {selectedDate
          ? `Delivery scheduled for ${selectedDate.toLocaleDateString()}`
          : "Please select a delivery date to continue"}
      </Text>
    </View>
  )
}
