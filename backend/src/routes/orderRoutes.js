import express from 'express';
import { getOrders, getOrderById, createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);

export default router;
