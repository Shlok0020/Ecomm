// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for creating order (with or without login)
router.post('/', createOrder);

// Protected routes (require login)
router.get('/my-orders', protect, getUserOrders);
router.get('/my-orders/:id', protect, getOrderById);
router.put('/my-orders/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;