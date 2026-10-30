# 🌟 Nihara D Aura - Complete API Documentation

> **Local Base URL:** `http://localhost:5000/api`
> **Direct IP URL:** `http://127.0.0.1:5000/api`
> **Database:** MongoDB Atlas (`nihara_d_aura`) - Live Connected ✅
> **Realtime Engine:** Socket.io (WebSocket) - Active ⚡
> **Total APIs:** **42 / 42 PASSED (100% Verified ✅)**
> **Test Date:** October 2026

---

## 🔐 Authentication Headers (Request ke saath ye bhejni padti hain)

| Header Key | Example Value | Kab lagani hai |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Har POST, PUT, PATCH request mein |
| `Authorization` | `Bearer <JWT_TOKEN>` | Customer session ke liye |

---

## ⚡ Real-Time Socket.io Events (Live Updates)

| Event Name | Direction | Payload | Kya hota hai |
| :--- | :--- | :--- | :--- |
| `booking:created` | Server ➔ Clients | `{ booking }` | Nayi booking hote hi sabko live update milti hai |
| `booking:cancelled` | Server ➔ Clients | `{ booking }` | Booking cancel hone par live notification |
| `ping_server` / `pong_client` | Dono taraf | `{ timestamp }` | Connection health check karne ke liye |

---

## 1. System Health Check (Server ki Halat Jaanno)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server, Socket.io aur architecture ka live status check karta hai | Kuch nahi | `✅ 200 OK` | ~45ms |

---

## 2. Authentication - Login & Register (Account aur Login)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Naye customer ka account banata hai | `{ name, phone, email }` | `✅ 201 Created` | ~14ms |
| `POST` | `/api/auth/login` | Phone number se login karta hai, OTP bhejta hai | `{ phone }` | `✅ 200 OK` | ~15ms |
| `POST` | `/api/auth/verify-otp` | OTP verify karke JWT token deta hai | `{ phone, otp }` | `✅ 200 OK` | ~18ms |
| `POST` | `/api/auth/logout` | Customer ka session safely logout karta hai | Kuch nahi | `✅ 200 OK` | ~15ms |

---

## 3. Luxury Products (Saare Products - 90 Items)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Saare luxury products ki list, search aur filter ke saath | Query: `?category=makeup&search=...&minPrice=&maxPrice=&sort=` | `✅ 200 OK` | ~17ms |
| `GET` | `/api/products/:id` | Ek product ki poori details, images aur price | Params: `:id` jaise `prod_choker` | `✅ 200 OK` | ~8ms |
| `POST` | `/api/products` | **Admin only:** Naya product catalog mein add karna | `{ name, price, category, categorySlug, description }` + Admin Header | `✅ 200 OK` | ~4ms |
| `PUT` | `/api/products/:id` | **Admin only:** Product ki price ya details update karna | `{ price: 1999 }` + Admin Header | `✅ 200 OK` | ~7ms |
| `DELETE` | `/api/products/:id` | **Admin only:** Product ko catalog se permanently delete karna | Params: `:id` + Admin Header | `✅ 200 OK` | ~16ms |

---

## 4. Categories (Makeup, Jewellery, Skincare, Wellness)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Saari 4 main categories ki list sub-categories ke saath | Kuch nahi | `✅ 200 OK` | ~15ms |
| `GET` | `/api/categories/:id` | Ek specific category ka poora data | Params: `:id` jaise `makeup` | `✅ 200 OK` | ~16ms |

---

## 5. Salon & Bridal Services (Appointment Wali Services)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Salon, bridal aur spa ke saare packages ki list | Kuch nahi | `✅ 200 OK` | ~17ms |
| `GET` | `/api/services/:id` | Kisi ek service ki duration, price aur details | Params: `:id` jaise `srv_bridal_glow` | `✅ 200 OK` | ~17ms |
| `GET` | `/api/admin/services?category=Salon` | **Admin only:** Makeup ya Salon service catalogue dekhna; legacy Nails/Styling records Salon mein normalize hote hain | Valid admin Bearer token; optional `category=Makeup` or `Salon` | `200 OK` | — |
| `POST` | `/api/admin/services` | **Admin only:** Nayi Makeup ya Salon service create karna | `{ name, category, price, durationMinutes, image, description, inclusions }` + admin Bearer token | `201 Created` | — |
| `PATCH` | `/api/admin/services/:id` | **Admin only:** Service details update karna | Service ID, validated update fields + admin Bearer token | `200 OK` | — |
| `DELETE` | `/api/admin/services/:id` | **Admin only:** Service ko public menu se delete karna; existing booking details stay saved | Service ID + admin Bearer token | `200 OK` | — |
| `GET` | `/api/artists` | Expert makeup artists aur stylists ki profiles | Kuch nahi | `✅ 200 OK` | ~16ms |
| `GET` | `/api/salon` | Flagship salon ka address, timings aur amenities | Kuch nahi | `✅ 200 OK` | ~17ms |

---

## 6. Bookings & Appointments (Salon Appointment Book Karo)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/bookings` | Customer ki saari salon appointments ki list | Kuch nahi | `✅ 200 OK` | ~16ms |
| `POST` | `/api/bookings` | Nayi salon ya home appointment book karna | `{ serviceIds, date, timeSlot, artistName, locationType }` | `✅ 201 Created` | ~20ms |
| `DELETE` | `/api/bookings/:id` | Schedule ki gayi appointment cancel karna | Params: `:id` jaise `bk_...` | `✅ 200 OK` | ~16ms |

### POST /api/bookings - Example Body:
```json
{
  "serviceIds": ["srv_bridal_glow"],
  "date": "2026-11-20",
  "timeSlot": "02:00 PM",
  "artistName": "Alia Khan",
  "locationType": "salon"
}
```

---

## 7. Orders (Product Order History)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Customer ke saare purane orders ki history | Kuch nahi | `✅ 200 OK` | ~17ms |
| `POST` | `/api/orders` | Checkout karke naya product order place karna | `{ items, total, paymentMethod }` | `✅ 201 Created` | ~17ms |
| `GET` | `/api/orders/:id` | Ek order ki invoice aur tracking details | Params: `:id` jaise `ord_...` | `✅ 200 OK` | ~17ms |

---

## 8. Shopping Cart (Shopping Bag aur Coupon)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Cart mein rakhe items aur total bill dekhna | Kuch nahi | `✅ 200 OK` | ~16ms |
| `POST` | `/api/cart` | Cart mein naya product add karna | `{ productId, quantity, variant }` | `✅ 200 OK` | ~16ms |
| `PUT` | `/api/cart/:productId` | Cart mein product ki quantity badhana ya ghatana | `{ quantity, variant }` | `✅ 200 OK` | ~16ms |
| `DELETE` | `/api/cart/:productId` | Cart se product hatana | Query: `?variant=Standard` | `✅ 200 OK` | ~17ms |
| `POST` | `/api/cart/apply-coupon` | Promo coupon code lagana (`GLOW20` ya `NIHARA10`) | `{ code: "GLOW20" }` | `✅ 200 OK` | ~17ms |
| `DELETE` | `/api/cart/remove-coupon` | Laga hua coupon code hatana | Kuch nahi | `✅ 200 OK` | ~15ms |

---

## 9. Customer Profile (Customer ki Poori Jaankari)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Customer profile, VIP tier aur reward points dekhna | Kuch nahi | `✅ 200 OK` | ~17ms |
| `PUT` | `/api/profile/update` | Profile ka naam, email ya phone update karna | `{ name: "Amit Kumar" }` | `✅ 200 OK` | ~17ms |

---

## 10. Delivery Addresses (Ghar ka Pata)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/profile/addresses` | Saare save kiye gaye delivery addresses dekhna | Kuch nahi | `✅ 200 OK` | ~15ms |
| `POST` | `/api/profile/addresses` | Naya delivery address save karna | `{ name, addressLine, city, state, pincode, phone, isDefault }` | `✅ 201 Created` | ~16ms |
| `PUT` | `/api/profile/addresses/:id` | Purane address mein badlav karna | `{ city: "Mumbai" }` | `✅ 200 OK` | ~15ms |
| `DELETE` | `/api/profile/addresses/:id` | Save kiya hua address delete karna | Params: `:id` | `✅ 200 OK` | ~16ms |

---

## 11. Wishlist (Pasandida Products Save Karo)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/profile/wishlist` | Wishlist mein save kiye gaye saare products dekhna | Kuch nahi | `✅ 200 OK` | ~17ms |
| `POST` | `/api/profile/wishlist/:productId` | Product ko wishlist mein add ya remove karna (Toggle) | Params: `:productId` | `✅ 200 OK` | ~16ms |

---

## 12. Payment Gateway (Paise Bharo)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create-intent` | Razorpay / UPI ke liye payment order intent banana | `{ amount: 2850 }` | `✅ 200 OK` | ~16ms |
| `POST` | `/api/payment/verify` | Payment gateway signature aur transaction verify karna | `{ paymentId, orderId }` | `✅ 200 OK` | ~19ms |

---

## 13. Offers & Promotions (Discounts aur Deals)

| Method | Endpoint | Kya karta hai | Request mein kya bhejo | Test Result | Speed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/offers` | Saare active discount offers aur promotional banners dekhna | Kuch nahi | `✅ 200 OK` | ~15ms |
| `POST` | `/api/offers` | **Admin only:** Naya promotional offer ya coupon banana | `{ title, code, discountPercent, validTill }` + Admin Header | `✅ 200 OK` | ~18ms |
| `PATCH` | `/api/offers/:id/toggle` | **Admin only:** Offer ko active ya inactive karna | Params: `:id` + Admin Header | `✅ 200 OK` | ~14ms |
| `DELETE` | `/api/offers/:id` | **Admin only:** Promotional offer hamesha ke liye delete karna | Params: `:id` + Admin Header | `✅ 200 OK` | ~17ms |

---

## 🧪 Dobara Test Kaise Karo? (Kabhi bhi!)

Koi bhi change karne ke baad ya just check karne ke liye ye command chalaao:

```bash
node scripts/testAllApis.js
```

Ye script saari 42 APIs par live HTTP request bhejti hai aur har ek ka status, response time (ms) aur PASS/FAIL result console mein dikhati hai.

**Expected output:**
```
Final Test Score: 42/42 PASSED
```

---

## 📌 Quick Cheatsheet - Sabse Zaroori APIs

| Kaam kya karna hai | Use karo |
| :--- | :--- |
| Server check karna hai | `GET /api/health` |
| Login karna hai | `POST /api/auth/login` |
| Products dekhne hain | `GET /api/products` |
| Cart mein add karna hai | `POST /api/cart` |
| Booking karni hai | `POST /api/bookings` |
| Order place karna hai | `POST /api/orders` |
| Discount coupon lagana hai | `POST /api/cart/apply-coupon` |
| Admin: Naya product add karna | `POST /api/products` + `x-user-role: admin` |
| Admin: Offer banana | `POST /api/offers` + `x-user-role: admin` |
