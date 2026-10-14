import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check if logging in as Admin
    if (role === 'admin' || cleanEmail === 'admin@niharadaura.com') {
      if (cleanEmail === 'admin@niharadaura.com' && password === 'admin123') {
        let adminUser = await User.findOne({ email: 'admin@niharadaura.com' });
        if (!adminUser) {
          adminUser = await User.create({
            id: 'usr_admin_nihara',
            name: 'Nihara Administrator',
            email: 'admin@niharadaura.com',
            phone: '+91 9999999999',
            role: 'admin',
            tier: 'Master Admin',
            rewardPoints: 9999
          });
        }
        return successResponse(res, {
          token: 'jwt_nihara_token_admin_active',
          user: adminUser
        }, 'Welcome Administrator to Nihara Management Portal');
      } else {
        return errorResponse(res, 'Invalid admin credentials. Access Denied.', 401);
      }
    }

    // Customer Login
    let customerUser = await User.findOne({ email: cleanEmail });
    if (!customerUser) {
      customerUser = await User.create({
        id: `usr_${Date.now()}`,
        name: 'Amit Kumar',
        email: cleanEmail || 'amitky2056@gmail.com',
        phone: '+91 8004116370',
        role: 'user',
        tier: 'Royal Elite',
        rewardPoints: 450
      });
    }

    return successResponse(res, {
      token: 'jwt_nihara_token_customer_active',
      user: customerUser
    }, 'Welcome back to Nihara D Aura');
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    let existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return errorResponse(res, 'An account with this email already exists.', 400);
    }

    const user = await User.create({
      id: `usr_${Date.now()}`,
      name: name || 'New Patron',
      email: cleanEmail,
      phone: phone || '',
      role: 'user',
      tier: 'Silver',
      rewardPoints: 100
    });

    return successResponse(res, { user, requiresOtp: true }, 'Registration successful in MongoDB', 201);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    if (otp === '1234' || otp === '2026' || otp) {
      let user = await User.findOne({ email: (email || '').trim().toLowerCase() });
      if (!user) {
        user = await User.findOne();
      }
      return successResponse(res, {
        token: 'jwt_nihara_token_customer_active',
        user
      }, 'Phone verified successfully');
    }
    return errorResponse(res, 'Invalid verification code. Enter 1234 or 2026.', 400);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    let user = await User.findOne();
    return successResponse(res, { user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    return successResponse(res, {}, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};
