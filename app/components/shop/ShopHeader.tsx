import React from "react"
import { View } from "react-native"
import { Text } from "@/components/Text"
import { Shop } from "@/domains/data/products/types"
import { getShopColors } from "@/theme/shopColors"

interface ShopHeaderProps {
  shop: Shop
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({ shop }) => {
  // Get shop-specific color based on shop ID
  const shopColor = getShopColors(shop.id as any) || getShopColors("coca_cola_company")

  return (
    <View className="px-md py-lg" style={{ backgroundColor: shopColor }}>
      <View className="flex-row items-center mb-md">
        <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mr-md">
          <Text text={shop.icon} size="xl" style={{ color: "white" }} />
        </View>
        <View className="flex-1">
          <Text text={shop.name} preset="heading" style={{ color: "white" }} />
          <Text text={shop.description || ""} size="sm" style={{ color: "white", opacity: 0.8 }} />
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text text={`${shop.productCount} products`} size="sm" style={{ color: "white" }} />
          {shop.rating && (
            <View className="flex-row items-center ml-md">
              <Text text="⭐" size="sm" style={{ color: "white" }} />
              <Text
                text={shop.rating.toString()}
                size="sm"
                className="ml-xs"
                style={{ color: "white" }}
              />
            </View>
          )}
        </View>
        {shop.isVerified && (
          <View className="bg-white/20 px-xs py-xs rounded">
            <Text text="✓ Verified" size="xs" style={{ color: "white" }} />
          </View>
        )}
      </View>
    </View>
  )
}
