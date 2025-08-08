import React, { useState } from "react"
import { View, TouchableOpacity, TextInput, Modal } from "react-native"
import { ListItem } from "@/components/ListItem"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"

interface ProfileInfoItemProps {
  label: string
  value: string
  placeholder?: string
  onSave: (value: string) => void
  icon?: string
  multiline?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
}

export const ProfileInfoItem = ({
  label,
  value,
  placeholder,
  onSave,
  icon = "✏️",
  multiline = false,
  keyboardType = "default",
}: ProfileInfoItemProps) => {
  const { theme } = useAppTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleEdit = () => {
    setEditValue(value)
    setIsEditing(true)
  }

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const displayValue = value || "Not set"

  return (
    <>
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

      {/* Edit Modal */}
      <Modal visible={isEditing} transparent animationType="slide" onRequestClose={handleCancel}>
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View
            className="bg-white rounded-t-lg p-lg"
            style={{ backgroundColor: theme.colors.background }}
          >
            <Text
              text={`Edit ${label}`}
              size="lg"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="mb-md"
            />

            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              multiline={multiline}
              keyboardType={keyboardType}
              className="border border-gray-300 rounded-md p-md mb-md"
              style={{
                borderColor: theme.colors.palette.neutral300,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              }}
            />

            <View className="flex-row justify-end space-x-2">
              <Button
                preset="secondary"
                text="Cancel"
                onPress={handleCancel}
                className="flex-1 mr-xs"
              />
              <Button preset="primary" text="Save" onPress={handleSave} className="flex-1 ml-xs" />
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
