import React from "react"
import { View } from "react-native"
import { Text } from "@/components/Text"
import { ProfileInfoItem } from "./ProfileInfoItem"
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

interface ProfileInfoSectionProps {
  user: User
  onUpdateProfile: (updates: Partial<User>) => void
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

export const ProfileInfoSection = ({
  user,
  onUpdateProfile,
  onEditField,
}: ProfileInfoSectionProps) => {
  const { theme } = useAppTheme()

  const handleUpdateField = (field: keyof User, value: string) => {
    onUpdateProfile({ [field]: value })
  }

  const handleUpdateAddress = (field: keyof User["address"], value: string) => {
    const currentAddress = user.address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    }

    onUpdateProfile({
      address: {
        ...currentAddress,
        [field]: value,
      },
    })
  }

  const formatAddress = (address?: User["address"]) => {
    if (!address) return ""
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
  }

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <View className="mb-lg">
      {/* Avatar Section */}
      <View className="items-center mb-lg">
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.colors.palette.primary300 }}
        >
          <Text
            text={getInitials()}
            size="xl"
            weight="bold"
            style={{ color: theme.colors.background }}
          />
        </View>
        <Text
          text={`${user.firstName} ${user.lastName}`}
          size="lg"
          weight="bold"
          style={{ color: theme.colors.text }}
          className="mt-sm"
        />
      </View>

      <View
        className="bg-white rounded-lg overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        <ProfileInfoItem
          label="First Name"
          value={user.firstName}
          onSave={(value) => handleUpdateField("firstName", value)}
          icon="👤"
          onEditField={onEditField}
        />

        <ProfileInfoItem
          label="Last Name"
          value={user.lastName}
          onSave={(value) => handleUpdateField("lastName", value)}
          icon="👤"
          onEditField={onEditField}
        />

        <ProfileInfoItem
          label="Phone Number"
          value={user.phone || ""}
          placeholder="Enter phone number"
          onSave={(value) => handleUpdateField("phone", value)}
          icon="📞"
          keyboardType="phone-pad"
          onEditField={onEditField}
        />

        <ProfileInfoItem
          label="Shop Type"
          value={user.shopType || ""}
          placeholder="individual or business"
          onSave={(value) => handleUpdateField("shopType", value as "individual" | "business")}
          icon="🏪"
          onEditField={onEditField}
        />

        <ProfileInfoItem
          label="VAT Number"
          value={user.vatNumber || ""}
          placeholder="Enter VAT number"
          onSave={(value) => handleUpdateField("vatNumber", value)}
          icon="📋"
          onEditField={onEditField}
        />

        <ProfileInfoItem
          label="Address"
          value={formatAddress(user.address)}
          placeholder="Enter full address"
          onSave={(value) => {
            // For simplicity, we'll just update the street for now
            // In a real app, you'd want separate fields for each address component
            const currentAddress = user.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            }
            onUpdateProfile({
              address: {
                ...currentAddress,
                street: value,
              },
            })
          }}
          icon="📍"
          multiline
          onEditField={onEditField}
        />
      </View>
    </View>
  )
}
