import { useCallback } from "react"
import { useProductsServiceHubInitialize } from "@/domains/data/products/http"
import { useAuthServiceHubInitialize } from "@/domains/data/auth/http"
import { useCartServiceHubInitialize } from "@/domains/data/cart/http"
import { useOrdersServiceHubInitialize } from "@/domains/data/orders/http"
import { useMembershipServiceHubInitialize } from "@/domains/data/membership/http"

type ServiceInitParams = {
  isWeb?: boolean | null
}

export const useInitServices = ({ isWeb }: ServiceInitParams) => {
  const { initialize: initProducts, authorize: authorizeProducts } =
    useProductsServiceHubInitialize()
  const { initialize: initAuth, authorize: authorizeAuth } = useAuthServiceHubInitialize()
  const { initialize: initCart, authorize: authorizeCart } = useCartServiceHubInitialize()
  const { initialize: initOrders, authorize: authorizeOrders } = useOrdersServiceHubInitialize()
  const { initialize: initMembership, authorize: authorizeMembership } =
    useMembershipServiceHubInitialize()

  const initAllServices = useCallback(
    async (token: string) => {
      try {
        console.log("🔄 Initializing all domain services...")

        // Initialize all services
        initProducts()
        initAuth()
        initCart()
        initOrders()
        initMembership()

        // Authorize all services with token
        authorizeProducts(token)
        authorizeAuth(token)
        authorizeCart(token)
        authorizeOrders(token)
        authorizeMembership(token)

        console.log("✅ All domain services initialized successfully")
      } catch (error) {
        console.error("❌ Error initializing services:", error)
        throw error
      }
    },
    [
      initProducts,
      initAuth,
      initCart,
      initOrders,
      initMembership,
      authorizeProducts,
      authorizeAuth,
      authorizeCart,
      authorizeOrders,
      authorizeMembership,
    ],
  )

  const initServicesWithoutAuth = useCallback(() => {
    try {
      console.log("🔄 Initializing services without authentication...")

      // Initialize services that don't require auth
      initProducts()

      console.log("✅ Services initialized without authentication")
    } catch (error) {
      console.error("❌ Error initializing services:", error)
      throw error
    }
  }, [initProducts])

  return {
    initAllServices,
    initServicesWithoutAuth,
  }
}
