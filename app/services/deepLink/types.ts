export interface DeepLinkRoute {
  screen: string
  params?: Record<string, any>
  timestamp: number
}

export interface DeepLinkConfig {
  prefixes: string[]
  screens: Record<string, string>
  fallback?: string
}

export interface DeepLinkHandler {
  canHandle: (url: string) => boolean
  handle: (url: string, params?: Record<string, any>) => Promise<void>
  validate?: (params: Record<string, any>) => boolean
}

export interface DeepLinkAnalytics {
  trackLinkOpen: (url: string, source: string) => void
  trackLinkError: (url: string, error: string) => void
  trackLinkSuccess: (url: string, screen: string) => void
}

export type DeepLinkSource = 
  | 'push_notification'
  | 'email'
  | 'sms'
  | 'social_media'
  | 'qr_code'
  | 'web'
  | 'external_app'
  | 'manual' 