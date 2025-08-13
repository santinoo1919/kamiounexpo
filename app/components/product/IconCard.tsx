import React from "react"
import { View, TouchableOpacity } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface IconCardProps {
  icon: string
  name: string
  isSelected?: boolean
  onPress?: () => void
}

export const IconCard = ({ icon, name, isSelected = false, onPress }: IconCardProps) => {
  const { theme } = useAppTheme()

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="mr-xs px-md py-xs rounded-full flex-row items-center"
      style={{
        backgroundColor: isSelected ? theme.colors.palette.primary300 : "transparent",
      }}
    >
      <Text text={icon} size="sm" className="mr-1" />
      <Text
        text={name}
        size="xs"
        style={{
          color: isSelected ? theme.colors.palette.neutral100 : theme.colors.palette.neutral500,
          fontWeight: isSelected ? "bold" : "normal",
        }}
      />
    </TouchableOpacity>
  )
}
