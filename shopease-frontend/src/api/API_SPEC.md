# ShopEase API Spec (Frontend Integration)

Base URL: `/api/v1/` (example deployed base: `https://e-commerce-6kpd.onrender.com/api/v1`)

Auth

- POST `/auth/login/`
  - Body: `{ "username": "<email|username>", "password": "<password>" }`
  - Response (200): `{ "access": "<access_token>", "refresh": "<refresh_token>", "user": { ... }, "message": "..." }`
  - Notes: backend uses `username` field for login; frontend helpers may send email as `username`.

- POST `/auth/register/`
  - Body: `{ "username": "<username>", "email": "<email>", "password": "<password>", "confirm_password": "<password>", "first_name": "", "last_name": "" }`
  - Response (201): `{ "message": "Registration successful.", "user": { ... }, "access": "<access>", "refresh": "<refresh>" }`

- POST `/auth/token/refresh/`
  - Body: `{ "refresh": "<refresh_token>" }`
  - Response: `{ "access": "<new_access_token>" }`

- GET `/auth/profile/` (Requires Authorization `Bearer <access>`)
  - Response: user profile object

Products & Categories

- GET `/products/`
  - Returns paginated list: `{ count, next, previous, results: [ { id, name, slug, description, price, discount_price, stock_quantity, category: {id,name,slug}, brand:{...}, images:[], average_rating, review_count } ] }`

- GET `/products/{id}/`
  - Returns single product object (see normalize rules in frontend `storeApi.js`).

- GET `/categories/`
  - Returns list of categories (id/slug, name)

Cart

- All cart endpoints require Authorization `Bearer <access>`
- GET `/cart/`
  - Response: cart object with `items` array: each item includes `product` (id), `product_name`, `product_price`, `quantity`, `subtotal`; plus cart `total_items`, `total_price`.

- POST `/cart/add/`
  - Body: `{ "product_id": <int>, "quantity": <int> }`
  - Response: updated cart (same shape as GET `/cart/`)

- POST `/cart/remove/`
  - Body: `{ "product_id": <int> }`
  - Response: updated cart

- POST `/cart/update/`
  - Body: `{ "product_id": <int>, "quantity": <int> }`
  - Response: updated cart

- POST `/cart/clear/`
  - Body: none
  - Response: `{ "message": "Cart cleared successfully." }`

Wishlist

- All wishlist endpoints require Authorization `Bearer <access>`
- GET `/wishlist/`
  - Response: array of wishlist items; each item includes `product` (id) and related product fields via serializer.

- POST `/wishlist/add/`
  - Body: `{ "product_id": <int> }`
  - Response: list of wishlist items (updated)

- POST `/wishlist/remove/`
  - Body: `{ "product_id": <int> }`
  - Response: list of wishlist items (updated)

Orders

- GET `/orders/` (Requires Authorization)
  - Response: list of orders

- POST `/orders/checkout/`
  - Body: checkout payload (varies by implementation). Frontend should send `{ items: [...], shipping_address: {...}, payment_method: "..." }` — verify with backend teammate for exact shape.
  - Response: order confirmation

Reviews

- POST `/reviews/` (Create review)
  - Body: `{ "product": <product_id>, "rating": <int>, "comment": "..." }` (user is set server-side)
  - Response: created review

- GET `/reviews/product/{product_id}/`
  - Response: list of reviews for the product

- PUT `/reviews/{id}/update/` (Requires auth, only review owner)
  - Body: fields to update (e.g., `rating`, `comment`)

- DELETE `/reviews/{id}/delete/` (Requires auth, only review owner)

Auth & Headers

- Include header: `Authorization: Bearer <access_token>` for protected routes
- Content-Type: `application/json` for JSON requests

Error handling

- Non-2xx responses return standard DRF error shapes (400 with field errors, 401 for unauthenticated, 403 for forbidden)
- Frontend should show error messages from response body when available

Examples (curl)

```
curl -X POST https://e-commerce-6kpd.onrender.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"secret"}'

curl -X POST https://e-commerce-6kpd.onrender.com/api/v1/cart/add/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS>" \
  -d '{"product_id": 38, "quantity": 1}'
```

Notes & Next Steps

- Confirm checkout payload shape with backend (payment integration varies).
- If backend removes or changes endpoints, ask backend teammate to provide a short OpenAPI/Swagger export or a list of replaced endpoints.
- I will not change backend code further—I'll keep producing frontend-focused artifacts (API spec, helper mappings, example requests).

Important deployed behavior:
- Deployed API (checked against https://e-commerce-6kpd.onrender.com) does NOT expose `/cart/update/` (returned 404 in smoke-check). Use one of these frontend strategies:
  - Use `POST /cart/add/` to increase quantity by the delta and `POST /cart/remove/` then `POST /cart/add/` to set a lower quantity (the frontend now does this when `/cart/update/` is missing).
  - After performing adds/removes, always re-GET `/cart/` to obtain authoritative server state.
  - If your workflow needs an idempotent absolute-set endpoint, coordinate with the backend teammate to expose `/cart/update/` or return a PATCH-style endpoint for cart items.

These recommendations ensure frontend state stays consistent with the server when the dedicated update endpoint is unavailable.

---

Generated by integration assistant to help frontend developers wire API calls quickly.
