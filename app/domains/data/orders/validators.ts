export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateMagentoOrder = (data: any): any => {
  if (!data) throw new ValidationError("Order is required")
  if (!data.entity_id) throw new ValidationError("Missing entity_id", "entity_id")
  if (!data.increment_id) throw new ValidationError("Missing increment_id", "increment_id")
  if (!Array.isArray(data.items)) throw new ValidationError("Missing items", "items")
  if (!data.created_at) throw new ValidationError("Missing created_at", "created_at")
  if (!data.updated_at) throw new ValidationError("Missing updated_at", "updated_at")
  return data
}

export const validateMagentoAddress = (data: any): any => {
  if (!data) throw new ValidationError("Address is required")
  if (!data.entity_id) throw new ValidationError("Missing entity_id", "entity_id")
  if (!data.firstname) throw new ValidationError("Missing firstname", "firstname")
  if (!data.lastname) throw new ValidationError("Missing lastname", "lastname")
  if (!data.city) throw new ValidationError("Missing city", "city")
  if (!data.region) throw new ValidationError("Missing region", "region")
  if (!data.postcode) throw new ValidationError("Missing postcode", "postcode")
  if (!data.country_id) throw new ValidationError("Missing country_id", "country_id")
  return data
}

export const validateMagentoShippingMethod = (data: any): any => {
  if (!data) throw new ValidationError("Shipping method is required")
  if (!data.method_id) throw new ValidationError("Missing method_id", "method_id")
  if (!data.method_title) throw new ValidationError("Missing method_title", "method_title")
  if (typeof data.price_incl_tax !== "number")
    throw new ValidationError("Invalid price_incl_tax", "price_incl_tax")
  return data
}

export const validateMagentoTracking = (data: any): any => {
  if (!data) throw new ValidationError("Tracking is required")
  if (!data.order_id) throw new ValidationError("Missing order_id", "order_id")
  if (!Array.isArray(data.events)) throw new ValidationError("Missing events", "events")
  return data
}
