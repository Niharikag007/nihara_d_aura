const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const recalculateRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const rating = stats.length ? Math.round((stats[0].avg + Number.EPSILON) * 10) / 10 : 0;
  const reviewCount = stats.length ? stats[0].count : 0;
  await Product.findByIdAndUpdate(productId, { rating, reviewCount });
  return { rating, reviewCount };
};

const serialize = (review) => ({
  id: review._id,
  productId: review.productId,
  userId: review.userId,
  customerName: review.customerName,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
});

// Public: list reviews for a product
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Valid productId is required' });
    }
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, reviews: reviews.map(serialize) });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Could not load reviews' });
  }
});

// Auth: create or update own review (one per user per product)
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required to review' });
    }
    const { productId, rating, comment } = req.body;
    const numericRating = Number(rating);
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Valid productId is required' });
    }
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.findOneAndUpdate(
      { productId, userId: req.user._id },
      {
        productId,
        userId: req.user._id,
        customerName: req.user.fullName || req.user.name || 'Customer',
        rating: numericRating,
        comment: String(comment || '').slice(0, 2000),
      },
      { new: true, upsert: true, runValidators: true }
    );

    const stats = await recalculateRating(productId);
    res.status(201).json({ success: true, review: serialize(review), ...stats });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ success: false, message: 'Could not save review' });
  }
});

// Auth: delete own review; admin can delete any
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const isOwner = String(review.userId) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You can only delete your own review' });
    }
    await Review.findByIdAndDelete(req.params.id);
    const stats = await recalculateRating(review.productId);
    res.status(200).json({ success: true, message: 'Review deleted', ...stats });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Could not delete review' });
  }
});

module.exports = router;
