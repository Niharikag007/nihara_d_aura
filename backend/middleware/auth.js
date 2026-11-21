const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'secret123';
      try {
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.user?.id || decoded.id;
        const user = await User.findById(userId).select('-password -otp -otpExpires');
        if (user && !user.isBlocked) {
          req.user = user;
          return next();
        } else if (user && user.isBlocked) {
          return res.status(403).json({ success: false, message: 'Account is blocked' });
        }
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }
    }
    return res.status(401).json({ success: false, message: 'Authentication required' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

