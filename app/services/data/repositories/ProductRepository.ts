import {
  Product,
  ProductCategory,
  ProductSearchParams,
  ProductSearchResult,
  Shop,
} from "@/domains/data/products/types"

export interface ProductRepository {
  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  getCategories(): Promise<ProductCategory[]>
  getShops(): Promise<Shop[]>
  getProductsBySupplier(supplier: string): Promise<Product[]>
  searchProducts(params: ProductSearchParams): Promise<ProductSearchResult>
  getFeaturedProducts(): Promise<Product[]>
}
