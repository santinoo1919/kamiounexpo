import { MMKV } from "react-native-mmkv"

let _storage: MMKV | undefined
let _isJSIReady = false

// Check if JSI is ready
try {
  // Try to create a test instance to see if JSI is ready
  const testStorage = new MMKV()
  testStorage.setString("test", "test")
  testStorage.delete("test")
  _isJSIReady = true
} catch (error) {
  console.log("JSI not ready, using fallback storage")
  _isJSIReady = false
}

function getStorage(): MMKV | null {
  if (!_isJSIReady) {
    return null
  }
  if (!_storage) {
    _storage = new MMKV()
  }
  return _storage
}

// Fallback storage using AsyncStorage when MMKV is not available
let _fallbackStorage: { [key: string]: string } = {}

// Lazy-initialized storage using Proxy to delay MMKV creation until JSI is ready
export const storage = new Proxy({} as MMKV, {
  get: (target, prop) => {
    const instance = getStorage()
    if (!instance) {
      // Return fallback methods
      if (prop === "setString") {
        return (key: string, value: string) => {
          _fallbackStorage[key] = value
          console.log("Using fallback storage for setString:", key, "=", value)
        }
      }
      if (prop === "getString") {
        return (key: string) => {
          const value = _fallbackStorage[key]
          console.log("Using fallback storage for getString:", key, "=", value)
          return value
        }
      }
      if (prop === "delete") {
        return (key: string) => {
          delete _fallbackStorage[key]
          console.log("Using fallback storage for delete:", key)
        }
      }
      if (prop === "clearAll") {
        return () => {
          _fallbackStorage = {}
          console.log("Using fallback storage for clearAll")
        }
      }
      return undefined
    }
    const value = instance[prop as keyof MMKV]
    return typeof value === "function" ? value.bind(instance) : value
  },
})

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | null {
  try {
    return storage.getString(key) ?? null
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    storage.setString(key, value)
    return true
  } catch (error) {
    console.log("Storage save error:", error)
    return false
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load<T>(key: string): T | null {
  let almostThere: string | null = null
  try {
    almostThere = loadString(key)
    return JSON.parse(almostThere ?? "") as T
  } catch {
    return (almostThere as T) ?? null
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key: string, value: unknown): boolean {
  try {
    saveString(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): void {
  try {
    storage.delete(key)
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export function clear(): void {
  try {
    storage.clearAll()
  } catch {}
}
