import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseHelper.js';

const getBearerToken = (req) => {
  const authorization = req.headers.authorization || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : null;
};

export const protect = (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) return errorResponse(res, 'Authentication required', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !decoded.role) {
      return errorResponse(res, 'Invalid authentication token', 401);
    }
    const userEmail = typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : '';
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (decoded.role === 'admin' && (!adminEmail || userEmail !== adminEmail)) {
      return errorResponse(res, 'Admin access is not enabled for this account', 403);
    }
    req.userId = decoded.id;
    req.userRole = decoded.role || 'user';
    req.userEmail = userEmail;
    return next();
  } catch (err) {
    return errorResponse(res, 'Not authorized to access this resource', 401);
  }
};

/**
 * RBAC: Restrict route strictly to Administrator role
 */
export const protectAdmin = (req, res, next) => {
  return protect(req, res, () => {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!adminEmail) return errorResponse(res, 'Admin email is not configured on the server', 503);
    if (req.userRole !== 'admin' || req.userEmail !== adminEmail) {
      return errorResponse(res, 'Admin authorization required', 403);
    }
    return next();
  });
};
