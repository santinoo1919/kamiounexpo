export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateMagentoCart = (data: any): any => {
  if (!data) throw new ValidationError("Cart is required")
  if (!Array.isArray(data.items)) throw new ValidationError("Missing items", "items")
  if (!data.updated_at) throw new ValidationError("Missing updated_at", "updated_at")
  return data
}
