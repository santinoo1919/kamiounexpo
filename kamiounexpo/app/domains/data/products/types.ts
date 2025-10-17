// Products service specific types
export interface ProductVariant {
  id: string
  title: string
  sku?: string
  inventory_quantity?: number
  manage_inventory?: boolean
  price?: number
  isInStock: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  weight?: string // NEW: Weight/volume information (e.g., "330ml", "150g", "1L")
  units?: number // NEW: Quantity of units in package (e.g., 24 for "x24")
  brand: string
  supplier: string
  shopId: string // NEW: Link product to specific shop
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
  variants?: ProductVariant[] // NEW: Product variants for selection
  selectedVariantId?: string // NEW: Currently selected variant ID
}

export interface ProductCategory {
  id: string
  name: string
  icon: string
  description?: string
  productCount: number
}

export interface Shop {
  id: string
  name: string
  supplier: string
  icon: string
  description?: string
  productCount: number
  rating?: number
  isVerified?: boolean
  minCartAmount?: number // NEW: Minimum cart amount for this shop
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

// API Response types
export interface ProductsApiResponse {
  products: Product[]
  total: number
  hasMore: boolean
}

export interface CategoriesApiResponse {
  categories: ProductCategory[]
}

export interface ShopsApiResponse {
  shops: Shop[]
}

// Error types
export interface ProductsApiError {
  message: string
  code: string
  details?: any
}
