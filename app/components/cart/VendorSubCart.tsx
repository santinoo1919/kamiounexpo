import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { Shop, Product } from "@/domains/data/products/types"
import { useCart } from "@/context/CartContext"

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
    <View className="mb-md p-md border border-gray-200 rounded-lg bg-white">
      {/* Shop Header */}
      <View className="flex-row items-center justify-between mb-sm">
        <View className="flex-row items-center">
          <Text text={shop.icon} size="lg" />
          <Text text={shop.name} weight="bold" className="ml-sm" />
        </View>

        {/* Clear All Items from This Shop */}
        <TouchableOpacity
          onPress={() => items.forEach((item) => removeFromCart(item.productId))}
          className="px-sm py-xs bg-red-50 rounded-md"
        >
          <Text text="Clear All" size="xs" className="text-red-600" />
        </TouchableOpacity>
      </View>

      {/* Items List */}
      {items.map((item) => (
        <View key={item.productId} className="flex-row justify-between items-center py-xs">
          <View className="flex-1">
            <Text text={item.product.name} size="sm" />
            <Text
              text={`$${item.product.price.toFixed(2)} each`}
              size="xs"
              className="text-gray-500"
            />
          </View>

          {/* Quantity Controls */}
          <View className="flex-row items-center mr-sm">
            <TouchableOpacity
              onPress={() => updateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center"
            >
              <Text text="-" size="sm" weight="bold" />
            </TouchableOpacity>

            <Text text={item.quantity.toString()} size="sm" weight="medium" className="mx-md" />

            <TouchableOpacity
              onPress={() => updateQuantity(item.productId, item.quantity + 1)}
              className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center"
            >
              <Text text="+" size="sm" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Item Total */}
          <Text
            text={`$${(item.product.price * item.quantity).toFixed(2)}`}
            size="sm"
            weight="medium"
          />
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
