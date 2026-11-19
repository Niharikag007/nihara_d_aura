const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const legacySlugByStorefrontSlug = {
  'royal-emerald-floral-jhumkas': '22k-solid-gold-peacock-temple-jhumkas',
  'royal-ruby-flower-drop-earrings': 'royal-jadau-kundan-pearl-chandbalis',
  'pearl-gold-blossom-studs': '18k-gold-floral-solitaire-stud-earrings',
  'golden-bell-temple-dangler-earrings': 'antique-22k-gold-lakshmi-temple-danglers',
  'amber-crystal-festive-jhumkas': 'traditional-rajasthani-filigree-22k-gold-jhumkas',
  'royal-nakshi-lakshmi-temple-kada': 'handcrafted-nakshi-lakshmi-temple-kada',
  'everyday-anti-tarnish-fashion-ring': 'uncut-polki-diamond-18k-gold-solitaire-ring',
};
const allowedNewSlugs = new Set(['everyday-anti-tarnish-fashion-ring']);
const JEWELLERY_TARGET_MARGIN = 18;

const getStorefrontFields = (product) => {
  const images = Array.isArray(product.images) ? product.images : [];
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    categorySlug: product.categorySlug,
    subcategory: product.subcategory,
    productCollection: 'Jewellery',
    price: product.price,
    cost: Math.round(product.price * (1 - JEWELLERY_TARGET_MARGIN / 100)),
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images,
    image: images[0] || '',
    description: product.description || '',
    variants: product.variants || [],
    sizes: product.sizes || [],
    features: product.features || [],
    stock: product.stock ?? 0,
    isFeatured: Boolean(product.isFeatured),
    isBestseller: Boolean(product.isBestseller),
  };
};

async function syncJewelleryCatalog() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);

    const frontendDataPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'services', 'mockData.js');
    const source = fs.readFileSync(frontendDataPath, 'utf8')
      .replace(/^export const mockData = /, '')
      .replace(/;\s*$/, '');
    const storefrontProducts = JSON.parse(source).products.filter(product =>
      /jewell/i.test(`${product.category || ''} ${product.categorySlug || ''}`)
    );
    const databaseProducts = await Product.find();
    const productBySlug = new Map(databaseProducts.map(product => [product.slug, product]));
    const updates = [];
    const matchedIds = new Set();
    const storefrontSlugs = new Set(storefrontProducts.map(product => product.slug));

    if (storefrontSlugs.size !== storefrontProducts.length) {
      throw new Error('Storefront jewellery catalog contains duplicate slugs');
    }

    for (const storefrontProduct of storefrontProducts) {
      const currentSlug = legacySlugByStorefrontSlug[storefrontProduct.slug];
      const databaseProduct = productBySlug.get(storefrontProduct.slug)
        || (currentSlug && productBySlug.get(currentSlug));
      if (!databaseProduct) {
        if (!allowedNewSlugs.has(storefrontProduct.slug)) {
          throw new Error(`No database product found for storefront product "${storefrontProduct.name}" (${storefrontProduct.slug})`);
        }
        updates.push({
          insertOne: {
            document: {
              ...getStorefrontFields(storefrontProduct),
              cost: 0,
              stock: storefrontProduct.stock ?? 0,
              status: 'Live',
              soldLast30: 0,
            },
          },
        });
        continue;
      }
      if (matchedIds.has(String(databaseProduct._id))) {
        throw new Error(`Multiple storefront products map to database product "${currentSlug}"`);
      }
      matchedIds.add(String(databaseProduct._id));

      const conflictingProduct = productBySlug.get(storefrontProduct.slug);
      if (conflictingProduct && String(conflictingProduct._id) !== String(databaseProduct._id)) {
        throw new Error(`Cannot assign duplicate product slug "${storefrontProduct.slug}"`);
      }

      updates.push({
        updateOne: {
          filter: { _id: databaseProduct._id },
          update: { $set: getStorefrontFields(storefrontProduct) },
        },
      });
    }

    const result = await Product.bulkWrite(updates);
    console.log(`Synced ${storefrontProducts.length} storefront jewellery products (${result.modifiedCount} changed).`);
    process.exitCode = 0;
  } catch (error) {
    console.error('Jewellery catalog sync failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  syncJewelleryCatalog();
}

module.exports = syncJewelleryCatalog;
