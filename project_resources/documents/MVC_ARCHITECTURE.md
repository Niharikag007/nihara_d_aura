# Nihara D Aura — Enterprise MVC Architecture Overview

The codebase is structured following the **Model-View-Controller (MVC) + Services Layer** design pattern, ensuring clean separation of concerns, high testability, and enterprise maintainability.

---

## 1. High-Level Architecture Diagram

```
                 CLIENT REQUEST (Browser / Mobile Web)
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │       Vite + React UI        │  ◄── [VIEW LAYER]
                   │  (Pages, Components, Tokens) │
                   └──────────────┬───────────────┘
                                  │ HTTP / JSON
                                  ▼
                   ┌──────────────────────────────┐
                   │    Express Routes Router     │
                   │   (auth, products, booking)  │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │         CONTROLLERS          │  ◄── [CONTROLLER LAYER]
                   │ Thin request/response layer  │
                   │  (validation, HTTP codes)    │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │       SERVICES LAYER         │  ◄── [BUSINESS LOGIC]
                   │ Business logic, calculations │
                   │  discounts, appointment slots│
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │         DATA MODELS          │  ◄── [MODEL LAYER]
                   │  Mongoose Schemas + Memory   │
                   │ (User, Product, Booking...)  │
                   └──────────────────────────────┘
```

---

## 2. Directory Structure (MVC Layout)

### Backend (`/backend/src`)

```text
backend/src/
├── config/
│   └── db.js                        # Database connection & memory fallback manager
├── models/                          # [MODEL LAYER] Mongoose Data Schemas
│   ├── User.js                      # Patron accounts & tiers
│   ├── Product.js                   # E-commerce products & variants
│   ├── Category.js                  # 4 Luxury verticals & subcategories
│   ├── Service.js                   # Salon services & Master Artists
│   └── BookingOrderAddress.js       # Bookings, Orders, and Addresses
├── services/                        # [SERVICE LAYER] Pure Business Logic
│   └── storeService.js              # Persistence, inventory, pricing, and appointment logic
├── controllers/                     # [CONTROLLER LAYER] Request / Response Handlers
│   ├── authController.js            # Login, registration, and OTP verification
│   ├── productController.js         # Products catalog, filtering, and sorting
│   ├── categoryController.js        # Category listings and subcategories
│   ├── serviceController.js         # Salon services, specialists, and salon venue
│   ├── bookingController.js         # 5-step appointment creation and cancellation
│   ├── orderController.js           # Order placement and order history
│   ├── cartController.js            # Shopping bag, quantities, and coupons
│   └── profileController.js         # Profile edits, addresses, and wishlist
├── routes/                          # Modular API Routers
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── serviceRoutes.js
│   ├── bookingRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── profileRoutes.js
│   └── index.js                     # Master API aggregator mounted at /api
├── middleware/                      # Cross-Cutting Middlewares
│   ├── requestLogger.js             # HTTP request duration and status logger
│   ├── errorHandler.js              # Centralized error handler
│   └── authMiddleware.js            # JWT verification & session protection
├── utils/
│   └── responseHelper.js            # Standardized { success, message, data } builder
├── data/
│   └── initialData.js               # Seed dataset reverse-engineered from APK
└── server.js                        # Clean application bootstrap
```

### Frontend (`/frontend/src`)

```text
frontend/src/
├── components/                      # UI Presentation Components
│   ├── common/                      # Global Navbar, Footer, MobileBottomNav
│   ├── products/                    # ProductCard, ProductGrid
│   ├── services/                    # ServiceCard, ArtistCard
│   └── cart/                        # CartDrawer
├── pages/                           # [VIEW LAYER] Screen Views matching APK
│   ├── Home.jsx                     # Hero banner, category pills, bestsellers
│   ├── Products.jsx                 # Search, sort, and product grid
│   ├── ProductDetails.jsx           # Gallery, shades, sizes, add to bag
│   ├── Categories.jsx               # Vertical cards with subcategories
│   ├── Services.jsx                 # Salon & at-home service catalogue
│   ├── Booking.jsx                  # 5-step appointment wizard
│   ├── Cart.jsx                     # Shopping bag with coupons
│   ├── Checkout.jsx                 # Addresses, payment, and order confirmation
│   ├── Orders.jsx                   # Order history (Processing, Delivered)
│   ├── Bookings.jsx                 # Appointments history with cancellation
│   ├── Profile.jsx                  # Amit Kumar profile with edit modal
│   └── Addresses.jsx                # Saved delivery & service addresses
├── context/                         # State Machines (State Controllers)
│   ├── AuthContext.jsx              # Customer session
│   ├── CartContext.jsx              # Bag items, quantities & coupons
│   ├── WishlistContext.jsx          # Saved favorites
│   └── ToastContext.jsx             # Notification toasts
├── services/                        # API Client Adapter
│   ├── api.js                       # HTTP requests with offline fallback
│   └── mockData.js                  # Client dataset
├── App.jsx                          # Router and Layout Provider
├── main.jsx                         # Application entry
└── index.css                        # Design tokens & styling
```

---

## 3. Strict Compliance Checks
- [x] **Thin Controllers**: Controllers only extract parameters and invoke services, returning standard response shapes.
- [x] **Services Decoupling**: Business calculations (cart subtotal, coupons, travel charges) reside strictly inside the service layer.
- [x] **No Admin Constraint**: Zero admin routes, controllers, or panels exist in either frontend or backend.
- [x] **Dual Persistence**: Works seamlessly with live MongoDB or built-in in-memory database store.
