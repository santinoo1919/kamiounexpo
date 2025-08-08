import { Linking } from "react-native"

export const generateDeepLink = (type: string, params: Record<string, string> = {}) => {
  const baseUrl = "kamioun://"
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}/${value}`)
    .join("/")

  return `${baseUrl}${type}${paramString ? `/${paramString}` : ""}`
}

export const openDeepLink = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      console.warn("Cannot open URL:", url)
    }
  } catch (error) {
    console.error("Error opening deep link:", error)
  }
}

// Example deep links for testing
export const DEEP_LINK_EXAMPLES = {
  product: (id: string) => generateDeepLink("product", { id }),
  category: (slug: string) => generateDeepLink("category", { slug }),
  cart: () => generateDeepLink("cart"),
  profile: () => generateDeepLink("profile"),
  order: (orderId: string) => generateDeepLink("order", { orderId }),
  shop: (shopId: string) => generateDeepLink("shop", { shopId }),
}
