import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  itemCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  description: { type: String },
  subcategories: [{ type: String }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      return ret;
    }
  }
});

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
