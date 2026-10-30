import mongoose from 'mongoose';

const StoreSettingSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  storeName: { type: String, default: "Nihara D'Aura" },
  lowStockThreshold: { type: Number, min: 1, default: 5 },
  targetMargins: {
    Jewellery: { type: Number, default: 18 },
    Makeup: { type: Number, default: 45 },
    Nails: { type: Number, default: 55 },
    Candles: { type: Number, default: 60 }
  }
}, { timestamps: true });

export const StoreSetting = mongoose.models.StoreSetting || mongoose.model('StoreSetting', StoreSettingSchema);
