const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const OLD_REAL_JEWELLERY_NAMES = [
  '22K Gold Royal Peacock Statement Cocktail Ring',
  '18K Rose Gold Eternity Diamond Band',
  'Heritage Navratna & Emerald 22K Gold Ring',
  '22K Hand-Engraved Floral Gold Signet Ring',
  'Floral Kundan Layer Choker',
  'Emerald Lace Collar'
];

async function removeOldJewellery() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI missing from backend/.env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected successfully!');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    // 1. Check existing matches
    const toDelete = await Product.find({ name: { $in: OLD_REAL_JEWELLERY_NAMES } }, '_id name category');
    console.log(`Found ${toDelete.length} matching products to delete:`);
    toDelete.forEach(p => console.log(` - [${p._id}] "${p.name}"`));

    if (toDelete.length > 0) {
      const deleteResult = await Product.deleteMany({ name: { $in: OLD_REAL_JEWELLERY_NAMES } });
      console.log(`✅ Deleted ${deleteResult.deletedCount} items from Database.`);
    } else {
      console.log('ℹ️ No items matched in Database (already deleted or not present).');
    }

    // 2. Verify Anti-Tarnish and other store products remain completely safe
    const antiTarnishCount = await Product.countDocuments({
      $or: [
        { name: /anti-tarnish/i },
        { name: /tarnish/i },
        { category: /artificial/i }
      ]
    });
    const totalCount = await Product.countDocuments();
    console.log(`🔒 Total products remaining in DB: ${totalCount}`);
    console.log(`🔒 Anti-Tarnish / Artificial items safe: ${antiTarnishCount}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during deletion:', err.message);
    process.exit(1);
  }
}

removeOldJewellery();
