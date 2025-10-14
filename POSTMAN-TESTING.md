# Testing Medusa Backend with Postman 🚀

## ✅ Backend Status

- **Running:** localhost:9000
- **Database:** PostgreSQL with demo data
- **Admin:** http://localhost:9000/app

---

## Postman Setup

### 1. Environment Variables

Set in your "local" environment:

```
base_url = http://localhost:9000
```

### 2. Test Endpoints (In Order)

#### ✅ Health Check

```http
GET {{base_url}}/health
```

**Expected:** `OK`

---

#### ✅ List Products

```http
GET {{base_url}}/store/products
```

**Expected:** Array of products with demo data

---

#### ✅ Get Single Product

```http
GET {{base_url}}/store/products/{product_id}
```

**Use a product ID from the list response**

---

#### ✅ Get Regions

```http
GET {{base_url}}/store/regions
```

**Expected:** List of available regions

---

#### ✅ Create Cart

```http
POST {{base_url}}/store/carts
Content-Type: application/json

{
  "region_id": "{region_id_from_previous_response}"
}
```

**Expected:** New cart object with cart_id

---

#### ✅ Add Item to Cart

```http
POST {{base_url}}/store/carts/{cart_id}/line-items
Content-Type: application/json

{
  "variant_id": "{variant_id_from_product}",
  "quantity": 2
}
```

**Expected:** Updated cart with items

---

#### ✅ View Cart

```http
GET {{base_url}}/store/carts/{cart_id}
```

**Expected:** Cart details with items, totals

---

## Important Notes

### Product Structure

Medusa uses **variants**, not direct products:

- Each product has variants (sizes, colors, etc.)
- When adding to cart, use `variant_id` (not `product_id`)
- Get variant_id from product response: `product.variants[0].id`

### Cart Flow

1. Create cart → Get `cart_id`
2. Add items using `variant_id`
3. Add shipping address
4. Select shipping method
5. Complete cart → Creates order

---

## Create Admin User

**Option 1: Via Browser**

1. Open: http://localhost:9000/app
2. Use the invite link from terminal output
3. Set email/password

**Option 2: Via CLI**

```bash
cd backend
npx medusa user -e admin@test.com -p supersecret
```

---

## Troubleshooting

### "Connection Refused"

- Check backend is running: `curl http://localhost:9000/health`
- Restart: `cd backend && yarn dev`

### "Invalid variant_id"

- Get variant from product: `/store/products`
- Use: `product.variants[0].id` (not `product.id`)

### "Region required"

- Get region first: `/store/regions`
- Use region_id when creating cart

---

## What's Running

```
Backend:     localhost:9000
Admin:       localhost:9000/app
Database:    PostgreSQL (localhost:5432)
Demo Data:   ✅ Loaded
```

**Happy Testing!** 🎉
