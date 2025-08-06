export interface Product {
  id: string
  name: string
  description: string
  brand: string
  supplier: string
  price: number
  promoPrice?: number
  status: "in_stock" | "out_of_stock" | "discontinued"
  image: string
  category: string
  featured?: boolean
  rating?: number
  reviewCount?: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  icon: string
  description?: string
  productCount: number
}

export interface ProductSearchParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  inStock?: boolean
  sortBy?: "name" | "price" | "rating" | "createdAt"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}

export interface ProductSearchResult {
  products: Product[]
  total: number
  hasMore: boolean
}
