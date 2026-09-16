# ShopEase Frontend

A polished React + Vite frontend for the ShopEase e-commerce platform, featuring a customer storefront and an admin dashboard. This project is designed to match the required capstone UI and provide a complete mock shopping experience.

## Overview

ShopEase Frontend includes:

- A responsive customer-facing store with product browsing, cart, wishlist, and checkout flow
- A complete admin area for managing products, categories, orders, customers, inventory, reviews, coupons, reports, and settings
- Context-based state management for authentication, cart, and wishlist actions
- Modern styling with Tailwind CSS and reusable UI components

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Recharts
- Lucide React
- Context API for auth, cart, and wishlist state

## Features

### Storefront

- Home page with promotional hero section and featured categories
- Shop page with search, filtering, sorting, and product listing
- Product detail page with quantity controls and add-to-cart actions
- Wishlist support for saving favorite items
- Cart page with quantity updates and order summary
- Checkout flow with a mock payment and shipping form
- Login and registration screens with mock authentication
- Protected routes for authenticated customer actions and admin-only access
- Responsive layout for desktop, tablet, and mobile screens

### Admin Dashboard

- Dashboard overview with KPI cards and analytics charts
- Product management with add, edit, and delete actions
- Category management
- Order tracking with status updates
- Customer management table
- Inventory monitoring with stock alerts
- Review moderation tools
- Coupon creation and management
- Reports and settings pages

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal, typically:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
npm run preview
```

## Demo Accounts

This frontend currently uses mock authentication stored in localStorage.

- Admin: `admin@shopease.com` / `admin123`
- Customer: create a new account from the register page, or log in with a registered account

## Project Structure

```text
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
  App.jsx           -> route definitions
  main.jsx          -> app entry point
```

## Backend Integration Notes

This version is frontend-only and currently relies on mock data from `src/data/`.

To connect it to your Django REST API:

1. Replace mock data usage with API requests in each page or create a dedicated `src/api/` service layer.
2. Update `AuthContext` to use real login and registration endpoints.
3. Store JWT access and refresh tokens instead of a plain user object.
4. Attach `Authorization: Bearer <token>` headers on protected requests.
5. Update `ProtectedRoute` to derive admin/user role information from the backend response or decoded token.

## Notes

- Authentication, cart, and wishlist data are currently stored in the browser's localStorage.
- Product images are demo placeholders from Unsplash and can be replaced with real brand assets before final deployment.
- This project is meant to be a frontend prototype/demo and can be connected to the Django backend for production use.
