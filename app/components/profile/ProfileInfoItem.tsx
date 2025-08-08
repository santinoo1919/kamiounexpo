import React from "react"
import { View, TouchableOpacity } from "react-native"
import { ListItem } from "@/components/ListItem"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface ProfileInfoItemProps {
  label: string
  value: string
  placeholder?: string
  onSave: (value: string) => void
  icon?: string
  multiline?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  onEditField: (
    field: {
      label: string
      value: string
      placeholder?: string
      multiline?: boolean
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
    },
    onSave: (value: string) => void,
  ) => void
}

export const ProfileInfoItem = ({
  label,
  value,
  placeholder,
  onSave,
  icon = "✏️",
  multiline = false,
  keyboardType = "default",
  onEditField,
}: ProfileInfoItemProps) => {
  const { theme } = useAppTheme()

  const handleEdit = () => {
    onEditField(
      {
        label,
        value,
        placeholder,
        multiline,
        keyboardType,
      },
      onSave,
    )
  }

  const displayValue = value || "Not set"

  return (
    <ListItem
      text={label}
      RightComponent={
        <View className="flex-1 flex-row items-center justify-end">
          <Text
            text={displayValue}
            size="sm"
            style={{ color: theme.colors.textDim }}
            className="flex-1 text-right mr-sm"
            numberOfLines={multiline ? 3 : 1}
          />
          <TouchableOpacity onPress={handleEdit} className="p-xs">
            <Text text={icon} size="sm" />
          </TouchableOpacity>
        </View>
      }
      bottomSeparator
    />
  )
}
