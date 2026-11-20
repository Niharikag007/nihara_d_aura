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

    const adminEmail = ADMIN_EMAIL.toLowerCase();
    let user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log(`Creating new admin user: ${adminEmail}`);
      const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
      const newUser = new User({
        email: adminEmail,
        fullName: 'Niharika Gautam',
        name: 'Niharika Gautam',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      await newUser.save();
      console.log(`New admin user created: ${adminEmail}`);
      console.log(`Password: ${NEW_PASSWORD}`);
      console.log(`Role: admin`);
      process.exit(0);
    }

    // Update existing user to admin
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    user.password = hashedPassword;
    user.role = 'admin';
    user.fullName = 'Niharika Gautam';
    user.name = 'Niharika Gautam';
    user.isVerified = true;
    await user.save();

    console.log(`Admin updated: ${adminEmail}`);
    console.log(`Password: ${NEW_PASSWORD}`);
    console.log(`Role: admin`);
    console.log(`Name: Niharika Gautam`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAdminPassword();
