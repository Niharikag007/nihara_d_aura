const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'secret123';

    try {
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.user?.id || decoded.id;
      
      const user = await User.findById(userId).select('-password -otp -otpExpires');
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'This account has been blocked' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
