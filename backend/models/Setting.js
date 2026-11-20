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
  salonName: { type: String, default: "Nihara D'Aura Flagship Salon" },
  salonAddress: { type: String, default: "423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306" },
  salonPhone: { type: String, default: "+91 92660 59846" },
  salonEmail: { type: String, default: "support@niharadaura.com" },
  salonHours: { type: String, default: "09:00 AM - 08:30 PM (Daily)" },
  salonAmenities: { type: [String], default: ["Valet Parking", "Complimentary Kashmiri Kahwa", "Private Bridal Suites", "Sterilized Tools"] },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
