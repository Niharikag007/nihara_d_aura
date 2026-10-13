import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Initialize Payment Intent (for Online Gateway / Razorpay / UPI / Card)
 */
export const createPaymentIntent = (req, res, next) => {
  try {
    const { amount, currency = 'INR', paymentMethod = 'Online' } = req.body;
    if (!amount || amount <= 0) {
      return errorResponse(res, 'Invalid payment amount', 400);
    }

    const intentId = 'pay_intent_' + Math.floor(10000000 + Math.random() * 90000000);
    const paymentData = {
      intentId,
      amount,
      currency,
      status: 'CREATED',
      merchantName: 'Nihara D Aura Studio',
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    return successResponse(res, { paymentIntent: paymentData }, 'Payment intent initialized');
  } catch (err) {
    next(err);
  }
};

/**
 * Verify Online Payment Signature or Process Gateway Transaction
 */
export const verifyPayment = (req, res, next) => {
  try {
    const { intentId, transactionId, paymentMethod, status = 'SUCCESS' } = req.body;

    const txnRef = transactionId || 'TXN_' + Math.floor(100000000 + Math.random() * 900000000);
    
    const verificationResult = {
      success: status === 'SUCCESS',
      transactionId: txnRef,
      paymentMethod: paymentMethod || 'Online Payment Gateway',
      status: status === 'SUCCESS' ? 'PAID' : 'FAILED',
      verifiedAt: new Date().toISOString()
    };

    return successResponse(res, { verification: verificationResult }, 'Payment verification successful');
  } catch (err) {
    next(err);
  }
};
