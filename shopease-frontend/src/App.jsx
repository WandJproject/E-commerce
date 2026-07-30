import React from 'react'
import { Routes, Route } from 'react-router-dom'
import StoreLayout from './components/layout/StoreLayout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

import Home from './pages/store/Home.jsx'
import Shop from './pages/store/Shop.jsx'
import ProductDetail from './pages/store/ProductDetail.jsx'
import Cart from './pages/store/Cart.jsx'
import Wishlist from './pages/store/Wishlist.jsx'
import Checkout from './pages/store/Checkout.jsx'
import OrderSuccess from './pages/store/OrderSuccess.jsx'
import Login from './pages/store/Login.jsx'
import Register from './pages/store/Register.jsx'
import About from './pages/store/About.jsx'
import MyOrders from './pages/store/MyOrders.jsx'
import NotFound from './pages/store/NotFound.jsx'

import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import AdminCategories from './pages/admin/Categories.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import AdminCustomers from './pages/admin/Customers.jsx'
import AdminInventory from './pages/admin/Inventory.jsx'
import AdminReviews from './pages/admin/Reviews.jsx'
import AdminCoupons from './pages/admin/Coupons.jsx'
import AdminReports from './pages/admin/Reports.jsx'
import AdminSettings from './pages/admin/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}
