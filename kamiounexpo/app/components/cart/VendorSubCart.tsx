import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { AutoImage } from "@/components/AutoImage"
import { Shop, Product } from "@/domains/data/products/types"
import { useCart } from "@/stores/cartStore"
import { useAppTheme } from "@/theme/context"
import { Ionicons } from "@expo/vector-icons"

interface CartItem {
  productId: string
  product: Product
  quantity: number
}

interface VendorSubCartProps {
  shop: Shop
  items: CartItem[]
  minCartAmount: number
  subtotal: number
}

export const VendorSubCart = ({ shop, items, minCartAmount, subtotal }: VendorSubCartProps) => {
  const { updateQuantity, removeFromCart } = useCart()
  const { theme } = useAppTheme()
  const remaining = Math.max(0, minCartAmount - subtotal)
  const canProceed = subtotal >= minCartAmount

  return (
    <View>
      {/* Items List */}
      {items.map((item) => (
        <View
          key={item.productId}
          className="flex-row items-start align-middle border-b border-gray-100 last:border-b-0 py-sm"
        >
          {/* Product Image */}
          <View className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg mr-sm justify-center items-center overflow-hidden">
            <AutoImage
              source={{ uri: item.product.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Product Info */}
          <View className="flex-1 mr-sm">
            <Text text={item.product.name} size="xs" weight="medium" className="mb-1" />
            {/* Variant Information */}
            {item.product.variants && item.product.variants.length > 1 && (
              <Text
                text={`Size: ${item.product.variants.find((v) => v.id === item.product.id)?.title || "Unknown"}`}
                size="xxs"
                className="text-gray-400 mb-1"
              />
            )}
            <View className="flex-row items-center">
              <Text
                text={`$${item.product.price.toFixed(2)}`}
                size="xs"
                className="text-gray-500"
              />
              <TouchableOpacity onPress={() => removeFromCart(item.productId)} className="ml-2 p-1">
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Side: Quantity Controls + Item Total */}
          <View className="items-end">
            {/* Item Total */}
            <Text
              text={`$${(item.product.price * item.quantity).toFixed(2)}`}
              size="xs"
              weight="medium"
              className="mb-xs"
            />

            {/* Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center"
              >
                <Ionicons name="remove" size={14} color="#6B7280" />
              </TouchableOpacity>

              <Text text={item.quantity.toString()} size="xs" weight="medium" className="mx-sm" />

              <TouchableOpacity
                onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center"
              >
                <Ionicons name="add" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Footer with Subtotal & Min Amount */}
      <View className="mt-sm pt-sm border-t border-gray-100">
        <View className="flex-row justify-between items-center mb-xs">
          <Text text="Subtotal:" weight="bold" />
          <Text text={`$${subtotal.toFixed(2)}`} weight="bold" />
        </View>

        {minCartAmount > 0 && (
          <View className="flex-row justify-between items-center">
            <Text text="Min Required:" size="xs" className="text-gray-600" />
            {canProceed ? (
              <Text text="✓ Met" size="xs" style={{ color: "#10B981" }} />
            ) : (
              <Text
                text={`$${remaining.toFixed(2)} remaining`}
                size="xs"
                style={{ color: theme.colors.palette.accent100 }}
                className="font-medium"
              />
            )}
          </View>
        )}
      </View>
    </View>
  )
}
