import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OffersProvider } from './context/OffersContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';

import ScrollToTop from './components/common/ScrollToTop';

// Storefront Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MobileBottomNav from './components/common/MobileBottomNav';
import CartDrawer from './components/cart/CartDrawer';

// Storefront Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Bookings from './pages/Bookings';
import Addresses from './pages/Addresses';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';

// Admin Console Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import Overview from './pages/admin/Overview';
import Analytics from './pages/admin/Analytics';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminAppointments from './pages/admin/Appointments';
import AdminCoupons from './pages/admin/Coupons';
import AdminCustomers from './pages/admin/Customers';
import AdminPlaybook from './pages/admin/Playbook';
import AdminSettings from './pages/admin/Settings';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      {/* Global Storefront Navbar (hidden on /admin routes) */}
      {!isAdmin && <Navbar />}

      {/* Main Page Body */}
      <main className={`flex-1 ${!isAdmin ? 'pb-16 md:pb-0' : ''}`}>
        <Routes>
          {/* ── Public Storefront Routes ── */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* ── Admin Console (Dedicated Luxury Layout with 9 Pages) ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="playbook" element={<AdminPlaybook />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── Customer Portal Routes ── */}
          <Route path="/book" element={<Booking />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<Bookings />} />
          <Route path="/addresses" element={<Addresses />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Storefront Cart & Footer (hidden on /admin routes) */}
      {!isAdmin && (
        <>
          <CartDrawer />
          <MobileBottomNav />
          <Footer />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <OffersProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <SocketProvider>
                    <AppLayout />
                  </SocketProvider>
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </OffersProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
