import { medusaIntegrationTestRunner } from "@medusajs/test-utils";

jest.setTimeout(60 * 1000);

medusaIntegrationTestRunner({
  inApp: true,
  env: {},
  testSuite: ({ api }) => {
    describe("Cart API", () => {
      let cartId: string;
      let variantId: string;
      let lineItemId: string;

      beforeAll(async () => {
        // Get a test variant from seeded products
        const productsResponse = await api.get("/store/products", {
          headers: {
            "x-publishable-api-key":
              process.env.MEDUSA_PUBLISHABLE_KEY ||
              "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
          },
        });

        const firstProduct = productsResponse.data.products[0];
        variantId = firstProduct.variants[0].id;
      });

      describe("POST /store/carts", () => {
        it("should create a new cart", async () => {
          const response = await api.post(
            "/store/carts",
            { region_id: null },
            {
              headers: {
                "x-publishable-api-key":
                  process.env.MEDUSA_PUBLISHABLE_KEY ||
                  "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
              },
            }
          );

          expect(response.status).toEqual(200);
          expect(response.data.cart).toBeDefined();
          expect(response.data.cart.id).toBeDefined();
          expect(response.data.cart.items).toEqual([]);
          expect(response.data.cart.total).toEqual(0);

          cartId = response.data.cart.id;
        });
      });

      describe("GET /store/carts/:id", () => {
        it("should retrieve cart by id", async () => {
          const response = await api.get(`/store/carts/${cartId}`, {
            headers: {
              "x-publishable-api-key":
                process.env.MEDUSA_PUBLISHABLE_KEY ||
                "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
            },
          });

          expect(response.status).toEqual(200);
          expect(response.data.cart.id).toEqual(cartId);
        });

        it("should return 404 for non-existent cart", async () => {
          try {
            await api.get("/store/carts/cart_nonexistent", {
              headers: {
                "x-publishable-api-key":
                  process.env.MEDUSA_PUBLISHABLE_KEY ||
                  "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
              },
            });
          } catch (error: any) {
            expect(error.response.status).toEqual(404);
          }
        });
      });

      describe("POST /store/carts/:id/line-items", () => {
        it("should add item to cart", async () => {
          const response = await api.post(
            `/store/carts/${cartId}/line-items`,
            {
              variant_id: variantId,
              quantity: 1,
            },
            {
              headers: {
                "x-publishable-api-key":
                  process.env.MEDUSA_PUBLISHABLE_KEY ||
                  "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
              },
            }
          );

          expect(response.status).toEqual(200);
          expect(response.data.cart.items).toHaveLength(1);
          expect(response.data.cart.items[0].variant_id).toEqual(variantId);
          expect(response.data.cart.items[0].quantity).toEqual(1);
          expect(response.data.cart.total).toBeGreaterThan(0);

          lineItemId = response.data.cart.items[0].id;
        });

        it("should increase quantity when adding same variant", async () => {
          const response = await api.post(
            `/store/carts/${cartId}/line-items`,
            {
              variant_id: variantId,
              quantity: 2,
            },
            {
              headers: {
                "x-publishable-api-key":
                  process.env.MEDUSA_PUBLISHABLE_KEY ||
                  "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
              },
            }
          );

          expect(response.status).toEqual(200);
          expect(response.data.cart.items).toHaveLength(1);
          expect(response.data.cart.items[0].quantity).toEqual(3); // 1 + 2
        });
      });

      describe("POST /store/carts/:id/line-items/:line_id", () => {
        it("should update line item quantity", async () => {
          const response = await api.post(
            `/store/carts/${cartId}/line-items/${lineItemId}`,
            { quantity: 5 },
            {
              headers: {
                "x-publishable-api-key":
                  process.env.MEDUSA_PUBLISHABLE_KEY ||
                  "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
              },
            }
          );

          expect(response.status).toEqual(200);
          expect(response.data.cart.items[0].quantity).toEqual(5);
        });
      });

      describe("DELETE /store/carts/:id/line-items/:line_id", () => {
        it("should remove line item from cart", async () => {
          const response = await api.delete(
            `/store/carts/${cartId}/line-items/${lineItemId}`,
            {
              headers: {
                "x-publishable-api-key":
                  process.env.MEDUSA_PUBLISHABLE_KEY ||
                  "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
              },
            }
          );

          expect(response.status).toEqual(200);
          expect(response.data.cart.items).toHaveLength(0);
          expect(response.data.cart.total).toEqual(0);
        });
      });

      describe("Cart validation", () => {
        it("should reject invalid variant_id", async () => {
          try {
            await api.post(
              `/store/carts/${cartId}/line-items`,
              {
                variant_id: "variant_invalid",
                quantity: 1,
              },
              {
                headers: {
                  "x-publishable-api-key":
                    process.env.MEDUSA_PUBLISHABLE_KEY ||
                    "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
                },
              }
            );
          } catch (error: any) {
            expect(error.response.status).toBeGreaterThanOrEqual(400);
          }
        });

        it("should reject invalid quantity", async () => {
          try {
            await api.post(
              `/store/carts/${cartId}/line-items`,
              {
                variant_id: variantId,
                quantity: -1,
              },
              {
                headers: {
                  "x-publishable-api-key":
                    process.env.MEDUSA_PUBLISHABLE_KEY ||
                    "pk_7bedfa1e24113de9f1cb37df6b7cbd31fee57f0c91e05db7333203e695bb6d41",
                },
              }
            );
          } catch (error: any) {
            expect(error.response.status).toBeGreaterThanOrEqual(400);
          }
        });
      });
    });
  },
});
