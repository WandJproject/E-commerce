# ShopEase — Frontend (Capstone Project)

A complete React frontend for the **E-Commerce Platform** capstone option, covering the customer storefront and the admin dashboard, matching the required UI reference and the project guidelines.

## Tech Stack
- React 18 + Vite
- React Router v6 (client-side routing, protected routes)
- Tailwind CSS
- Recharts (admin analytics charts)
- lucide-react (icons)
- Context API for Auth / Cart / Wishlist (persisted to `localStorage`)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (usually `http://localhost:5173`).

3. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Demo Accounts

This frontend uses mock authentication (no backend yet), stored in `localStorage`.

- **Admin login:** `admin@shopease.com` / `admin123`
- **Customer:** register a new account from the Register page, or log in with any account you create.

## Project Structure

```
src/
  components/
    common/       -> ProductCard, StarRating
    layout/        -> Navbar, Footer, StoreLayout, AdminSidebar, AdminHeader, AdminLayout, ProtectedRoute
  context/          -> AuthContext, CartContext, WishlistContext
  data/             -> mock products, categories, orders, customers, coupons, reviews
  pages/
    store/          -> Home, Shop, ProductDetail, Cart, Wishlist, Checkout, OrderSuccess,
                        Login, Register, About, MyOrders, NotFound
    admin/          -> Dashboard, Products, Categories, Orders, Customers, Inventory,
                        Reviews, Coupons, Reports, Settings
  App.jsx           -> all route definitions
  main.jsx          -> app entry point
```

## Features Implemented (per project guidelines)

**Storefront**
- Home page with hero, categories, top-selling products
- Shop page with search, category filter, price filter, sorting
- Product detail page with image gallery, quantity selector, add to cart / buy now / wishlist
- Cart with quantity update, removal, order summary
- Wishlist (save/remove favourites)
- Checkout flow with form validation (shipping + payment, mock)
- Login / Register (mock JWT-style auth via Context + localStorage)
- Protected routes (checkout & orders require login; `/admin` requires an admin account)
- Responsive design across breakpoints, loading/empty states, 404 page

**Admin Dashboard**
- Sidebar navigation (Dashboard, Products, Categories, Orders, Customers, Inventory, Reviews, Coupons, Reports, Settings)
- Dashboard stat cards, sales line chart, category donut chart, recent orders, best sellers
- Products: search, add / edit / delete (modal form)
- Categories: add / edit / delete
- Orders: search, filter by status, update order status
- Customers: searchable customer table
- Inventory: low-stock alerts, stock levels
- Reviews: moderate / delete customer reviews
- Coupons: create / delete discount codes
- Reports: revenue and sales charts
- Settings: admin profile form

## Connecting to Your Django Backend

This is a frontend-only build using mock data in `src/data/`. To wire it up to your Django REST Framework API:

1. Replace the mock arrays in `src/data/*.js` with API calls (e.g. using `fetch` or `axios`) inside each page, or create a small `src/api/` layer.
2. Replace `AuthContext`'s `login`/`register` functions with calls to your JWT endpoints, and store the returned access/refresh tokens instead of a plain user object.
3. Add an `Authorization: Bearer <token>` header to authenticated requests (cart checkout, admin CRUD, etc.).
4. Update `ProtectedRoute` if you want role information to come from the decoded JWT instead of the stored user object.

## Notes

- All cart/wishlist/auth data currently persists in the browser's `localStorage`, so it will reset if `localStorage` is cleared, and is per-browser (not shared between team members) until connected to the real backend.
- Product images are pulled from Unsplash for demo purposes — swap in your own product photography before final submission.
