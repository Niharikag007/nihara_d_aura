import express from 'express';
import { login, register, verifyOtp, logout, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getCurrentUser);
router.post('/logout', logout);

export default router;
