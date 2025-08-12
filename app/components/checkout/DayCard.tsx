import React from "react"
import { TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface DayCardProps {
  day: string
  date: Date
  isSelected: boolean
  isAvailable: boolean
  onSelect: (date: Date) => void
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  date,
  isSelected,
  isAvailable,
  onSelect,
}) => {
  const dayNumber = date.getDate()
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

  const handlePress = () => {
    if (isAvailable && !isPast) {
      onSelect(date)
    }
  }

  const getCardStyle = () => {
    if (isPast) {
      return "bg-gray-100 opacity-50"
    }
    if (isSelected) {
      return "bg-blue-500 border-blue-600"
    }
    if (isAvailable) {
      return "bg-white border-gray-200 hover:border-blue-300"
    }
    return "bg-gray-100 border-gray-200"
  }

  const getTextStyle = () => {
    if (isPast) {
      return "text-gray-400"
    }
    if (isSelected) {
      return "text-white"
    }
    return "text-gray-700"
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isPast || !isAvailable}
      className={`w-16 h-20 rounded-lg border-2 items-center justify-center ${getCardStyle()}`}
    >
      {/* Day name (small text) */}
      <Text className={`text-xs font-medium mb-1 ${getTextStyle()}`}>{day}</Text>

      {/* Day number (big text) */}
      <Text className={`text-xl font-bold ${getTextStyle()}`}>{dayNumber}</Text>

      {/* Selection indicator */}
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={16}
          color="white"
          className="absolute top-1 right-1"
        />
      )}
    </TouchableOpacity>
  )
}
