import { errorResponse } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.stack || err.message);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, message, status, err.errors || null);
};
