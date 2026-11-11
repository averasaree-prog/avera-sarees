# AVERA / Saanvi Sarees — REST API Specification

Interactive Swagger UI documentation is available at:
- **Local Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

---

## 🔐 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate customer or admin, returns JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Authenticated |

---

## 🥻 2. Products Catalog (`/api/products`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Paginated search and filtering (category, fabric, occasion, color, price range) | Public |
| `GET` | `/api/products/{slug}` | Detailed saree metadata, images, and ratings | Public |
| `GET` | `/api/products/featured` | Curated homepage spotlight sarees | Public |
| `GET` | `/api/products/best-sellers` | Top-selling sarees | Public |
| `GET` | `/api/products/new-arrivals` | Latest loom drop sarees | Public |
| `GET` | `/api/products/{id}/related`| Category-related sarees | Public |
| `GET` | `/api/products/meta/fabrics`| Distinct catalog fabric list | Public |

---

## 🛍️ 3. Shopping Bag & Wishlist (`/api/cart`, `/api/wishlist`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/cart` | Retrieve shopping bag items with server pricing | Public / Session |
| `POST` | `/api/cart/items` | Add saree item with stock check | Public / Session |
| `PATCH` | `/api/cart/items/{id}` | Update quantity of cart item | Public / Session |
| `DELETE` | `/api/cart/items/{id}` | Remove item from cart | Public / Session |
| `GET` | `/api/wishlist` | Fetch saved wishlist sarees | Authenticated |
| `POST` | `/api/wishlist/toggle/{id}` | Toggle saree in customer wishlist | Authenticated |

---

## 📦 4. Checkout, Orders & Logistics (`/api/checkout`, `/api/orders`, `/api/shipping`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/checkout/summary` | Revalidate product inventory, calculate coupons and shipping | Public / Session |
| `POST` | `/api/orders` | Place order with atomic inventory decrement and snapshots | Public / Guest / User |
| `GET` | `/api/orders/track/{orderNumber}` | Live order tracking with status history | Public |
| `GET` | `/api/orders/my-orders` | Authenticated customer's order history | Authenticated |
| `GET` | `/api/shipping/pincode/{pin}` | Check Indian PIN code serviceability and delivery timeline | Public |

---

## 💳 5. Payments (`/api/payments`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/payments/razorpay/verify` | Verify Razorpay HMAC-SHA256 signature and confirm order | Public |
| `POST` | `/api/payments/webhook` | Idempotent Razorpay event webhook receiver | Public |

---

## 🛡️ 6. Admin Command Center (`/api/admin`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/metrics` | Business KPIs (Revenue, Orders, Low Stock Alerts) | Role: `ROLE_ADMIN` |
| `GET` | `/api/admin/orders` | Paginated orders with status filtering | Role: `ROLE_ADMIN` |
| `PATCH`| `/api/admin/orders/{id}/status` | Update fulfillment state and add courier tracking | Role: `ROLE_ADMIN` |
| `POST` | `/api/admin/products` | Publish new saree to catalog | Role: `ROLE_ADMIN` |
| `PUT`  | `/api/admin/products/{id}` | Modify saree specifications and inventory | Role: `ROLE_ADMIN` |
| `POST` | `/api/admin/coupons` | Create promotional discount coupon | Role: `ROLE_ADMIN` |
| `GET`  | `/api/admin/reviews` | Patron reviews list for moderation | Role: `ROLE_ADMIN` |
| `PATCH`| `/api/admin/reviews/{id}/approval` | Approve or hide a customer review | Role: `ROLE_ADMIN` |
