import React from "react"
import { View } from "react-native"

import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { AutoImage } from "@/components/AutoImage"
import { useAppTheme } from "@/theme/context"
import { Product } from "@/domains/data/products/types"
import { useCart } from "@/context/CartContext"

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onPress?: (product: Product) => void
}

export const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onPress,
}: ProductCardProps) => {
  const { theme } = useAppTheme()
  const { items } = useCart()

  const cartItem = items.find((item) => item.productId === product.id)
  const quantity = cartItem?.quantity || 0

  const handlePress = () => {
    if (onPress) {
      onPress(product)
    } else {
      console.log("Product pressed:", product.id)
    }
  }

  const getStatusColors = (status: Product["status"]) => {
    switch (status) {
      case "in_stock":
        return {
          background: theme.colors.palette.neutral100,
          text: theme.colors.palette.neutral700,
        }
      case "out_of_stock":
        return {
          background: theme.colors.errorBackground,
          text: theme.colors.error,
        }
      case "discontinued":
        return {
          background: theme.colors.palette.neutral300,
          text: theme.colors.palette.neutral600,
        }
      default:
        return {
          background: theme.colors.palette.neutral200,
          text: theme.colors.palette.neutral600,
        }
    }
  }

  const statusColors = getStatusColors(product.status)

  return (
    <Card
      className="flex-1 m-xs rounded-lg"
      onPress={handlePress}
      HeadingComponent={
        <View className="w-full h-32 mb-xs overflow-hidden rounded-md relative">
          <AutoImage source={{ uri: product.image }} className="w-full h-full" resizeMode="cover" />
          {/* Stock Status Label */}
          <View className="absolute top-xs right-xs">
            <View
              className="px-xs py-xxs rounded-sm"
              style={{ backgroundColor: statusColors.background }}
            >
              <Text
                text={product.status === "in_stock" ? "In Stock" : "Out of Stock"}
                size="xxs"
                style={{ color: statusColors.text }}
              />
            </View>
          </View>
        </View>
      }
      heading={product.name}
      content={product.description}
      HeadingTextProps={{
        className: "px-xs py-xs",
        numberOfLines: 2,
      }}
      ContentTextProps={{
        className: "px-xs py-xs",
      }}
      verticalAlignment="force-footer-bottom"
      FooterComponent={
        <View className="w-full px-xs py-xs">
          <View className="flex-row items-center justify-between mb-xs">
            <Text text={`$${product.price}`} weight="bold" style={{ color: theme.colors.text }} />
            {product.promoPrice && (
              <Text
                text={`$${product.promoPrice}`}
                size="xs"
                style={{ color: theme.colors.error }}
              />
            )}
            {quantity > 0 && (
              <Text text={`Qty: ${quantity}`} size="xs" style={{ color: theme.colors.textDim }} />
            )}
          </View>
          <View className="w-full">
            <Button
              preset="primary"
              text={quantity > 0 ? "Add More" : "Add to Cart"}
              onPress={() => onAddToCart(product.id)}
              className="w-full"
            />
            {quantity > 0 && (
              <Button
                preset="secondary"
                text="Remove"
                onPress={() => onRemoveFromCart(product.id)}
                className="w-full mt-xs"
              />
            )}
          </View>
        </View>
      }
    />
  )
}
