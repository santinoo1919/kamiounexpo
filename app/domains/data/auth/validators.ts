export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateMagentoUser = (data: any): any => {
  if (!data) throw new ValidationError("User data is required")
  if (!data.id) throw new ValidationError("Missing id", "id")
  if (!data.email) throw new ValidationError("Missing email", "email")
  if (!data.firstname) throw new ValidationError("Missing firstname", "firstname")
  if (!data.lastname) throw new ValidationError("Missing lastname", "lastname")
  if (typeof data.is_email_verified !== "boolean")
    throw new ValidationError("Invalid is_email_verified", "is_email_verified")
  if (typeof data.is_phone_verified !== "boolean")
    throw new ValidationError("Invalid is_phone_verified", "is_phone_verified")
  if (!data.created_at) throw new ValidationError("Missing created_at", "created_at")
  if (!data.updated_at) throw new ValidationError("Missing updated_at", "updated_at")
  return data
}
