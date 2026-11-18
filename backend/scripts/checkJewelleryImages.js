const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function checkJewelleryImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const jewelleryProducts = await Product.find({ productCollection: 'Jewellery' })
      .select('name image images')
      .sort({ name: 1 });

    console.log(`\nFound ${jewelleryProducts.length} Jewellery products\n`);
    console.log('='.repeat(80));

    jewelleryProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Single Image: ${product.image || 'NOT SET'}`);
      console.log(`   Images Array: ${product.images?.length || 0} images`);
      if (product.images && product.images.length > 0) {
        product.images.forEach((img, i) => {
          console.log(`     [${i}] ${img}`);
        });
      }
    });

    console.log('\n' + '='.repeat(80));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkJewelleryImages();
