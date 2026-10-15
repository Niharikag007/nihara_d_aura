import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const newJewellerySubcategories = [
  "Royal Kundan Haar",
  "Temple Gold Jhumkas",
  "Nakshi Temple Kada",
  "Lakshmi Gold Locket",
  "Gold Ganesha Pendant",
  "Evil Eye Pendant",
  "Sacred Om Locket",
  "Kundan Chandbalis"
];

async function updateJewellery() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // 1. Update Category model in MongoDB
  await Category.findOneAndUpdate(
    { slug: 'jewellery' },
    { $set: { subcategories: newJewellerySubcategories } }
  );
  console.log('Updated Jewellery Category subcategories in MongoDB.');

  // 2. Map existing jewellery products in MongoDB to the new subcategories
  const jewelleryProducts = await Product.find({
    $or: [{ category: 'Jewellery' }, { categorySlug: 'jewellery' }]
  });
  console.log(`Found ${jewelleryProducts.length} jewellery products in DB.`);

  for (const prod of jewelleryProducts) {
    const name = (prod.name || '').toLowerCase();
    let newSub = 'Royal Kundan Haar'; // default

    if (name.includes('jhumka') || name.includes('stud') || (prod.subcategory || '').includes('Jhumka')) {
      newSub = 'Temple Gold Jhumkas';
    }
    if (name.includes('chandbali') || name.includes('dangler') || name.includes('jadau')) {
      newSub = 'Kundan Chandbalis';
    }
    if (name.includes('kada') || name.includes('kangan') || name.includes('churi') || name.includes('bangle')) {
      newSub = 'Nakshi Temple Kada';
    }
    if (name.includes('lakshmi') && (name.includes('locket') || name.includes('coin'))) {
      newSub = 'Lakshmi Gold Locket';
    }
    if (name.includes('ganesha')) {
      newSub = 'Gold Ganesha Pendant';
    }
    if (name.includes('evil eye')) {
      newSub = 'Evil Eye Pendant';
    }
    if (name.includes('om') || name.includes('mantra')) {
      newSub = 'Sacred Om Locket';
    }
    if (name.includes('haar') || name.includes('necklace') || name.includes('choker') || name.includes('collar') || name.includes('tikka')) {
      newSub = 'Royal Kundan Haar';
    }

    await Product.findByIdAndUpdate(prod._id, { $set: { subcategory: newSub } });
    console.log(`Product: "${prod.name}" -> Subcategory: "${newSub}"`);
  }

  // 3. Update initialData.js
  const rootDir = path.resolve(import.meta.dirname, '../../..');
  const initDataPath = path.join(rootDir, 'backend/src/data/initialData.js');
  const initMod = await import('../data/initialData.js');

  const updatedCategories = (initMod.initialData.categories || []).map(cat => {
    if (cat.slug === 'jewellery' || (cat.name || '').toLowerCase().includes('jewellery')) {
      return { ...cat, subcategories: newJewellerySubcategories };
    }
    return cat;
  });

  const updatedProducts = (initMod.initialData.products || []).map(prod => {
    if ((prod.category || '').toLowerCase() === 'jewellery' || (prod.categorySlug || '').toLowerCase() === 'jewellery') {
      const name = (prod.name || '').toLowerCase();
      let newSub = 'Royal Kundan Haar';
      if (name.includes('jhumka') || name.includes('stud') || (prod.subcategory || '').includes('Jhumka')) newSub = 'Temple Gold Jhumkas';
      if (name.includes('chandbali') || name.includes('dangler') || name.includes('jadau')) newSub = 'Kundan Chandbalis';
      if (name.includes('kada') || name.includes('kangan') || name.includes('churi') || name.includes('bangle')) newSub = 'Nakshi Temple Kada';
      if (name.includes('lakshmi') && (name.includes('locket') || name.includes('coin'))) newSub = 'Lakshmi Gold Locket';
      if (name.includes('ganesha')) newSub = 'Gold Ganesha Pendant';
      if (name.includes('evil eye')) newSub = 'Evil Eye Pendant';
      if (name.includes('om') || name.includes('mantra')) newSub = 'Sacred Om Locket';
      if (name.includes('haar') || name.includes('necklace') || name.includes('choker') || name.includes('collar') || name.includes('tikka')) newSub = 'Royal Kundan Haar';
      return { ...prod, subcategory: newSub };
    }
    return prod;
  });

  const newInitData = {
    ...initMod.initialData,
    categories: updatedCategories,
    products: updatedProducts
  };

  fs.writeFileSync(initDataPath, `// Preloaded seed data matching APK, Video & PRD exactly\nexport const initialData = ${JSON.stringify(newInitData, null, 2)};\n`, 'utf8');
  console.log('Updated initialData.js');

  // 4. Update mockData.js
  const mockDataPath = path.join(rootDir, 'frontend/src/services/mockData.js');
  if (fs.existsSync(mockDataPath)) {
    const mockMod = await import('../../../frontend/src/services/mockData.js');
    const mockUpdatedCategories = (mockMod.mockData.categories || []).map(cat => {
      if (cat.slug === 'jewellery' || (cat.name || '').toLowerCase().includes('jewellery')) {
        return { ...cat, subcategories: newJewellerySubcategories };
      }
      return cat;
    });

    const mockUpdatedProducts = (mockMod.mockData.products || []).map(prod => {
      if ((prod.category || '').toLowerCase() === 'jewellery' || (prod.categorySlug || '').toLowerCase() === 'jewellery') {
        const name = (prod.name || '').toLowerCase();
        let newSub = 'Royal Kundan Haar';
        if (name.includes('jhumka') || name.includes('stud') || (prod.subcategory || '').includes('Jhumka')) newSub = 'Temple Gold Jhumkas';
        if (name.includes('chandbali') || name.includes('dangler') || name.includes('jadau')) newSub = 'Kundan Chandbalis';
        if (name.includes('kada') || name.includes('kangan') || name.includes('churi') || name.includes('bangle')) newSub = 'Nakshi Temple Kada';
        if (name.includes('lakshmi') && (name.includes('locket') || name.includes('coin'))) newSub = 'Lakshmi Gold Locket';
        if (name.includes('ganesha')) newSub = 'Gold Ganesha Pendant';
        if (name.includes('evil eye')) newSub = 'Evil Eye Pendant';
        if (name.includes('om') || name.includes('mantra')) newSub = 'Sacred Om Locket';
        if (name.includes('haar') || name.includes('necklace') || name.includes('choker') || name.includes('collar') || name.includes('tikka')) newSub = 'Royal Kundan Haar';
        return { ...prod, subcategory: newSub };
      }
      return prod;
    });

    const newMockData = {
      ...mockMod.mockData,
      categories: mockUpdatedCategories,
      products: mockUpdatedProducts
    };
    fs.writeFileSync(mockDataPath, `// Preloaded client dataset matching backend, APK, Video & PRD\nexport const mockData = ${JSON.stringify(newMockData, null, 2)};\n`, 'utf8');
    console.log('Updated mockData.js');
  }

  console.log('Jewellery subcategories successfully synchronized across DB and file datasets!');
  process.exit(0);
}

updateJewellery().catch(err => {
  console.error('Update error:', err);
  process.exit(1);
});
