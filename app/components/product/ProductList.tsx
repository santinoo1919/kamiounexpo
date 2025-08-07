import React from "react"
import { FlatList, View } from "react-native"

import { ProductCard } from "./ProductCard"
import { Product } from "@/domains/data/products/types"

interface ProductListProps {
  products: Product[]
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  onProductPress?: (product: Product) => void
  numColumns?: number
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: any
  scrollEnabled?: boolean
}

export const ProductList = ({
  products,
  onAddToCart,
  onRemoveFromCart,
  onProductPress,
  numColumns = 2,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  scrollEnabled = true,
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
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[{ paddingBottom: 48 }, contentContainerStyle]}
      scrollEnabled={scrollEnabled}
    />
  )
}
