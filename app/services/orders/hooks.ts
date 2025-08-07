import { useState, useEffect, useCallback } from "react"
import type {
  Order,
  OrderHistory,
  OrderTracking,
  DeliveryAddress,
  ShippingMethod,
  CreateOrderRequest,
  OrderStatus,
} from "./types"

// Mock data
const MOCK_DELIVERY_ADDRESSES: DeliveryAddress[] = [
  {
    id: "1",
    userId: "user-1",
    name: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    phone: "+1234567890",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    name: "Office",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "USA",
    phone: "+1234567891",
    isDefault: false,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
]

const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    price: 2.99,
    estimatedDays: 5,
    isAvailable: true,
    isExpress: false,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    price: 9.99,
    estimatedDays: 2,
    isAvailable: true,
    isExpress: true,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next business day",
    price: 19.99,
    estimatedDays: 1,
    isAvailable: true,
    isExpress: true,
  },
]

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    userId: "user-1",
    orderNumber: "ORD-2024-001",
    status: "delivered",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Coca-Cola Classic",
        productImage:
          "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
        price: 1.99,
        quantity: 2,
        total: 3.98,
      },
    ],
    subtotal: 3.98,
    tax: 0.4,
    shipping: 2.99,
    total: 7.37,
    currency: "USD",
    deliveryAddress: MOCK_DELIVERY_ADDRESSES[0],
    shippingMethod: MOCK_SHIPPING_METHODS[0],
    paymentMethod: "credit_card",
    estimatedDelivery: "2024-01-10T00:00:00Z",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-08T15:30:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    orderNumber: "ORD-2024-002",
    status: "shipped",
    items: [
      {
        id: "2",
        productId: "3",
        productName: "Lay's Classic Chips",
        productImage:
          "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop",
        price: 2.49,
        quantity: 1,
        total: 2.49,
      },
    ],
    subtotal: 2.49,
    tax: 0.25,
    shipping: 2.99,
    total: 5.73,
    currency: "USD",
    deliveryAddress: MOCK_DELIVERY_ADDRESSES[0],
    shippingMethod: MOCK_SHIPPING_METHODS[1],
    paymentMethod: "credit_card",
    estimatedDelivery: "2024-01-12T00:00:00Z",
    createdAt: "2024-01-09T14:00:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
]

// Orders service hooks
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      setOrders(MOCK_ORDERS)
    } catch (err) {
      setError("Failed to fetch orders")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrder = useCallback(async (request: CreateOrderRequest): Promise<Order | null> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock order creation
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: "user-1",
        orderNumber: `ORD-2024-${Math.floor(Math.random() * 1000)}`,
        status: "pending",
        items: request.items.map((item, index) => ({
          id: `item-${index}`,
          productId: item.productId,
          productName: "Mock Product",
          productImage:
            "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
          price: 9.99,
          quantity: item.quantity,
          total: 9.99 * item.quantity,
        })),
        subtotal: 19.98,
        tax: 2.0,
        shipping: 2.99,
        total: 24.97,
        currency: "USD",
        deliveryAddress: MOCK_DELIVERY_ADDRESSES[0],
        shippingMethod: MOCK_SHIPPING_METHODS[0],
        paymentMethod: "credit_card",
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setOrders((prev) => [newOrder, ...prev])
      setLoading(false)

      return newOrder
    } catch (err) {
      setError("Failed to create order")
      setLoading(false)
      return null
    }
  }, [])

  const cancelOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock order cancellation
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" as OrderStatus } : order,
        ),
      )

      setLoading(false)
      return true
    } catch (err) {
      setError("Failed to cancel order")
      setLoading(false)
      return false
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    createOrder,
    cancelOrder,
    refetch: fetchOrders,
  }
}

// Delivery addresses hook
export const useDeliveryAddresses = () => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAddresses(MOCK_DELIVERY_ADDRESSES)
    } catch (err) {
      setError("Failed to fetch addresses")
      console.error("Error fetching addresses:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addAddress = useCallback(
    async (
      address: Omit<DeliveryAddress, "id" | "userId" | "createdAt" | "updatedAt">,
    ): Promise<boolean> => {
      try {
        setLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newAddress: DeliveryAddress = {
          ...address,
          id: `address-${Date.now()}`,
          userId: "user-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setAddresses((prev) => [...prev, newAddress])
        setLoading(false)

        return true
      } catch (err) {
        setError("Failed to add address")
        setLoading(false)
        return false
      }
    },
    [],
  )

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  return {
    addresses,
    loading,
    error,
    addAddress,
    refetch: fetchAddresses,
  }
}

// Shipping methods hook
export const useShippingMethods = () => {
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchShippingMethods = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setMethods(MOCK_SHIPPING_METHODS)
    } catch (err) {
      setError("Failed to fetch shipping methods")
      console.error("Error fetching shipping methods:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShippingMethods()
  }, [fetchShippingMethods])

  return {
    methods,
    loading,
    error,
    refetch: fetchShippingMethods,
  }
}

// Order tracking hook
export const useOrderTracking = () => {
  const getOrderTracking = useCallback(async (orderId: string): Promise<OrderTracking | null> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock tracking data
      const tracking: OrderTracking = {
        orderId,
        status: "shipped",
        trackingNumber: "TRK123456789",
        estimatedDelivery: "2024-01-15T00:00:00Z",
        events: [
          {
            id: "1",
            status: "Order Placed",
            description: "Your order has been placed",
            timestamp: "2024-01-10T10:00:00Z",
          },
          {
            id: "2",
            status: "Processing",
            description: "Your order is being processed",
            timestamp: "2024-01-11T14:30:00Z",
          },
          {
            id: "3",
            status: "Shipped",
            description: "Your order has been shipped",
            location: "New York, NY",
            timestamp: "2024-01-12T09:15:00Z",
          },
        ],
      }

      return tracking
    } catch (err) {
      console.error("Error fetching order tracking:", err)
      return null
    }
  }, [])

  return {
    getOrderTracking,
  }
}
