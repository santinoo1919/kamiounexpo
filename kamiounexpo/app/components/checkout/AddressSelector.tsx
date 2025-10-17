import React, { useState, useEffect } from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { useCustomerAddresses } from "@/domains/data/auth/hooks"
import { useCurrentCustomer } from "@/domains/data/auth/hooks"
import { useAuth } from "@/stores/authStore"
import axios from "axios"
import Config from "@/config"
import { loadString } from "@/utils/storage"

interface AddressSelectorProps {
  selectedAddress: any | null
  onAddressSelect: (address: any) => void
  onError: (message: string) => void
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddress,
  onAddressSelect,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()
  const { data: customerAddresses, isLoading: addressesLoading } = useCustomerAddresses(token)
  const { data: customer } = useCurrentCustomer(token)

  // Set first address as default if none selected
  useEffect(() => {
    if (customerAddresses && customerAddresses.length > 0 && !selectedAddress) {
      onAddressSelect(customerAddresses[0])
      updateCartAddress(customerAddresses[0])
    }
  }, [customerAddresses, selectedAddress, onAddressSelect])

  const updateCartAddress = async (address: any) => {
    try {
      setIsLoading(true)
      const cartId = await loadString("medusa_cart_id")

      if (!cartId) {
        throw new Error("No cart ID available")
      }

      const instance = axios.create({
        baseURL: (Config as any).MEDUSA_BACKEND_URL,
        timeout: 30000,
      })

      const headers = {
        "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
      }

      // Update cart with shipping and billing address
      const addressData = {
        first_name: address.first_name || "Guest",
        last_name: address.last_name || "Customer",
        address_1: address.address_1 || "123 Main St",
        address_2: address.address_2 || "",
        city: address.city || "New York",
        country_code: address.country_code || "us",
        postal_code: address.postal_code || "10001",
        province: address.province || "",
        phone: address.phone || "",
      }

      await instance.post(
        `/store/carts/${cartId}`,
        {
          shipping_address: addressData,
          billing_address: addressData, // Use same address for billing
        },
        { headers },
      )

      console.log("Cart address updated successfully:", addressData)
    } catch (error) {
      console.error("Failed to update cart address:", error)
      onError("Failed to update address. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSelect = async (address: any) => {
    onAddressSelect(address)
    await updateCartAddress(address)
  }

  if (addressesLoading) {
    return (
      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <Text className="text-sm text-gray-600">Loading addresses...</Text>
      </View>
    )
  }

  if (!customerAddresses || customerAddresses.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <Text className="text-sm text-gray-600 mb-2">No saved addresses found</Text>
        <Text className="text-xs text-gray-500">
          Using default address for COD delivery. Please update in your profile.
        </Text>
      </View>
    )
  }

  return (
    <View className="space-y-2">
      <Text className="text-sm font-medium text-gray-900 mb-2">Select Delivery Address</Text>

      {customerAddresses.map((address: any) => (
        <TouchableOpacity
          key={address.id}
          onPress={() => handleAddressSelect(address)}
          disabled={isLoading}
          className={`p-3 rounded-lg border ${
            selectedAddress?.id === address.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">
                {customer?.first_name} {customer?.last_name}
              </Text>
              <Text className="text-xs text-gray-600 mt-1">
                {address.address_1}
                {address.address_2 && `, ${address.address_2}`}
              </Text>
              <Text className="text-xs text-gray-600">
                {address.city}, {address.province} {address.postal_code}
              </Text>
              <Text className="text-xs text-gray-600">{address.country_code?.toUpperCase()}</Text>
              {address.phone && (
                <Text className="text-xs text-gray-600">Phone: {address.phone}</Text>
              )}
            </View>

            {selectedAddress?.id === address.id && (
              <View className="w-5 h-5 bg-blue-500 rounded-full items-center justify-center ml-2">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}

      {isLoading && (
        <Text className="text-xs text-gray-500 text-center mt-2">Updating address...</Text>
      )}
    </View>
  )
}
