const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth);

function requireUser(req, res) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Sign in required' });
    return false;
  }
  return true;
}

router.post('/create-intent', (req, res) => {
  if (!requireUser(req, res)) return;
  res.status(503).json({
    success: false,
    message: 'A verified UPI payment gateway is not configured. Orders must remain payment-pending until UPI transfers can be verified.'
  });
});

router.post('/verify', (req, res) => {
  if (!requireUser(req, res)) return;
  res.status(503).json({
    success: false,
    message: 'UPI payment verification is not configured. No payment has been marked as paid.'
  });
});

module.exports = router;

