export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateMagentoProduct = (data: any): any => {
  if (!data) throw new ValidationError("Product is required")
  if (!data.id) throw new ValidationError("Missing id", "id")
  if (!data.name) throw new ValidationError("Missing name", "name")
  if (typeof data.price !== "number") throw new ValidationError("Invalid price", "price")
  if (!data.created_at) throw new ValidationError("Missing created_at", "created_at")
  if (!data.updated_at) throw new ValidationError("Missing updated_at", "updated_at")
  return data
}

export const validateMagentoCategory = (data: any): any => {
  if (!data) throw new ValidationError("Category is required")
  if (!data.id) throw new ValidationError("Missing id", "id")
  if (!data.name) throw new ValidationError("Missing name", "name")
  if (typeof data.product_count !== "number")
    throw new ValidationError("Invalid product_count", "product_count")
  return data
}

export const validateMagentoShop = (data: any): any => {
  if (!data) throw new ValidationError("Shop is required")
  if (!data.id) throw new ValidationError("Missing id", "id")
  if (!data.name) throw new ValidationError("Missing name", "name")
  if (!data.supplier) throw new ValidationError("Missing supplier", "supplier")
  if (typeof data.product_count !== "number")
    throw new ValidationError("Invalid product_count", "product_count")
  return data
}
