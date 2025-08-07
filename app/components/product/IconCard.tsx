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
    <TouchableOpacity onPress={handlePress} className="items-center mr-lg">
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-xs"
        style={{
          backgroundColor: isSelected
            ? theme.colors.palette.primary600
            : theme.colors.palette.neutral200,
        }}
      >
        <Text text={icon} size="lg" />
      </View>
      <Text
        text={name}
        size="xs"
        className="text-center w-12"
        style={{
          fontWeight: isSelected ? "bold" : "normal",
          color: isSelected ? theme.colors.palette.primary600 : theme.colors.text,
        }}
      />
    </TouchableOpacity>
  )
}
