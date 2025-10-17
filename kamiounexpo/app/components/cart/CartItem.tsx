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
      className="mb-xs"
      style={{
        borderWidth: 1,
        borderColor: theme.colors.palette.neutral300,
        borderRadius: 8,
      }}
      ContentComponent={
        <View className="flex-row h-24 p-xs">
          {/* Product Image */}
          <View className="w-20 h-20 rounded-md overflow-hidden mr-md">
            <AutoImage
              source={{ uri: product.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Product Details */}
          <View className="flex-1 justify-between">
            {/* Name and Brand */}
            <View>
              <Text
                text={product.name}
                size="sm"
                weight="bold"
                style={{ color: theme.colors.text }}
                className="mb-xxs"
              />
              <Text text={product.brand} size="xs" style={{ color: theme.colors.textDim }} />
              {/* Variant Information */}
              {product.variants && product.variants.length > 1 && (
                <View className="mt-1">
                  <Text
                    text={`Size: ${product.variants.find((v) => v.id === product.id)?.title || "Unknown"}`}
                    size="xxs"
                    style={{ color: theme.colors.textDim }}
                  />
                </View>
              )}
            </View>

            {/* Price and Controls Row */}
            <View className="flex-row items-center">
              <Text
                text={`$${product.price}`}
                size="sm"
                weight="bold"
                style={{ color: theme.colors.palette.primary600 }}
                className="mr-md"
              />

              {/* Quantity Controls */}
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={onDecreaseQuantity}
                  className="w-6 h-6 rounded-full items-center justify-center mr-xs"
                  style={{ backgroundColor: theme.colors.palette.neutral200 }}
                >
                  <Text text="-" size="xxs" style={{ color: theme.colors.text }} />
                </TouchableOpacity>
                <Text
                  text={quantity.toString()}
                  size="sm"
                  style={{ color: theme.colors.text }}
                  className="mx-xs"
                />
                <TouchableOpacity
                  onPress={onIncreaseQuantity}
                  className="w-6 h-6 rounded-full items-center justify-center ml-xs"
                  style={{ backgroundColor: theme.colors.palette.neutral200 }}
                >
                  <Text text="+" size="xxs" style={{ color: theme.colors.text }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={onRemove}
            className="ml-xs px-xs py-xxs rounded-md self-start"
            style={{ backgroundColor: theme.colors.errorBackground }}
          >
            <Text text="Remove" size="xxs" style={{ color: theme.colors.error }} />
          </TouchableOpacity>
        </View>
      }
    />
  )
}
