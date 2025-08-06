import React, { useState, useEffect } from "react"
import { View, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { AutoImage } from "@/components/AutoImage"
import { Header } from "@/components/Header"
import { useAppTheme } from "@/theme/context"
import { Product, ProductCategory, Shop } from "@/models/Product"
import { MockProductRepository } from "@/services/data/repositories/MockProductRepository"

// Product Card Component (same as HomeScreen)
const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
}: {
  product: Product
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
            {product.promoPrice && (
              <Text
                text={`$${product.promoPrice}`}
                size="xs"
                style={{ color: theme.colors.error }}
              />
            )}
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

// Category Carousel Component (same as HomeScreen)
const CategoryCarousel = ({
  categories,
  selectedCategory,
  onCategoryPress,
}: {
  categories: ProductCategory[]
  selectedCategory: string | null
  onCategoryPress: (categoryId: string) => void
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-md py-xs">
      {/* All Categories Option */}
      <TouchableOpacity onPress={() => onCategoryPress("all")} className="items-center mr-lg">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mb-xs ${
            selectedCategory === null ? "bg-primary-600" : "bg-neutral-200"
          }`}
        >
          <Text text="🏠" size="lg" />
        </View>
        <Text
          text="All"
          size="xs"
          className={`text-center ${selectedCategory === null ? "font-bold" : ""}`}
        />
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryPress(category.id)}
          className="items-center mr-lg"
        >
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mb-xs ${
              selectedCategory === category.id ? "bg-primary-600" : "bg-neutral-200"
            }`}
          >
            <Text text={category.icon} size="lg" />
          </View>
          <Text
            text={category.name}
            size="xs"
            className={`text-center ${selectedCategory === category.id ? "font-bold" : ""}`}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// Shop Header Component
const ShopHeader = ({ shop }: { shop: Shop }) => {
  return (
    <View className="px-md py-lg bg-white">
      <View className="flex-row items-center mb-md">
        <View className="w-16 h-16 bg-neutral-200 rounded-full items-center justify-center mr-md">
          <Text text={shop.icon} size="xl" />
        </View>
        <View className="flex-1">
          <Text text={shop.name} preset="heading" />
          <Text text={shop.description || ""} size="sm" style={{ opacity: 0.7 }} />
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text text={`${shop.productCount} products`} size="sm" />
          {shop.rating && (
            <View className="flex-row items-center ml-md">
              <Text text="⭐" size="sm" />
              <Text text={shop.rating.toString()} size="sm" className="ml-xs" />
            </View>
          )}
        </View>
        {shop.isVerified && (
          <View className="bg-green-100 px-xs py-xs rounded">
            <Text text="✓ Verified" size="xs" style={{ color: "#059669" }} />
          </View>
        )}
      </View>
    </View>
  )
}

// Main Shop Screen
export const ShopScreen = ({ route }: { route: { params: { shop: Shop } } }) => {
  const { shop } = route.params
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  const productRepository = new MockProductRepository()

  const fetchShopProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productRepository.getProductsBySupplier(shop.supplier)
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError("Failed to fetch shop products")
      console.error("Error fetching shop products:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setError(null)
      const data = await productRepository.getCategories()
      setCategories(data)
    } catch (err) {
      setError("Failed to fetch categories")
      console.error("Error fetching categories:", err)
    }
  }

  useEffect(() => {
    fetchShopProducts()
    fetchCategories()
  }, [shop.supplier])

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const filtered = products.filter((product) => product.category === selectedCategory)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [selectedCategory, products])

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
    if (categoryId === "all") {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    }
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onAddToCart={addToCart}
      onRemoveFromCart={removeFromCart}
      quantity={cart[item.id] || 0}
    />
  )

  if (loading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title={shop.name}
          RightActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="✕" size="md" />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text text="Loading shop products..." />
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} className="flex-1">
        <Header
          title={shop.name}
          RightActionComponent={
            <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
              <Text text="✕" size="md" />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text text={`Error: ${error}`} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} className="flex-1">
      <Header
        title={shop.name}
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="✕" size="md" />
          </TouchableOpacity>
        }
      />

      <ShopHeader shop={shop} />

      <CategoryCarousel
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />

      <View className="px-md">
        <Text preset="heading" text="Products" className="mb-md" />

        <FlatList
          data={filteredProducts}
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
