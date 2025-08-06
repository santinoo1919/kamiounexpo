import {
  Product,
  ProductCategory,
  ProductSearchParams,
  ProductSearchResult,
  Shop,
} from "@/models/Product"

export interface ProductRepository {
  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  getCategories(): Promise<ProductCategory[]>
  getShops(): Promise<Shop[]>
  getProductsBySupplier(supplier: string): Promise<Product[]>
  searchProducts(params: ProductSearchParams): Promise<ProductSearchResult>
  getFeaturedProducts(): Promise<Product[]>
}
