import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const login = (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};

    const cleanEmail = (email || '').trim().toLowerCase();

    // Check if logging in as Admin
    if (role === 'admin' || cleanEmail === 'admin@niharadaura.com') {
      if (cleanEmail === 'admin@niharadaura.com' && password === 'admin123') {
        const adminUser = {
          id: 'usr_admin_nihara',
          name: 'Nihara Administrator',
          email: 'admin@niharadaura.com',
          phone: '+91 9999999999',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
          role: 'admin',
          tier: 'Master Admin',
          rewardPoints: 9999
        };
        return successResponse(res, {
          token: 'jwt_nihara_token_admin_active',
          user: adminUser
        }, 'Welcome Administrator to Nihara Management Portal');
      } else {
        return errorResponse(res, 'Invalid admin credentials. Access Denied.', 401);
      }
    }

    // Customer Login
    const baseProfile = store.getUserProfile();
    const customerUser = {
      ...baseProfile,
      email: cleanEmail || baseProfile.email,
      role: 'user'
    };

    return successResponse(res, {
      token: 'jwt_nihara_token_customer_active',
      user: customerUser
    }, 'Welcome back to Nihara D Aura');
  } catch (err) {
    next(err);
  }
};

export const register = (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const user = {
      id: `usr_${Date.now()}`,
      name: name || 'New Patron',
      email: email || '',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'user', // New accounts are always customers
      tier: 'Silver',
      rewardPoints: 100
    };
    store.currentUser = user;
    return successResponse(res, { user, requiresOtp: true }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = (req, res, next) => {
  try {
    const user = {
      ...store.getUserProfile(),
      role: 'user'
    };
    return successResponse(res, {
      token: 'jwt_nihara_token_customer_active',
      user
    }, 'OTP verified successfully');
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  return successResponse(res, {}, 'Logged out successfully');
};
