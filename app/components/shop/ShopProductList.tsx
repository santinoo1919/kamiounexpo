import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { AutoImage } from "@/components/AutoImage"
import { Product } from "@/domains/data/products/types"
import { getShopColors } from "@/theme/shopColors"
import { useAppTheme } from "@/theme/context"

interface ShopProductListProps {
  products: Product[]
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  cart: { [key: string]: number }
  shopId: string
  numColumns?: number
}

export const ShopProductList: React.FC<ShopProductListProps> = ({
  products,
  onAddToCart,
  onRemoveFromCart,
  cart,
  shopId,
  numColumns = 2,
}) => {
  const { theme } = useAppTheme()
  const shopColor = getShopColors(shopId as any) || getShopColors("coca_cola_company")

  const renderProduct = (product: Product) => (
    <Card
      key={product.id}
      className="flex-1 m-xs rounded-lg"
      onPress={() => console.log("Product pressed:", product.id)}
      HeadingComponent={
        <View className="w-full h-32 mb-xs overflow-hidden rounded-md relative">
          <AutoImage source={{ uri: product.image }} className="w-full h-full" resizeMode="cover" />
          {/* Stock Status Label */}
          <View className="absolute top-xs right-xs">
            <View
              className={`px-xs py-xxs rounded-sm ${
                product.status === "in_stock" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                text={product.status === "in_stock" ? "In Stock" : "Out of Stock"}
                size="xxs"
                className={product.status === "in_stock" ? "text-green-700" : "text-red-700"}
              />
            </View>
          </View>
        </View>
      }
      heading={product.name}
      content={product.description}
      HeadingTextProps={{ className: "px-xs py-xs", numberOfLines: 2 }}
      ContentTextProps={{ className: "px-xs py-xs" }}
      verticalAlignment="force-footer-bottom"
      FooterComponent={
        <View className="w-full px-xs py-xs">
          <View className="flex-row items-center justify-between mb-xs">
            <Text text={`$${product.price}`} weight="bold" />
            {product.promoPrice && (
              <Text
                text={`$${product.promoPrice}`}
                size="xs"
                style={{ color: theme.colors.error }}
              />
            )}
            {cart[product.id] > 0 && <Text text={`Qty: ${cart[product.id]}`} size="xs" />}
          </View>
          <View className="w-full">
            <Button
              preset="primary"
              text={cart[product.id] > 0 ? "Add More" : "Add to Cart"}
              onPress={() => onAddToCart(product.id)}
              className="w-full"
              style={{ backgroundColor: shopColor }}
            />
          </View>
        </View>
      }
    />
  )

  // Create grid layout
  const renderGrid = () => {
    const rows = []
    for (let i = 0; i < products.length; i += numColumns) {
      const row = products.slice(i, i + numColumns)
      rows.push(
        <View key={i} className="flex-row">
          {row.map((product) => (
            <View key={product.id} className="flex-1">
              {renderProduct(product)}
            </View>
          ))}
        </View>,
      )
    }
    return rows
  }

  return <View className="flex-1">{renderGrid()}</View>
}
