import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

async function updateCat() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  await Category.findOneAndUpdate(
    { slug: 'nails' },
    { $set: { image: '/images/nails/nail_img_1.png', name: 'Nail Polish & Manicure Art' } }
  );
  console.log('Updated category in MongoDB.');

  const rootDir = path.resolve(import.meta.dirname, '../../..');
  // Update initialData.js
  const initPath = path.join(rootDir, 'backend/src/data/initialData.js');
  let initText = fs.readFileSync(initPath, 'utf8');
  initText = initText.replace('"image": "https://images.unsplash.com/photo-1632345031435-8727f6897d53"', '"image": "/images/nails/nail_img_1.png"');
  fs.writeFileSync(initPath, initText);

  // Update mockData.js
  const mockPath = path.join(rootDir, 'frontend/src/services/mockData.js');
  if (fs.existsSync(mockPath)) {
    let mockText = fs.readFileSync(mockPath, 'utf8');
    mockText = mockText.replace('"image": "https://images.unsplash.com/photo-1632345031435-8727f6897d53"', '"image": "/images/nails/nail_img_1.png"');
    fs.writeFileSync(mockPath, mockText);
  }
  console.log('Category thumbnails updated successfully!');
  process.exit(0);
}
updateCat().catch(e => { console.error(e); process.exit(1); });
