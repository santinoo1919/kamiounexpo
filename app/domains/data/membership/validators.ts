import type { UserProfile } from "./types"

// Validation error class
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

// Profile validation
export const validateUserProfile = (data: any): any => {
  if (!data) throw new ValidationError("Profile data is required")

  if (!data.id) throw new ValidationError("Missing user ID", "id")
  if (!data.email) throw new ValidationError("Missing email", "email")
  if (!data.firstname) throw new ValidationError("Missing first name", "firstname")
  if (!data.lastname) throw new ValidationError("Missing last name", "lastname")

  if (typeof data.is_email_verified !== "boolean") {
    throw new ValidationError("Invalid email verification status", "is_email_verified")
  }

  if (typeof data.is_phone_verified !== "boolean") {
    throw new ValidationError("Invalid phone verification status", "is_phone_verified")
  }

  if (!data.created_at) throw new ValidationError("Missing creation date", "created_at")
  if (!data.updated_at) throw new ValidationError("Missing update date", "updated_at")

  return data
}
