import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { DeepLink } from "@/types/deepLink"

interface DeepLinkContextType {
  initialLink: DeepLink | null
  currentLink: DeepLink | null
  handleDeepLink: (url: string) => void
}

const DeepLinkContext = createContext<DeepLinkContextType | null>(null)

export const useDeepLinkContext = () => {
  const context = useContext(DeepLinkContext)
  if (!context) {
    throw new Error("useDeepLinkContext must be used within a DeepLinkProvider")
  }
  return context
}

interface DeepLinkProviderProps {
  children: React.ReactNode
}

export const DeepLinkProvider = ({ children }: DeepLinkProviderProps) => {
  const [initialLink, setInitialLink] = useState<DeepLink | null>(null)
  const [currentLink, setCurrentLink] = useState<DeepLink | null>(null)
  const navigation = useNavigation()

  const parseDeepLink = useCallback((url: string): DeepLink | null => {
    try {
      // Remove protocol and domain
      const path = url.replace(/^.*?:\/\/[^\/]+/, "")

      // Parse path segments
      const segments = path.split("/").filter(Boolean)

      if (segments.length === 0) return null

      const type = segments[0] as DeepLink["type"]
      const params: Record<string, string> = {}

      // Extract parameters
      if (segments.length > 1) {
        for (let i = 1; i < segments.length; i += 2) {
          if (segments[i + 1]) {
            params[segments[i]] = segments[i + 1]
          }
        }
      }

      return { type, params }
    } catch (error) {
      console.error("Failed to parse deep link:", error)
      return null
    }
  }, [])

  const navigateToDeepLink = useCallback(
    (link: DeepLink) => {
      try {
        switch (link.type) {
          case "product":
            if (link.params.id) {
              navigation.navigate("Product" as never, { productId: link.params.id } as never)
            }
            break
          case "category":
            if (link.params.slug) {
              navigation.navigate("Category" as never, { categorySlug: link.params.slug } as never)
            }
            break
          case "cart":
            navigation.navigate("Cart" as never)
            break
          case "profile":
            navigation.navigate("Settings" as never)
            break
          case "order":
            if (link.params.orderId) {
              navigation.navigate("Order" as never, { orderId: link.params.orderId } as never)
            }
            break
          case "shop":
            if (link.params.shopId) {
              navigation.navigate("Shop" as never, { shopId: link.params.shopId } as never)
            }
            break
          default:
            console.warn("Unknown deep link type:", link.type)
        }
      } catch (error) {
        console.error("Failed to navigate to deep link:", error)
      }
    },
    [navigation],
  )

  const handleDeepLink = useCallback(
    (url: string) => {
      const parsedLink = parseDeepLink(url)
      if (parsedLink) {
        setCurrentLink(parsedLink)
        navigateToDeepLink(parsedLink)
      }
    },
    [parseDeepLink, navigateToDeepLink],
  )

  useEffect(() => {
    // Handle app launch from deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        const parsedLink = parseDeepLink(url)
        if (parsedLink) {
          setInitialLink(parsedLink)
          navigateToDeepLink(parsedLink)
        }
      }
    })

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url)
    })

    return () => subscription?.remove()
  }, [handleDeepLink, parseDeepLink, navigateToDeepLink])

  return (
    <DeepLinkContext.Provider value={{ initialLink, currentLink, handleDeepLink }}>
      {children}
    </DeepLinkContext.Provider>
  )
}
