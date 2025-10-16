import React, { useState, useEffect } from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import axios from "axios"
import Config from "@/config"
import { loadString } from "@/utils/storage"

interface ShippingSelectorProps {
  selectedOption: string | null
  onOptionSelect: (optionId: string) => void
  onError: (message: string) => void
}

export const ShippingSelector: React.FC<ShippingSelectorProps> = ({
  selectedOption,
  onOptionSelect,
  onError,
}) => {
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch shipping options
  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        setIsLoading(true)
        const cartId = await loadString("medusa_cart_id")

        if (!cartId) {
          console.log("No cart ID available for shipping options")
          setShippingOptions([])
          return
        }

        const instance = axios.create({
          baseURL: (Config as any).MEDUSA_BACKEND_URL,
          timeout: 30000,
        })

        const headers = {
          "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
        }

        const { data } = await instance.get(`/store/shipping-options?cart_id=${cartId}`, {
          headers,
        })

        const options = data.shipping_options || []
        console.log("Raw API response:", JSON.stringify(data, null, 2))
        console.log("Number of options found:", options.length)

        setShippingOptions(options)

        console.log("=== AVAILABLE SHIPPING OPTIONS ===")
        options.forEach((option: any, index: number) => {
          console.log(
            `${index + 1}. ${option.name}: $${(option.amount / 100).toFixed(2)} (ID: ${option.id})`,
          )
          console.log(`   Type: ${option.type?.label} (${option.type?.code})`)
          console.log(`   Price: ${option.amount} cents`)
        })
        console.log("=================================")
      } catch (error) {
        console.error("Failed to fetch shipping options:", error)
        setShippingOptions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchShippingOptions()
  }, [])

  const handleOptionSelect = async (optionId: string) => {
    try {
      console.log("=== SHIPPING SELECTION DEBUG ===")
      console.log("Selected option ID:", optionId)

      // Find the option details
      const option = shippingOptions?.find((opt: any) => opt.id === optionId)
      console.log("Option details:", option)

      onOptionSelect(optionId)

      // Apply shipping method to cart
      const instance = axios.create({
        baseURL: (Config as any).MEDUSA_BACKEND_URL,
        timeout: 30000,
      })

      const headers = {
        "x-publishable-api-key": (Config as any).MEDUSA_PUBLISHABLE_KEY,
      }

      const cartId = await loadString("medusa_cart_id")
      console.log("Current cart ID:", cartId)

      if (!cartId) {
        throw new Error("No cart ID available")
      }

      console.log("Applying shipping method to current cart...")
      await instance.post(
        `/store/carts/${cartId}/shipping-methods`,
        { option_id: optionId },
        { headers },
      )

      console.log("Shipping method applied to current cart:", optionId)
      console.log("=====================================")
    } catch (error) {
      console.error("Failed to apply shipping method:", error)
      onError("Failed to apply shipping method. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <Text className="text-sm text-gray-600">Loading shipping options...</Text>
      </View>
    )
  }

  if (!shippingOptions || shippingOptions.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <Text className="text-sm text-gray-600">No shipping options available</Text>
      </View>
    )
  }

  return (
    <View className="space-y-2">
      {shippingOptions.map((option: any) => {
        const isSelected = selectedOption === option.id
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionSelect(option.id)}
            className={`rounded-lg p-4 shadow-sm border ${
              isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
            }`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className={`text-base font-medium ${
                    isSelected ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {option.name}
                </Text>
                {option.description && (
                  <Text
                    className={`text-sm mt-1 ${isSelected ? "text-blue-700" : "text-gray-600"}`}
                  >
                    {option.description}
                  </Text>
                )}
              </View>
              <View className="flex-row items-center">
                <Text
                  className={`text-lg font-semibold ${
                    isSelected ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  ${(option.amount / 100).toFixed(2)}
                </Text>
                {isSelected && <Text className="ml-2 text-blue-600 text-sm">✓</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
