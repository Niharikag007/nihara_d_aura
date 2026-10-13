# Nihara D Aura — Complete REST API Specification

This document details all backend endpoints, request bodies, query parameters, authorization requirements, and standard JSON responses.

---

## 1. Global Standards & Headers

- **Base URL**: `/api`
- **Standard Content-Type**: `application/json`
- **Authentication**: Bearer Token in `Authorization: Bearer <JWT_TOKEN>` header or HTTP-only cookie.
- **Standard Success Response**:
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... }
  }
  ```
- **Standard Error Response**:
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": []
  }
  ```

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 Register
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Ananya Roy",
    "email": "ananya.roy@example.com",
    "phone": "+919876543210",
    "password": "Password123"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify OTP.",
    "data": {
      "userId": "674d8e...",
      "phone": "+919876543210",
      "requiresOtp": true
    }
  }
  ```

### 2.2 Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "phone": "+919876543210",
    "otp": "123456"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Verification successful",
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "674d8e...",
      "name": "Ananya Roy",
      "email": "ananya.roy@example.com",
      "phone": "+919876543210"
    }
  }
  ```

### 2.3 Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "emailOrPhone": "amitky2056@gmail.com",
    "password": "Password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGci...",
    "user": {
      "_id": "674d8e123...",
      "name": "Amit Kumar",
      "email": "amitky2056@gmail.com",
      "phone": "+918004116370",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    }
  }
  ```

### 2.4 Create Password / Reset Password
- `POST /api/auth/create-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/logout`

---

## 3. Product Endpoints (`/api/products`)

### 3.1 List Products
- **Endpoint**: `GET /api/products`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional, e.g., `Makeup`, `Jewellery`, `Nails`, `Candles`)
  - `search` (optional, string search in name/tags/description)
  - `sort` (`featured`, `price-low`, `price-high`, `rating`, `newest`)
  - `minPrice` & `maxPrice`
  - `page` & `limit`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 9,
    "total": 9,
    "page": 1,
    "products": [
      {
        "_id": "prod_1",
        "name": "Glow Velvet Silk Foundation",
        "slug": "glow-velvet-silk-foundation",
        "category": "Makeup",
        "price": 2499,
        "originalPrice": 3000,
        "discountPercent": 17,
        "rating": 4.9,
        "reviewCount": 142,
        "images": ["https://images.unsplash.com/photo-1596462502278-27bfdc403348"],
        "isFeatured": true,
        "isBestseller": true
      }
    ]
  }
  ```

### 3.2 Product Details
- **Endpoint**: `GET /api/products/:id` (supports either ID or Slug)
- **Access**: Public

---

## 4. Category Endpoints (`/api/categories`)

- `GET /api/categories` — Returns the 4 luxury verticals with banner images and product counts.
- `GET /api/categories/:id` — Returns category details with its child subcategories.

---

## 5. Salon & Beauty Services Endpoints (`/api/services` & `/api/artists`)

### 5.1 List Beauty Services
- **Endpoint**: `GET /api/services`
- **Access**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "services": [
      {
        "_id": "srv_1",
        "name": "Royal Bridal Glow & Makeup Package",
        "slug": "royal-bridal-glow-makeup-package",
        "category": "Makeup",
        "price": 18500,
        "durationMinutes": 180,
        "rating": 5.0,
        "reviewCount": 310,
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
      }
    ]
  }
  ```

### 5.2 List Artists / Specialists
- **Endpoint**: `GET /api/artists`
- **Response**: List including Priya Sharma, Ananya Verma, Meera Kapoor, Rohan Malhotra, and "Any Senior Specialist".

---

## 6. Beauty Booking Endpoints (`/api/bookings`)

### 6.1 Create Appointment Booking
- **Endpoint**: `POST /api/bookings`
- **Access**: Customer (Authenticated)
- **Request Body**:
  ```json
  {
    "serviceIds": ["srv_1", "srv_2"],
    "date": "2026-10-16",
    "timeSlot": "01:00 PM",
    "locationType": "home",
    "serviceAddress": {
      "fullName": "Amit Kumar",
      "phone": "+91 8004116370",
      "streetAddress": "Flat 302, Royal Palms, Jubilee Hills, Hyderabad"
    },
    "artistId": "art_2",
    "artistName": "Ananya Verma"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Appointment Confirmed",
    "booking": {
      "_id": "675...",
      "bookingId": "BK-126697",
      "servicesSubtotal": 25000,
      "travelCharge": 500,
      "totalAmount": 25500,
      "bookingStatus": "Confirmed",
      "date": "2026-10-16",
      "timeSlot": "01:00 PM"
    }
  }
  ```

### 6.2 Get Customer Bookings
- **Endpoint**: `GET /api/bookings`
- **Access**: Customer

### 6.3 Cancel Appointment
- **Endpoint**: `DELETE /api/bookings/:id` or `PUT /api/bookings/:id/cancel`
- **Access**: Customer

---

## 7. Shopping Bag / Cart (`/api/cart`) & Wishlist (`/api/wishlist`)

- `GET /api/cart` — Fetch user's active shopping bag
- `POST /api/cart` — Add item `{ productId, quantity, variant, size }`
- `PUT /api/cart/:productId` — Update item quantity
- `DELETE /api/cart/:productId` — Remove item
- `POST /api/cart/apply-coupon` — Apply coupon (`NIHARA10`, `GLOW20`)
- `GET /api/wishlist` — Fetch saved products
- `POST /api/wishlist/:productId` — Toggle or add to wishlist
- `DELETE /api/wishlist/:productId` — Remove from wishlist

---

## 8. Orders & Checkout (`/api/orders`)

### 8.1 Place Order
- **Endpoint**: `POST /api/orders`
- **Access**: Customer
- **Request Body**:
  ```json
  {
    "items": [
      { "productId": "prod_1", "quantity": 1, "variant": "Warm Ivory" }
    ],
    "shippingAddress": {
      "fullName": "Ananya Roy",
      "phone": "+91 98765 43210",
      "streetAddress": "Flat 402, Rosewood Villa, Worli, Mumbai, Maharashtra - 400018"
    },
    "paymentMethod": "UPI / GPay / PhonePe",
    "subtotal": 2499,
    "deliveryFee": 0,
    "totalAmount": 2499
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Order Placed Successfully!",
    "order": {
      "_id": "ord_100172",
      "orderId": "NIH-100172",
      "totalAmount": 2499,
      "orderStatus": "Processing",
      "createdAt": "2026-10-01T12:31:00.000Z"
    }
  }
  ```

### 8.2 Get Customer Orders & Order Details
- `GET /api/orders` — List user's orders
- `GET /api/orders/:id` — Single order details

---

## 9. Customer Profile & Addresses (`/api/profile`, `/api/addresses`)

- `GET /api/profile` — Fetch current customer profile
- `PUT /api/profile/update` — Update avatar, name, email, phone
- `GET /api/addresses` — List saved delivery & service addresses
- `POST /api/addresses` — Add new address
- `PUT /api/addresses/:id` — Edit address or set as default
- `DELETE /api/addresses/:id` — Delete address
