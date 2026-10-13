# Nihara D Aura — APK, Video & PRD Deep Analysis Report

This document records the reverse-engineered visual tokens, UI patterns, content architecture, customer flows, and design systems observed from:
1. **`app-release.apk`**: Flutter Android compiled release binary (`libapp.so`, asset manifests, strings, network policies).
2. **`WhatsApp Video 2026-10-01 at 12.33.00 PM.mp4`**: High-resolution end-to-end user walkthrough recording on Android.
3. **`Nihara_D_Aura_Final_Web_PRD_No_Admin (1).pdf`**: Official Product Requirements Document (6 pages) establishing scope, web adaptations, API requirements, and constraints.

---

## 1. Brand Identity & Visual Language

### Brand Name & Tagline
- **Brand Title**: `Nihara D Aura`
- **Secondary Branding**: `Nihara Luxury`, `Welcome to Nihara D Aura`
- **Subtitles & Badges**:
  - *"ROYAL GOLD COLLECTION — Radiant Gold Festive Glow"*
  - *"Most loved products by Nihara patrons"*
  - *"Handpicked products for timeless elegance"*
  - *"Experience royal treatment at salon or home"*
  - *"Book expert artists for makeup, nails & jewellery"*

### Color Palette (Extracted & Mapped)
- **Primary Luxury Gold Gradient**: `linear-gradient(135deg, #C5A059 0%, #9B783E 100%)` / `#C59B27` to `#8A6714`
- **Champagne Gold Highlight**: `#EAD6B8` / `#D4AF37`
- **Cream / Warm Sand Canvas (Background)**: `#FBF8F2` (95% light tint) to `#F5EFEB`
- **Card Backgrounds**: `#FFFFFF` with subtle warm border `rgba(197, 160, 89, 0.2)` and soft shadow
- **Dark Neutral (Headings & Primary Text)**: `#1E1B18` / `#231F20`
- **Muted Neutral (Body / Secondary)**: `#736B63` / `#8C827A`
- **Pill / Badge Backgrounds**:
  - Gold Active Pill: Background `#A67C37`, Text `#FFFFFF`
  - Inactive Category Pill: Background `#FFFFFF`, Border `#EADECF`, Text `#554D44`
  - Discount Tag: Background `#C59B27` / `#B8860B`, Text `#FFFFFF`, Font Size `11px`, Bold
  - Status Confirmed: Background `#FFF4DC`, Text `#B8860B`, Border `#F3E1B9`
  - Status Delivered / Completed: Background `#E8F5E9`, Text `#2E7D32`
  - Status Cancelled: Background `#FFEBEE`, Text `#D32F2F`
  - Status Processing: Background `#FFF8E1`, Text `#F57F17`

### Typography & Iconography
- **Typography**: Elegant Serif for Headings (`Playfair Display` or `Cinzel` / `Cormorant Garamond`) paired with modern geometric Sans-Serif (`Plus Jakarta Sans` or `Inter`) for UI body, buttons, and prices.
- **Iconography**: Lucide React / Cupertino luxury line icons: Heart, Shopping Bag, Calendar, Clock, MapPin, Sparkles, User, ChevronRight, CheckCircle2, Star, Search, Filter.

---

## 2. Reverse-Engineered Imagery & Media Assets

The APK and video utilize high-resolution curated luxury imagery from Unsplash for products, services, banners, and specialist avatars:

| Asset Name | Target URL | Usage in App |
|---|---|---|
| **Festive Glow Hero Model** | `https://images.unsplash.com/photo-1524504388940-b1c1722653e1` | Home Top Banner / Hero Carousel |
| **Glow Velvet Silk Foundation** | `https://images.unsplash.com/photo-1596462502278-27bfdc403348` | Foundation Product Card & Details |
| **Foundation Lifestyle / Model** | `https://images.unsplash.com/photo-1487412720507-e7ab37603c6f` | Makeup Category & Foundation Banner |
| **Celestial Shimmer Eyeshadow** | `https://images.unsplash.com/photo-1512496015851-a90fb38ba796` | Eyeshadow Palette Listing |
| **Royal Rosewood Satin Lipstick** | `https://images.unsplash.com/photo-1586495777744-4413f21062fa` | Lipstick Product Card |
| **Chandbali Emerald Earrings** | `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908` | Handcrafted Jewellery Card |
| **Rose Gold Choker** | `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f` | Jewellery Featured Luxury |
| **Rose Quartz Press-On Nails** | `https://images.unsplash.com/photo-1632345031435-8727f6897d53` | Nail Art Product & Service Card |
| **Jasmine & Amber Soy Wax Candle** | `https://images.unsplash.com/photo-1603006905003-be475563bc59` | Candle Product Card |
| **Reed Diffusers / Home Spa** | `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85` | Candles & Home Fragrance Category |
| **Bridal Model Portrait** | `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e` | Bridal Glow & Makeup Service Card |
| **Master Artist - Priya Sharma** | `https://images.unsplash.com/photo-1534528741775-53994a69daeb` | Bridal Specialist Avatar |
| **Master Artist - Ananya Verma** | `https://images.unsplash.com/photo-1517841905240-472988babdf9` | Nail Specialist Avatar |
| **Master Artist - Meera Kapoor** | `https://images.unsplash.com/photo-1544005313-94ddf0286df2` | Hair & Beauty Specialist Avatar |
| **Master Artist - Rohan Malhotra** | `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d` | Celebrity Stylist Avatar |
| **Customer Avatar - Amit Kumar** | `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d` | Customer Profile Avatar |

---

## 3. Screen-by-Screen Flow & Component Breakdown (From Video & APK)

### 3.1 Home Screen (`/`)
- **Top Header Bar**:
  - Left: Welcome subtitle (`WELCOME TO`) + Brand title (`Nihara D Aura`)
  - Right: Notification Bell icon with badge dot + Shopping Bag icon with cart item count badge
- **Hero Promotional Banner**:
  - Gold luxury background with model image overlay
  - Badge: `ROYAL GOLD COLLECTION`
  - Headline: `Radiant Gold Festive Glow`
  - CTA Button: `Shop Now →`
- **Category Filter Horizontal Bar**:
  - Pills: `All`, `Makeup`, `Jewellery`, `Nails`, `Candles` with custom category icons
  - Active pill highlighted with golden brown fill and white text
- **Bridal & Glam Styling Services Feature Card**:
  - Warm parchment card with gold border
  - Left: Crown/Sparkle icon, title `Bridal & Glam Styling Services`, description `Book expert artists for makeup, nails & jewellery.`
  - Right: Gold button `Book Now`
- **Bestseller Beauties Carousel / Grid**:
  - Header: `Bestseller Beauties` | Subtext: `Most loved products by Nihara patrons` | `See All >` link
  - Product Cards:
    - Discount badge (`15% OFF`, `25% OFF`)
    - Wishlist Heart Toggle (filled gold when saved)
    - Product Image with smooth rounded corners
    - Category Tag (`JEWELLERY`, `NAILS`, `CANDLES`, `MAKEUP`)
    - Title (`Chandbali Emerald & Pearl Earrings`)
    - Rating: `★ 5.0 (71)`
    - Price: Current price `₹8500` + strikethrough original `₹10000`
    - Add to Bag cart icon button
- **Featured Luxuries Section**:
  - Header: `Featured Luxuries` | Subtext: `Handpicked products for timeless elegance` | `See All >`
  - 2-column or 4-column responsive grid featuring foundation, eyeshadow palette, rose gold choker, and candles
- **Signature Salon Services Section**:
  - Header: `Signature Salon Services` | Subtext: `Experience royal treatment at salon or home` | `See All >`
  - Service Cards:
    - Service Image thumbnail
    - Category Badge (`Makeup`, `Nails`, `Styling`)
    - Title (`Royal Bridal Glow & Makeup Package`)
    - Meta row: `⏱ 180 Mins` • `★ 5.0 (310)`
    - Price: `₹18500`
    - Button: `Book Now` (direct link into Step 1 of Booking Wizard)

---

### 3.2 Categories Screen (`/categories`)
- **Header**: Title `Categories`, Search button
- **Rich Category Banner Cards**:
  1. **Makeup Services & Products** (14 Products)
     - Subcategories: `Face Foundations`, `Lipsticks & Gloss`, `Eyeshadow Palettes`, `Blushes & Highlighters`
  2. **Handcrafted Jewellery** (18 Products)
     - Subcategories: `Kundan Chandbalis`, `Rose Gold Chokers`, `Temple Bangles`, `Bridal Sets`
  3. **Nail Extensions & Nail Art** (12 Products)
     - Subcategories: `Press-On Kits`, `Gel Lacquer`, `Chrome Nail Art`, `Cuticle Elixirs`
  4. **Candles & Home Fragrance** (10 Products)
     - Subcategories: `Soy Wax Jar Candles`, `Reed Diffusers`, `Aroma Room Sprays`, `Wax Melts`

---

### 3.3 All Products & Category Filter Screen (`/products`, `/categories/:slug`)
- Search bar with instant debounced filter
- Sort dropdown: *Recommended, Price: Low to High, Price: High to Low, Rating: High to Low, Newest*
- Filter by category, price range, and rating
- Responsive Product Grid with active Wishlist toggle and instant Add to Bag feedback toast

---

### 3.4 Product Details Screen (`/products/:id`)
- Image Gallery with thumbnail selector
- Category, Title, Rating (`★ 4.9 (142 reviews)`)
- Price, Original Price, Discount % Tag
- Variant selector:
  - Shade/Variant: `Warm Ivory`, `Golden Beige`, `Rose Petal`, `Royal Mogra`
  - Size: `30 ml`, `50 ml`, `Set of 2`
- Rich Product Descriptions & Key Ingredients / Features
- Quantity selector (`-` `1` `+`)
- Sticky Bottom Bar / CTA: `Add to Shopping Bag` and `Buy Now`
- Related products recommendations carousel

---

### 3.5 Beauty Services Booking Flow (`/book`) — 5-Step Wizard
Observed in video with exact state tracking:
1. **Step 1: Select Beauty Services**
   - Step indicator: `Step 1 of 5`
   - Notice: `Tap to select one or multiple beauty services below.`
   - Interactive multi-select cards with checkmark indicator
   - Sticky / Floating summary banner: `X service(s) Selected • Subtotal: ₹XXXX`
   - Continue Button (disabled if 0 selected)
2. **Step 2: Choose Date & Time**
   - Step indicator: `Step 2 of 5`
   - Interactive Calendar month picker (default October 2026 / current date onwards)
   - Time Slot grid:
     - `09:30 AM`, `11:00 AM`, `01:00 PM`, `02:30 PM`, `04:00 PM`, `05:30 PM`, `07:00 PM`
   - Back & Continue buttons
3. **Step 3: Select Location**
   - Step indicator: `Step 3 of 5`
   - Option A: **Nihara Luxury Salon Visit** (`Bandra Flagship Salon, Mumbai`)
   - Option B: **At Home Luxury Service (+₹500)** (`Therapist visits your home with full equipment`)
   - When "At Home" is selected: Address selector shows saved addresses (`Flat 302, Royal Palms, Jubilee Hills...`) or allows entering a new address
   - Back & Continue buttons
4. **Step 4: Choose Master Artist**
   - Step indicator: `Step 4 of 5`
   - Subtitle: `Select preferred artist or choose "Any Available Specialist"`
   - Options:
     - `Any Senior Specialist` — *"We will assign the best available master stylist"* (default)
     - `Priya Sharma` — Master Bridal Makeup Artist • ★ 4.9
     - `Ananya Verma` — Senior Nail Art Specialist • ★ 4.8
     - `Meera Kapoor` — Senior Hair & Beauty Specialist • ★ 4.9
     - `Rohan Malhotra` — Celebrity Hair & Drape Stylist • ★ 5.0
   - Back & Continue buttons
5. **Step 5: Booking Summary & Confirmation**
   - Step indicator: `Step 5 of 5`
   - Selected Services List with durations and individual prices
   - Details Card: Date, Time Slot, Location, Service Address, Assigned Artist
   - Cost Breakdown: Services Subtotal, At-Home Travel Charge (`₹500` or `₹0`), Total Payable
   - Action Button: `Confirm & Book`
   - **Confirmation Modal**:
     - Luxury gold shopping bag emblem
     - Heading: `Appointment Confirmed!`
     - Booking Ref: `BK-XXXXXX`
     - Subtitle: `X services scheduled for [Date] at [Time]`
     - CTA Button: `View My Bookings`

---

### 3.6 Shopping Bag & Checkout (`/cart`, `/checkout`)
- **Shopping Bag**:
  - Item listing: Image, Title, Variant/Size, Price, Quantity (`-` `qty` `+`), Remove `✕`
  - Promo Code input: Supporting codes `NIHARA10` (10% off) and `GLOW20` (20% off)
  - Price Summary: Subtotal, Delivery Fee (`FREE`), Promo Discount, Total Amount
  - Empty State: Gold bag icon, "Your Shopping Bag is Empty", "Discover our luxury collections and add your favourites.", [Explore Nihara Products] button
- **Checkout**:
  - Delivery Address selection (saved address or add new)
  - Payment Method:
    - `UPI / GPay / PhonePe` (default)
    - `Credit / Debit Card`
    - `Net Banking`
    - `Cash on Delivery`
  - Order Summary preview
  - `Place Order (₹XXXX)` button
  - **Success Dialog**:
    - Heading: `Order Placed Successfully!`
    - Order ID: `NIH-XXXXXX`
    - Subtext: *"Thank you for shopping with Nihara. Your luxury package is being prepared with love and care."*
    - CTA: `View Order Details`

---

### 3.7 Profile, Account, Orders & Bookings
- **Customer Profile (`/profile`)**:
  - User header card: Avatar, Name, Email, Phone, Edit Profile button
  - Navigation menu list:
    - `My Orders` → `/orders`
    - `My Bookings` → `/bookings`
    - `Saved Addresses` → `/addresses`
    - `My Wishlist` → `/wishlist`
    - `Help & Concierge Support` → modal / contact drawer
    - `Settings` → preferences drawer
    - `Log Out` → Sign out action with confirmation
- **Edit Profile Modal**:
  - Avatar selector / upload
  - Full Name, Email, Phone Number input fields
  - Save Changes action
- **My Orders (`/orders`)**:
  - Card with Order ID (`NIH-100172`), Date (`Oct 1, 2026`), Status badge (`Processing`, `Delivered`)
  - Thumbnails and titles of ordered items
  - Total Amount Paid
- **My Bookings / Appointments (`/bookings`)**:
  - Card with Booking ID (`BK-126697`), Status badge (`Confirmed`, `Cancelled`, `Completed`)
  - Service title + count (`Royal Bridal Glow & Makeup Package + 1 more`)
  - Artist Name (`Ananya Verma`)
  - Date & Time badge (`📅 Fri, Oct 16, 2026` | `⏱ 01:00 PM`)
  - Location badge (`📍 At Home Service - Flat 302, Royal Palms...`)
  - Cancel Appointment action with instant toast confirmation
- **Saved Addresses (`/addresses`)**:
  - Address Cards with `DEFAULT` pill, Name, Full street address, Phone, Edit and Delete actions
  - `+ Add New Address` action modal
- **My Wishlist (`/wishlist`)**:
  - Luxury grid of wishlisted items with 1-click move to bag and remove.

---

## 4. Key Differences: Web Adaptation vs APK

While matching the APK 1:1 in visual colors, fonts, content, and customer flows, the web version naturally incorporates:
1. **Desktop Navigation Bar**:
   - Top luxury announcement bar: *"Complimentary Royal Gift on orders above ₹4,999 | Free Shipping Across India"*
   - Main Header: Brand Logo, Main Navigation links (`Home`, `Products`, `Categories`, `Salon Services`, `About`), Search input with live dropdown, Wishlist counter, Cart drawer/counter, and User Account menu.
2. **Responsive Layout Grids**:
   - 1-column on mobile (< 640px)
   - 2-column on tablet (640px - 1024px)
   - 4-column on desktop (1024px - 1440px)
3. **Modal & Drawer Systems**:
   - Cart slide-over drawer for quick shopping without interrupting browsing
   - Quick-view modals for products and services
4. **Strict Constraint Adherence**:
   - Absolutely **zero admin routes, zero admin panels, and zero admin APIs**, strictly complying with Section 15 of the PRD.
