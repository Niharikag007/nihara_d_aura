const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

const DEFAULT_SALON = {
  name: "Nihara D'Aura Flagship Salon",
  address: "423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306",
  phone: "+91 92660 59846",
  email: "support@niharadaura.com",
  hours: "09:00 AM - 08:30 PM (Daily)",
  amenities: [
    "Valet Parking",
    "Complimentary Kashmiri Kahwa",
    "Private Bridal Suites",
    "Sterilized Tools"
  ]
};

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findOne({ key: 'store' });
    res.status(200).json({
      success: true,
      salon: settings ? {
        name: settings.salonName || DEFAULT_SALON.name,
        address: settings.salonAddress || DEFAULT_SALON.address,
        phone: settings.salonPhone || DEFAULT_SALON.phone,
        email: settings.salonEmail || DEFAULT_SALON.email,
        hours: settings.salonHours || DEFAULT_SALON.hours,
        amenities: settings.salonAmenities?.length ? settings.salonAmenities : DEFAULT_SALON.amenities
      } : DEFAULT_SALON
    });
  } catch (error) {
    console.error('Error fetching salon info:', error);
    res.status(200).json({ success: true, salon: DEFAULT_SALON });
  }
});

module.exports = router;
