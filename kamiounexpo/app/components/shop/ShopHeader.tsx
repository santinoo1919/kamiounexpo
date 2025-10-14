import React from "react"
import { View } from "react-native"
import { Text } from "@/components/Text"
import { Ionicons } from "@expo/vector-icons"
import { Shop } from "@/domains/data/products/types"
import { getShopColors } from "@/theme/shopColors"

interface ShopHeaderProps {
  shop: Shop
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({ shop }) => {
  // Get shop-specific color based on shop ID
  const shopColor = getShopColors(shop.id as any) || getShopColors("coca_cola_company")

  return (
    <View className="px-md" style={{ backgroundColor: shopColor }}>
      <View className="flex-row items-center mb-md">
        <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mr-md">
          <Text text={shop.icon} size="xl" style={{ color: "white" }} />
        </View>
        <View className="flex-1">
          <View className="mt-xs">
            <View className="flex-row items-center mb-xs">
              <Ionicons
                name="calendar-outline"
                size={14}
                color="white"
                style={{ opacity: 0.8 }}
                className="mr-xs"
              />
              <Text
                text="Next delivery: Tomorrow"
                size="sm"
                style={{ color: "white", opacity: 0.8 }}
              />
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="bag-outline"
                size={14}
                color="white"
                style={{ opacity: 0.8 }}
                className="mr-xs"
              />
              <Text
                text={`Min: $${shop.minCartAmount?.toFixed(2) || "0.00"}`}
                size="sm"
                style={{ color: "white", opacity: 0.8 }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
