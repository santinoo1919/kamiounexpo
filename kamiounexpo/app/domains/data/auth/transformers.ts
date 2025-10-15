import type { Customer } from "./types"

interface MedusaCustomer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export const transformCustomer = (medusaCustomer: MedusaCustomer): Customer => {
  return {
    id: medusaCustomer.id,
    email: medusaCustomer.email,
    first_name: medusaCustomer.first_name,
    last_name: medusaCustomer.last_name,
    phone: medusaCustomer.phone,
    created_at: medusaCustomer.created_at,
    updated_at: medusaCustomer.updated_at,
  }
}

// Backwards compatibility
export const transformUser = transformCustomer
