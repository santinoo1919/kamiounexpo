import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react"
import { loadString, saveString } from "@/utils/storage"
import { useAuthStore } from "@/stores/authStore"

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  authEmail?: string
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  logout: () => void
  validationError: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Custom hook to use lazy-loaded string storage
 * Replaces useMMKVString to avoid JSI initialization issues
 */
function useStorageString(key: string): [string | undefined, (value: string | undefined) => void] {
  const [value, setValue] = useState<string | undefined>()
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial value from storage
  useEffect(() => {
    const initialValue = loadString(key)
    setValue(initialValue ?? undefined)
    setIsLoaded(true)
  }, [key])

  const setter = useCallback(
    (newValue: string | undefined) => {
      setValue(newValue)
      if (newValue === undefined) {
        saveString(key, "")
      } else {
        saveString(key, newValue)
      }
    },
    [key],
  )

  return [value, setter]
}

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useStorageString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useStorageString("AuthProvider.authEmail")

  // Sync with authStore
  const {
    isAuthenticated: storeIsAuthenticated,
    token: storeToken,
    customer: storeCustomer,
  } = useAuthStore()

  // Update AuthContext when authStore changes
  useEffect(() => {
    if (storeIsAuthenticated && storeToken) {
      setAuthToken(storeToken)
      if (storeCustomer?.email) {
        setAuthEmail(storeCustomer.email)
      }
    } else if (!storeIsAuthenticated) {
      setAuthToken(undefined)
      setAuthEmail("")
    }
  }, [storeIsAuthenticated, storeToken, storeCustomer?.email, setAuthToken, setAuthEmail])

  const logout = useCallback(() => {
    setAuthToken(undefined)
    setAuthEmail("")
  }, [setAuthEmail, setAuthToken])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    authEmail,
    setAuthToken,
    setAuthEmail,
    logout,
    validationError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
