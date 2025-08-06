import React, { useState } from "react"
import { View, ScrollView, TouchableOpacity, FlatList } from "react-native"

import { Screen } from "@/components/Screen"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { AutoImage } from "@/components/AutoImage"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"

// Mock data
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 89.99,
    image: "https://picsum.photos/200/200?random=1",
    description: "Premium noise-canceling wireless headphones",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "https://picsum.photos/200/200?random=2",
    description: "Advanced fitness tracking smartwatch",
  },
  {
    id: "3",
    name: "Laptop Stand",
    price: 49.99,
    image: "https://picsum.photos/200/200?random=3",
    description: "Ergonomic aluminum laptop stand",
  },
  {
    id: "4",
    name: "Coffee Maker",
    price: 79.99,
    image: "https://picsum.photos/200/200?random=4",
    description: "Programmable coffee maker with timer",
  },
  {
    id: "5",
    name: "Yoga Mat",
    price: 34.99,
    image: "https://picsum.photos/200/200?random=5",
    description: "Non-slip premium yoga mat",
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 129.99,
    image: "https://picsum.photos/200/200?random=6",
    description: "Portable waterproof bluetooth speaker",
  },
  {
    id: "7",
    name: "Phone Case",
    price: 24.99,
    image: "https://picsum.photos/200/200?random=7",
    description: "Durable protective phone case",
  },
  {
    id: "8",
    name: "Desk Lamp",
    price: 59.99,
    image: "https://picsum.photos/200/200?random=8",
    description: "LED desk lamp with adjustable brightness",
  },
  {
    id: "9",
    name: "Backpack",
    price: 69.99,
    image: "https://picsum.photos/200/200?random=9",
    description: "Water-resistant laptop backpack",
  },
  {
    id: "10",
    name: "Wireless Charger",
    price: 39.99,
    image: "https://picsum.photos/200/200?random=10",
    description: "Fast wireless charging pad",
  },
  {
    id: "11",
    name: "Gaming Mouse",
    price: 89.99,
    image: "https://picsum.photos/200/200?random=11",
    description: "High-precision gaming mouse",
  },
  {
    id: "12",
    name: "Plant Pot",
    price: 19.99,
    image: "https://picsum.photos/200/200?random=12",
    description: "Ceramic plant pot with drainage",
  },
  {
    id: "13",
    name: "Sunglasses",
    price: 149.99,
    image: "https://picsum.photos/200/200?random=13",
    description: "Polarized UV protection sunglasses",
  },
  {
    id: "14",
    name: "Water Bottle",
    price: 29.99,
    image: "https://picsum.photos/200/200?random=14",
    description: "Insulated stainless steel water bottle",
  },
  {
    id: "15",
    name: "Keyboard",
    price: 119.99,
    image: "https://picsum.photos/200/200?random=15",
    description: "Mechanical RGB gaming keyboard",
  },
  {
    id: "16",
    name: "Candle Set",
    price: 44.99,
    image: "https://picsum.photos/200/200?random=16",
    description: "Scented soy wax candle set",
  },
]

const CATEGORIES = [
  { id: "1", name: "Electronics", icon: "🔌" },
  { id: "2", name: "Clothing", icon: "👕" },
  { id: "3", name: "Books", icon: "📚" },
  { id: "4", name: "Sports", icon: "⚽" },
  { id: "5", name: "Home", icon: "🏠" },
]

// Product Card Component
const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
}: {
  product: (typeof MOCK_PRODUCTS)[0]
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  quantity?: number
}) => {
  const { theme } = useAppTheme()

  return (
    <Card
      className="flex-1 m-xs rounded-lg"
      onPress={() => console.log("Product pressed:", product.id)}
      HeadingComponent={
        <View className="w-full h-32 mb-xs overflow-hidden rounded-md">
          <AutoImage source={{ uri: product.image }} className="w-full h-full" resizeMode="cover" />
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
            {quantity > 0 && <Text text={`Qty: ${quantity}`} size="xs" />}
          </View>
          <View className="w-full">
            <Button
              preset="primary"
              text={quantity > 0 ? "Add More" : "Add to Cart"}
              onPress={() => onAddToCart(product.id)}
              className="w-full"
            />
          </View>
        </View>
      }
    />
  )
}

// Category Carousel Component
const CategoryCarousel = ({
  onCategoryPress,
}: {
  onCategoryPress: (categoryId: string) => void
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-md py-xs">
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryPress(category.id)}
          className="items-center mr-lg"
        >
          <View className="w-12 h-12 bg-neutral-200 rounded-full items-center justify-center mb-xs">
            <Text text={category.icon} size="lg" />
          </View>
          <Text text={category.name} size="xs" className="text-center" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// Main Home Screen
export const HomeScreen = () => {
  const { theme } = useAppTheme()
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[productId] > 0) {
        newCart[productId] -= 1
        if (newCart[productId] === 0) {
          delete newCart[productId]
        }
      }
      return newCart
    })
  }

  const handleCategoryPress = (categoryId: string) => {
    console.log(`Selected category: ${categoryId}`)
  }

  const renderProduct = ({ item }: { item: (typeof MOCK_PRODUCTS)[0] }) => (
    <ProductCard
      product={item}
      onAddToCart={addToCart}
      onRemoveFromCart={removeFromCart}
      quantity={cart[item.id] || 0}
    />
  )

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} className="flex-1">
      <Header title="Home" />

      <CategoryCarousel onCategoryPress={handleCategoryPress} />

      <View className="px-md">
        <Text preset="heading" text="Featured Products" className="mb-md" />

        <FlatList
          data={MOCK_PRODUCTS}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          scrollEnabled={false}
        />
      </View>
    </Screen>
  )
}
