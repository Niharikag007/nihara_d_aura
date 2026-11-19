const mongoose = require('mongoose');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function updateProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find();
    console.log(`Found ${products.length} products`);
    const seedPath = path.join(__dirname, '..', 'seeds', 'products.json');
    const seedProducts = fs.existsSync(seedPath)
      ? JSON.parse(fs.readFileSync(seedPath, 'utf8'))
      : [];
    const seedProductBySlug = new Map(seedProducts.map(product => [product.slug, product]));
    const jewelleryNameAndImageBySlug = {
      'nihara-signature-18k-rose-gold-choker': {
        name: 'Pearl Bloom Choker Set',
        image: '/images/artificial-jewellery/necklaces/necklace_01.jpeg'
      },
      'luminary-diamond-18k-rose-gold-tennis-choker': {
        name: 'Royal Pearl Collar',
        image: '/images/artificial-jewellery/necklaces/necklace_02.jpeg'
      },
      'blooming-flora-18k-rose-gold-layered-choker': {
        name: 'Floral Kundan Layer Choker',
        image: '/images/artificial-jewellery/necklaces/necklace_03.jpeg'
      },
      'regal-emerald-drop-18k-rose-gold-collar': {
        name: 'Emerald Lace Collar',
        image: '/images/artificial-jewellery/necklaces/necklace_04.jpeg'
      },
      'basra-pearl-18k-rose-gold-cascade-choker': {
        name: 'Pearl Cascade Choker',
        image: '/images/artificial-jewellery/necklaces/necklace_05.jpeg'
      },
      '22k-solid-gold-peacock-temple-jhumkas': {
        name: '22K Solid Gold Peacock Temple Jhumkas',
        image: '/images/artificial-jewellery/earrings/earring_01.jpeg'
      },
      'royal-jadau-kundan-pearl-chandbalis': {
        name: 'Royal Jadau Kundan & Pearl Chandbalis',
        image: '/images/artificial-jewellery/earrings/earring_08.jpeg'
      },
      '18k-gold-floral-solitaire-stud-earrings': {
        name: '18K Gold Floral Solitaire Stud Earrings',
        image: '/images/artificial-jewellery/earrings/earring_04.jpeg'
      },
      'antique-22k-gold-lakshmi-temple-danglers': {
        name: 'Antique 22K Gold Lakshmi Temple Danglers',
        image: '/images/artificial-jewellery/earrings/earring_17.jpeg'
      },
      'traditional-rajasthani-filigree-22k-gold-jhumkas': {
        name: 'Traditional Rajasthani Filigree 22K Gold Jhumkas',
        image: '/images/artificial-jewellery/earrings/earring_09.jpeg'
      }
    };

    let updated = 0;
    for (const product of products) {
      let needsUpdate = false;
      const seedMatch = seedProductBySlug.get(product.slug);
      const seedCategory = seedMatch?.category || seedMatch?.categorySlug || '';
      if (seedMatch && /jewell/i.test(seedCategory)) {
        if (product.name !== seedMatch.name) {
          product.name = seedMatch.name;
          needsUpdate = true;
        }
        if (Array.isArray(seedMatch.images) && seedMatch.images.length > 0) {
          if (JSON.stringify(product.images) !== JSON.stringify(seedMatch.images)) {
            product.images = seedMatch.images;
            needsUpdate = true;
          }
          if (product.image !== seedMatch.images[0]) {
            product.image = seedMatch.images[0];
            needsUpdate = true;
          }
        }
      }
      const jewelleryMatch = jewelleryNameAndImageBySlug[product.slug];
      if (jewelleryMatch) {
        if (product.name !== jewelleryMatch.name) {
          product.name = jewelleryMatch.name;
          needsUpdate = true;
        }
        if (!Array.isArray(product.images) || !product.images.includes(jewelleryMatch.image)) {
          product.images = [jewelleryMatch.image];
          needsUpdate = true;
        }
        if (product.image !== jewelleryMatch.image) {
          product.image = jewelleryMatch.image;
          needsUpdate = true;
        }
      }

      // Set default productCollection based on product name and category
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      const combined = `${name} ${category}`;

      let assignedCollection = 'Jewellery';

      // Check for Makeup keywords
      if (combined.includes('lipstick') || combined.includes('foundation') || combined.includes('concealer') ||
          combined.includes('blush') || combined.includes('highlighter') || combined.includes('primer') ||
          combined.includes('mascara') || combined.includes('eyeshadow') || combined.includes('kohl') ||
          combined.includes('setting spray') || combined.includes('elixer') || combined.includes('shimmer') ||
          combined.includes('cream') || combined.includes('tint') || combined.includes('palette') ||
          combined.includes('makeup') || combined.includes('bb cream') || combined.includes('matte')) {
        assignedCollection = 'Makeup';
      }
      // Check for Nails keywords
      else if (combined.includes('nail') || combined.includes('polish') || combined.includes('lacquer') ||
               combined.includes('gel') || combined.includes('manicure') || combined.includes('cuticle') ||
               combined.includes('press-on') || combined.includes('enamel')) {
        assignedCollection = 'Nails';
      }
      // Check for Candles keywords
      else if (combined.includes('candle') || combined.includes('wax') || combined.includes('diffuser') ||
               combined.includes('room mist') || combined.includes('fragrance') || combined.includes('aroma') ||
               combined.includes('scent') || combined.includes('reed') || combined.includes('soy')) {
        assignedCollection = 'Candles';
      }
      // Check for Jewellery keywords
      else if (combined.includes('gold') || combined.includes('diamond') || combined.includes('kundan') ||
               combined.includes('jhumka') || combined.includes('earring') || combined.includes('necklace') ||
               combined.includes('choker') || combined.includes('bangle') || combined.includes('kada') ||
               combined.includes('pendant') || combined.includes('bridal') || combined.includes('temple') ||
               combined.includes('filigree') || combined.includes('jadau') || combined.includes('polki') ||
               combined.includes('mala') || combined.includes('haar') || combined.includes('tikka') ||
               combined.includes('ring') || combined.includes('antique') || combined.includes('royal')) {
        assignedCollection = 'Jewellery';
      }

      if (product.productCollection !== assignedCollection) {
        product.productCollection = assignedCollection;
        needsUpdate = true;
      }

      // Set default cost if missing
      if (!product.cost) {
        product.cost = Math.round(product.price * 0.8); // Assume 20% margin as default
        needsUpdate = true;
      }

      // Set default status if missing or Draft (change to Live)
      if (!product.status || product.status === 'Draft') {
        product.status = 'Live';
        needsUpdate = true;
      }

      // Set default soldLast30 if missing
      if (!product.soldLast30) {
        product.soldLast30 = 0;
        needsUpdate = true;
      }

      // Set image from images array if missing
      if (!product.image && product.images && product.images.length > 0) {
        product.image = product.images[0];
        needsUpdate = true;
      }

      if (needsUpdate) {
        await product.save();
        updated++;
        console.log(`Updated: ${product.name} -> ${product.productCollection}`);
      }
    }

    console.log(`\nUpdated ${updated} products out of ${products.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateProducts();
