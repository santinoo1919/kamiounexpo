import { Product, Shop } from "../../../app/domains/data/products/types"
import { MOCK_SHOPS, MOCK_PRODUCTS } from "../../../app/domains/data/mockData/products"

// Define CartItem interface for testing
interface CartItem {
  productId: string
  product: Product
  quantity: number
}

// Test data setup - using existing mock data
const mockCartItems: CartItem[] = [
  { productId: "11", product: MOCK_PRODUCTS[10], quantity: 2 }, // iPhone 15 Pro (1199.99)
  { productId: "15", product: MOCK_PRODUCTS[14], quantity: 1 }, // MacBook Pro (2499.99)
  { productId: "12", product: MOCK_PRODUCTS[11], quantity: 3 }, // Nike Air Max (129.99)
]

describe("Cart Calculations", () => {
  describe("Shop Grouping", () => {
    test("should group items by shop correctly", () => {
      const grouped = groupItemsByShop(mockCartItems)

      expect(grouped).toHaveProperty("apple_inc")
      expect(grouped).toHaveProperty("nike_inc")
      expect(grouped.apple_inc).toHaveLength(2)
      expect(grouped.nike_inc).toHaveLength(1)
    })

    test("should handle empty cart", () => {
      const grouped = groupItemsByShop([])
      expect(grouped).toEqual({})
    })

    test("should handle single shop cart", () => {
      const singleShopItems = mockCartItems.filter((item) => item.product.shopId === "apple_inc")
      const grouped = groupItemsByShop(singleShopItems)

      expect(Object.keys(grouped)).toHaveLength(1)
      expect(grouped.apple_inc).toHaveLength(2)
    })
  })

  describe("Shop Subtotal Calculations", () => {
    test("should calculate shop subtotals correctly", () => {
      const grouped = groupItemsByShop(mockCartItems)
      const subtotals = calculateShopSubtotals(grouped)

      // Apple: (1199.99 * 2) + (2499.99 * 1) = 2399.98 + 2499.99 = 4899.97
      expect(subtotals.apple_inc).toBeCloseTo(4899.97, 2)
      // Nike: 129.99 * 3 = 389.97
      expect(subtotals.nike_inc).toBeCloseTo(389.97, 2)
    })

    test("should handle zero quantities", () => {
      const itemsWithZero = [
        { productId: "11", product: MOCK_PRODUCTS[10], quantity: 0 }, // iPhone 15 Pro
        { productId: "15", product: MOCK_PRODUCTS[14], quantity: 1 }, // MacBook Pro
      ]
      const grouped = groupItemsByShop(itemsWithZero)
      const subtotals = calculateShopSubtotals(grouped)

      expect(subtotals.apple_inc).toBe(2499.99) // Only MacBook Pro
    })

    test("should handle decimal prices", () => {
      const decimalProduct: Product = { ...MOCK_PRODUCTS[10], price: 99.99 } // iPhone 15 Pro with decimal price
      const decimalItems = [{ productId: "11", product: decimalProduct, quantity: 2 }]
      const grouped = groupItemsByShop(decimalItems)
      const subtotals = calculateShopSubtotals(grouped)

      expect(subtotals.apple_inc).toBe(199.98)
    })
  })

  describe("Minimum Amount Validation", () => {
    test("should check if shop meets minimum amount", () => {
      const shop = MOCK_SHOPS.find((s) => s.id === "apple_inc")!
      const subtotal = 3197
      const minAmount = shop.minCartAmount || 0

      const meetsMinimum = checkShopMinimum(subtotal, minAmount)
      expect(meetsMinimum).toBe(true) // 3197 > 100
    })

    test("should handle shops with no minimum", () => {
      const shop = MOCK_SHOPS.find((s) => s.id === "nike_inc")!
      const subtotal = 387
      const minAmount = shop.minCartAmount || 0

      const meetsMinimum = checkShopMinimum(subtotal, minAmount)
      expect(meetsMinimum).toBe(true) // 387 > 50
    })

    test("should fail when below minimum", () => {
      const shop = MOCK_SHOPS.find((s) => s.id === "apple_inc")!
      const subtotal = 50
      const minAmount = shop.minCartAmount || 0

      const meetsMinimum = checkShopMinimum(subtotal, minAmount)
      expect(meetsMinimum).toBe(false) // 50 < 100
    })
  })

  describe("Remaining Amount Calculation", () => {
    test("should calculate remaining amount correctly", () => {
      const shop = MOCK_SHOPS.find((s) => s.id === "apple_inc")!
      const subtotal = 50
      const minAmount = shop.minCartAmount || 0

      const remaining = calculateRemainingAmount(subtotal, minAmount)
      expect(remaining).toBe(50) // 100 - 50
    })

    test("should return 0 when minimum is met", () => {
      const shop = MOCK_SHOPS.find((s) => s.id === "apple_inc")!
      const subtotal = 150
      const minAmount = shop.minCartAmount || 0

      const remaining = calculateRemainingAmount(subtotal, minAmount)
      expect(remaining).toBe(0) // 150 > 100
    })

    test("should handle zero minimum", () => {
      const subtotal = 100
      const minAmount = 0

      const remaining = calculateRemainingAmount(subtotal, minAmount)
      expect(remaining).toBe(0)
    })
  })

  describe("All Shops Validation", () => {
    test("should return true when all shops meet minimums", () => {
      const shopData = {
        apple_inc: { subtotal: 150, minAmount: 100, canProceed: true },
        nike_inc: { subtotal: 100, minAmount: 50, canProceed: true },
      }

      const allValid = validateAllShops(shopData)
      expect(allValid).toBe(true)
    })

    test("should return false when any shop fails minimum", () => {
      const shopData = {
        apple_inc: { subtotal: 50, minAmount: 100, canProceed: false },
        nike_inc: { subtotal: 100, minAmount: 50, canProceed: true },
      }

      const allValid = validateAllShops(shopData)
      expect(allValid).toBe(false)
    })

    test("should handle empty shop data", () => {
      const shopData = {}
      const allValid = validateAllShops(shopData)
      expect(allValid).toBe(true) // No shops = no validation needed
    })
  })
})

// Helper functions to test (these mirror the logic in CartContext)
function groupItemsByShop(items: CartItem[]): { [shopId: string]: CartItem[] } {
  const grouped: { [shopId: string]: CartItem[] } = {}
  items.forEach((item) => {
    const shopId = item.product.shopId
    if (!grouped[shopId]) grouped[shopId] = []
    grouped[shopId].push(item)
  })
  return grouped
}

function calculateShopSubtotals(grouped: { [shopId: string]: CartItem[] }): {
  [shopId: string]: number
} {
  const subtotals: { [shopId: string]: number } = {}
  Object.entries(grouped).forEach(([shopId, shopItems]) => {
    subtotals[shopId] = shopItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })
  return subtotals
}

function checkShopMinimum(subtotal: number, minAmount: number): boolean {
  return subtotal >= minAmount
}

function calculateRemainingAmount(subtotal: number, minAmount: number): number {
  return Math.max(0, minAmount - subtotal)
}

function validateAllShops(shopData: { [shopId: string]: { canProceed: boolean } }): boolean {
  return Object.values(shopData).every((shop) => shop.canProceed)
}
