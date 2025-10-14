import type { User } from "./types"

interface MagentoUser {
  id: number
  email: string
  firstname: string
  lastname: string
  telephone?: string
  avatar_url?: string
  is_email_verified: boolean
  is_phone_verified: boolean
  created_at: string
  updated_at: string
}

export const transformUser = (magentoUser: MagentoUser): User => {
  return {
    id: magentoUser.id.toString(),
    email: magentoUser.email,
    firstName: magentoUser.firstname,
    lastName: magentoUser.lastname,
    phone: magentoUser.telephone,
    avatar: magentoUser.avatar_url,
    isEmailVerified: magentoUser.is_email_verified,
    isPhoneVerified: magentoUser.is_phone_verified,
    createdAt: magentoUser.created_at,
    updatedAt: magentoUser.updated_at,
  }
}
