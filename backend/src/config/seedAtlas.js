import 'dotenv/config';
import mongoose from 'mongoose';
import { initialData } from '../data/initialData.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Service } from '../models/Service.js';
import { User } from '../models/User.js';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected! Seeding initial collections...');

  // Seed Categories
  await Category.deleteMany({});
  const categoriesToInsert = initialData.categories.map(c => ({
    name: c.name,
    slug: c.slug,
    itemCount: c.itemCount || 0,
    image: c.image,
    description: c.description || '',
    subcategories: c.subcategories || []
  }));
  await Category.insertMany(categoriesToInsert);
  console.log(`Inserted ${categoriesToInsert.length} categories`);

  // Seed Products
  await Product.deleteMany({});
  const productsToInsert = initialData.products.map(p => ({
    name: p.name,
    slug: p.slug || p.id,
    category: p.category,
    categorySlug: p.categorySlug || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    subcategory: p.subcategory || '',
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discountPercent: p.discountPercent || 0,
    rating: p.rating || 4.8,
    reviewCount: p.reviewCount || 10,
    images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e']),
    description: p.description || '',
    variants: p.variants || [],
    sizes: p.sizes || [],
    features: p.features || [],
    stock: p.stock || 25,
    isFeatured: !!p.isFeatured,
    isBestseller: !!p.isBestseller
  }));
  await Product.insertMany(productsToInsert);
  console.log(`Inserted ${productsToInsert.length} products`);

  // Seed Services
  await Service.deleteMany({});
  const servicesToInsert = (initialData.services || []).map(s => ({
    name: s.name,
    slug: s.slug || s.id,
    category: s.category || 'Salon',
    price: s.price || 999,
    durationMinutes: s.durationMinutes || 45,
    rating: s.rating || 4.9,
    reviewCount: s.reviewCount || 12,
    image: s.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    description: s.description || '',
    inclusions: s.inclusions || []
  }));
  if (servicesToInsert.length > 0) {
    await Service.insertMany(servicesToInsert);
    console.log(`Inserted ${servicesToInsert.length} services`);
  }

  // Seed Users
  await User.deleteMany({});
  const usersToInsert = (initialData.users || []).map(u => ({
    name: u.name,
    email: u.email,
    phone: u.phone,
    password: u.password,
    avatar: u.avatar,
    tier: u.tier,
    rewardPoints: u.rewardPoints
  }));
  if (usersToInsert.length > 0) {
    await User.insertMany(usersToInsert);
    console.log(`Inserted ${usersToInsert.length} users`);
  }

  console.log('Database seeding successfully finished!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
