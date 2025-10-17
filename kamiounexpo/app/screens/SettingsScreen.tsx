import React, { useState, useCallback, useEffect } from "react"
import { View, Alert } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { ProfileInfoSection } from "@/components/profile"
import { BottomSheet } from "@/components/BottomSheet"
import { EditForm } from "@/components/forms/EditForm"
import { useAppTheme } from "@/theme/context"
import { useAuth as useAuthContext } from "@/context/AuthContext"
import { useAuth as useAuthStore } from "@/stores/authStore"
import type { Customer, CustomerAddress } from "@/domains/data/auth/types"
import { Keyboard } from "react-native"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  companyName?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
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
  const { isAuthenticated } = useAuthContext() // For navigation
  const { customer, updateCustomer, logout, isLoading } = useAuthStore() // For business logic
  const [editingField, setEditingField] = useState<EditingField | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isSheetVisible, setIsSheetVisible] = useState(false)

  // Update edit value when editing field changes
  React.useEffect(() => {
    if (editingField) {
      setEditValue(editingField.value)
      setIsSheetVisible(true)
    }
  }, [editingField])

  const handleSave = useCallback(() => {
    if (editingField) {
      editingField.onSave(editValue)
      setEditingField(null)
      setIsSheetVisible(false)
      Keyboard.dismiss()
    }
  }, [editValue, editingField])

  const handleCancel = useCallback(() => {
    if (editingField) {
      setEditValue(editingField.value)
      setEditingField(null)
      setIsSheetVisible(false)
      Keyboard.dismiss()
    }
  }, [editingField])

  const handleEditField = useCallback(
    (field: Omit<EditingField, "onSave">, onSave: (value: string) => void) => {
      setEditingField({ ...field, onSave })
    },
    [],
  )

  const handleCloseSheet = useCallback(() => {
    setEditingField(null)
    setIsSheetVisible(false)
  }, [])

  // Helper function to get main address from customer
  const getMainAddress = (customer: Customer) => {
    const mainAddress =
      customer.addresses?.find(
        (addr: CustomerAddress) =>
          addr.id === customer.default_shipping_address_id ||
          addr.id === customer.default_billing_address_id,
      ) || customer.addresses?.[0]

    return mainAddress
      ? {
          street: mainAddress.address_1 || "",
          city: mainAddress.city || "",
          state: mainAddress.province || "",
          zipCode: mainAddress.postal_code || "",
          country: mainAddress.country_code || "",
        }
      : {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        }
  }

  // Convert Medusa customer to UI user format
  const user: User | null = customer
    ? {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone || "",
        companyName: customer.company_name || "",
        address: getMainAddress(customer),
      }
    : null

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!customer) {
      Alert.alert("Error", "No customer data available")
      return
    }

    try {
      // Convert UI updates to Medusa format
      const medusaUpdates: any = {}

      if (updates.firstName) medusaUpdates.first_name = updates.firstName
      if (updates.lastName) medusaUpdates.last_name = updates.lastName
      if (updates.phone) medusaUpdates.phone = updates.phone
      if (updates.companyName) medusaUpdates.company_name = updates.companyName

      await updateCustomer(medusaUpdates)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      console.error("Profile update error:", error)
      Alert.alert("Error", "Failed to update profile. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await logout() // This calls authStore.logout()
      console.log("Logout successful")
      // AuthContext will automatically sync and navigation will handle the rest
    } catch (error) {
      console.error("Logout failed:", error)
      Alert.alert("Error", "Failed to logout. Please try again.")
    }
  }

  // Show loading or not authenticated state
  if (isLoading) {
    return (
      <View className="flex-1">
        <Header title="Settings" />
        <Screen preset="scroll" className="flex-1">
          <View className="px-md py-lg">
            <Text text="Loading..." className="text-center" />
          </View>
        </Screen>
      </View>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1">
        <Header title="Settings" />
        <Screen preset="scroll" className="flex-1">
          <View className="px-md py-lg">
            <Text text="Please log in to view your profile" className="text-center" />
          </View>
        </Screen>
      </View>
    )
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
        </View>
      </Screen>

      {/* Logout Button - Sticky to Bottom */}
      <View className="px-md pb-md pt-sm" style={{ backgroundColor: theme.colors.background }}>
        <Button preset="secondary" text="Logout" onPress={handleLogout} className="w-full" />
      </View>

      {/* Reusable Bottom Sheet */}
      <BottomSheet
        isVisible={isSheetVisible}
        onClose={handleCloseSheet}
        title={`Edit ${editingField?.label || ""}`}
        onSave={handleSave}
      >
        <EditForm
          value={editValue}
          onChangeText={setEditValue}
          placeholder={
            editingField?.placeholder || `Enter ${editingField?.label?.toLowerCase() || ""}`
          }
          multiline={editingField?.multiline}
          keyboardType={editingField?.keyboardType}
        />
      </BottomSheet>
    </View>
  )
}

export const SettingsScreen = SettingsScreenComponent
