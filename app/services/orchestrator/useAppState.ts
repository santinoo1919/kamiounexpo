import { useState, useCallback, useEffect } from "react"
import { useAuthService } from "@/services/auth/hooks"
import { useCart } from "@/services/cart/hooks"
import { useUserProfile } from "@/services/membership/hooks"

export interface AppState {
  isInitialized: boolean
  isOnline: boolean
  isLoading: boolean
  currentScreen: string
  lastActive: string
  appVersion: string
  buildNumber: string
}

export interface AppActions {
  setCurrentScreen: (screen: string) => void
  setOnlineStatus: (isOnline: boolean) => void
  setLoading: (isLoading: boolean) => void
  refreshAppState: () => void
}

export const useAppState = () => {
  const { isAuthenticated, user } = useAuthService()
  const { cart } = useCart()
  const { profile } = useUserProfile()

  const [appState, setAppState] = useState<AppState>({
    isInitialized: false,
    isOnline: true,
    isLoading: false,
    currentScreen: "Home",
    lastActive: new Date().toISOString(),
    appVersion: "1.0.0",
    buildNumber: "1",
  })

  // Update last active timestamp
  useEffect(() => {
    const updateLastActive = () => {
      setAppState((prev) => ({
        ...prev,
        lastActive: new Date().toISOString(),
      }))
    }

    // Update on user interaction
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    events.forEach((event) => {
      document.addEventListener(event, updateLastActive, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateLastActive, true)
      })
    }
  }, [])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setAppState((prev) => ({ ...prev, isOnline: true }))
      console.log("🌐 App is online")
    }

    const handleOffline = () => {
      setAppState((prev) => ({ ...prev, isOnline: false }))
      console.log("📴 App is offline")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const setCurrentScreen = useCallback((screen: string) => {
    setAppState((prev) => ({
      ...prev,
      currentScreen: screen,
      lastActive: new Date().toISOString(),
    }))
    console.log(`📱 Screen changed to: ${screen}`)
  }, [])

  const setOnlineStatus = useCallback((isOnline: boolean) => {
    setAppState((prev) => ({ ...prev, isOnline }))
  }, [])

  const setLoading = useCallback((isLoading: boolean) => {
    setAppState((prev) => ({ ...prev, isLoading }))
  }, [])

  const refreshAppState = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      lastActive: new Date().toISOString(),
    }))
    console.log("🔄 App state refreshed")
  }, [])

  const initializeApp = useCallback(() => {
    setAppState((prev) => ({ ...prev, isInitialized: true }))
    console.log("🚀 App initialized")
  }, [])

  // Computed app state
  const isUserLoggedIn = isAuthenticated && user !== null
  const hasCartItems = cart && cart.items.length > 0
  const cartItemCount = cart?.itemCount || 0
  const userName = profile?.firstName || user?.firstName || "Guest"

  return {
    // App state
    appState,
    isUserLoggedIn,
    hasCartItems,
    cartItemCount,
    userName,

    // App actions
    setCurrentScreen,
    setOnlineStatus,
    setLoading,
    refreshAppState,
    initializeApp,

    // Service state
    isAuthenticated,
    user,
    cart,
    profile,
  }
}
