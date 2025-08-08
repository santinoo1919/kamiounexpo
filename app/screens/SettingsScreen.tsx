import React, { useState, useCallback, useMemo, useRef } from "react"
import { View } from "react-native"
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { ProfileInfoSection } from "@/components/profile"
import { useAppTheme } from "@/theme/context"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  shopType?: "individual" | "business"
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  vatNumber?: string
}

interface EditingField {
  label: string
  value: string
  placeholder?: string
  multiline?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  onSave: (value: string) => void
}

const SettingsScreenComponent = () => {
  const { theme } = useAppTheme()
  const [editingField, setEditingField] = useState<EditingField | null>(null)
  const [editValue, setEditValue] = useState("")

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["50%"], [])

  // Update edit value when editing field changes
  React.useEffect(() => {
    if (editingField) {
      setEditValue(editingField.value)
      bottomSheetRef.current?.expand()
    }
  }, [editingField])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setEditingField(null)
    }
  }, [])

  const handleSave = useCallback(() => {
    if (editingField) {
      editingField.onSave(editValue)
      setEditingField(null)
      bottomSheetRef.current?.close()
    }
  }, [editValue, editingField])

  const handleCancel = useCallback(() => {
    if (editingField) {
      setEditValue(editingField.value)
      setEditingField(null)
      bottomSheetRef.current?.close()
    }
  }, [editingField])

  const handleEditField = useCallback(
    (field: Omit<EditingField, "onSave">, onSave: (value: string) => void) => {
      setEditingField({ ...field, onSave })
    },
    [],
  )

  // Mock user data - in real app this would come from auth context
  const [user, setUser] = useState<User>({
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890",
    shopType: "individual",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    vatNumber: "VAT123456789",
  })

  const handleUpdateProfile = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }))
    // In real app, this would call an API to update the profile
    console.log("Profile updated:", updates)
  }

  const handleLogout = () => {
    // In real app, this would clear auth tokens and navigate to login
    console.log("Logout pressed")
  }

  const handleDeleteAccount = () => {
    // In real app, this would show a confirmation dialog
    console.log("Delete account pressed")
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <Header title="Settings" />

      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="px-md py-lg">
          {/* Profile Information */}
          <ProfileInfoSection
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onEditField={handleEditField}
          />

          {/* Account Actions */}
          <View className="space-y-md">
            <Button preset="secondary" text="Logout" onPress={handleLogout} className="w-full" />

            <Button
              preset="secondary"
              text="Delete Account"
              onPress={handleDeleteAccount}
              className="w-full mt-md"
              style={{
                backgroundColor: theme.colors.error,
                borderColor: theme.colors.error,
              }}
            />
          </View>
        </View>
      </Screen>

      {/* Bottom Sheet for Editing - Rendered at screen level */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: theme.colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.palette.neutral300,
        }}
      >
        <BottomSheetView className="flex-1 px-lg py-md">
          <Text
            text={`Edit ${editingField?.label || ""}`}
            size="lg"
            weight="bold"
            style={{ color: theme.colors.text }}
            className="mb-md"
          />

          <BottomSheetTextInput
            value={editValue}
            onChangeText={setEditValue}
            placeholder={
              editingField?.placeholder || `Enter ${editingField?.label?.toLowerCase() || ""}`
            }
            multiline={editingField?.multiline}
            keyboardType={editingField?.keyboardType}
            className="border rounded-md p-md mb-md"
            style={{
              borderColor: theme.colors.palette.neutral300,
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
              minHeight: editingField?.multiline ? 80 : 48,
            }}
          />

          <View className="flex-row space-x-2">
            <Button preset="secondary" text="Cancel" onPress={handleCancel} className="flex-1" />
            <Button preset="primary" text="Save" onPress={handleSave} className="flex-1" />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export const SettingsScreen = SettingsScreenComponent
