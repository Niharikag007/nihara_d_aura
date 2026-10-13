// Comprehensive API Test Suite for Nihara D Aura Backend
const BASE_URL = 'http://127.0.0.1:5000';

async function req(method, path, body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const duration = Date.now() - start;
    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return {
      status: res.status,
      ok: res.ok,
      duration: `${duration}ms`,
      data
    };
  } catch (err) {
    return {
      status: 0,
      ok: false,
      error: err.message
    };
  }
}

async function runAllTests() {
  const results = [];
  const adminHeaders = { 'x-user-role': 'admin' };

  console.log('--- EXECUTING COMPLETE ENDPOINT TESTING ---');

  // 1. System Health
  results.push({
    method: 'GET',
    path: '/api/health',
    category: 'System Health',
    purposeHindi: 'सर्वर और Socket.io की लाइव हेल्थ और स्थिति चेक करना',
    purposeEn: 'Verify server health, brand metadata & Socket.io realtime status',
    test: await req('GET', '/api/health')
  });

  // 2. Auth APIs
  results.push({
    method: 'POST',
    path: '/api/auth/register',
    category: 'Authentication',
    purposeHindi: 'नए कस्टमर का नया अकाउंट रजिस्टर करना',
    purposeEn: 'Register a new customer profile',
    test: await req('POST', '/api/auth/register', { name: 'Pooja Sharma', phone: '+91 9876543210', email: 'pooja@example.com' })
  });

  results.push({
    method: 'POST',
    path: '/api/auth/login',
    category: 'Authentication',
    purposeHindi: 'फोन नंबर से कस्टमर लॉगिन और OTP ट्रिगर करना',
    purposeEn: 'Customer login via mobile phone number',
    test: await req('POST', '/api/auth/login', { phone: '+91 8004116370' })
  });

  results.push({
    method: 'POST',
    path: '/api/auth/verify-otp',
    category: 'Authentication',
    purposeHindi: 'OTP वेरिफाई करके सुरक्षित JWT टोकन प्राप्त करना',
    purposeEn: 'Verify OTP and return authenticated JWT session token',
    test: await req('POST', '/api/auth/verify-otp', { phone: '+91 8004116370', otp: '123456' })
  });

  results.push({
    method: 'POST',
    path: '/api/auth/logout',
    category: 'Authentication',
    purposeHindi: 'कस्टमर सेशन को सुरक्षित तरीके से लॉगआउट करना',
    purposeEn: 'Customer session logout',
    test: await req('POST', '/api/auth/logout')
  });

  // 3. Products APIs
  results.push({
    method: 'GET',
    path: '/api/products',
    category: 'Products',
    purposeHindi: 'सभी प्रोडक्ट्स की लिस्टिंग, सर्च और फ़िल्टरिंग',
    purposeEn: 'List luxury products with search, category & price filters',
    test: await req('GET', '/api/products?category=makeup')
  });

  results.push({
    method: 'GET',
    path: '/api/products/:id',
    category: 'Products',
    purposeHindi: 'किसी एक प्रोडक्ट की पूरी जानकारी (Details, Images, Price)',
    purposeEn: 'Get single product details by ID or URL slug',
    test: await req('GET', '/api/products/prod_choker')
  });

  const testProdPayload = {
    id: `prod_test_${Date.now()}`,
    name: 'Royal Velvet Lipstick Edition',
    price: 1899,
    category: 'Makeup',
    categorySlug: 'makeup',
    description: 'Velvet matte finish long stay lipstick'
  };

  const newProdRes = await req('POST', '/api/products', testProdPayload, adminHeaders);

  results.push({
    method: 'POST',
    path: '/api/products',
    category: 'Products (Admin)',
    purposeHindi: 'एडमिन द्वारा नया प्रोडक्ट जोड़ना (RBAC Protected)',
    purposeEn: 'Admin create a new product item in catalog',
    test: newProdRes
  });

  const createdProdId = newProdRes.data?.product?.id || testProdPayload.id;

  results.push({
    method: 'PUT',
    path: '/api/products/:id',
    category: 'Products (Admin)',
    purposeHindi: 'एडमिन द्वारा किसी प्रोडक्ट की कीमत/डिटेल्स अपडेट करना',
    purposeEn: 'Admin update existing product price and details',
    test: await req('PUT', `/api/products/${createdProdId}`, { price: 1999 }, adminHeaders)
  });

  results.push({
    method: 'DELETE',
    path: '/api/products/:id',
    category: 'Products (Admin)',
    purposeHindi: 'एडमिन द्वारा प्रोडक्ट कैटलॉग से डिलीट करना',
    purposeEn: 'Admin delete product from catalog',
    test: await req('DELETE', `/api/products/${createdProdId}`, null, adminHeaders)
  });

  // 4. Categories APIs
  results.push({
    method: 'GET',
    path: '/api/categories',
    category: 'Categories',
    purposeHindi: 'सभी प्रोडक्ट और सर्विस कैटेगरीज़ की लिस्ट (Makeup, Jewellery, etc.)',
    purposeEn: 'List all store categories with subcategories & counters',
    test: await req('GET', '/api/categories')
  });

  results.push({
    method: 'GET',
    path: '/api/categories/:id',
    category: 'Categories',
    purposeHindi: 'किसी एक विशिष्ट कैटेगरी की पूरी जानकारी प्राप्त करना',
    purposeEn: 'Get specific category details by category slug',
    test: await req('GET', '/api/categories/makeup')
  });

  // 5. Salon & Bridal Services APIs
  results.push({
    method: 'GET',
    path: '/api/services',
    category: 'Salon Services',
    purposeHindi: 'सैलून, ब्राइडल और स्पा सर्विसेस की पूरी लिस्ट',
    purposeEn: 'List all luxury salon and bridal makeover services',
    test: await req('GET', '/api/services')
  });

  results.push({
    method: 'GET',
    path: '/api/services/:id',
    category: 'Salon Services',
    purposeHindi: 'किसी खास सर्विस की डिटेल्स, अवधि और शुल्क',
    purposeEn: 'Get specific service details by service ID/slug',
    test: await req('GET', '/api/services/srv_bridal_glow')
  });

  results.push({
    method: 'GET',
    path: '/api/artists',
    category: 'Salon Services',
    purposeHindi: 'एक्सपर्ट मेकअप आर्टिस्ट्स और स्टाइलिस्ट्स की प्रोफाइल्स',
    purposeEn: 'List expert makeup artists and stylists',
    test: await req('GET', '/api/artists')
  });

  results.push({
    method: 'GET',
    path: '/api/salon',
    category: 'Salon Services',
    purposeHindi: 'फ्लैगशिप सैलून का पता, सुविधाएं और टाइमिंग्स',
    purposeEn: 'Get salon studio address, working hours & amenities',
    test: await req('GET', '/api/salon')
  });

  // 6. Bookings APIs
  results.push({
    method: 'GET',
    path: '/api/bookings',
    category: 'Bookings',
    purposeHindi: 'कस्टमर की सैलून अपॉइंटमेंट्स और बुकिंग लिस्ट',
    purposeEn: 'Get list of scheduled salon bookings and status',
    test: await req('GET', '/api/bookings')
  });

  const newBookingRes = await req('POST', '/api/bookings', {
    serviceIds: ['srv_bridal_glow'],
    serviceName: 'Royal Bridal Glow & Makeup Package',
    date: '2026-11-20',
    timeSlot: '02:00 PM',
    artistName: 'Alia Khan'
  });

  results.push({
    method: 'POST',
    path: '/api/bookings',
    category: 'Bookings',
    purposeHindi: 'नई सैलून अपॉइंटमेंट बुक करना (Service, Date, Time Slot)',
    purposeEn: 'Book a new salon appointment with date and time slot',
    test: newBookingRes
  });

  const createdBookingId = newBookingRes.data?.booking?.id || 'book_1';

  results.push({
    method: 'DELETE',
    path: '/api/bookings/:id',
    category: 'Bookings',
    purposeHindi: 'बुकिंग अपॉइंटमेंट कैंसिल करना',
    purposeEn: 'Cancel a scheduled appointment booking',
    test: await req('DELETE', `/api/bookings/${createdBookingId}`)
  });

  // 7. Orders APIs
  results.push({
    method: 'GET',
    path: '/api/orders',
    category: 'Orders',
    purposeHindi: 'कस्टमर के पिछले सभी ऑर्डर्स की हिस्ट्री',
    purposeEn: 'Get customer order history and tracking status',
    test: await req('GET', '/api/orders')
  });

  const newOrderRes = await req('POST', '/api/orders', {
    items: [{ productId: 'prod_foundation', quantity: 1, price: 2850 }],
    total: 2850,
    paymentMethod: 'UPI'
  });

  results.push({
    method: 'POST',
    path: '/api/orders',
    category: 'Orders',
    purposeHindi: 'चेकआउट करके नया ऑर्डर प्लेस करना',
    purposeEn: 'Create a new customer checkout order',
    test: newOrderRes
  });

  const createdOrderId = newOrderRes.data?.order?.id || 'ord_1';

  results.push({
    method: 'GET',
    path: '/api/orders/:id',
    category: 'Orders',
    purposeHindi: 'किसी एक ऑर्डर की इनवॉइस और ट्रैकिंग डिटेल्स देखना',
    purposeEn: 'Get single order details and invoice information',
    test: await req('GET', `/api/orders/${createdOrderId}`)
  });

  // 8. Cart APIs
  results.push({
    method: 'GET',
    path: '/api/cart',
    category: 'Cart',
    purposeHindi: 'शॉपिंग कार्ट में मौजूद आइटम्स और कुल कीमत देखना',
    purposeEn: 'Get current user cart items, quantities & bill summary',
    test: await req('GET', '/api/cart')
  });

  results.push({
    method: 'POST',
    path: '/api/cart',
    category: 'Cart',
    purposeHindi: 'कार्ट में नया प्रोडक्ट ऐड करना',
    purposeEn: 'Add product item to shopping cart',
    test: await req('POST', '/api/cart', { productId: 'prod_choker', quantity: 1, variant: 'Standard' })
  });

  results.push({
    method: 'PUT',
    path: '/api/cart/:productId',
    category: 'Cart',
    purposeHindi: 'कार्ट में प्रोडक्ट की क्वांटिटी बढ़ाना/घटाना',
    purposeEn: 'Update item quantity in shopping cart',
    test: await req('PUT', '/api/cart/prod_choker', { quantity: 2, variant: 'Standard' })
  });

  results.push({
    method: 'POST',
    path: '/api/cart/apply-coupon',
    category: 'Cart',
    purposeHindi: 'डिस्काउंट कूपन कोड (GLOW20 / NIHARA10) अप्लाई करना',
    purposeEn: 'Apply promotional coupon code to cart total',
    test: await req('POST', '/api/cart/apply-coupon', { code: 'GLOW20' })
  });

  results.push({
    method: 'DELETE',
    path: '/api/cart/remove-coupon',
    category: 'Cart',
    purposeHindi: 'लागू किया गया कूपन कोड कार्ट से हटाना',
    purposeEn: 'Remove currently applied coupon discount from cart',
    test: await req('DELETE', '/api/cart/remove-coupon')
  });

  results.push({
    method: 'DELETE',
    path: '/api/cart/:productId',
    category: 'Cart',
    purposeHindi: 'कार्ट से किसी प्रोडक्ट को हटाना',
    purposeEn: 'Remove product from cart',
    test: await req('DELETE', '/api/cart/prod_choker?variant=Standard')
  });

  // 9. Profile & Addresses APIs
  results.push({
    method: 'GET',
    path: '/api/profile',
    category: 'Profile',
    purposeHindi: 'कस्टमर प्रोफाइल, रॉयल्टी टियर और रिवॉर्ड पॉइंट्स देखना',
    purposeEn: 'Get user profile info, VIP tier & reward points',
    test: await req('GET', '/api/profile')
  });

  results.push({
    method: 'PUT',
    path: '/api/profile/update',
    category: 'Profile',
    purposeHindi: 'कस्टमर का नाम, ईमेल या फोन नंबर अपडेट करना',
    purposeEn: 'Update customer personal profile information',
    test: await req('PUT', '/api/profile/update', { name: 'Amit Kumar Royal' })
  });

  results.push({
    method: 'GET',
    path: '/api/profile/addresses',
    category: 'Addresses',
    purposeHindi: 'कस्टमर के सभी सेव किए गए डिलीवरी एड्रेस देखना',
    purposeEn: 'Get all saved customer delivery addresses',
    test: await req('GET', '/api/profile/addresses')
  });

  const newAddrRes = await req('POST', '/api/profile/addresses', {
    name: 'Amit Kumar',
    addressLine: 'Flat 402, Royal Palms, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 8004116370',
    isDefault: true
  });

  results.push({
    method: 'POST',
    path: '/api/profile/addresses',
    category: 'Addresses',
    purposeHindi: 'नया डिलीवरी एड्रेस सेव करना',
    purposeEn: 'Save a new delivery address for checkout',
    test: newAddrRes
  });

  const createdAddrId = newAddrRes.data?.address?.id || 'addr_1';

  results.push({
    method: 'PUT',
    path: '/api/profile/addresses/:id',
    category: 'Addresses',
    purposeHindi: 'सेव किए गए डिलीवरी एड्रेस को एडिट करना',
    purposeEn: 'Update existing saved address details',
    test: await req('PUT', `/api/profile/addresses/${createdAddrId}`, { city: 'Mumbai Luxury' })
  });

  results.push({
    method: 'DELETE',
    path: '/api/profile/addresses/:id',
    category: 'Addresses',
    purposeHindi: 'सेव किए गए डिलीवरी एड्रेस को डिलीट करना',
    purposeEn: 'Delete a saved delivery address',
    test: await req('DELETE', `/api/profile/addresses/${createdAddrId}`)
  });

  // 10. Wishlist APIs
  results.push({
    method: 'GET',
    path: '/api/profile/wishlist',
    category: 'Wishlist',
    purposeHindi: 'कस्टमर की विशलिस्ट में सेव किए गए प्रोडक्ट्स देखना',
    purposeEn: 'Get user saved wishlist favorite items',
    test: await req('GET', '/api/profile/wishlist')
  });

  results.push({
    method: 'POST',
    path: '/api/profile/wishlist/:productId',
    category: 'Wishlist',
    purposeHindi: 'प्रोडक्ट को विशलिस्ट में जोड़ना या हटाना (Toggle)',
    purposeEn: 'Toggle product in/out of customer wishlist',
    test: await req('POST', '/api/profile/wishlist/prod_choker')
  });

  // 11. Payments APIs
  results.push({
    method: 'POST',
    path: '/api/payment/create-intent',
    category: 'Payments',
    purposeHindi: 'पेमेंट गेटवे (Razorpay/Cards) का पेमेंट आर्डर इंटेंट बनाना',
    purposeEn: 'Create payment gateway order intent for checkout',
    test: await req('POST', '/api/payment/create-intent', { amount: 2850 })
  });

  results.push({
    method: 'POST',
    path: '/api/payment/verify',
    category: 'Payments',
    purposeHindi: 'पेमेंट गेटवे सिग्नेचर और ट्रांजैक्शन वेरिफाई करना',
    purposeEn: 'Verify payment gateway signature after transaction',
    test: await req('POST', '/api/payment/verify', { paymentId: 'pay_test_123', orderId: 'ord_test_456' })
  });

  // 12. Offers & Promotions APIs
  results.push({
    method: 'GET',
    path: '/api/offers',
    category: 'Offers & Promos',
    purposeHindi: 'सभी एक्टिव प्रोमोशनल ऑफर्स, डिस्काउंट्स और कूपन्स देखना',
    purposeEn: 'Get active promotional banners and discount deals',
    test: await req('GET', '/api/offers')
  });

  const newOfferRes = await req('POST', '/api/offers', {
    title: 'Diwali Festive Glow',
    code: 'FESTIVE30',
    discountPercent: 30,
    validTill: '2026-11-15'
  }, adminHeaders);

  results.push({
    method: 'POST',
    path: '/api/offers',
    category: 'Offers & Promos (Admin)',
    purposeHindi: 'एडमिन द्वारा नया प्रमोशनल ऑफर/कूपन बनाना (RBAC Protected)',
    purposeEn: 'Admin create a promotional offer coupon',
    test: newOfferRes
  });

  const createdOfferId = newOfferRes.data?.offer?.id || 'off_festive';

  results.push({
    method: 'PATCH',
    path: '/api/offers/:id/toggle',
    category: 'Offers & Promos (Admin)',
    purposeHindi: 'एडमिन द्वारा ऑफर को एक्टिव/डीएक्टिवेट टॉगल करना',
    purposeEn: 'Admin toggle promotional offer active status',
    test: await req('PATCH', `/api/offers/${createdOfferId}/toggle`, null, adminHeaders)
  });

  results.push({
    method: 'DELETE',
    path: '/api/offers/:id',
    category: 'Offers & Promos (Admin)',
    purposeHindi: 'एडमिन द्वारा प्रमोशनल ऑफर को डिलीट करना',
    purposeEn: 'Admin delete promotional offer from database',
    test: await req('DELETE', `/api/offers/${createdOfferId}`, null, adminHeaders)
  });

  console.log(`\n--- ALL ${results.length} ENDPOINTS TESTED ---`);
  let passed = 0;
  for (const r of results) {
    const isOk = r.test.ok;
    if (isOk) passed++;
    console.log(`[${isOk ? 'PASS' : 'FAIL'} ${r.test.status}] ${r.method.padEnd(6)} ${r.path.padEnd(32)} (${r.test.duration}) -> ${r.purposeHindi}`);
  }
  console.log(`\nFinal Test Score: ${passed}/${results.length} PASSED`);

  return results;
}

runAllTests().catch(console.error);
