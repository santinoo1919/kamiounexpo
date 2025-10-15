export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateMedusaCustomer = (data: any): any => {
  if (!data) throw new ValidationError("Customer data is required")
  if (!data.id) throw new ValidationError("Missing id", "id")
  if (!data.email) throw new ValidationError("Missing email", "email")
  if (!data.first_name) throw new ValidationError("Missing first_name", "first_name")
  if (!data.last_name) throw new ValidationError("Missing last_name", "last_name")
  if (!data.created_at) throw new ValidationError("Missing created_at", "created_at")
  if (!data.updated_at) throw new ValidationError("Missing updated_at", "updated_at")
  return data
}

// Backwards compatibility
export const validateMagentoUser = validateMedusaCustomer
