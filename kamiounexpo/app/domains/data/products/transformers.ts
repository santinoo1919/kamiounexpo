import type { Product, ProductCategory, Shop } from "./types"

interface MagentoProduct {
  id: number
  name: string
  description: string
  brand?: string
  supplier?: string
  shop_id?: string // NEW: Shop ID from Magento
  price: number
  special_price?: number
  status: 0 | 1
  image_url: string
  category?: string
  rating?: number
  review_count?: number
  created_at: string
  updated_at: string
}

interface MagentoCategory {
  id: number
  name: string
  icon_url?: string
  description?: string
  product_count: number
}

interface MagentoShop {
  id: number
  name: string
  supplier: string
  icon_url?: string
  description?: string
  product_count: number
  rating?: number
  is_verified?: boolean
}

// Medusa product types
interface MedusaProduct {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  handle: string
  thumbnail?: string | null
  variants?: Array<{
    id: string
    title: string
    sku?: string
    prices?: Array<{
      amount: number
      currency_code: string
    }>
    inventory_quantity?: number
    manage_inventory?: boolean
    calculated_price?: {
      calculated_amount: number
      currency_code: string
    }
  }>
  collection_id?: string | null
  type_id?: string | null
  weight?: number | null
  created_at: string
  updated_at: string
  metadata?: Record<string, any> | null
}

export const transformProduct = (p: MagentoProduct): Product => ({
  id: p.id.toString(),
  name: p.name,
  description: p.description,
  brand: p.brand ?? "",
  supplier: p.supplier ?? "",
  shopId: p.shop_id ?? "default_shop", // NEW: Shop ID with fallback
  price: p.price,
  promoPrice: p.special_price,
  status: p.status === 1 ? "in_stock" : "out_of_stock",
  image: p.image_url,
  category: p.category ?? "",
  rating: p.rating,
  reviewCount: p.review_count,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
})

export const transformCategory = (c: MagentoCategory): ProductCategory => ({
  id: c.id.toString(),
  name: c.name,
  icon: c.icon_url ?? "",
  description: c.description,
  productCount: c.product_count,
})

export const transformShop = (s: MagentoShop): Shop => ({
  id: s.id.toString(),
  name: s.name,
  supplier: s.supplier,
  icon: s.icon_url ?? "",
  description: s.description,
  productCount: s.product_count,
  rating: s.rating,
  isVerified: s.is_verified,
})

// Medusa cart item transformer
export const transformMedusaCartItem = (item: any): Product => {
  console.log("🔧 Transforming Medusa cart item:", {
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    productImage: item.productImage,
  })

  return {
    id: item.productId, // ← Use productId instead of variant_id
    name: item.productName, // ← Use productName instead of title
    description: item.description || "",
    brand: item.brand || "Medusa",
    supplier: item.supplier || "Medusa Official",
    shopId: item.shopId || "medusa_shop",
    price: item.price || 0, // ← Use price directly (already in dollars)
    promoPrice: item.promoPrice,
    status: item.inStock ? "in_stock" : "out_of_stock",
    image: item.productImage || "", // ← Use productImage instead of thumbnail
    category: item.category || "uncategorized",
    rating: item.rating,
    reviewCount: item.reviewCount,
    createdAt: item.addedAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }
}

// Medusa product transformer
export const transformMedusaProduct = (p: MedusaProduct): Product => {
  // Get the first variant for pricing
  const firstVariant = p.variants?.[0]

  // Use calculated_price for automatic currency/region pricing
  const calculatedPrice = (firstVariant as any)?.calculated_price
  const priceInDollars = calculatedPrice?.calculated_amount
    ? calculatedPrice.calculated_amount / 100
    : 0

  // Check inventory status (proper Medusa logic)
  // A product is in stock if ANY variant has inventory
  const hasInventory =
    p.variants?.some(
      (variant) =>
        variant.manage_inventory === false ||
        (variant.inventory_quantity && variant.inventory_quantity > 0),
    ) || false

  // Transform variants for selection
  const variants =
    p.variants?.map((variant) => {
      const variantPrice = variant.calculated_price?.calculated_amount
        ? variant.calculated_price.calculated_amount / 100
        : priceInDollars

      return {
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        inventory_quantity: variant.inventory_quantity,
        manage_inventory: variant.manage_inventory,
        price: variantPrice,
        isInStock:
          variant.manage_inventory === false ||
          (variant.inventory_quantity ? variant.inventory_quantity > 0 : false),
      }
    }) || []

  return {
    id: firstVariant?.id || p.id, // Use variant ID for cart operations, fallback to product ID
    name: p.title,
    description: p.description || p.subtitle || "",
    brand: (p.metadata?.brand as string) || "Medusa",
    supplier: (p.metadata?.supplier as string) || "Medusa Official",
    shopId: (p.metadata?.shop_id as string) || "medusa_shop",
    price: priceInDollars,
    promoPrice: (p.metadata?.promo_price as number) || undefined,
    status: hasInventory ? "in_stock" : "out_of_stock",
    image: p.thumbnail || "",
    category: p.collection_id || (p.metadata?.category as string) || "uncategorized",
    rating: (p.metadata?.rating as number) || undefined,
    reviewCount: (p.metadata?.review_count as number) || undefined,
    weight: p.weight ? `${p.weight}g` : undefined,
    units: (p.metadata?.units as number) || undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    variants: variants,
    selectedVariantId: firstVariant?.id, // Default to first variant
  }
}
