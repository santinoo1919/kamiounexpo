import React, { forwardRef, useImperativeHandle, useState } from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { BottomSheet } from "@/components/BottomSheet"
import { Text } from "@/components/Text"
import { AutoImage } from "@/components/AutoImage"
import { useAppTheme } from "@/theme/context"

interface Supplier {
  id: string
  name: string
  storeName: string
  minCartAmount: number
}

interface SupplierSelectionBottomSheetProps {
  productName: string
  productImage: string
  currentSupplier: string
  availableSuppliers: Supplier[]
  onSupplierSelect: (supplier: Supplier) => void
}

export interface SupplierSelectionBottomSheetRef {
  show: () => void
  hide: () => void
}

export const SupplierSelectionBottomSheet = forwardRef<
  SupplierSelectionBottomSheetRef,
  SupplierSelectionBottomSheetProps
>(({ productName, productImage, currentSupplier, availableSuppliers, onSupplierSelect }, ref) => {
  const { theme } = useAppTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<string>(currentSupplier)

  useImperativeHandle(ref, () => ({
    show: () => {
      setSelectedSupplier(currentSupplier)
      setIsVisible(true)
    },
    hide: () => setIsVisible(false),
  }))

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier.id)
  }

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      title="Select Supplier"
      snapPoints={["25%"]}
      showButtons={false}
    >
      <View className="flex-1 px-md">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {availableSuppliers.map((supplier) => (
            <TouchableOpacity
              key={supplier.id}
              onPress={() => {
                handleSupplierSelect(supplier)
                // Auto-close when supplier is selected
                const supplierObj = availableSuppliers.find((s) => s.id === supplier.id)
                if (supplierObj) {
                  onSupplierSelect(supplierObj)
                  setIsVisible(false)
                }
              }}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.palette.neutral200,
                borderRadius: 8,
              }}
              className="mb-xs p-xs rounded-lg"
            >
              <View className="flex-row h-20 items-center">
                {/* Product Image */}
                <View className="w-16 h-16 rounded-md overflow-hidden mr-md">
                  <AutoImage
                    source={{ uri: productImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Supplier Details */}
                <View className="flex-1 justify-between">
                  <View>
                    <Text
                      text={`$${supplier.minCartAmount + (supplier.id === "supplier1" ? 0 : supplier.id === "supplier2" ? 2 : 1)}`}
                      size="sm"
                      weight="bold"
                      style={{
                        color: theme.colors.palette.primary400,
                      }}
                      className="mb-xxs"
                    />
                    <Text
                      text={supplier.storeName}
                      size="xs"
                      style={{ color: theme.colors.palette.neutral600 }}
                    />
                  </View>

                  <Text
                    text={`Min. cart: $${supplier.minCartAmount}`}
                    size="xs"
                    style={{ color: theme.colors.palette.neutral500 }}
                  />
                </View>

                {/* Selection Indicator */}
                {selectedSupplier === supplier.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.colors.palette.accent100}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  )
})
