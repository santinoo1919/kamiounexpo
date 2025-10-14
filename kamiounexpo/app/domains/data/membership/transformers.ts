import type { UserProfile } from "./types"

// Magento API response types (what Magento actually returns)
interface MagentoUserProfile {
  id: number
  email: string
  firstname: string
  lastname: string
  telephone?: string
  shop_type?: "individual" | "business"
  address?: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  vat_number?: string
  avatar_url?: string
  dob?: string
  gender?: number
  is_email_verified: boolean
  is_phone_verified: boolean
  created_at: string
  updated_at: string
}

// Transformers
export const transformUserProfile = (magentoData: MagentoUserProfile): UserProfile => {
  return {
    id: magentoData.id.toString(),
    email: magentoData.email,
    firstName: magentoData.firstname,
    lastName: magentoData.lastname,
    phone: magentoData.telephone,
    shopType: magentoData.shop_type,
    address: magentoData.address
      ? {
          street: magentoData.address.street,
          city: magentoData.address.city,
          state: magentoData.address.state,
          zipCode: magentoData.address.zip_code,
          country: magentoData.address.country,
        }
      : undefined,
    vatNumber: magentoData.vat_number,
    avatar: magentoData.avatar_url,
    dateOfBirth: magentoData.dob,
    gender: magentoData.gender === 1 ? "male" : magentoData.gender === 2 ? "female" : "other",
    isEmailVerified: magentoData.is_email_verified,
    isPhoneVerified: magentoData.is_phone_verified,
    createdAt: magentoData.created_at,
    updatedAt: magentoData.updated_at,
  }
}
