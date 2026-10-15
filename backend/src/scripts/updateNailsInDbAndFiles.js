import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://niharikagautam007_db_user:Nihara_2026@cluster0.wqlletl.mongodb.net/nihara_d_aura?retryWrites=true&w=majority";

// The 20 curated real nail polish / manicure products with exact images matching user's Meesho screenshots
export const updatedNailProducts = [
  {
    id: "prod_glitter_polish",
    name: "Superior Bright Mirror Chrome Silver Nail Polish",
    slug: "superior-bright-mirror-chrome-silver-nail-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Chrome Nail Art",
    price: 94,
    originalPrice: 107,
    discountPercent: 12,
    rating: 4.8,
    reviewCount: 1213,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_1.png"
    ],
    description: "Ultra-reflective liquid chrome mirror silver nail lacquer. Provides a salon-finish high-gloss metallic chrome coat that shines brilliantly under any lighting.",
    variants: ["Mirror Chrome Silver", "Holographic Platinum"],
    sizes: ["12ml Bottle"],
    features: [
      "Ultra-reflective mirror chrome finish",
      "Chip-resistant formula up to 14 days",
      "Quick-dry UV/Air formula with streak-free brush"
    ],
    stock: 45
  },
  {
    id: "prod_gold_nail_kit",
    name: "Professional Enriched Bronze & Wine Dual Nail Colour",
    slug: "professional-enriched-bronze-wine-dual-nail-colour",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 113,
    originalPrice: 131,
    discountPercent: 14,
    rating: 4.7,
    reviewCount: 1335,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_2.png"
    ],
    description: "Rich duo of metallic bronze copper and deep berry wine nail polish. Highly enriched with vitamins for intense pigmentation and lustrous shine in a single stroke.",
    variants: ["Metallic Bronze & Deep Wine", "Rose Copper Duo"],
    sizes: ["2 x 10ml Bottles"],
    features: [
      "Dual shade combo pack",
      "Enriched with nourishing Vitamin E",
      "High opacity in single stroke"
    ],
    stock: 50
  },
  {
    id: "prod_burgundy_gel_lacquer",
    name: "Sensational Collection Velvet Burgundy 4-Shade Nail Lacquer",
    slug: "sensational-collection-velvet-burgundy-4-shade-nail-lacquer",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 131,
    originalPrice: 155,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 409,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_3.png"
    ],
    description: "Sensational collection of 4 velvety burgundy, wine red, and deep plum shades. Delivers a salon-grade high-shine gel finish that locks in color for days.",
    variants: ["Burgundy & Wine Collection", "Royal Ruby Quartette"],
    sizes: ["Set of 4 x 8ml"],
    features: [
      "4 complementary bridal & party shades",
      "High shine salon gel finish",
      "No-fade formula with mirror gloss"
    ],
    stock: 35
  },
  {
    id: "prod_rose_gold_chrome_pen",
    name: "Colors Queen Super Gel Royal Maroon UV Nail Polish",
    slug: "colors-queen-super-gel-royal-maroon-uv-nail-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 245,
    originalPrice: 499,
    discountPercent: 51,
    rating: 4.8,
    reviewCount: 538,
    isFeatured: true,
    isBestseller: false,
    images: [
      "/images/nails/nail_img_4.png"
    ],
    description: "Deep, intense royal maroon UV gel nail lacquer by Colors Queen. Creates a smooth, plumping gel dome on nails with exceptional depth of color and mirror finish.",
    variants: ["Royal Deep Maroon", "Crimson Cherry"],
    sizes: ["15ml Salon Bottle"],
    features: [
      "Super Gel plump gloss formula",
      "UV/LED curable or fast air-dry",
      "51% festive discount - best seller"
    ],
    stock: 40
  },
  {
    id: "prod_french_nails",
    name: "Exclusive Bright Ice Matte Mocha & Bow Press-On Nails",
    slug: "exclusive-bright-ice-matte-mocha-bow-press-on-nails",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Press-On Kits",
    price: 148,
    originalPrice: 180,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 4619,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_5.png"
    ],
    description: "CEMERA Ice Matte finish press-on suite in rich mocha brown with 3D miniature gold bow charms. Non-glossy matte velvet texture crafted for modern elegance.",
    variants: ["Matte Mocha Brown", "Velvet Espresso"],
    sizes: ["24-Piece Suite with Adhesive Tabs"],
    features: [
      "Velvety soft ice matte texture",
      "3D metallic gold bow embellishments",
      "Reusable salon-quality press-on tips"
    ],
    stock: 60
  },
  {
    id: "prod_emerald_bridal_presson",
    name: "Colors Queen Affair Pastel Matcha Green Nail Lacquer",
    slug: "colors-queen-affair-pastel-matcha-green-nail-lacquer",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 149,
    originalPrice: 179,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 900,
    isFeatured: false,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_6.png"
    ],
    description: "Pastel matcha sage green nail lacquer with smooth, milky consistency. Subtle, calming, and aesthetic aesthetic tone that matches earthy luxury styling.",
    variants: ["Matcha Sage Green", "Pistachio Mint"],
    sizes: ["12ml Bottle"],
    features: [
      "Aesthetic pastel sage tone",
      "Smooth streak-free application",
      "Long-wear chip resistant formula"
    ],
    stock: 35
  },
  {
    id: "prod_coffin_nude_presson",
    name: "Rich Chocolate Brown High-Shine UV Gel Nail Polish",
    slug: "rich-chocolate-brown-high-shine-uv-gel-nail-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 237,
    originalPrice: 499,
    discountPercent: 53,
    rating: 4.7,
    reviewCount: 123,
    isFeatured: false,
    isBestseller: false,
    images: [
      "/images/nails/nail_img_7.png"
    ],
    description: "Colors Queen Rich Chocolate Brown UV Gel Nail Polish. Deep coffee brown tone that offers warm, luxurious coverage with incredible high-gloss sheen.",
    variants: ["Rich Chocolate Brown", "Warm Espresso"],
    sizes: ["15ml Bottle"],
    features: [
      "Deep cocoa pigment intensity",
      "Ultra-glossy gel coat",
      "Does not yellow or crack"
    ],
    stock: 30
  },
  {
    id: "prod_nail_lacquer",
    name: "SUGAR POP Bold Classic Cherry Red Glossy Nail Lacquer",
    slug: "sugar-pop-bold-classic-cherry-red-glossy-nail-lacquer",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 80,
    originalPrice: 129,
    discountPercent: 38,
    rating: 4.9,
    reviewCount: 86,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_8.png"
    ],
    description: "SUGAR POP Bold Cherry Red glossy nail lacquer. Rich crimson red shade with wide fan brush that coats each nail evenly in a single dip with mirror gloss.",
    variants: ["Bold Cherry Red", "Classic Crimson"],
    sizes: ["10ml Classic Bottle"],
    features: [
      "Intense pigment payoff",
      "Wide custom fan applicator brush",
      "Quick-dry gloss finish"
    ],
    stock: 75
  },
  {
    id: "prod_gel_top_base_duo",
    name: "Bella Dual Enriched Glossy Black & Crystal Top Coat Duo",
    slug: "bella-dual-enriched-glossy-black-crystal-top-coat-duo",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 96,
    originalPrice: 108,
    discountPercent: 11,
    rating: 4.8,
    reviewCount: 612,
    isFeatured: true,
    isBestseller: false,
    images: [
      "/images/nails/nail_img_9.png"
    ],
    description: "Bella 2-piece combo featuring High-Gloss Midnight Black and Crystal Clear Diamond Top Coat. Locks in midnight intensity while preventing chipping.",
    variants: ["Midnight Black & Crystal Clear", "Dual Black Pack"],
    sizes: ["2 x 10ml Bottles"],
    features: [
      "Complete base and top coat pairing",
      "Deepest pitch black pigment",
      "High-gloss diamond seal"
    ],
    stock: 45
  },
  {
    id: "prod_milky_white_gel",
    name: "Scheibe Superior Professional Jet Black High-Gloss Gel Polish",
    slug: "scheibe-superior-professional-jet-black-high-gloss-gel-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 177,
    originalPrice: 181,
    discountPercent: 2,
    rating: 4.7,
    reviewCount: 117,
    isFeatured: false,
    isBestseller: false,
    images: [
      "/images/nails/nail_img_10.png"
    ],
    description: "Scheibe Professional high-gloss black gel lacquer. Delivers intense pitch-black color with wet-look mirror shine. Perfect for modern gothic and statement nail art.",
    variants: ["Jet Black Gloss", "Raven Noir"],
    sizes: ["12ml Salon Bottle"],
    features: [
      "Professional salon formulation",
      "Single-coat opaque black coverage",
      "Long-lasting shine"
    ],
    stock: 35
  },
  {
    id: "prod_pearl_glazed_chrome",
    name: "Scheibe Premium Rich High-Pigment Black Gel Lacquer",
    slug: "scheibe-premium-rich-high-pigment-black-gel-lacquer",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 178,
    originalPrice: 199,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 421,
    isFeatured: false,
    isBestseller: false,
    images: [
      "/images/nails/nail_img_11.png"
    ],
    description: "Scheibe Premium Rich high-pigment lacquer. Specially engineered to resist fading and chipping, providing an enduring black gloss finish that looks freshly painted.",
    variants: ["Rich Onyx Black", "Diamond Noir"],
    sizes: ["12ml Bottle"],
    features: [
      "Deep pigment saturation",
      "Chip-proof resilience",
      "Smooth glide application"
    ],
    stock: 40
  },
  {
    id: "prod_cuticle_oil",
    name: "Colors Queen Affair Caramel Mocha Long-Wear Nail Polish",
    slug: "colors-queen-affair-caramel-mocha-long-wear-nail-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 147,
    originalPrice: 179,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 1964,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_12.png"
    ],
    description: "Warm, delectable caramel mocha brown nail lacquer from the Colors Queen Affair range. Flattering on all Indian skin tones, adding an earthy elegance.",
    variants: ["Caramel Mocha", "Warm Chestnut"],
    sizes: ["12ml Bottle"],
    features: [
      "Universally flattering warm nude-brown",
      "Over 1,900 verified 5-star customer ratings",
      "Fast drying with lasting brilliance"
    ],
    stock: 80
  },
  {
    id: "prod_gold_foil_art_suite",
    name: "MI Fashion 4-in-1 Velvet Matte Plum & Wine Nail Enamel Set",
    slug: "mi-fashion-4-in-1-velvet-matte-plum-wine-nail-enamel-set",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 243,
    originalPrice: 255,
    discountPercent: 5,
    rating: 4.9,
    reviewCount: 557,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_13.png"
    ],
    description: "MI Fashion set of 4 luxury matte & satin nail enamels in deep wine, royal plum, and velvety berry shades. Comes with swatches for mix-and-match manicures.",
    variants: ["Plum & Wine 4-Pack", "Royal Berry Suite"],
    sizes: ["Set of 4 x 9ml"],
    features: [
      "4 complementary bridal wine shades",
      "Velvet matte & satin dual finishes",
      "Toxin-free 5-free formula"
    ],
    stock: 55
  },
  {
    id: "prod_holographic_chrome_flakes",
    name: "Colors Queen Premium Diamond Shimmer Glitter Nail Lacquer",
    slug: "colors-queen-premium-diamond-shimmer-glitter-nail-lacquer",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Chrome Nail Art",
    price: 245,
    originalPrice: 499,
    discountPercent: 51,
    rating: 4.8,
    reviewCount: 206,
    isFeatured: true,
    isBestseller: false,
    images: [
      "/images/nails/nail_img_14.png"
    ],
    description: "Colors Queen Premium sparkling silver micro-glitter nail polish. Hundreds of light-reflecting diamond particles suspended in crystal clear suspension for party-ready nails.",
    variants: ["Diamond Silver Shimmer", "Champagne Gold Glitter"],
    sizes: ["15ml Bottle"],
    features: [
      "Ultra-fine reflective glitter particles",
      "Can be worn solo or as sparkling top coat",
      "Does not feel gritty or peel"
    ],
    stock: 40
  },
  {
    id: "prod_presson",
    name: "Colors Queen Professional Pastel Blossom Pink Gel Polish",
    slug: "colors-queen-professional-pastel-blossom-pink-gel-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Gel Lacquer",
    price: 241,
    originalPrice: 499,
    discountPercent: 52,
    rating: 4.7,
    reviewCount: 380,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_15.png"
    ],
    description: "Soft, romantic baby pink pastel gel lacquer by Colors Queen. Imparts a delicate cherry blossom flush with ultra-glossy glass-like reflections.",
    variants: ["Blossom Baby Pink", "Soft Rose Nude"],
    sizes: ["15ml Salon Bottle"],
    features: [
      "Delicate pastel pink shade",
      "High gloss plumping effect",
      "52% limited discount"
    ],
    stock: 65
  },
  {
    id: "prod_liquid_chrome_powder",
    name: "Sensational Bright Bella Mirror Chrome Metallic Silver Nail Polish",
    slug: "sensational-bright-bella-mirror-chrome-metallic-silver-nail-polish",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Chrome Nail Art",
    price: 95,
    originalPrice: 108,
    discountPercent: 12,
    rating: 4.8,
    reviewCount: 422,
    isFeatured: true,
    isBestseller: true,
    images: [
      "/images/nails/nail_img_16.png"
    ],
    description: "Futuristic Bella silver mirror chrome liquid polish. Delivers an otherworldly molten liquid silver reflection on nails without needing complicated powders or lamps.",
    variants: ["Mirror Liquid Silver", "Gunmetal Chrome"],
    sizes: ["10ml Bottle"],
    features: [
      "Authentic molten chrome effect",
      "Dries smooth and streak-free",
      "Instant futuristic metallic finish"
    ],
    stock: 70
  },
  {
    id: "prod_rose_jojoba_oil_pen",
    name: "Damascus Rose & Argan Nourishing Cuticle Oil Care Pen",
    slug: "damascus-rose-argan-nourishing-cuticle-oil-care-pen",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Cuticle Elixirs",
    price: 199,
    originalPrice: 350,
    discountPercent: 43,
    rating: 4.9,
    reviewCount: 310,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Infused with pure Moroccan Argan and distilled Damascus Rose oils. Softens rough cuticles, prevents hangnails, and conditions nail beds after manicures.",
    variants: ["Damascus Rose", "Pure Argan"],
    sizes: ["5ml Precision Brush Pen"],
    features: [
      "Pocket-friendly twist applicator",
      "Deep moisture without greasy residue",
      "Enriched with natural botanical extracts"
    ],
    stock: 50
  },
  {
    id: "prod_almond_keratin_serum",
    name: "Sweet Almond & Keratin Deep Nail Repair & Strength Serum",
    slug: "sweet-almond-keratin-deep-nail-repair-strength-serum",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Cuticle Elixirs",
    price: 249,
    originalPrice: 399,
    discountPercent: 37,
    rating: 4.8,
    reviewCount: 245,
    isFeatured: false,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Clinically formulated with hydrolyzed nail keratin and cold-pressed sweet almond oil. Rebuilds brittle, peeling nails and supports thicker, healthier nail growth.",
    variants: ["Almond Keratin Complex"],
    sizes: ["15ml Dropper Bottle"],
    features: [
      "Repairs damage from acrylics and gel removals",
      "Strengthens natural keratin bonds",
      "Noticeable strength in 7 days"
    ],
    stock: 40
  },
  {
    id: "prod_lavender_night_balm",
    name: "French Lavender Soothing Cuticle & Hand Therapy Cream",
    slug: "french-lavender-soothing-cuticle-hand-therapy-cream",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Cuticle Elixirs",
    price: 229,
    originalPrice: 349,
    discountPercent: 34,
    rating: 4.7,
    reviewCount: 188,
    isFeatured: false,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Rich overnight restorative cream with Provence lavender, shea butter, and jojoba. Rehydrates severely dry hands and seals cuticle moisture overnight.",
    variants: ["Lavender & Shea Butter"],
    sizes: ["50g Luxe Jar"],
    features: [
      "Calming French lavender fragrance",
      "Deep nourishing overnight therapy",
      "Leaves skin velvety soft and nourished"
    ],
    stock: 45
  },
  {
    id: "prod_vitamin_e_strengthener",
    name: "Cold-Pressed Avocado & Vitamin E Growth Nail Shield",
    slug: "cold-pressed-avocado-vitamin-e-growth-nail-shield",
    category: "Nails",
    categorySlug: "nails",
    subcategory: "Cuticle Elixirs",
    price: 189,
    originalPrice: 299,
    discountPercent: 36,
    rating: 4.8,
    reviewCount: 340,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Protective clear nail growth treatment enriched with rich avocado oil, calcium, and Vitamin E. Imparts a glossy protective shield that prevents chipping and supports long natural nails.",
    variants: ["Avocado & Vitamin E Shield"],
    sizes: ["12ml Treatment Bottle"],
    features: [
      "Stimulates healthy natural nail growth",
      "Invisible chip-proof protective armor",
      "High-gloss transparent finish"
    ],
    stock: 60
  }
];

async function updateAll() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas successfully.');

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  console.log('Updating MongoDB products in category Nails...');
  for (const item of updatedNailProducts) {
    const res = await Product.findOneAndUpdate(
      { id: item.id },
      { $set: item },
      { upsert: true, new: true }
    );
    console.log(`Updated DB: ${item.id} -> ${item.name}`);
  }

  // Update initialData.js
  console.log('Updating backend/src/data/initialData.js...');
  const rootDir = path.resolve(import.meta.dirname, '../../..');
  const initDataPath = path.join(rootDir, 'backend/src/data/initialData.js');

  // Load existing module to get all other products
  const mod = await import('../data/initialData.js');
  const existingProducts = mod.initialData.products;

  // Replace nail products in array
  const updatedProductList = existingProducts.map(p => {
    const match = updatedNailProducts.find(n => n.id === p.id);
    return match ? { ...p, ...match } : p;
  });

  const fullData = {
    ...mod.initialData,
    products: updatedProductList
  };

  const newCode = `// Preloaded seed data matching APK, Video & PRD exactly\nexport const initialData = ${JSON.stringify(fullData, null, 2)};\n`;
  fs.writeFileSync(initDataPath, newCode, 'utf8');
  console.log('Updated initialData.js successfully.');

  // Update mockData.js
  console.log('Updating frontend/src/services/mockData.js...');
  const mockDataPath = path.join(rootDir, 'frontend/src/services/mockData.js');
  if (fs.existsSync(mockDataPath)) {
    const mockMod = await import('../../../frontend/src/services/mockData.js');
    if (mockMod.mockData && mockMod.mockData.products) {
      const updatedMockProducts = mockMod.mockData.products.map(p => {
        const match = updatedNailProducts.find(n => n.id === p.id);
        return match ? { ...p, ...match } : p;
      });
      const newMockData = {
        ...mockMod.mockData,
        products: updatedMockProducts
      };
      fs.writeFileSync(mockDataPath, `// Preloaded client dataset matching backend, APK, Video & PRD\nexport const mockData = ${JSON.stringify(newMockData, null, 2)};\n`, 'utf8');
      console.log('Updated mockData.js successfully.');
    }
  }

  console.log('ALL NAIL PRODUCTS UPDATED ACROSS MONGODB, INITIAL DATA, AND MOCK DATA!');
  process.exit(0);
}

updateAll().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
