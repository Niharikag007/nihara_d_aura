const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'niharikagautam007@gmail.com';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || 'Niharika_2026';

async function setAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (!user) {
      console.error(`Admin user not found with email: ${ADMIN_EMAIL}`);
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
      const newUser = new User({
        email: ADMIN_EMAIL.toLowerCase(),
        fullName: 'Niharika Gautam',
        name: 'Niharika Gautam',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      await newUser.save();
      console.log(`New admin user created: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    user.password = hashedPassword;
    user.role = 'admin';
    user.fullName = 'Niharika Gautam';
    user.name = 'Niharika Gautam';
    await user.save();

    console.log(`Admin password set successfully for ${ADMIN_EMAIL}`);
    console.log(`Role set to: admin`);
    console.log(`Name updated to: Niharika Gautam`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAdminPassword();
