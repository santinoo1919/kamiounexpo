export interface DeepLink {
  type: "product" | "category" | "cart" | "profile" | "order" | "shop"
  params: Record<string, string>
}

export interface DeepLinkConfig {
  prefixes: string[]
  screens: Record<string, string>
}
