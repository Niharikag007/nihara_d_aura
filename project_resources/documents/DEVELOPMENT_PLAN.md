# Nihara D Aura — Master Development Plan

This phased roadmap outlines the engineering steps to build, test, and deliver the production-ready customer-facing web platform for Nihara D Aura, strictly following the PRD requirements.

---

## Phase 1: Analysis & Technical Architecture (Completed)
- [x] Analyze APK binary (`app-release.apk`), extract embedded assets, fonts, strings, and endpoints.
- [x] Reverse-engineer video walkthrough (`WhatsApp Video 2026-10-01 at 12.33.00 PM.mp4`) frame-by-frame.
- [x] Synthesize requirements from PRD (`Nihara_D_Aura_Final_Web_PRD_No_Admin (1).pdf`).
- [x] Generate `APK_ANALYSIS.md` (Design tokens, visual assets, screen flows).
- [x] Generate `SITE_MAP.md` (Public & customer route hierarchy, access control).
- [x] Generate `DATABASE_SCHEMA.md` (Mongoose data models for all 15 collections).
- [x] Generate `API_SPEC.md` (REST API contracts for customer flows).
- [x] Generate `COMPONENT_ARCHITECTURE.md` (React hierarchy & design system).
- [x] Generate `DEVELOPMENT_PLAN.md` (This document).

---

## Phase 2: Foundation Setup (Frontend & Backend)
- [ ] Initialize Express.js backend with modular architecture (`controllers/`, `routes/`, `models/`, `middleware/`, `services/`, `utils/`).
- [ ] Configure MongoDB connection with intelligent in-memory/fallback data store to guarantee 100% zero-dependency local execution and offline persistence.
- [ ] Seed database with initial products, categories, services, salons, artists, and customer accounts extracted from APK.
- [ ] Initialize React + Vite + Tailwind CSS frontend with React Router v6.
- [ ] Install essential libraries (`lucide-react`, `clsx`, `tailwind-merge`, `axios`).
- [ ] Build global Design System: typography (Playfair/Inter), luxury gold gradients, silk sand palette, shadows, and button components.
- [ ] Setup global State Contexts: `AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`.

---

## Phase 3: Core UI & Discovery
- [ ] Implement responsive luxury `Navbar` with announcement bar, search trigger, category links, cart badge, and user dropdown.
- [ ] Build responsive `Footer` with brand narrative, concierge links, and newsletter.
- [ ] Build `MobileBottomNav` matching the APK mobile experience.
- [ ] Construct pixel-perfect `Home` page:
  - Hero promotional banner (`ROYAL GOLD COLLECTION — Radiant Gold Festive Glow`).
  - Horizontal interactive category filter pills (`All`, `Makeup`, `Jewellery`, `Nails`, `Candles`).
  - Bridal & Glam Styling Services feature card.
  - Bestseller Beauties carousel / grid.
  - Featured Luxuries product showcase.
  - Signature Salon Services section.
- [ ] Build `Categories` screen with large visual cards for all 4 verticals and clickable subcategories.

---

## Phase 4: Shopping, Catalog, Cart & Checkout
- [ ] Build `Products` page with real-time search, category filters, price sorting, and rating filters.
- [ ] Build `ProductDetails` page with image gallery, variant options (shades/sizes), stock status, and add-to-bag actions.
- [ ] Build `Wishlist` page with instant add-to-bag and removal.
- [ ] Implement interactive `Cart` page & `CartDrawer` with promo code validation (`NIHARA10`, `GLOW20`), quantity controls, and order totals.
- [ ] Implement `Checkout` page with delivery address selector, payment options (UPI, Cards, NetBanking, COD), and order summary.
- [ ] Implement Order Success Modal and database order persistence.

---

## Phase 5: Customer Account & Authentication
- [ ] Build `Login` and `Register` screens with luxury gold styling.
- [ ] Build `VerifyOTP` modal/screen with countdown timer and automatic verification.
- [ ] Build `Profile` dashboard with user details (Amit Kumar default from APK), quick navigation menu, and stats.
- [ ] Implement `EditProfileModal` with avatar selector, name, email, and phone updates.
- [ ] Implement `Addresses` page to add, edit, delete, and set default shipping/service addresses.

---

## Phase 6: Beauty Booking Flow (5-Step Wizard)
- [ ] Step 1: Select Beauty Services (multi-select list with live price & duration accumulation).
- [ ] Step 2: Choose Date & Time (interactive calendar & slot selection).
- [ ] Step 3: Select Location (Salon Visit vs At-Home Luxury Service with +₹500 travel charge and address picker).
- [ ] Step 4: Choose Specialist (Priya Sharma, Ananya Verma, Meera Kapoor, Rohan Malhotra, or Any Senior Specialist).
- [ ] Step 5: Booking Summary & Confirmation (full cost calculation, instant booking creation, and gold celebration modal).

---

## Phase 7: Customer History & Order Tracking
- [ ] Build `Orders` list page (`/orders`) with status badges (`Processing`, `Delivered`) and order item thumbnails.
- [ ] Build `OrderDetails` page (`/orders/:id`) with full breakdown.
- [ ] Build `Bookings` list page (`/bookings`) with status badges (`Confirmed`, `Cancelled`, `Completed`).
- [ ] Implement one-click Cancel Appointment with toast notification.

---

## Phase 8: Quality Assurance, Verification & Production Build
- [ ] Verify 100% absence of any `/admin` route or UI.
- [ ] Test cross-device responsiveness (Mobile 375px, Tablet 768px, Desktop 1280px+).
- [ ] Validate end-to-end user journeys (Product purchase flow & Beauty booking flow).
- [ ] Execute production build (`npm run build`) and verify zero errors.
- [ ] Run full browser subagent walkthrough and record demo.
