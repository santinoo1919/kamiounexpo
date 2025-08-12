import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { Shop, Product } from "@/domains/data/products/types"
import { useCart } from "@/context/CartContext"
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
  const remaining = Math.max(0, minCartAmount - subtotal)
  const canProceed = subtotal >= minCartAmount

  return (
    <View>
      {/* Items List */}
      {items.map((item) => (
        <View
          key={item.productId}
          className="flex-row items-start align-middle py-sm border-b border-gray-100 last:border-b-0"
        >
          {/* Product Image */}
          <View className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg mr-sm justify-center items-center">
            <Text text="🖼️" size="sm" />
          </View>

          {/* Product Info */}
          <View className="flex-1 mr-sm">
            <Text text={item.product.name} size="xs" weight="medium" className="mb-1" />
            <Text text={`$${item.product.price.toFixed(2)}`} size="xs" className="text-gray-500" />
          </View>

          {/* Right Side: Quantity Controls + Item Total */}
          <View className="items-end">
            {/* Item Total */}
            <Text
              text={`$${(item.product.price * item.quantity).toFixed(2)}`}
              size="sm"
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

              <Text text={item.quantity.toString()} size="sm" weight="medium" className="mx-sm" />

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
            <Text
              text={canProceed ? "✓ Met" : `$${remaining.toFixed(2)} remaining`}
              size="xs"
              className={canProceed ? "text-green-600" : "text-orange-600"}
            />
          </View>
        )}
      </View>
    </View>
  )
}
