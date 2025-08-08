import type { Product, ProductCategory, Shop } from "./types"

interface MagentoProduct {
  id: number
  name: string
  description: string
  brand?: string
  supplier?: string
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

export const transformProduct = (p: MagentoProduct): Product => ({
  id: p.id.toString(),
  name: p.name,
  description: p.description,
  brand: p.brand ?? "",
  supplier: p.supplier ?? "",
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
