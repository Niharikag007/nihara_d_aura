import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OffersProvider } from './context/OffersContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';

import ScrollToTop from './components/common/ScrollToTop';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MobileBottomNav from './components/common/MobileBottomNav';
import CartDrawer from './components/cart/CartDrawer';

// Pages
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
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/common/AdminRoute';

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
                    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
                      
                      {/* Global Navbar */}
                      <Navbar />

                      {/* Main Page Body */}
                      <main className="flex-1 pb-16 md:pb-0">
                        <Routes>
                          {/* Public Routes */}
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

                          {/* Admin Dashboard - RBAC Protected */}
                          <Route 
                            path="/admin" 
                            element={
                              <AdminRoute>
                                <AdminDashboard />
                              </AdminRoute>
                            } 
                          />

                          {/* Customer Routes */}
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

                      {/* Global Cart Slide-Over Drawer */}
                      <CartDrawer />

                      {/* Mobile Bottom Navigation (as in APK) */}
                      <MobileBottomNav />

                      {/* Global Desktop & Responsive Footer */}
                      <Footer />

                    </div>
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
