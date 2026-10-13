import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  itemCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  description: { type: String },
  subcategories: [{ type: String }]
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
