# 🌟 Nihara D Aura - Complete Step-by-Step API Documentation (Hinglish)

> **Base URL:** `http://localhost:5000` (ya `http://127.0.0.1:5000`)  
> **Format:** Simple Clear Format (Bina kisi JSON curly-bracket `{}` ke)  
> **Note:** Har action ka title upar diya gaya hai aur theek niche uska endpoint, method, kya bhejna hai aur kis kaam ke liye use hota hai likha hai.

---

## 👤 1. USER ACCOUNT & AUTHENTICATION (रजिस्ट्रेशन और लॉगिन)

### 📌 1. Naya Account Register Karna
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Kiske liye use hota hai:** Jab koi naya customer pehli baar website par apna account banata hai.
- **Kya bhejna hota hai:** Name, Phone number, Email address

---

### 📌 2. Customer Login Karna (OTP Mangwana)
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Kiske liye use hota hai:** Jab purana ya naya user phone number daal kar login karta hai aur phone par OTP aata hai.
- **Kya bhejna hota hai:** Registered Mobile Phone number

---

### 📌 3. OTP Verify Karna (Login Complete Karna)
- **Method:** `POST`
- **Endpoint:** `/api/auth/verify-otp`
- **Kiske liye use hota hai:** Phone par aaye huye 6-digit OTP ko verify karke login success karna aur authentication token prapt karna.
- **Kya bhejna hota hai:** Phone number aur 6-digit OTP code

---

### 📌 4. Account Logout Karna
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Kiske liye use hota hai:** Customer ka active session safely band (logout) karne ke liye.
- **Kya bhejna hota hai:** Kuch nahi (Direct request bhejni hai)

---

## 💄 2. LUXURY PRODUCTS & SEARCH (सामान देखना और खोजना)

### 📌 5. Saare Products Dekhna aur Filter Karna
- **Method:** `GET`
- **Endpoint:** `/api/products`
- **Kiske liye use hota hai:** Home page ya shop page par saare products ki list dekhne ke liye, search bar se product dhoondhne ke liye, ya category/price ke hisab se filter karne ke liye.
- **Kya bhejna hota hai:** Optional filters (jaise category name, search keyword, min price, max price)

---

### 📌 6. Kisi Ek Product Ki Poori Detail Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/products/:id`
- **Kiske liye use hota hai:** Jab user kisi product par click karke uska product detail page kholta hai (badi photo, shades, price aur description dekhne ke liye).
- **Kya bhejna hota hai:** URL me product ki ID ya Slug (jaise `/api/products/prod_choker`)

---

## 🏷️ 3. PRODUCT CATEGORIES (कैटेगरीज़)

### 📌 7. Saari Categories Ki List Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/categories`
- **Kiske liye use hota hai:** Website ke header/menu me saari categories (Makeup, Jewellery, Skincare, Wellness) dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 8. Kisi Ek Category Ki Details Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/categories/:id`
- **Kiske liye use hota hai:** Jab user kisi category par click karke uski sub-categories aur items dekhna chahta hai.
- **Kya bhejna hota hai:** URL me category ka naam/slug (jaise `/api/categories/makeup`)

---

## 🛍️ 4. SHOPPING CART (शॉपिंग बैग और कूपन)

### 📌 9. Shopping Cart Ke Items Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/cart`
- **Kiske liye use hota hai:** Bag icon par click karke cart me rakhe huye saare items aur kul bill dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 10. Cart Me Naya Product Add Karna
- **Method:** `POST`
- **Endpoint:** `/api/cart`
- **Kiske liye use hota hai:** "Add to Cart" button dabakar product ko shopping bag me daalne ke liye.
- **Kya bhejna hota hai:** Product ID, Quantity (kitne chahiye), Variant/Shade name

---

### 📌 11. Cart Me Quantity Kam Ya Zyada Karna
- **Method:** `PUT`
- **Endpoint:** `/api/cart/:productId`
- **Kiske liye use hota hai:** Cart page par quantity badhane (+) ya ghatane (-) ke liye.
- **Kya bhejna hota hai:** URL me Product ID, nayi Quantity aur Variant name

---

### 📌 12. Cart Se Kisi Item Ko Hatana (Remove)
- **Method:** `DELETE`
- **Endpoint:** `/api/cart/:productId`
- **Kiske liye use hota hai:** Cart me se kisi product ko delete/remove karne ke liye.
- **Kya bhejna hota hai:** URL me Product ID aur variant name

---

### 📌 13. Discount Coupon Code Apply Karna
- **Method:** `POST`
- **Endpoint:** `/api/cart/apply-coupon`
- **Kiske liye use hota hai:** Bill me discount paane ke liye promo code (jaise GLOW20 ya NIHARA10) lagane ke liye.
- **Kya bhejna hota hai:** Coupon Code

---

### 📌 14. Laga Hua Coupon Code Hatana
- **Method:** `DELETE`
- **Endpoint:** `/api/cart/remove-coupon`
- **Kiske liye use hota hai:** Agar customer ne koi coupon lagaya hai aur use hatana chahta hai.
- **Kya bhejna hota hai:** Kuch nahi

---

## 🏠 5. DELIVERY ADDRESS (डिलीवरी का पता)

### 📌 15. Saved Delivery Addresses Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/profile/addresses`
- **Kiske liye use hota hai:** Customer ke pehle se save kiye huye sabhi ghar/office ke pate dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 16. Naya Delivery Address Save Karna
- **Method:** `POST`
- **Endpoint:** `/api/profile/addresses`
- **Kiske liye use hota hai:** Checkout ke waqt delivery ke liye naya address jodne ke liye.
- **Kya bhejna hota hai:** Name, Phone, Address line, City, State, Pincode

---

### 📌 17. Saved Address Ko Edit/Update Karna
- **Method:** `PUT`
- **Endpoint:** `/api/profile/addresses/:id`
- **Kiske liye use hota hai:** Purane save kiye huye address me koi sudhar ya badlav karne ke liye.
- **Kya bhejna hota hai:** URL me Address ID aur badla hua naya pata/phone

---

### 📌 18. Saved Address Ko Delete Karna
- **Method:** `DELETE`
- **Endpoint:** `/api/profile/addresses/:id`
- **Kiske liye use hota hai:** Jo address ab use nahi karna use list se hatane ke liye.
- **Kya bhejna hota hai:** URL me Address ID

---

## 📦 6. PRODUCT ORDERS & CHECKOUT (ऑर्डर प्लेस करना और ट्रैकिंग)

### 📌 19. Naya Product Order Place Karna (Checkout)
- **Method:** `POST`
- **Endpoint:** `/api/orders`
- **Kiske liye use hota hai:** Cart ke saare items ka payment method chun kar final order place karne ke liye.
- **Kya bhejna hota hai:** Order Items list, Total amount, Payment method (UPI/COD/Card), Delivery Address

---

### 📌 20. Customer Ke Pichle Saare Orders Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/orders`
- **Kiske liye use hota hai:** Order history page par jakar apne purane aur current sabhi orders ki list dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 21. Kisi Ek Order Ka Invoice Aur Status Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/orders/:id`
- **Kiske liye use hota hai:** Order ki raseed (invoice), delivery status aur tracking details dekhne ke liye.
- **Kya bhejna hota hai:** URL me Order ID (jaise `/api/orders/ord_123`)

---

## 💇‍♀️ 7. SALON & BRIDAL SERVICES (सैलून और ब्राइडल सेवाएँ)

### 📌 22. Saari Salon Services Ki List Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/services`
- **Kiske liye use hota hai:** Bridal makeup, hair styling aur skincare salon packages dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 23. Kisi Ek Service Ki Detail Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/services/:id`
- **Kiske liye use hota hai:** Service ka time (duration), kitne rupaye lagenge aur kya-kya include hai dekhne ke liye.
- **Kya bhejna hota hai:** URL me Service ID (jaise `/api/services/srv_bridal_glow`)

---

### 📌 24. Expert Artists Aur Stylists Ki Profiles Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/artists`
- **Kiske liye use hota hai:** Top makeup artists ki list, unka experience aur rating dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 25. Salon Ka Pata Aur Timings Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/salon`
- **Kiske liye use hota hai:** Flagship salon ka address, google map location, open timings aur phone number dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

## 📅 8. SALON APPOINTMENT BOOKING (अपॉइंटमेंट बुक करना)

### 📌 26. Nayi Salon/Bridal Appointment Book Karna
- **Method:** `POST`
- **Endpoint:** `/api/bookings`
- **Kiske liye use hota hai:** Apni pasand ki service, taarikh, time slot aur makeup artist select karke appointment fix karne ke liye.
- **Kya bhejna hota hai:** Service ID, Date (taarikh), Time Slot (samay), Artist ka naam, Location type (Salon ya Home)

---

### 📌 27. Book Ki Huyi Appointments Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/bookings`
- **Kiske liye use hota hai:** User ki aane wali sabhi appointments aur unka status dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 28. Book Ki Huyi Appointment Cancel Karna
- **Method:** `DELETE`
- **Endpoint:** `/api/bookings/:id`
- **Kiske liye use hota hai:** Agar kisi ka plan badal jaye to schedule ki hui booking ko cancel karne ke liye.
- **Kya bhejna hota hai:** URL me Booking ID

---

## ❤️ 9. WISHLIST (पसंदीदा सामान)

### 📌 29. Wishlist Ke Products Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/profile/wishlist`
- **Kiske liye use hota hai:** Apne pasand kiye gaye saare favorite products ki list dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 30. Product Ko Wishlist Me Add Ya Remove Karna
- **Method:** `POST`
- **Endpoint:** `/api/profile/wishlist/:productId`
- **Kiske liye use hota hai:** Dil (Heart) icon par click karke kisi product ko wishlist me jodne ya nikalne ke liye (Toggle).
- **Kya bhejna hota hai:** URL me Product ID

---

## 💳 10. ONLINE PAYMENT GATEWAY (ऑनलाइन पेमेंट)

### 📌 31. Payment Order Create Karna (Intent)
- **Method:** `POST`
- **Endpoint:** `/api/payment/create-intent`
- **Kiske liye use hota hai:** UPI, Card ya Netbanking se payment karne ke liye gateway me naya payment order generate karne ke liye.
- **Kya bhejna hota hai:** Total payment amount

---

### 📌 32. Payment Transaction Verify Karna
- **Method:** `POST`
- **Endpoint:** `/api/payment/verify`
- **Kiske liye use hota hai:** Bank ya UPI se payment complete hone ke baad payment successful hui ya nahi, ye verify karne ke liye.
- **Kya bhejna hota hai:** Payment ID aur Order ID

---

## 👤 11. USER PROFILE & REWARDS (प्रोफाइल और रिवॉर्ड्स)

### 📌 33. Customer Profile Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/profile`
- **Kiske liye use hota hai:** Customer ka name, email, phone number, VIP tier (Silver/Gold/Platinum) aur loyalty points dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

### 📌 34. Profile Ki Information Update Karna
- **Method:** `PUT`
- **Endpoint:** `/api/profile/update`
- **Kiske liye use hota hai:** Apna naam, email id ya phone number badalne ke liye.
- **Kya bhejna hota hai:** Naya Name, Email ya Phone

---

## 🎁 12. OFFERS & DEALS (डिस्काउंट और ऑफर्स)

### 📌 35. Saare Active Offers Dekhna
- **Method:** `GET`
- **Endpoint:** `/api/offers`
- **Kiske liye use hota hai:** Website par chal rahe festive discounts, offer banners aur seasonal promo codes dekhne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

## 🛠️ 13. SYSTEM HEALTH (सर्वर स्टेटस)

### 📌 36. Server Health Check Karna
- **Method:** `GET`
- **Endpoint:** `/api/health`
- **Kiske liye use hota hai:** Server aur real-time database theek se chal raha hai ya nahi, ye live check karne ke liye.
- **Kya bhejna hota hai:** Kuch nahi

---

## 👑 14. ADMIN PANEL OPERATIONS (एडमिन के काम)

### 📌 37. Naya Product Catalog Me Add Karna
- **Method:** `POST`
- **Endpoint:** `/api/products`
- **Kiske liye use hota hai:** Admin dwara website par naya luxury product launch/add karne ke liye.
- **Kya bhejna hota hai:** Product Name, Price, Category, Description, Images

---

### 📌 38. Kisi Product Ki Price Ya Details Update Karna
- **Method:** `PUT`
- **Endpoint:** `/api/products/:id`
- **Kiske liye use hota hai:** Admin dwara kisi product ki keemat badalne ya details modify karne ke liye.
- **Kya bhejna hota hai:** URL me Product ID aur nayi Price/Details

---

### 📌 39. Product Ko Store Se Delete Karna
- **Method:** `DELETE`
- **Endpoint:** `/api/products/:id`
- **Kiske liye use hota hai:** Admin dwara kisi product ko catalog se permanently hatane ke liye.
- **Kya bhejna hota hai:** URL me Product ID

---

### 📌 40. Naya Promotional Offer/Coupon Banana
- **Method:** `POST`
- **Endpoint:** `/api/offers`
- **Kiske liye use hota hai:** Admin dwara naya discount code ya festive festival offer create karne ke liye.
- **Kya bhejna hota hai:** Offer Title, Coupon Code, Discount Percent, Expiry Date

---

### 📌 41. Offer Ko Chalu (Active) Ya Band (Inactive) Karna
- **Method:** `PATCH`
- **Endpoint:** `/api/offers/:id/toggle`
- **Kiske liye use hota hai:** Admin dwara kisi offer ko temporarily activate ya deactivate karne ke liye.
- **Kya bhejna hota hai:** URL me Offer ID

---

### 📌 42. Offer Ko Permanently Delete Karna
- **Method:** `DELETE`
- **Endpoint:** `/api/offers/:id`
- **Kiske liye use hota hai:** Admin dwara kisi purane offer ko hamesha ke liye hatane ke liye.
- **Kya bhejna hota hai:** URL me Offer ID
