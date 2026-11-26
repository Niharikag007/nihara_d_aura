import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OffersProvider } from './context/OffersContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import { ServiceProvider } from './context/ServiceContext';

import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import lazyRetry from './utils/lazyRetry';

// Storefront Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MobileBottomNav from './components/common/MobileBottomNav';
import CartDrawer from './components/cart/CartDrawer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Storefront Pages — with auto-retry on chunk load failure
const Home = lazy(() => lazyRetry(() => import('./pages/Home')));
const Products = lazy(() => lazyRetry(() => import('./pages/Products')));
const ProductDetails = lazy(() => lazyRetry(() => import('./pages/ProductDetails')));
const Categories = lazy(() => lazyRetry(() => import('./pages/Categories')));
const Services = lazy(() => lazyRetry(() => import('./pages/Services')));
const Booking = lazy(() => lazyRetry(() => import('./pages/Booking')));
const Cart = lazy(() => lazyRetry(() => import('./pages/Cart')));
const Checkout = lazy(() => lazyRetry(() => import('./pages/Checkout')));
const Wishlist = lazy(() => lazyRetry(() => import('./pages/Wishlist')));
const Profile = lazy(() => lazyRetry(() => import('./pages/Profile')));
const Orders = lazy(() => lazyRetry(() => import('./pages/Orders')));
const Bookings = lazy(() => lazyRetry(() => import('./pages/Bookings')));
const Addresses = lazy(() => lazyRetry(() => import('./pages/Addresses')));
const Login = lazy(() => lazyRetry(() => import('./pages/Login')));
const Register = lazy(() => lazyRetry(() => import('./pages/Register')));
const VerifyOTP = lazy(() => lazyRetry(() => import('./pages/VerifyOTP')));
const About = lazy(() => lazyRetry(() => import('./pages/About')));
const HelpCenter = lazy(() => lazyRetry(() => import('./pages/HelpCenter')));
const Notifications = lazy(() => lazyRetry(() => import('./pages/Notifications')));
const ReturnsAndRefunds = lazy(() => lazyRetry(() => import('./pages/ReturnsAndRefunds')));

// Admin Console Layout & Pages — with auto-retry
const AdminLayout = lazy(() => lazyRetry(() => import('./components/admin/AdminLayout')));
const Overview = lazy(() => lazyRetry(() => import('./pages/admin/Overview')));
const Analytics = lazy(() => lazyRetry(() => import('./pages/admin/Analytics')));
const AdminProducts = lazy(() => lazyRetry(() => import('./pages/admin/Products')));
const AdminCategories = lazy(() => lazyRetry(() => import('./pages/admin/Categories')));
const AdminInventory = lazy(() => lazyRetry(() => import('./pages/admin/Inventory')));
const AdminServices = lazy(() => lazyRetry(() => import('./pages/admin/Services')));
const AdminArtists = lazy(() => lazyRetry(() => import('./pages/admin/Artists')));
const AdminOrders = lazy(() => lazyRetry(() => import('./pages/admin/Orders')));
const AdminAppointments = lazy(() => lazyRetry(() => import('./pages/admin/Appointments')));
const AdminCoupons = lazy(() => lazyRetry(() => import('./pages/admin/Coupons')));
const AdminCustomers = lazy(() => lazyRetry(() => import('./pages/admin/Customers')));
const AdminPlaybook = lazy(() => lazyRetry(() => import('./pages/admin/Playbook')));
const AdminSettings = lazy(() => lazyRetry(() => import('./pages/admin/Settings')));

// Protected Admin Route Component
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin, user } = useAuth();

  console.log('ProtectedAdminRoute check:', { isAuthenticated, isAdmin, userEmail: user?.email });

  if (!isAuthenticated) {
    return <Navigate to="/login?role=admin" replace />;
  }

  if (!isAdmin) {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedCustomerRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      {/* Global Storefront Navbar (hidden on /admin routes) */}
      {!isAdmin && <Navbar />}

      {/* Main Page Body */}
      <main className={`flex-1 ${!isAdmin ? 'pb-16 md:pb-0' : ''}`}>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
              <span className="rounded-full border border-[#DFBC77]/50 bg-white/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#855F14] shadow-sm">
                Loading Nihara D'Aura...
              </span>
            </div>
          }
        >
          <Routes>
            {/* ── Public Storefront Routes ── */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* ── Admin Console (Dedicated Luxury Layout with 9 Pages) - Protected Route */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="artists" element={<AdminArtists />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="playbook" element={<AdminPlaybook />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ── Customer Portal Routes ── */}
            <Route path="/book" element={<ProtectedCustomerRoute><Booking /></ProtectedCustomerRoute>} />
            <Route path="/cart" element={<ProtectedCustomerRoute><Cart /></ProtectedCustomerRoute>} />
            <Route path="/checkout" element={<ProtectedCustomerRoute><Checkout /></ProtectedCustomerRoute>} />
            <Route path="/wishlist" element={<ProtectedCustomerRoute><Wishlist /></ProtectedCustomerRoute>} />
            <Route path="/profile" element={<ProtectedCustomerRoute><Profile /></ProtectedCustomerRoute>} />
            <Route path="/profile/edit" element={<ProtectedCustomerRoute><Profile /></ProtectedCustomerRoute>} />
            <Route path="/orders" element={<ProtectedCustomerRoute><Orders /></ProtectedCustomerRoute>} />
            <Route path="/orders/:id" element={<ProtectedCustomerRoute><Orders /></ProtectedCustomerRoute>} />
            <Route path="/bookings" element={<ProtectedCustomerRoute><Bookings /></ProtectedCustomerRoute>} />
            <Route path="/bookings/:id" element={<ProtectedCustomerRoute><Bookings /></ProtectedCustomerRoute>} />
            <Route path="/addresses" element={<ProtectedCustomerRoute><Addresses /></ProtectedCustomerRoute>} />
            <Route path="/returns-refunds" element={<ProtectedCustomerRoute><ReturnsAndRefunds /></ProtectedCustomerRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Storefront Cart & Footer (hidden on /admin routes) */}
      {!isAdmin && (
        <>
          <CartDrawer />
          <MobileBottomNav />
          <WhatsAppButton />
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
        <ToastProvider>
          <SocketProvider>
            <ProductProvider>
              <OffersProvider>
                <CartProvider>
                  <WishlistProvider>
                    <NotificationProvider>
                      <ServiceProvider>
                        <ErrorBoundary>
                          <AppLayout />
                        </ErrorBoundary>
                      </ServiceProvider>
                    </NotificationProvider>
                  </WishlistProvider>
                </CartProvider>
              </OffersProvider>
            </ProductProvider>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
