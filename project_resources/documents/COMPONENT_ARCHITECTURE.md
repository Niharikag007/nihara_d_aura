# Nihara D Aura — Frontend Component Architecture & Design System

This document specifies the React component hierarchy, atomic UI components, design tokens, state management contexts, and responsive layout specifications.

---

## 1. Directory Structure

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── site.webmanifest
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TopAnnouncementBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileBottomNav.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Breadcrumbs.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilterBar.jsx
│   │   │   └── ProductVariantSelector.jsx
│   │   ├── services/
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ArtistCard.jsx
│   │   │   └── ServiceFilterPills.jsx
│   │   ├── booking/
│   │   │   ├── BookingWizard.jsx
│   │   │   ├── Step1SelectServices.jsx
│   │   │   ├── Step2SelectDateTime.jsx
│   │   │   ├── Step3SelectLocation.jsx
│   │   │   ├── Step4SelectArtist.jsx
│   │   │   ├── Step5BookingSummary.jsx
│   │   │   └── BookingSuccessModal.jsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── CartItemRow.jsx
│   │   │   └── CouponInput.jsx
│   │   └── profile/
│   │       ├── EditProfileModal.jsx
│   │       ├── AddressCard.jsx
│   │       └── AddAddressModal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── WishlistContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useProducts.js
│   │   └── useScrollPosition.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Categories.jsx
│   │   ├── CategoryProducts.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetails.jsx
│   │   ├── Booking.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Profile.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── Bookings.jsx
│   │   ├── Addresses.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── VerifyOTP.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authApi.js
│   │   ├── productApi.js
│   │   ├── serviceApi.js
│   │   ├── bookingApi.js
│   │   └── orderApi.js
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── mockData.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
```

---

## 2. Design Tokens & Styling System

### 2.1 Color Tokens (Tailwind & CSS Variables)
```css
:root {
  --color-gold-50: #FCF9F2;
  --color-gold-100: #F7EEDC;
  --color-gold-200: #EDD7AD;
  --color-gold-300: #DFBC77;
  --color-gold-400: #CFA44C;
  --color-gold-500: #C59B27; /* Brand Primary Gold */
  --color-gold-600: #A87D17;
  --color-gold-700: #855F14;
  --color-gold-800: #624312;
  --color-gold-900: #3E290B;
  
  --color-canvas: #FBF8F2;    /* Warm Silk Sand background */
  --color-surface: #FFFFFF;   /* Pure White Card */
  --color-text-main: #1C1917; /* Deep Onyx */
  --color-text-muted: #78716C;/* Warm Slate Muted */
  --color-border-subtle: #EBE5DB;
}
```

### 2.2 Reusable Button Classes & Variants
1. **Primary Gold Button (`.btn-gold`)**:
   `bg-gradient-to-r from-[#C59B27] to-[#A87D17] text-white font-medium shadow-md hover:shadow-lg hover:from-[#B58C1E] hover:to-[#966E12] transition-all duration-200 active:scale-95`
2. **Outlined Champagne Button (`.btn-outline`)**:
   `border border-[#C59B27] text-[#855F14] bg-white/80 hover:bg-[#FCF9F2] transition-colors`
3. **Ghost / Text Button (`.btn-ghost`)**:
   `text-[#855F14] hover:text-[#523A0B] underline-offset-4 hover:underline`

---

## 3. Global Context State Machines

### 3.1 `AuthContext`
- **State**:
  - `user`: User object (id, name, email, phone, avatar, tier)
  - `token`: JWT string
  - `isAuthenticated`: Boolean
  - `isLoading`: Boolean
- **Methods**:
  - `login(credentials)`
  - `register(userData)`
  - `verifyOtp(phone, otp)`
  - `updateProfile(data)`
  - `logout()`

### 3.2 `CartContext`
- **State**:
  - `items`: Array of `{ product, quantity, variant, size }`
  - `appliedCoupon`: String or null
  - `discount`: Number
  - `deliveryFee`: Fixed `0` (Free Delivery)
  - `subtotal`: Calculated sum
  - `total`: Final sum
  - `isCartDrawerOpen`: Boolean
- **Methods**:
  - `addToCart(product, quantity, variant, size)`
  - `updateQuantity(productId, variant, delta)`
  - `removeFromCart(productId, variant)`
  - `applyCoupon(code)`
  - `removeCoupon()`
  - `clearCart()`
  - `openCartDrawer()` / `closeCartDrawer()`

### 3.3 `WishlistContext`
- **State**:
  - `wishlist`: Array of saved Product objects
- **Methods**:
  - `toggleWishlist(product)`
  - `isInWishlist(productId)`
  - `removeFromWishlist(productId)`

---

## 4. Fully Responsive Breakpoint Strategy & Multi-Device Optimization

- **Mobile Viewport (`320px - 639px`)**:
  - Compact sticky top navigation header with search toggle modal, logo, and quick drawer actions.
  - Touch-optimized Full-Width Hero Slider with finger swipe gestures (`onTouchStart`/`onTouchMove`/`onTouchEnd`), manual prev/next controls, and auto-scroll progress indicator.
  - 2-column balanced grid for product collections (`grid-cols-2 gap-3 sm:gap-5`) with touch-friendly wishlist and cart action buttons.
  - Sticky mobile bottom navigation bar (`fixed bottom-0 z-40`) providing quick thumb access to `Home`, `Categories`, `Book (Elevated Golden FAB)`, `Wishlist`, and `Profile`.
  - Main body container includes `pb-16 md:pb-0` padding to prevent bottom elements, payment buttons, and footers from overlapping with the mobile bottom navigation bar.

- **Tablet Viewport (`640px - 1023px`)**:
  - 3 to 4 column responsive grid layout (`sm:grid-cols-3 md:grid-cols-4`) for products and services.
  - Medium-screen hero slider controls with visible prev/next arrow buttons.
  - Responsive inline navbar with collapsible drawer menu and search modal.
  - Flexible checkout and booking wizards using responsive flex-col to grid transformations.

- **Laptop Viewport (`1024px - 1279px`)**:
  - 4 to 5 column balanced luxury product showcase (`lg:grid-cols-5`).
  - Full desktop navigation header with gold accent active state pill indicators.
  - Slide-over luxury cart drawer (`CartDrawer.jsx`) with live order calculation and free shipping progress bar.
  - Split 2-column product detail page (`ProductDetails.jsx`) with sticky image preview gallery and side action panel.

- **Large Desktop Viewport (`1280px - 1920px+`)**:
  - 6-column ultra-wide luxury product grids (`xl:grid-cols-6`).
  - Full HD hero slides scaling smoothly up to `650px` height with animated background zoom.
  - Multi-column luxury footer (`Footer.jsx`) with value propositions, boutique address, direct phone contact, and brand manifesto.
  - Sticky bottom mobile bar is automatically hidden (`md:hidden`), displaying the standard luxury desktop footer.
