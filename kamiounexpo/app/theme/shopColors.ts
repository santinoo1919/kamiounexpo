// Simple shop colors - header and button use the same color
export const SHOP_COLORS = {
  // Real shop IDs from your mock data
  coca_cola_company: "#DC2626", // Coca-Cola Red
  pepsico: "#2563EB", // Pepsi Blue
  nestle: "#7C3AED", // Purple
  procter_gamble: "#0EA5E9", // Blue
  colgate_palmolive: "#8B5CF6", // Purple
  unilever: "#059669", // Green
  kraft_heinz: "#F59E0B", // Orange
  mars_inc: "#8B5CF6", // Purple
  red_bull_gmbh: "#DC2626", // Red
  kellogg_company: "#10B981", // Green
} as const

// Type for shop IDs
export type ShopId = keyof typeof SHOP_COLORS

// Helper function to get colors for a shop
export const getShopColors = (shopId: ShopId) => {
  return SHOP_COLORS[shopId]
}

// Helper function to get random shop ID
export const getRandomShopId = (): ShopId => {
  const shopIds = Object.keys(SHOP_COLORS) as ShopId[]
  return shopIds[Math.floor(Math.random() * shopIds.length)]
}
