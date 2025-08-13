import React from "react"
import { View, ViewStyle } from "react-native"

import { ListView } from "@/components/ListView"
import { ProductCard } from "./ProductCard"
import { Product } from "@/domains/data/products/types"

interface ProductListProps {
  products: Product[]
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onProductPress?: (product: Product) => void
  numColumns?: number
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: ViewStyle
  scrollEnabled?: boolean
  masonry?: boolean
  optimizeItemArrangement?: boolean
}

export const ProductList = ({
  products,
  onAddToCart,
  onRemoveFromCart,
  onProductPress,
  numColumns,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  scrollEnabled = true,
  masonry = false,
  optimizeItemArrangement = true,
}: ProductListProps) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onAddToCart={onAddToCart}
      onRemoveFromCart={onRemoveFromCart}
      onPress={onProductPress}
    />
  )

  return (
    <ListView
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={contentContainerStyle}
      scrollEnabled={scrollEnabled}
      masonry={masonry}
      optimizeItemArrangement={masonry ? true : optimizeItemArrangement}
      estimatedItemSize={masonry ? undefined : 200}
    />
  )
}
