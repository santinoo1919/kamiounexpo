import { useCallback } from "react"
import { useProductsServiceHubInitialize } from "@/domains/data/products/http"
import { useAuthServiceHubInitialize } from "@/domains/data/auth/http"
import { useCartServiceHubInitialize } from "@/domains/data/cart/http"
import { useOrdersServiceHubInitialize } from "@/domains/data/orders/http"
// Membership init is optional to avoid breaking if the module isn't ready on some platforms
let useMembershipServiceHubInitialize: any
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useMembershipServiceHubInitialize =
    require("@/domains/data/membership/http").useMembershipServiceHubInitialize
} catch (e) {
  useMembershipServiceHubInitialize = undefined
}

type ServiceInitParams = {
  isWeb?: boolean | null
}

export const useInitServices = ({ isWeb }: ServiceInitParams) => {
  const { initialize: initProducts, authorize: authorizeProducts } =
    useProductsServiceHubInitialize()
  const { initialize: initAuth, authorize: authorizeAuth } = useAuthServiceHubInitialize()
  const { initialize: initCart, authorize: authorizeCart } = useCartServiceHubInitialize()
  const { initialize: initOrders, authorize: authorizeOrders } = useOrdersServiceHubInitialize()
  const membershipInit = useMembershipServiceHubInitialize?.()
  const initMembership = membershipInit?.initialize
  const authorizeMembership = membershipInit?.authorize

  const initAllServices = useCallback(
    async (token: string) => {
      try {
        console.log("🔄 Initializing all domain services...")

        // Initialize all services
        initProducts()
        initAuth()
        initCart()
        initOrders()
        initMembership?.()

        // Authorize all services with token
        authorizeProducts(token)
        authorizeAuth(token)
        authorizeCart(token)
        authorizeOrders(token)
        authorizeMembership?.(token)

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
