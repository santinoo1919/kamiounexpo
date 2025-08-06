import { ProductRepository } from "./ProductRepository"
import {
  Product,
  ProductCategory,
  ProductSearchParams,
  ProductSearchResult,
  Shop,
} from "@/models/Product"
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SHOPS } from "../mockProducts"

export class MockProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return MOCK_PRODUCTS
  }

  async getProduct(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return MOCK_PRODUCTS.find((product) => product.id === id) || null
  }

  async getCategories(): Promise<ProductCategory[]> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return MOCK_CATEGORIES
  }

  async searchProducts(params: ProductSearchParams): Promise<ProductSearchResult> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let filteredProducts = [...MOCK_PRODUCTS]

    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query),
      )
    }

    if (params.category) {
      filteredProducts = filteredProducts.filter((product) => product.category === params.category)
    }

    if (params.featured !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.featured === params.featured)
    }

    if (params.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          (params.inStock && product.status === "in_stock") ||
          (!params.inStock && product.status !== "in_stock"),
      )
    }

    if (params.minPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price >= params.minPrice!)
    }

    if (params.maxPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price <= params.maxPrice!)
    }

    // Apply sorting
    if (params.sortBy) {
      filteredProducts.sort((a, b) => {
        const aValue = a[params.sortBy!]
        const bValue = b[params.sortBy!]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return params.sortOrder === "desc"
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return params.sortOrder === "desc" ? bValue - aValue : aValue - bValue
        }

        return 0
      })
    }

    // Apply pagination
    const total = filteredProducts.length
    const offset = params.offset || 0
    const limit = params.limit || total
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    return {
      products: paginatedProducts,
      total,
      hasMore: offset + limit < total,
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return MOCK_PRODUCTS.filter((product) => product.featured)
  }

  async getShops(): Promise<Shop[]> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return MOCK_SHOPS
  }

  async getProductsBySupplier(supplier: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return MOCK_PRODUCTS.filter((product) => product.supplier === supplier)
  }
}
