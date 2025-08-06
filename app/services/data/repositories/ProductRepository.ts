import {
  Product,
  ProductCategory,
  ProductSearchParams,
  ProductSearchResult,
} from "@/models/Product"

export interface ProductRepository {
  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  getCategories(): Promise<ProductCategory[]>
  searchProducts(params: ProductSearchParams): Promise<ProductSearchResult>
  getFeaturedProducts(): Promise<Product[]>
}
