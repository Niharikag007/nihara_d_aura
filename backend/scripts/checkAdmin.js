const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'amitkry5602@gmail.com'.toLowerCase() });
    if (!user) {
      console.error('Admin user not found');
      process.exit(1);
    }

    console.log('Admin user found:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Has password:', !!user.password);
    console.log('Password length:', user.password?.length || 0);
    console.log('isVerified:', user.isVerified);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdmin();
