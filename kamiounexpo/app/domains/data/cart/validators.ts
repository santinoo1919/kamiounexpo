export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateMedusaCart = (data: any): any => {
  if (!data) throw new ValidationError("Cart is required")
  if (!data.id) throw new ValidationError("Missing cart id", "id")
  if (!Array.isArray(data.items)) throw new ValidationError("Missing items", "items")
  if (!data.currency_code) throw new ValidationError("Missing currency_code", "currency_code")
  return data
}

// Legacy alias for backward compatibility
export const validateMagentoCart = validateMedusaCart
