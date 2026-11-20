const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@niharadaura.com';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function setAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (!user) {
      console.error(`Admin user not found with email: ${ADMIN_EMAIL}`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    user.password = hashedPassword;
    user.role = 'admin';
    await user.save();

    console.log(`Admin password set successfully for ${ADMIN_EMAIL}`);
    console.log(`Role set to: admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAdminPassword();
