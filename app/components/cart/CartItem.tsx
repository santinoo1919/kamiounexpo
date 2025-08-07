import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { AutoImage } from "@/components/AutoImage"
import { useAppTheme } from "@/theme/context"
import { Product } from "@/domains/data/products/types"

interface CartItemProps {
  product: Product
  quantity: number
  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
  onRemove: () => void
}

export const CartItem = ({
  product,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemove,
}: CartItemProps) => {
  const { theme } = useAppTheme()

  return (
    <Card
      className="mb-sm"
      ContentComponent={
        <View className="flex-row">
          {/* Product Image */}
          <View className="w-20 h-20 rounded-md overflow-hidden mr-md">
            <AutoImage
              source={{ uri: product.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Product Details */}
          <View className="flex-1">
            <Text
              text={product.name}
              size="sm"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="mb-xs"
            />
            <Text
              text={`$${product.price}`}
              size="sm"
              style={{ color: theme.colors.palette.primary600 }}
              className="mb-xs"
            />

            {/* Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={onDecreaseQuantity}
                className="w-8 h-8 rounded-full items-center justify-center mr-xs"
                style={{ backgroundColor: theme.colors.palette.neutral200 }}
              >
                <Text text="-" size="xs" style={{ color: theme.colors.text }} />
              </TouchableOpacity>
              <Text
                text={quantity.toString()}
                size="sm"
                style={{ color: theme.colors.text }}
                className="mx-xs"
              />
              <TouchableOpacity
                onPress={onIncreaseQuantity}
                className="w-8 h-8 rounded-full items-center justify-center ml-xs"
                style={{ backgroundColor: theme.colors.palette.neutral200 }}
              >
                <Text text="+" size="xs" style={{ color: theme.colors.text }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={onRemove}
            className="ml-xs px-xs py-xxs rounded-sm"
            style={{ backgroundColor: theme.colors.errorBackground }}
          >
            <Text text="Remove" size="xs" style={{ color: theme.colors.error }} />
          </TouchableOpacity>
        </View>
      }
    />
  )
}
