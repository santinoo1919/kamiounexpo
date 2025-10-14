import React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface DayCardProps {
  date: Date
  isSelected: boolean
  onPress: () => void
}

export const DayCard: React.FC<DayCardProps> = ({ date, isSelected, onPress }) => {
  const { theme } = useAppTheme()

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
  const dayNumber = date.getDate()

  return (
    <TouchableOpacity
      className="w-20 h-24 rounded-lg border items-center justify-center"
      style={{
        backgroundColor: isSelected
          ? theme.colors.palette.primary600
          : theme.colors.palette.neutral100,
        borderColor: isSelected ? theme.colors.palette.primary600 : theme.colors.palette.neutral200,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        text={dayName}
        size="xs"
        style={{
          color: isSelected ? theme.colors.palette.neutral100 : theme.colors.palette.neutral600,
          marginBottom: 4,
        }}
      />
      <Text
        text={dayNumber.toString()}
        size="xl"
        weight="bold"
        style={{
          color: isSelected ? theme.colors.palette.neutral100 : theme.colors.palette.neutral600,
        }}
      />
    </TouchableOpacity>
  )
}
