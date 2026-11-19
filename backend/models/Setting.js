const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'store' },
  storeName: { type: String, default: "Nihara D'Aura" },
  lowStockThreshold: { type: Number, default: 5, min: 0 },
  targetMargins: {
    Jewellery: { type: Number, default: 18 },
    Makeup: { type: Number, default: 45 },
    Nails: { type: Number, default: 55 },
    Candles: { type: Number, default: 60 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
