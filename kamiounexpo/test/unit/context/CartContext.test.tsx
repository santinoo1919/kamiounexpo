import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { render, screen, fireEvent } from "@testing-library/react-native"
import { CartProvider, useCart } from "../../../app/context/CartContext"
import { Product } from "../../../app/domains/data/products/types"

// Import existing mock data from the app
import { MOCK_PRODUCTS, MOCK_SHOPS } from "../../../app/domains/data/mockData/products"

// Use existing mock data
const mockProduct1 = MOCK_PRODUCTS[10] // iPhone 15 Pro
const mockProduct2 = MOCK_PRODUCTS[14] // MacBook Pro
const mockProduct3 = MOCK_PRODUCTS[11] // Nike Air Max

// Test component to access cart context
const TestCartComponent = () => {
  const cart = useCart()
  return (
    <View>
      <Text testID="total-items">{cart.totalItems}</Text>
      <Text testID="total-price">{cart.totalPrice}</Text>
      <Text testID="all-shops-valid">{cart.allShopsMeetMinimum.toString()}</Text>
      <Text testID="shop-count">{Object.keys(cart.cartByShopWithDetails).length}</Text>
      <Text testID="all-delivery-dates-selected">{cart.allDeliveryDatesSelected.toString()}</Text>
      <Text testID="delivery-dates-count">{Object.keys(cart.deliveryDates).length}</Text>

      <TouchableOpacity testID="add-product1" onPress={() => cart.addToCart(mockProduct1)}>
        <Text>Add iPhone</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="add-product2" onPress={() => cart.addToCart(mockProduct2)}>
        <Text>Add MacBook</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="add-product3" onPress={() => cart.addToCart(mockProduct3)}>
        <Text>Add Nike</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="clear-cart" onPress={() => cart.clearCart()}>
        <Text>Clear Cart</Text>
      </TouchableOpacity>

      {/* Delivery date test buttons */}
      <TouchableOpacity
        testID="select-delivery-apple"
        onPress={() => cart.selectDeliveryDate("apple_inc", new Date("2024-01-20"))}
      >
        <Text>Select Apple Delivery</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="select-delivery-nike"
        onPress={() => cart.selectDeliveryDate("nike_inc", new Date("2024-01-21"))}
      >
        <Text>Select Nike Delivery</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="clear-delivery-apple"
        onPress={() => cart.clearDeliveryDate("apple_inc")}
      >
        <Text>Clear Apple Delivery</Text>
      </TouchableOpacity>
    </View>
  )
}

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe("CartContext", () => {
  beforeEach(() => {
    // Clear cart before each test
    render(
      <TestWrapper>
        <TestCartComponent />
      </TestWrapper>,
    )

    const clearButton = screen.getByTestId("clear-cart")
    fireEvent.press(clearButton)
  })

  describe("Initial State", () => {
    test("should start with empty cart", () => {
      expect(screen.getByTestId("total-items")).toHaveTextContent("0")
      expect(screen.getByTestId("total-price")).toHaveTextContent("0")
      expect(screen.getByTestId("shop-count")).toHaveTextContent("0")
      expect(screen.getByTestId("all-shops-valid")).toHaveTextContent("true")
      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("true")
      expect(screen.getByTestId("delivery-dates-count")).toHaveTextContent("0")
    })
  })

  describe("Adding Items", () => {
    test("should add first item to cart", () => {
      const addButton = screen.getByTestId("add-product1")
      fireEvent.press(addButton)

      expect(screen.getByTestId("total-items")).toHaveTextContent("1")
      expect(screen.getByTestId("total-price")).toHaveTextContent("1199.99")
      expect(screen.getByTestId("shop-count")).toHaveTextContent("1")
    })

    test("should increment quantity when adding same product", () => {
      const addButton = screen.getByTestId("add-product1")

      // Add twice
      fireEvent.press(addButton)
      fireEvent.press(addButton)

      expect(screen.getByTestId("total-items")).toHaveTextContent("2")
      expect(screen.getByTestId("total-price")).toHaveTextContent("2399.98")
    })

    test("should add different products from same shop", () => {
      const addiPhone = screen.getByTestId("add-product1")
      const addMacBook = screen.getByTestId("add-product2")

      fireEvent.press(addiPhone)
      fireEvent.press(addMacBook)

      expect(screen.getByTestId("total-items")).toHaveTextContent("2")
      expect(parseFloat(screen.getByTestId("total-price").props.children)).toBeCloseTo(3699.98, 2)
      expect(screen.getByTestId("shop-count")).toHaveTextContent("1") // Same shop
    })

    test("should add products from different shops", () => {
      const addiPhone = screen.getByTestId("add-product1")
      const addNike = screen.getByTestId("add-product3")

      fireEvent.press(addiPhone)
      fireEvent.press(addNike)

      expect(screen.getByTestId("total-items")).toHaveTextContent("2")
      expect(screen.getByTestId("total-price")).toHaveTextContent("1329.98")
      expect(screen.getByTestId("shop-count")).toHaveTextContent("2") // Different shops
    })
  })

  describe("Shop Grouping", () => {
    test("should group items by shop correctly", () => {
      // Add items from different shops
      fireEvent.press(screen.getByTestId("add-product1")) // Apple
      fireEvent.press(screen.getByTestId("add-product2")) // Apple
      fireEvent.press(screen.getByTestId("add-product3")) // Nike

      expect(screen.getByTestId("shop-count")).toHaveTextContent("2")
    })

    test("should calculate shop subtotals correctly", () => {
      // Add multiple items from Apple shop
      fireEvent.press(screen.getByTestId("add-product1")) // 1199.99
      fireEvent.press(screen.getByTestId("add-product1")) // +1199.99 = 2399.98
      fireEvent.press(screen.getByTestId("add-product2")) // +2499.99 = 4899.97

      expect(parseFloat(screen.getByTestId("total-price").props.children)).toBeCloseTo(4899.97, 2)
    })
  })

  describe("Minimum Amount Validation", () => {
    test("should validate Apple shop minimum (100)", () => {
      // Add items below minimum
      fireEvent.press(screen.getByTestId("add-product1")) // 1199.99

      expect(screen.getByTestId("all-shops-valid")).toHaveTextContent("true") // 1199.99 > 100
    })

    test("should validate Nike shop minimum (50)", () => {
      fireEvent.press(screen.getByTestId("add-product3")) // 129.99

      expect(screen.getByTestId("all-shops-valid")).toHaveTextContent("true") // 129.99 > 50
    })
  })

  describe("Delivery Date Management", () => {
    test("should start with no delivery dates selected", () => {
      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("true")
      expect(screen.getByTestId("delivery-dates-count")).toHaveTextContent("0")
    })

    test("should select delivery date for shop", () => {
      // Add items first to create shops
      fireEvent.press(screen.getByTestId("add-product1")) // Apple
      fireEvent.press(screen.getByTestId("add-product3")) // Nike

      // Initially no delivery dates selected
      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("false")

      // Select delivery date for Apple
      const selectAppleDelivery = screen.getByTestId("select-delivery-apple")
      fireEvent.press(selectAppleDelivery)

      // Still false because Nike doesn't have delivery date
      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("false")

      // Select delivery date for Nike
      const selectNikeDelivery = screen.getByTestId("select-delivery-nike")
      fireEvent.press(selectNikeDelivery)

      // Now all delivery dates are selected
      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("true")
    })

    test("should clear delivery date for shop", () => {
      // Add items and select delivery dates
      fireEvent.press(screen.getByTestId("add-product1")) // Apple
      fireEvent.press(screen.getByTestId("add-product3")) // Nike

      fireEvent.press(screen.getByTestId("select-delivery-apple"))
      fireEvent.press(screen.getByTestId("select-delivery-nike"))

      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("true")

      // Clear Apple delivery date
      const clearAppleDelivery = screen.getByTestId("clear-delivery-apple")
      fireEvent.press(clearAppleDelivery)

      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("false")
    })
  })

  describe("Cart Operations", () => {
    test("should clear entire cart", () => {
      // Add some items
      fireEvent.press(screen.getByTestId("add-product1"))
      fireEvent.press(screen.getByTestId("add-product3"))

      // Clear cart
      const clearButton = screen.getByTestId("clear-cart")
      fireEvent.press(clearButton)

      expect(screen.getByTestId("total-items")).toHaveTextContent("0")
      expect(screen.getByTestId("total-price")).toHaveTextContent("0")
      expect(screen.getByTestId("shop-count")).toHaveTextContent("0")
    })
  })

  describe("Edge Cases", () => {
    test("should handle empty cart operations", () => {
      expect(screen.getByTestId("total-items")).toHaveTextContent("0")
      expect(screen.getByTestId("all-shops-valid")).toHaveTextContent("true")
      expect(screen.getByTestId("all-delivery-dates-selected")).toHaveTextContent("true")
    })
  })
})
