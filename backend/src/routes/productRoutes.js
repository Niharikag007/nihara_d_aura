import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes - All users & guests can browse and view products
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes - RBAC protected
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
