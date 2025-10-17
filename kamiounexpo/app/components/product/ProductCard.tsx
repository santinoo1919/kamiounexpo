import React, { useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { AutoImage } from "@/components/AutoImage"
import { useAppTheme } from "@/theme/context"
import { Product, ProductVariant } from "@/domains/data/products/types"
import { useCart } from "@/stores/cartStore"

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onPress?: (product: Product) => void
  variant?: "default" | "outOfStock"
}

export const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onPress,
  variant = "default",
}: ProductCardProps) => {
  const { theme } = useAppTheme()
  const { items, updateQuantity, addToCart } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.selectedVariantId || product.id,
  )

  const cartItem = items.find((item) => item.productId === product.id)
  const quantity = cartItem?.quantity || 0

  // Determine if product is out of stock
  const isOutOfStock = variant === "outOfStock" || product.status === "out_of_stock"

  // Get selected variant
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0]
  const isSelectedVariantInStock = selectedVariant?.isInStock ?? true

  const handlePress = () => {
    if (onPress) {
      onPress(product)
    } else {
      console.log("Product pressed:", product.id)
    }
  }

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId)
  }

  const getStatusColors = (status: Product["status"]) => {
    switch (status) {
      case "in_stock":
        return {
          background: theme.colors.palette.neutral100,
          text: theme.colors.palette.neutral400,
        }
      case "out_of_stock":
        return {
          background: theme.colors.palette.neutral100,
          text: theme.colors.error,
        }
      case "discontinued":
        return {
          background: theme.colors.palette.neutral100,
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
      className={`flex-1 m-xs rounded-lg ${isOutOfStock ? "opacity-60" : ""}`}
      onPress={handlePress}
      HeadingComponent={
        <View className="w-full h-32 mb-xs overflow-hidden relative rounded-t-lg">
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
      brand={product.brand}
      ContentComponent={
        <View>
          <Text
            text={product.description}
            preset="default"
            size="xs"
            className="px-xs mb-xs"
            numberOfLines={2}
          />

          {/* Supplier Information */}
          {product.supplier && (
            <View className="px-xs mb-xs">
              <View className="bg-blue-50 px-2 py-1 rounded flex-row items-center self-start">
                <Text
                  text={
                    product.supplier.length > 12
                      ? product.supplier.substring(0, 12) + "..."
                      : product.supplier
                  }
                  preset="default"
                  size="xxs"
                  className="text-blue-500 font-medium"
                  numberOfLines={1}
                />
              </View>
            </View>
          )}

          {/* Variant Selection */}
          {product.variants && product.variants.length > 1 && (
            <View className="px-xs mb-xs">
              <Text text="Size:" preset="default" size="xxs" className="text-gray-500 mb-1" />
              <View className="flex-row flex-wrap gap-1">
                {product.variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    onPress={() => handleVariantSelect(variant.id)}
                    className={`px-2 py-1 rounded border ${
                      selectedVariantId === variant.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    } ${!variant.isInStock ? "opacity-50" : ""}`}
                    disabled={!variant.isInStock}
                  >
                    <Text
                      text={variant.title}
                      preset="default"
                      size="xxs"
                      className={`${
                        selectedVariantId === variant.id
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      }
      HeadingTextProps={{
        className: "px-xs py-xs",
        numberOfLines: 2,
      }}
      BrandTextProps={{
        className: "px-xs",
      }}
      verticalAlignment="force-footer-bottom"
      FooterComponent={
        <View className="w-full px-xs py-xs">
          <View className="flex-row items-center justify-between mb-xs">
            <View className="flex-row items-center">
              {product.promoPrice && !isOutOfStock ? (
                <>
                  <Text
                    text={`$${product.price}`}
                    size="xs"
                    style={{
                      color: theme.colors.palette.neutral500,
                      textDecorationLine: "line-through",
                    }}
                  />
                  <Text
                    text={`$${product.promoPrice}`}
                    weight="bold"
                    style={{
                      color: theme.colors.palette.primary600,
                      marginLeft: 8,
                    }}
                  />
                </>
              ) : (
                <Text
                  text={`$${product.price}`}
                  weight="bold"
                  style={{ color: theme.colors.text }}
                />
              )}
            </View>
          </View>

          <View className="w-full">
            {quantity > 0 ? (
              // Quantity controls when in cart
              <View className="flex-row items-center justify-center space-x-2">
                <TouchableOpacity
                  onPress={() => updateQuantity(product.id, quantity - 1)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: theme.colors.palette.neutral200 }}
                >
                  <Ionicons name="remove" size={20} color={theme.colors.palette.neutral600} />
                </TouchableOpacity>

                <Text
                  text={quantity.toString()}
                  weight="bold"
                  className="mx-md"
                  style={{ color: theme.colors.text }}
                />

                <TouchableOpacity
                  onPress={() => updateQuantity(product.id, quantity + 1)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: theme.colors.palette.neutral200 }}
                >
                  <Ionicons name="add" size={20} color={theme.colors.palette.neutral600} />
                </TouchableOpacity>
              </View>
            ) : (
              // Add to cart button when not in cart
              <Button
                preset="primary"
                text={isSelectedVariantInStock ? "Add to Cart" : "Out of Stock"}
                onPress={() => addToCart({ ...product, id: selectedVariantId })}
                className="w-full"
                disabled={!isSelectedVariantInStock}
                LeftAccessory={({ textColor }) => (
                  <Ionicons name="cart-outline" size={20} color={textColor} />
                )}
              />
            )}
          </View>
        </View>
      }
    />
  )
}
