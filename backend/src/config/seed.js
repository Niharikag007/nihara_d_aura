import { Product } from '../models/Product.js';
import { Service, Artist } from '../models/Service.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { Address } from '../models/BookingOrderAddress.js';
import { Offer } from '../models/Offer.js';
import { initialData } from '../data/initialData.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Check & Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0 && Array.isArray(initialData.products) && initialData.products.length > 0) {
      console.log(`[Seed] Seeding ${initialData.products.length} products to MongoDB...`);
      await Product.insertMany(initialData.products.map(p => ({
        ...p,
        id: p.id || `prod_${Date.now()}`
      })));
      console.log(`[Seed] Products seeded successfully.`);
    }

    // 2. Check & Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0 && Array.isArray(initialData.categories) && initialData.categories.length > 0) {
      console.log(`[Seed] Seeding ${initialData.categories.length} categories to MongoDB...`);
      await Category.insertMany(initialData.categories);
      console.log(`[Seed] Categories seeded successfully.`);
    }

    // 3. Check & Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0 && Array.isArray(initialData.services) && initialData.services.length > 0) {
      console.log(`[Seed] Seeding ${initialData.services.length} services to MongoDB...`);
      await Service.insertMany(initialData.services);
      console.log(`[Seed] Services seeded successfully.`);
    }

    // 4. Check & Seed Artists
    const artistCount = await Artist.countDocuments();
    if (artistCount === 0 && Array.isArray(initialData.artists) && initialData.artists.length > 0) {
      console.log(`[Seed] Seeding ${initialData.artists.length} artists to MongoDB...`);
      await Artist.insertMany(initialData.artists);
      console.log(`[Seed] Artists seeded successfully.`);
    }

    // 5. Check & Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0 && Array.isArray(initialData.users) && initialData.users.length > 0) {
      console.log(`[Seed] Seeding default users to MongoDB...`);
      await User.insertMany(initialData.users);
      console.log(`[Seed] Users seeded successfully.`);
    }

    // 6. Check & Seed Offers
    const offerCount = await Offer.countDocuments();
    if (offerCount === 0) {
      const defaultOffers = [
        { id: "off_1", code: "NIHARA10", name: "Royal 10% Welcome Offer", discountPercent: 10, minOrder: 1999, validTill: "2026-12-31", isActive: true },
        { id: "off_2", code: "GLOW20", name: "Festive Glow 20% Offer", discountPercent: 20, minOrder: 3999, validTill: "2026-11-30", isActive: true },
        { id: "off_3", code: "AURA30", name: "Haute Luxury VIP Offer", discountPercent: 30, minOrder: 9999, validTill: "2026-12-31", isActive: true },
        { id: "off_4", code: "BRIDAL15", name: "Bridal Suite Special Offer", discountPercent: 15, minOrder: 4999, validTill: "2026-12-31", isActive: true }
      ];
      await Offer.insertMany(defaultOffers);
      console.log(`[Seed] Default offers seeded to MongoDB.`);
    }

    // 7. Check & Seed Addresses
    const addressCount = await Address.countDocuments();
    if (addressCount === 0 && Array.isArray(initialData.addresses) && initialData.addresses.length > 0) {
      await Address.insertMany(initialData.addresses);
      console.log(`[Seed] Default addresses seeded to MongoDB.`);
    }
  } catch (err) {
    console.error(`[Seed] Error checking/seeding database:`, err.message);
  }
};
