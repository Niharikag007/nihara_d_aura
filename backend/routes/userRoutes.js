const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');

// Helper to get authenticated user from token or email in request
async function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      const userId = decoded.user?.id || decoded.id;
      if (userId) {
        return await User.findById(userId);
      }
    } catch (e) {}
  }
  return null;
}

// 1. Create a new user profile directly
router.post('/', async (req, res) => {
  try {
    const { fullName, name, email, mobileNumber, phone, avatar, tier, rewardPoints } = req.body;
    const resolvedName = fullName || name;
    const resolvedPhone = mobileNumber || phone;

    if (!resolvedName || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required', message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists', message: 'User already exists' });
    }

    const newUser = new User({
      fullName: resolvedName,
      name: resolvedName,
      email: email.toLowerCase(),
      mobileNumber: resolvedPhone || '',
      avatar: avatar || '',
      tier: tier || 'Royal Member',
      rewardPoints: rewardPoints || 0,
      isVerified: true,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, message: 'User profile created successfully', user: savedUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'Internal server error' });
  }
});

// 2. Update user profile (Supports both PUT and POST /update)
const handleUpdateProfile = async (req, res) => {
  try {
    let user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required to update profile' });
    }

    const { avatar, fullName, name, mobileNumber, phone, tier, rewardPoints, addresses } = req.body;

    if (avatar !== undefined) user.avatar = avatar;
    if (fullName !== undefined) {
      user.fullName = fullName;
      user.name = fullName;
    }
    if (name !== undefined) {
      user.name = name;
      user.fullName = name;
    }
    const resolvedPhone = mobileNumber !== undefined ? mobileNumber : phone;
    if (resolvedPhone !== undefined) {
      user.mobileNumber = resolvedPhone;
    }
    if (tier !== undefined) user.tier = tier;
    if (rewardPoints !== undefined) user.rewardPoints = rewardPoints;
    if (addresses !== undefined && Array.isArray(addresses)) user.addresses = addresses;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        _id: user.id,
        fullName: user.fullName || user.name,
        name: user.name || user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber || user.phone || '',
        phone: user.phone || user.mobileNumber || '',
        avatar: user.avatar || '',
        tier: user.tier || 'Royal Member',
        rewardPoints: user.rewardPoints || 0,
        role: user.role || 'user',
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'Internal server error' });
  }
};

router.put('/update', handleUpdateProfile);
router.post('/update', handleUpdateProfile);
router.put('/', handleUpdateProfile);

// 2.1 Dedicated Avatar Image Upload (clean file storage, no heavy base64 strings in DB)
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: avatarUrl,
      user: {
        id: user.id,
        _id: user.id,
        fullName: user.fullName || user.name,
        name: user.name || user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber || user.phone || '',
        phone: user.phone || user.mobileNumber || '',
        avatar: user.avatar,
        tier: user.tier || 'Royal Member',
        rewardPoints: user.rewardPoints || 0,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ success: false, message: 'Could not upload avatar image' });
  }
});

// 3. Wishlist Management
router.get('/wishlist', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    res.status(200).json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load wishlist' });
  }
});

router.post('/wishlist/:id', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const productId = req.params.id;
    const exists = user.wishlist.includes(productId);
    if (exists) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
      action: exists ? 'removed' : 'added'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not toggle wishlist' });
  }
});

// 4. Addresses Management
router.get('/addresses', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const addresses = (user.addresses || []).map((address) => ({
      ...address.toObject(),
      streetAddress: address.street || address.streetAddress,
      area: address.area || '',
      postalCode: address.pincode || address.postalCode,
      type: address.tag || address.type
    }));
    res.status(200).json({
      success: true,
      addresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load addresses' });
  }
});

router.post('/addresses', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const newAddress = {
      id: `addr_${Date.now()}`,
      isDefault: user.addresses.length === 0,
      ...req.body,
      street: req.body.street || req.body.streetAddress,
      area: req.body.area || '',
      pincode: req.body.pincode || req.body.postalCode,
      tag: req.body.tag || req.body.type || 'Home'
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    // Return address with frontend-compatible field names
    const responseAddress = {
      ...newAddress,
      streetAddress: newAddress.street,
      area: newAddress.area || '',
      postalCode: newAddress.pincode,
      type: newAddress.tag
    };
    res.status(200).json({ success: true, address: responseAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not add address' });
  }
});

router.put('/addresses/:id', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const addrId = req.params.id;
    const index = user.addresses.findIndex(a => a.id === addrId || a._id?.toString() === addrId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses[index] = {
      ...user.addresses[index].toObject(),
      ...req.body,
      street: req.body.street || req.body.streetAddress || user.addresses[index].street,
      area: req.body.area || user.addresses[index].area || '',
      pincode: req.body.pincode || req.body.postalCode || user.addresses[index].pincode,
      tag: req.body.tag || req.body.type || user.addresses[index].tag
    };
    await user.save();

    // Return address with frontend-compatible field names
    const responseAddress = {
      ...user.addresses[index].toObject(),
      streetAddress: user.addresses[index].street,
      area: user.addresses[index].area || '',
      postalCode: user.addresses[index].pincode,
      type: user.addresses[index].tag
    };
    res.status(200).json({ success: true, address: responseAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not update address' });
  }
});

router.delete('/addresses/:id', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const addrId = req.params.id;
    user.addresses = user.addresses.filter(a => a.id !== addrId && a._id?.toString() !== addrId);
    await user.save();

    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not delete address' });
  }
});

// 5. Get current authenticated user's own profile only
router.get('/', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        _id: user.id,
        fullName: user.fullName || user.name,
        name: user.name || user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber || user.phone || '',
        phone: user.phone || user.mobileNumber || '',
        avatar: user.avatar || '',
        tier: user.tier || 'Royal Member',
        rewardPoints: user.rewardPoints || 0,
        role: user.role || 'user',
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'Internal server error' });
  }
});

// 6. Get specific profile by id — only own profile allowed (admin exempt via adminRoutes)
router.get('/:idOrEmail', async (req, res) => {
  try {
    const requester = await getAuthenticatedUser(req);
    if (!requester) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { idOrEmail } = req.params;

    // Users can only access their own profile
    const isSelf =
      requester._id.toString() === idOrEmail ||
      requester.email.toLowerCase() === idOrEmail.toLowerCase();

    if (!isSelf && requester.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: you can only view your own profile' });
    }

    let user;
    if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
      user = await User.findById(idOrEmail).select('-password -otp -otpExpires');
    }
    if (!user) {
      user = await User.findOne({ email: idOrEmail.toLowerCase() }).select('-password -otp -otpExpires');
    }
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found', message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: 'Internal server error' });
  }
});

module.exports = router;
