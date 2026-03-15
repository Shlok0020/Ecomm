const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Admin routes
router.get('/', admin, getAllOrders);
router.put('/:id', admin, updateOrderStatus);

module.exports = router;